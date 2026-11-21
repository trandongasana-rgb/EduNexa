import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import {
  MEDIA_DIR,
  THUMBS_DIR,
  getCmsState,
  getDriveConfig,
  getMediaAssetByDriveId,
  insertSyncLog,
  listMediaAssets,
  updateDriveConfig,
  upsertMediaAsset,
  type DriveCategory,
  type FolderGroupRule,
  type MediaAssetRecord,
  type PublicationStatus,
  type SyncLogRecord,
} from './db.ts';

class DriveAuthError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'DriveAuthError';
    this.statusCode = statusCode;
  }
}

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';

// Known course slugs & deterministic filename tokens for strict 02_ANH_KHOA_HOC binding
export const COURSE_MATCH_CATALOG: Array<{ courseId: string; tokens: string[] }> = [
  {
    courseId: 'ai-toan-dien-cho-giao-vien',
    tokens: ['ai-toan-dien-cho-giao-vien', 'ai-toan-dien', 'ai_toan_dien', 'toan-dien', '10-chuyen-de'],
  },
  {
    courseId: 'hoc-lieu-so-10-bo-23-sieu-skill',
    tokens: [
      'hoc-lieu-so-10-bo-23-sieu-skill',
      'hoc-lieu-so-10',
      'hl10',
      '23-sieu-skill',
      'bo-23-sieu-skill',
      'sieu-skill',
    ],
  },
  {
    courseId: 'bo-tai-lieu-quan-trong',
    tokens: ['bo-tai-lieu-quan-trong', 'bo-tai-lieu', 'tai-lieu-3-ngay', '03-ngay', '3-ngay'],
  },
  {
    courseId: 'ai-soan-giang-ho-tro-day-hoc',
    tokens: ['ai-soan-giang-ho-tro-day-hoc', 'ai-soan-giang', 'soan-giang', '5512'],
  },
  {
    courseId: 'ai-to-chuc-hoat-dong-hoc-tap',
    tokens: ['ai-to-chuc-hoat-dong-hoc-tap', 'ai-to-chuc', 'hoat-dong-hoc-tap', 'tro-choi-3d'],
  },
  {
    courseId: '03-cuon-cam-nang-toan-dien',
    tokens: ['03-cuon-cam-nang-toan-dien', '03-cuon-cam-nang', '3-cuon-cam-nang', 'cam-nang'],
  },
  {
    courseId: 'coaching-chuyen-biet',
    tokens: ['coaching-chuyen-biet', 'coaching-1-1', 'coaching'],
  },
];

// In-memory runtime OAuth token for active backend scheduled sync (NEVER written to disk)
interface RuntimeOAuthSession {
  accessToken: string;
  email: string;
  displayName: string;
  attachedAt: number;
}

let runtimeOAuthSession: RuntimeOAuthSession | null = null;
let isSyncRunning = false;
let schedulerTimer: ReturnType<typeof setInterval> | null = null;

export function attachRuntimeOAuthSession(
  accessToken: string,
  email: string,
  displayName: string
): void {
  runtimeOAuthSession = {
    accessToken,
    email,
    displayName,
    attachedAt: Date.now(),
  };
}

export function clearRuntimeOAuthSession(): void {
  runtimeOAuthSession = null;
}

export function hasRuntimeOAuthSession(): boolean {
  return Boolean(runtimeOAuthSession?.accessToken);
}

export function getSyncRunningState(): boolean {
  return isSyncRunning;
}

export function extractDriveFolderId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Format: https://drive.google.com/drive/folders/<ID> or /u/0/folders/<ID>
  const folderPathMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]{10,})/);
  if (folderPathMatch?.[1]) return folderPathMatch[1];

  // Format: ?id=<ID> or &id=<ID>
  const queryIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
  if (queryIdMatch?.[1]) return queryIdMatch[1];

  // Raw Drive folder ID
  if (/^[a-zA-Z0-9_-]{10,}$/.test(trimmed)) return trimmed;

  return null;
}

function normalizeVietnameseSlug(raw: string): string {
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function matchCourseIdFromFilename(filename: string): string | null {
  const baseName = filename.replace(/\.[^.]+$/, '');
  const normalized = normalizeVietnameseSlug(baseName);

  // Include live CMS courses (published + draft) so newly created courses auto-match too
  const dynamicEntries: Array<{ courseId: string; tokens: string[] }> = [];
  try {
    const cms = getCmsState();
    const seen = new Set(COURSE_MATCH_CATALOG.map((e) => e.courseId));
    for (const c of [...(cms.published?.courses || []), ...(cms.draft?.courses || [])]) {
      if (c.id && !seen.has(c.id)) {
        seen.add(c.id);
        dynamicEntries.push({
          courseId: c.id,
          tokens: [c.id, normalizeVietnameseSlug(c.title || '')].filter(Boolean),
        });
      }
    }
  } catch {
    // ignore if CMS state is unavailable
  }

  const catalog = [...COURSE_MATCH_CATALOG, ...dynamicEntries];

  // Match exact slug first, then longest matching deterministic token
  for (const entry of catalog) {
    if (normalized === entry.courseId) {
      return entry.courseId;
    }
  }
  for (const entry of catalog) {
    for (const token of entry.tokens) {
      const normalizedToken = normalizeVietnameseSlug(token);
      if (
        normalizedToken &&
        (normalized === normalizedToken ||
          normalized.startsWith(`${normalizedToken}-`) ||
          normalized.includes(`-${normalizedToken}-`) ||
          normalized.endsWith(`-${normalizedToken}`))
      ) {
        return entry.courseId;
      }
    }
  }
  return null;
}

function buildHumanTitleFromFilename(filename: string): string {
  const base = filename
    .replace(/\.[^.]+$/, '')
    .replace(/^\d+[_-\s]+/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!base) return 'Hình ảnh EDUNEXA';
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function parseLeadingOrder(filename: string, fallbackIndex: number): number {
  const m = filename.match(/^(\d{1,4})[_-\s]/);
  if (m?.[1]) return parseInt(m[1], 10);
  return (fallbackIndex + 1) * 10;
}

async function fetchWithRetry(
  url: string,
  accessToken: string,
  maxAttempts = 3
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Immediately fail on auth / permission errors without retrying
      if (res.status === 401 || res.status === 403 || res.status === 404) {
        return res;
      }

      // Retry transient rate limit or 5xx errors
      if ((res.status === 429 || res.status >= 500) && attempt < maxAttempts) {
        const delayMs = 600 * Math.pow(2, attempt - 1);
        await new Promise((r) => setTimeout(r, delayMs));
        continue;
      }

      return res;
    } catch (err) {
      lastError = err;
      if (attempt < maxAttempts) {
        const delayMs = 600 * Math.pow(2, attempt - 1);
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Lỗi kết nối mạng tới Google Drive API.');
}

interface DriveFileMeta {
  id: string;
  name: string;
  mimeType: string;
  md5Checksum?: string;
  modifiedTime?: string;
  size?: string;
  description?: string;
  capabilities?: {
    canListChildren?: boolean;
    canDownload?: boolean;
  };
}

export interface FolderVerificationResult {
  ok: boolean;
  folderId: string;
  folderName: string;
  detectedSubfolders: Array<{
    id: string;
    name: string;
    matchedCategory: DriveCategory | null;
    matchedLabel: string | null;
  }>;
  missingConfiguredFolders: string[];
  error?: string;
}

export async function verifyDriveFolderAccess(
  folderInput: string,
  accessToken: string
): Promise<FolderVerificationResult> {
  const folderId = extractDriveFolderId(folderInput);
  if (!folderId) {
    return {
      ok: false,
      folderId: '',
      folderName: '',
      detectedSubfolders: [],
      missingConfiguredFolders: [],
      error: 'URL hoặc ID thư mục Google Drive không hợp lệ.',
    };
  }

  const metaUrl = `${DRIVE_API_BASE}/files/${encodeURIComponent(
    folderId
  )}?fields=id,name,mimeType,capabilities&supportsAllDrives=true`;
  const metaRes = await fetchWithRetry(metaUrl, accessToken);

  if (metaRes.status === 401) {
    return {
      ok: false,
      folderId,
      folderName: '',
      detectedSubfolders: [],
      missingConfiguredFolders: [],
      error: 'Phiên đăng nhập Google đã hết hạn (401). Vui lòng đăng nhập lại bằng Google.',
    };
  }
  if (metaRes.status === 403) {
    return {
      ok: false,
      folderId,
      folderName: '',
      detectedSubfolders: [],
      missingConfiguredFolders: [],
      error: 'Tài khoản Google chưa có quyền đọc thư mục này hoặc Google Drive API chưa bật (403).',
    };
  }
  if (metaRes.status === 404) {
    return {
      ok: false,
      folderId,
      folderName: '',
      detectedSubfolders: [],
      missingConfiguredFolders: [],
      error: 'Không tìm thấy thư mục trên Google Drive hoặc tài khoản hiện tại không có quyền truy cập (404).',
    };
  }
  if (!metaRes.ok) {
    const body = await metaRes.text().catch(() => '');
    return {
      ok: false,
      folderId,
      folderName: '',
      detectedSubfolders: [],
      missingConfiguredFolders: [],
      error: `Google Drive API trả về lỗi ${metaRes.status}: ${body.slice(0, 180)}`,
    };
  }

  const folderMeta = (await metaRes.json()) as DriveFileMeta;
  if (folderMeta.mimeType !== 'application/vnd.google-apps.folder') {
    return {
      ok: false,
      folderId,
      folderName: folderMeta.name,
      detectedSubfolders: [],
      missingConfiguredFolders: [],
      error: `Đối tượng "${folderMeta.name}" không phải là thư mục Google Drive.`,
    };
  }

  if (folderMeta.capabilities?.canListChildren === false) {
    return {
      ok: false,
      folderId,
      folderName: folderMeta.name,
      detectedSubfolders: [],
      missingConfiguredFolders: [],
      error: `Không có quyền liệt kê nội dung bên trong thư mục "${folderMeta.name}".`,
    };
  }

  // List immediate child subfolders
  const query = encodeURIComponent(
    `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
  );
  const listUrl = `${DRIVE_API_BASE}/files?q=${query}&fields=files(id,name,mimeType)&pageSize=100&supportsAllDrives=true&includeItemsFromAllDrives=true`;
  const listRes = await fetchWithRetry(listUrl, accessToken);
  if (!listRes.ok) {
    return {
      ok: false,
      folderId,
      folderName: folderMeta.name,
      detectedSubfolders: [],
      missingConfiguredFolders: [],
      error: `Không thể đọc danh sách thư mục con (HTTP ${listRes.status}).`,
    };
  }

  const listJson = (await listRes.json()) as { files?: DriveFileMeta[] };
  const subfolders = listJson.files || [];
  const config = getDriveConfig();

  const ruleMap = new Map<string, FolderGroupRule>();
  for (const rule of config.folderRules) {
    ruleMap.set(rule.folderName.trim().toUpperCase(), rule);
  }

  const detectedSubfolders = subfolders.map((sf) => {
    const matched = ruleMap.get(sf.name.trim().toUpperCase()) || null;
    return {
      id: sf.id,
      name: sf.name,
      matchedCategory: matched ? matched.category : null,
      matchedLabel: matched ? matched.label : null,
    };
  });

  const detectedNames = new Set(subfolders.map((sf) => sf.name.trim().toUpperCase()));
  const missingConfiguredFolders = config.folderRules
    .filter((r) => r.enabled && !detectedNames.has(r.folderName.trim().toUpperCase()))
    .map((r) => r.folderName);

  return {
    ok: true,
    folderId: folderMeta.id,
    folderName: folderMeta.name,
    detectedSubfolders,
    missingConfiguredFolders,
  };
}

async function listAllFilesInFolder(
  folderId: string,
  accessToken: string
): Promise<DriveFileMeta[]> {
  const results: DriveFileMeta[] = [];
  let pageToken: string | undefined;

  do {
    const q = encodeURIComponent(
      `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false`
    );
    const tokenPart = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : '';
    const url = `${DRIVE_API_BASE}/files?q=${q}&fields=nextPageToken,files(id,name,mimeType,md5Checksum,modifiedTime,size,description)&pageSize=200&supportsAllDrives=true&includeItemsFromAllDrives=true${tokenPart}`;

    const res = await fetchWithRetry(url, accessToken);
    if (res.status === 401) {
      throw new DriveAuthError(
        401,
        'Phiên Google OAuth đã hết hạn hoặc bị thu hồi (401) trong quá trình đọc thư mục.'
      );
    }
    if (res.status === 403) {
      throw new DriveAuthError(
        403,
        'Mất quyền truy cập thư mục Google Drive (403). Vui lòng kiểm tra quyền chia sẻ.'
      );
    }
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} khi đọc danh sách tệp trong thư mục ${folderId}`);
    }
    const json = (await res.json()) as {
      nextPageToken?: string;
      files?: DriveFileMeta[];
    };
    if (json.files) results.push(...json.files);
    pageToken = json.nextPageToken;
  } while (pageToken);

  return results;
}

function safeUnlinkPublicAsset(urlPath: string | null | undefined): void {
  if (!urlPath) return;
  try {
    if (urlPath.startsWith('/storage/media/')) {
      const target = path.join(MEDIA_DIR, path.basename(urlPath));
      if (fs.existsSync(target)) fs.unlinkSync(target);
    } else if (urlPath.startsWith('/storage/thumbs/')) {
      const target = path.join(THUMBS_DIR, path.basename(urlPath));
      if (fs.existsSync(target)) fs.unlinkSync(target);
    }
  } catch {
    // ignore cleanup failure
  }
}

function publicAssetExistsOnDisk(publicUrl: string, thumbnailUrl: string): boolean {
  if (!publicUrl.startsWith('/storage/media/') || !thumbnailUrl.startsWith('/storage/thumbs/')) {
    return false;
  }
  const fullPath = path.join(MEDIA_DIR, path.basename(publicUrl));
  const thumbPath = path.join(THUMBS_DIR, path.basename(thumbnailUrl));
  return fs.existsSync(fullPath) && fs.existsSync(thumbPath);
}

export async function runDriveSync(
  triggerType: 'manual' | 'scheduled',
  overrideAccessToken?: string
): Promise<SyncLogRecord> {
  if (isSyncRunning) {
    throw new Error('Tiến trình đồng bộ khác đang chạy. Vui lòng chờ hoàn tất.');
  }

  const startedAt = new Date().toISOString();
  const config = getDriveConfig();
  const accessToken = overrideAccessToken || runtimeOAuthSession?.accessToken;

  if (!config.rootFolderId || config.connectionStatus === 'disconnected') {
    const msg = 'Chưa cấu hình hoặc chưa xác minh thư mục Google Drive.';
    return insertSyncLog({
      startedAt,
      finishedAt: new Date().toISOString(),
      triggerType,
      status: 'error',
      discoveredCount: 0,
      syncedCount: 0,
      skippedCount: 0,
      updatedCount: 0,
      deletedCount: 0,
      errorCount: 1,
      errorMessage: msg,
      details: [msg],
    });
  }

  if (!accessToken) {
    const msg =
      'Chưa có phiên Google OAuth đang hoạt động trên máy chủ. Vui lòng đăng nhập Google lại trong trang quản trị.';
    updateDriveConfig({ lastError: msg });
    return insertSyncLog({
      startedAt,
      finishedAt: new Date().toISOString(),
      triggerType,
      status: 'error',
      discoveredCount: 0,
      syncedCount: 0,
      skippedCount: 0,
      updatedCount: 0,
      deletedCount: 0,
      errorCount: 1,
      errorMessage: msg,
      details: [msg],
    });
  }

  isSyncRunning = true;
  const details: string[] = [];
  let discoveredCount = 0;
  let syncedCount = 0;
  let skippedCount = 0;
  let updatedCount = 0;
  let deletedCount = 0;
  let errorCount = 0;

  try {
    // 1. Verify root folder & locate configured category subfolders
    const verify = await verifyDriveFolderAccess(config.rootFolderId, accessToken);
    if (!verify.ok) {
      const errMsg = verify.error || 'Không thể xác minh quyền truy cập thư mục Google Drive.';
      updateDriveConfig({
        connectionStatus: 'error',
        lastError: errMsg,
      });
      if (errMsg.includes('(401)')) {
        clearRuntimeOAuthSession();
      }
      return insertSyncLog({
        startedAt,
        finishedAt: new Date().toISOString(),
        triggerType,
        status: 'error',
        discoveredCount: 0,
        syncedCount: 0,
        skippedCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        errorCount: 1,
        errorMessage: errMsg,
        details: [errMsg],
      });
    }

    updateDriveConfig({
      rootFolderName: verify.folderName,
      connectionStatus: 'connected_verified',
      lastVerifiedAt: new Date().toISOString(),
      lastError: null,
    });

    const maxBytes = config.maxFileSizeMb * 1024 * 1024;
    const ruleByCategory = new Map<DriveCategory, FolderGroupRule>();
    for (const r of config.folderRules) {
      ruleByCategory.set(r.category, r);
    }

    // Build target scan pairs: (folderId, category, rule)
    const scanTargets: Array<{ folderId: string; folderName: string; rule: FolderGroupRule }> = [];
    for (const sf of verify.detectedSubfolders) {
      if (sf.matchedCategory) {
        const rule = ruleByCategory.get(sf.matchedCategory);
        if (rule && rule.enabled) {
          scanTargets.push({ folderId: sf.id, folderName: sf.name, rule });
        }
      }
    }

    // Also allow if the user linked a single category folder directly (e.g. linked 01_BANNER_HERO directly)
    if (scanTargets.length === 0) {
      const directRule = config.folderRules.find(
        (r) => r.enabled && r.folderName.trim().toUpperCase() === verify.folderName.trim().toUpperCase()
      );
      if (directRule) {
        scanTargets.push({
          folderId: verify.folderId,
          folderName: verify.folderName,
          rule: directRule,
        });
      } else {
        details.push(
          `Không tìm thấy thư mục con khớp cấu hình bên trong "${verify.folderName}". Hãy tạo các thư mục như 01_BANNER_HERO, 02_ANH_KHOA_HOC... hoặc điều chỉnh tên thư mục trong cấu hình.`
        );
      }
    }

    const activeDriveFileIds = new Set<string>();
    const scannedFolderIds = new Set<string>();

    // 2. Scan every enabled matched subfolder
    for (const target of scanTargets) {
      scannedFolderIds.add(target.folderId);
      const files = await listAllFilesInFolder(target.folderId, accessToken);
      details.push(`Quét thư mục ${target.folderName}: phát hiện ${files.length} tệp.`);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        discoveredCount++;
        activeDriveFileIds.add(file.id);

        const nowIso = new Date().toISOString();
        const fileSize = Number(file.size || 0);
        const existing = getMediaAssetByDriveId(file.id);

        // Validate MIME type
        if (!ALLOWED_MIME_TYPES.has(file.mimeType)) {
          errorCount++;
          details.push(
            `Bỏ qua "${file.name}" (${target.folderName}): định dạng không hợp lệ (${file.mimeType}). Chỉ chấp nhận JPG, PNG, WEBP.`
          );
          continue;
        }

        // Validate size
        if (fileSize <= 0 || fileSize > maxBytes) {
          errorCount++;
          details.push(
            `Bỏ qua "${file.name}" (${target.folderName}): dung lượng không hợp lệ (${(
              fileSize /
              (1024 * 1024)
            ).toFixed(2)} MB, giới hạn ${config.maxFileSizeMb} MB).`
          );
          continue;
        }

        const driveChecksum = file.md5Checksum || `${file.modifiedTime || ''}:${fileSize}`;
        const modifiedTime = file.modifiedTime || nowIso;

        // Idempotent check: skip download & image processing when unchanged
        if (
          existing &&
          existing.checksum === driveChecksum &&
          existing.modifiedTime === modifiedTime &&
          existing.folderId === target.folderId &&
          existing.category === target.rule.category &&
          publicAssetExistsOnDisk(existing.publicUrl, existing.thumbnailUrl)
        ) {
          // If it was previously marked deleted_in_drive and restored, restore appropriate status
          let nextStatus = existing.publicationStatus;
          if (existing.publicationStatus === 'deleted_in_drive') {
            nextStatus =
              target.rule.category === 'CHO_DUYET'
                ? 'pending'
                : target.rule.autoPublish
                  ? 'published'
                  : 'pending';
          }
          upsertMediaAsset({
            ...existing,
            publicationStatus: nextStatus,
            errorMessage: null,
            lastSyncedAt: nowIso,
          });
          skippedCount++;
          continue;
        }

        // Download & optimize image using Sharp
        try {
          const downloadUrl = `${DRIVE_API_BASE}/files/${encodeURIComponent(
            file.id
          )}?alt=media&supportsAllDrives=true`;
          const dlRes = await fetchWithRetry(downloadUrl, accessToken);
          if (dlRes.status === 401) {
            throw new DriveAuthError(
              401,
              'Phiên Google OAuth đã hết hạn hoặc bị thu hồi (401) khi tải ảnh.'
            );
          }
          if (dlRes.status === 403) {
            throw new DriveAuthError(
              403,
              `Mất quyền tải tệp "${file.name}" trên Google Drive (403).`
            );
          }
          if (!dlRes.ok) {
            throw new Error(`Tải ảnh thất bại (HTTP ${dlRes.status})`);
          }

          const arrayBuf = await dlRes.arrayBuffer();
          const rawBuffer = Buffer.from(arrayBuf);
          if (rawBuffer.length > maxBytes) {
            throw new Error(`Dung lượng thực tế vượt quá ${config.maxFileSizeMb} MB`);
          }

          // Inspect image & verify integrity
          const imgMeta = await sharp(rawBuffer).metadata();
          if (!imgMeta.width || !imgMeta.height) {
            throw new Error('Tệp ảnh không hợp lệ hoặc bị hỏng.');
          }

          const contentHash = crypto
            .createHash('sha256')
            .update(rawBuffer)
            .digest('hex')
            .slice(0, 10);
          const assetId = existing?.id || `media_${crypto.randomUUID().replace(/-/g, '').slice(0, 14)}`;
          const safeFileStem = `${assetId}_${contentHash}`;
          const fullFileName = `${safeFileStem}.webp`;
          const thumbFileName = `${safeFileStem}_thumb.webp`;

          const fullDiskPath = path.join(MEDIA_DIR, fullFileName);
          const thumbDiskPath = path.join(THUMBS_DIR, thumbFileName);

          // Optimized WebP full image (max 1920px wide, no upscaling)
          const optimizedInfo = await sharp(rawBuffer)
            .rotate()
            .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 84 })
            .toFile(fullDiskPath);

          // Optimized WebP thumbnail (480x300, top-weighted for teacher portraits)
          await sharp(rawBuffer)
            .rotate()
            .resize({ width: 480, height: 300, fit: 'cover', position: 'top' })
            .webp({ quality: 78 })
            .toFile(thumbDiskPath);

          // Remove previous version files if replaced
          if (existing) {
            if (existing.publicUrl !== `/storage/media/${fullFileName}`) {
              safeUnlinkPublicAsset(existing.publicUrl);
            }
            if (existing.thumbnailUrl !== `/storage/thumbs/${thumbFileName}`) {
              safeUnlinkPublicAsset(existing.thumbnailUrl);
            }
          }

          // Strict course binding rule for 02_ANH_KHOA_HOC
          let courseId: string | null = existing?.courseId || null;
          if (target.rule.category === 'ANH_KHOA_HOC') {
            const matched = matchCourseIdFromFilename(file.name);
            courseId = matched || existing?.courseId || null;
          } else {
            courseId = null;
          }

          // Publication status rule
          let publicationStatus: PublicationStatus;
          if (existing && (existing.publicationStatus === 'published' || existing.publicationStatus === 'unpublished')) {
            publicationStatus = existing.publicationStatus;
          } else if (target.rule.category === 'CHO_DUYET') {
            publicationStatus = 'pending';
          } else if (target.rule.category === 'ANH_KHOA_HOC' && !courseId) {
            // Never auto-assign or publish an unmapped course photo to the wrong course
            publicationStatus = 'pending';
            details.push(
              `Ảnh "${file.name}" trong ${target.folderName} chưa khớp mã/slug khóa học — chuyển sang Chờ duyệt để quản trị viên gán đúng khóa.`
            );
          } else {
            publicationStatus = target.rule.autoPublish ? 'published' : 'pending';
          }

          const title = existing?.title || buildHumanTitleFromFilename(file.name);
          const altText =
            existing?.altText ||
            file.description?.trim() ||
            `${title} — EDUNEXA AI`;

          const record: MediaAssetRecord = {
            id: assetId,
            driveFileId: file.id,
            folderId: target.folderId,
            filename: file.name,
            mimeType: file.mimeType,
            fileSize: rawBuffer.length,
            width: optimizedInfo.width,
            height: optimizedInfo.height,
            checksum: driveChecksum,
            modifiedTime,
            title,
            altText,
            category: target.rule.category,
            courseId,
            displayOrder: existing?.displayOrder ?? parseLeadingOrder(file.name, i),
            publicUrl: `/storage/media/${fullFileName}`,
            thumbnailUrl: `/storage/thumbs/${thumbFileName}`,
            publicationStatus,
            errorMessage: null,
            lastSyncedAt: nowIso,
            createdAt: existing?.createdAt || nowIso,
          };

          upsertMediaAsset(record);
          syncedCount++;
          if (existing) {
            updatedCount++;
            details.push(`Đã cập nhật ảnh tối ưu: "${file.name}" (${target.folderName}).`);
          } else {
            details.push(`Đã đồng bộ ảnh mới: "${file.name}" → ${target.rule.label} (${publicationStatus}).`);
          }
        } catch (err) {
          if (err instanceof DriveAuthError) {
            throw err;
          }
          errorCount++;
          const msg = err instanceof Error ? err.message : 'Lỗi xử lý ảnh không xác định';
          details.push(`Lỗi đồng bộ "${file.name}": ${msg}`);
        }
      }
    }

    // 3. Handle files deleted from Drive according to deletePolicy
    const allStored = listMediaAssets();
    for (const stored of allStored) {
      if (
        scannedFolderIds.has(stored.folderId) &&
        !activeDriveFileIds.has(stored.driveFileId) &&
        stored.publicationStatus !== 'deleted_in_drive' &&
        stored.publicationStatus !== 'archived'
      ) {
        deletedCount++;
        if (config.deletePolicy === 'keep') {
          details.push(`Ảnh "${stored.filename}" đã xóa trên Drive — giữ nguyên hiển thị theo chính sách.`);
        } else {
          const nextStatus: PublicationStatus =
            config.deletePolicy === 'archive' ? 'archived' : 'deleted_in_drive';
          upsertMediaAsset({
            ...stored,
            publicationStatus: nextStatus,
            lastSyncedAt: new Date().toISOString(),
          });
          details.push(
            `Ảnh "${stored.filename}" đã bị xóa trên Drive → chuyển trạng thái "${nextStatus}".`
          );
        }
      }
    }

    const overallStatus: SyncLogRecord['status'] =
      errorCount > 0 ? (syncedCount > 0 || skippedCount > 0 ? 'partial' : 'error') : 'success';

    return insertSyncLog({
      startedAt,
      finishedAt: new Date().toISOString(),
      triggerType,
      status: overallStatus,
      discoveredCount,
      syncedCount,
      skippedCount,
      updatedCount,
      deletedCount,
      errorCount,
      errorMessage: errorCount > 0 ? `Có ${errorCount} tệp gặp lỗi hoặc không hợp lệ.` : null,
      details: details.slice(0, 80),
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Lỗi không xác định khi đồng bộ Google Drive.';
    if (err instanceof DriveAuthError) {
      updateDriveConfig({
        connectionStatus: 'error',
        lastError: errMsg,
      });
      if (err.statusCode === 401) {
        clearRuntimeOAuthSession();
      }
    } else {
      updateDriveConfig({ lastError: errMsg });
    }
    return insertSyncLog({
      startedAt,
      finishedAt: new Date().toISOString(),
      triggerType,
      status: 'error',
      discoveredCount,
      syncedCount,
      skippedCount,
      updatedCount,
      deletedCount,
      errorCount: errorCount + 1,
      errorMessage: errMsg,
      details: [...details, errMsg],
    });
  } finally {
    isSyncRunning = false;
  }
}

export function restartDriveSyncScheduler(): void {
  if (schedulerTimer) {
    clearInterval(schedulerTimer);
    schedulerTimer = null;
  }

  const config = getDriveConfig();
  if (!config.autoSyncEnabled) return;

  const intervalMs = Math.max(1, config.syncIntervalMinutes || 5) * 60 * 1000;
  schedulerTimer = setInterval(async () => {
    const latestConfig = getDriveConfig();
    if (
      !latestConfig.autoSyncEnabled ||
      latestConfig.connectionStatus !== 'connected_verified' ||
      !latestConfig.rootFolderId ||
      !hasRuntimeOAuthSession() ||
      isSyncRunning
    ) {
      return;
    }
    try {
      await runDriveSync('scheduled');
    } catch {
      // Errors are persisted into sync_logs inside runDriveSync
    }
  }, intervalMs);
}
