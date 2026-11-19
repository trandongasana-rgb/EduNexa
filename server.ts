import crypto from 'crypto';
import express from 'express';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import {
  MEDIA_DIR,
  STORAGE_ROOT,
  THUMBS_DIR,
  createAdminSessionToken,
  createInquiry,
  deleteInquiry,
  deleteMediaAssetById,
  getCmsState,
  getDriveConfig,
  getMediaAssetById,
  getPublicCmsSnapshot,
  insertAuditLog,
  listAuditLogs,
  listInquiries,
  listMediaAssets,
  listSyncLogs,
  publishCmsDraft,
  reorderMediaAssets,
  resetCmsToDefaults,
  saveCmsDraft,
  updateAdminPassword,
  updateDriveConfig,
  updateInquiry,
  updateMediaAssetFields,
  upsertMediaAsset,
  verifyAdminPassword,
  verifyAdminSessionToken,
  type DriveCategory,
  type MediaAssetRecord,
  type PublicationStatus,
} from './server/db.ts';
import {
  COURSE_MATCH_CATALOG,
  attachRuntimeOAuthSession,
  clearRuntimeOAuthSession,
  extractDriveFolderId,
  getSyncRunningState,
  hasRuntimeOAuthSession,
  restartDriveSyncScheduler,
  runDriveSync,
  verifyDriveFolderAccess,
} from './server/driveSync.ts';
import type { CmsSnapshot, InquiryStatus } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT || 3000);
const ADMIN_COOKIE_NAME = 'edunexa_admin_session';

function getBearerToken(req: express.Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice('Bearer '.length).trim();
  return token || null;
}

function parseCookie(req: express.Request, name: string): string | undefined {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return undefined;
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    if (key === name) {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return undefined;
}

function extractAdminToken(req: express.Request): string | undefined {
  return req.header('x-admin-session') || parseCookie(req, ADMIN_COOKIE_NAME);
}

function setAdminSessionCookie(req: express.Request, res: express.Response, token: string): void {
  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
  const maxAgeSec = 60 * 60 * 12; // 12 hours
  const cookieAttrs = [
    `${ADMIN_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    `Max-Age=${maxAgeSec}`,
    'HttpOnly',
    isHttps ? 'SameSite=None; Secure' : 'SameSite=Lax',
  ];
  res.setHeader('Set-Cookie', cookieAttrs.join('; '));
}

function clearAdminSessionCookie(req: express.Request, res: express.Response): void {
  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
  const cookieAttrs = [
    `${ADMIN_COOKIE_NAME}=`,
    'Path=/',
    'Max-Age=0',
    'HttpOnly',
    isHttps ? 'SameSite=None; Secure' : 'SameSite=Lax',
  ];
  res.setHeader('Set-Cookie', cookieAttrs.join('; '));
}

function requireAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  const sessionToken = extractAdminToken(req);
  if (!verifyAdminSessionToken(sessionToken)) {
    res.status(401).json({
      error: 'Phiên quản trị không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.',
    });
    return;
  }
  next();
}

function buildGroupedPublishedMedia() {
  const published = listMediaAssets({ status: 'published' });
  const grouped: Record<DriveCategory, typeof published> = {
    BANNER_HERO: [],
    ANH_KHOA_HOC: [],
    SAN_PHAM_HOC_VIEN: [],
    ANH_GIANG_VIEN: [],
    THU_VIEN_ANH: [],
    ANH_DOI_TAC: [],
    CHO_DUYET: [],
  };

  for (const item of published) {
    if (grouped[item.category]) {
      grouped[item.category].push(item);
    }
  }
  return { published, grouped };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '20mb' }));

  // Serve optimized images & thumbnails from persistent local storage with immutable cache
  app.use(
    '/storage',
    express.static(STORAGE_ROOT, {
      maxAge: '365d',
      immutable: true,
      fallthrough: false,
    })
  );

  // Serve built-in Vietnamese teacher site assets consistently in both dev and production
  app.use(
    '/site-assets',
    express.static(path.resolve(__dirname, 'src/assets/images'), {
      maxAge: '30d',
      fallthrough: false,
    })
  );

  // =====================================================================
  // 1. PUBLIC READ-ONLY SITE & MEDIA API
  // =====================================================================
  app.get('/api/public/media', (_req, res) => {
    const { published, grouped } = buildGroupedPublishedMedia();
    res.json({
      updatedAt: new Date().toISOString(),
      totalPublished: published.length,
      grouped,
    });
  });

  app.get('/api/public/site', (_req, res) => {
    const { snapshot, updatedAt } = getPublicCmsSnapshot();
    const { published, grouped } = buildGroupedPublishedMedia();
    res.json({
      cms: snapshot,
      cmsUpdatedAt: updatedAt,
      media: {
        updatedAt: new Date().toISOString(),
        totalPublished: published.length,
        grouped,
      },
    });
  });

  // Public registration / contact inquiry endpoint (persists to SQLite)
  app.post('/api/public/inquiries', (req, res) => {
    const body = req.body || {};
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const courseId = typeof body.courseId === 'string' ? body.courseId.trim() : '';
    const courseTitle = typeof body.courseTitle === 'string' ? body.courseTitle.trim() : '';
    const note = typeof body.note === 'string' ? body.note.trim() : '';
    const source = typeof body.source === 'string' && body.source.trim() ? body.source.trim() : 'website';
    const consentAccepted = body.consentAccepted === true;

    if (fullName.length < 2) {
      res.status(400).json({ error: 'Vui lòng nhập họ và tên đầy đủ.' });
      return;
    }
    if (phone.replace(/\D/g, '').length < 8) {
      res.status(400).json({ error: 'Vui lòng nhập số điện thoại / Zalo hợp lệ.' });
      return;
    }
    if (!consentAccepted) {
      res.status(400).json({
        error: 'Vui lòng đồng ý với chính sách xử lý thông tin trước khi gửi đăng ký.',
      });
      return;
    }

    const created = createInquiry({
      fullName,
      phone,
      email,
      courseId,
      courseTitle,
      note,
      source,
      consentAccepted: true,
    });

    insertAuditLog({
      actor: fullName,
      action: 'CREATE_INQUIRY',
      entityType: 'inquiry',
      entityId: created.id,
      summary: `Đăng ký khóa học từ ${source}: ${fullName} (${phone})${courseTitle ? ` — ${courseTitle}` : ''}.`,
      status: 'success',
    });

    res.status(201).json({ ok: true, inquiry: created });
  });

  // =====================================================================
  // 2. ADMIN AUTHENTICATION API (Server-side verification + HttpOnly cookie)
  // =====================================================================
  app.get('/api/admin/me', (req, res) => {
    const token = extractAdminToken(req);
    if (!verifyAdminSessionToken(token)) {
      res.status(401).json({ authenticated: false });
      return;
    }
    res.json({ authenticated: true, sessionToken: token });
  });

  app.post('/api/admin/login', (req, res) => {
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!verifyAdminPassword(password)) {
      insertAuditLog({
        actor: 'Khách truy cập',
        action: 'LOGIN_FAILED',
        entityType: 'auth',
        summary: 'Đăng nhập khu vực /quan-tri thất bại do sai mật khẩu.',
        status: 'warning',
      });
      res.status(401).json({ error: 'Mật khẩu quản trị không chính xác.' });
      return;
    }
    const token = createAdminSessionToken();
    setAdminSessionCookie(req, res, token);
    insertAuditLog({
      actor: 'Quản trị viên',
      action: 'LOGIN',
      entityType: 'auth',
      summary: 'Đăng nhập thành công vào trang quản trị /quan-tri.',
      status: 'success',
    });
    res.json({ ok: true, sessionToken: token });
  });

  app.post('/api/admin/logout', (req, res) => {
    clearAdminSessionCookie(req, res);
    insertAuditLog({
      actor: 'Quản trị viên',
      action: 'LOGOUT',
      entityType: 'auth',
      summary: 'Đăng xuất khỏi trang quản trị /quan-tri.',
      status: 'success',
    });
    res.json({ ok: true });
  });

  app.post('/api/admin/change-password', requireAdmin, (req, res) => {
    const currentPassword = typeof req.body?.currentPassword === 'string' ? req.body.currentPassword : '';
    const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';

    if (!verifyAdminPassword(currentPassword)) {
      res.status(400).json({ error: 'Mật khẩu hiện tại không đúng.' });
      return;
    }
    if (newPassword.length < 6) {
      res.status(400).json({ error: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' });
      return;
    }

    updateAdminPassword(newPassword);
    insertAuditLog({
      actor: 'Quản trị viên',
      action: 'CHANGE_PASSWORD',
      entityType: 'auth',
      summary: 'Đã cập nhật mật khẩu đăng nhập trang quản trị.',
      status: 'success',
    });
    res.json({ ok: true });
  });

  // =====================================================================
  // 3. ADMIN OVERVIEW & CMS DRAFT / PUBLISH API (Protected)
  // =====================================================================
  app.get('/api/admin/overview', requireAdmin, (_req, res) => {
    const cmsState = getCmsState();
    const driveCfg = getDriveConfig();
    const assets = listMediaAssets();
    const inquiries = listInquiries();
    const syncLogs = listSyncLogs(1);
    const recentLogs = listAuditLogs(8);
    const lastSync = syncLogs[0] || null;

    const courses = cmsState.draft.courses || [];
    const banners = cmsState.draft.heroShowcase || [];

    const hasLiveOAuth = hasRuntimeOAuthSession();
    const isOperational =
      driveCfg.connectionStatus === 'connected_verified' &&
      Boolean(driveCfg.rootFolderId) &&
      hasLiveOAuth;

    res.json({
      courses: {
        total: courses.length,
        published: courses.filter((c) => c.status !== 'hidden').length,
        hidden: courses.filter((c) => c.status === 'hidden').length,
        featured: courses.filter((c) => Boolean(c.featured)).length,
      },
      media: {
        total: assets.length,
        published: assets.filter((a) => a.publicationStatus === 'published').length,
        pending: assets.filter((a) => a.publicationStatus === 'pending').length,
        fromDrive: assets.filter((a) => !a.driveFileId.startsWith('upload_')).length,
        uploaded: assets.filter((a) => a.driveFileId.startsWith('upload_')).length,
      },
      banners: {
        total: banners.length,
        active: banners.filter((b) => b.active !== false).length,
      },
      inquiries: {
        total: inquiries.length,
        newCount: inquiries.filter((i) => i.status === 'new').length,
        contactedCount: inquiries.filter((i) => i.status === 'contacted').length,
        enrolledCount: inquiries.filter((i) => i.status === 'enrolled').length,
      },
      drive: {
        isOperational,
        connectionStatus: driveCfg.connectionStatus,
        rootFolderName: driveCfg.rootFolderName,
        lastSyncedAt: lastSync?.finishedAt || null,
        lastErrorCount: lastSync?.errorCount || 0,
      },
      cms: {
        draftUpdatedAt: cmsState.draftUpdatedAt,
        publishedUpdatedAt: cmsState.publishedUpdatedAt,
        hasUnpublishedChanges: cmsState.hasUnpublishedChanges,
      },
      recentLogs,
    });
  });

  app.get('/api/cms/state', requireAdmin, (_req, res) => {
    res.json(getCmsState());
  });

  app.put('/api/cms/draft', requireAdmin, (req, res) => {
    const snapshot = req.body?.snapshot as Partial<CmsSnapshot> | undefined;
    const summary =
      typeof req.body?.summary === 'string' && req.body.summary.trim()
        ? req.body.summary.trim()
        : 'Đã lưu bản nháp nội dung CMS vào cơ sở dữ liệu.';

    if (!snapshot || typeof snapshot !== 'object') {
      res.status(400).json({ error: 'Dữ liệu bản nháp không hợp lệ.' });
      return;
    }

    const updated = saveCmsDraft(snapshot, 'Quản trị viên');
    insertAuditLog({
      actor: 'Quản trị viên',
      action: 'SAVE_DRAFT',
      entityType: 'cms',
      entityId: 'draft',
      summary,
      status: 'success',
    });

    res.json({ ok: true, state: updated });
  });

  app.post('/api/cms/publish', requireAdmin, (req, res) => {
    const snapshot = req.body?.snapshot as Partial<CmsSnapshot> | undefined;
    const summary =
      typeof req.body?.summary === 'string' && req.body.summary.trim()
        ? req.body.summary.trim()
        : 'Đã xuất bản toàn bộ thay đổi lên website công khai EDUNEXA AI.';

    const updated = publishCmsDraft(snapshot, 'Quản trị viên');
    insertAuditLog({
      actor: 'Quản trị viên',
      action: 'PUBLISH_SITE',
      entityType: 'cms',
      entityId: 'published',
      summary,
      status: 'success',
    });

    res.json({ ok: true, state: updated });
  });

  app.post('/api/cms/reset', requireAdmin, (_req, res) => {
    const updated = resetCmsToDefaults('Quản trị viên');
    insertAuditLog({
      actor: 'Quản trị viên',
      action: 'RESET_CMS',
      entityType: 'cms',
      entityId: 'published',
      summary: 'Đã khôi phục toàn bộ nội dung website về cấu hình mặc định của EDUNEXA.',
      status: 'warning',
    });
    res.json({ ok: true, state: updated });
  });

  // =====================================================================
  // 4. GOOGLE DRIVE CONNECTION, VERIFICATION & SYNC API (Protected)
  // =====================================================================
  app.get('/api/drive/status', requireAdmin, (_req, res) => {
    const config = getDriveConfig();
    const assets = listMediaAssets();
    const logs = listSyncLogs(15);
    const lastLog = logs[0] || null;

    const counts = {
      totalStored: assets.length,
      published: assets.filter((a) => a.publicationStatus === 'published').length,
      pending: assets.filter((a) => a.publicationStatus === 'pending').length,
      error: assets.filter((a) => a.publicationStatus === 'error').length,
      deletedInDrive: assets.filter((a) => a.publicationStatus === 'deleted_in_drive').length,
    };

    const hasLiveOAuth = hasRuntimeOAuthSession();
    const isOperational =
      config.connectionStatus === 'connected_verified' &&
      Boolean(config.rootFolderId) &&
      hasLiveOAuth;

    res.json({
      config,
      hasLiveOAuth,
      isOperational,
      isSyncRunning: getSyncRunningState(),
      counts,
      lastLog,
      logs,
      courseMatchCatalog: COURSE_MATCH_CATALOG,
    });
  });

  app.post('/api/drive/session/attach', requireAdmin, async (req, res) => {
    const accessToken = getBearerToken(req);
    if (!accessToken) {
      res.status(401).json({ error: 'Thiếu Authorization Bearer token từ Google OAuth.' });
      return;
    }

    try {
      const infoRes = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`
      );
      if (!infoRes.ok) {
        res.status(401).json({ error: 'Google OAuth token không hợp lệ hoặc đã hết hạn.' });
        return;
      }
      const tokenInfo = (await infoRes.json()) as {
        email?: string;
        scope?: string;
      };
      const email =
        tokenInfo.email || (typeof req.body?.email === 'string' ? req.body.email : '');
      const displayName =
        typeof req.body?.displayName === 'string' ? req.body.displayName : email;

      attachRuntimeOAuthSession(accessToken, email, displayName);
      updateDriveConfig({
        connectedEmail: email,
        connectedDisplayName: displayName,
        lastError: null,
      });

      insertAuditLog({
        actor: email || 'Quản trị viên',
        action: 'DRIVE_OAUTH',
        entityType: 'drive',
        summary: `Đã xác thực phiên Google OAuth cho tài khoản ${email || displayName}.`,
        status: 'success',
      });

      res.json({
        ok: true,
        email,
        displayName,
        scopes: tokenInfo.scope || '',
      });
    } catch {
      res.status(502).json({ error: 'Không thể xác thực token với máy chủ Google.' });
    }
  });

  app.post('/api/drive/verify-folder', requireAdmin, async (req, res) => {
    const accessToken = getBearerToken(req);
    const folderInput = typeof req.body?.folderInput === 'string' ? req.body.folderInput : '';
    const saveOnSuccess = req.body?.save !== false;

    if (!accessToken) {
      res.status(401).json({
        error: 'Vui lòng đăng nhập Google trước khi kiểm tra quyền truy cập thư mục.',
      });
      return;
    }

    const folderId = extractDriveFolderId(folderInput);
    if (!folderId) {
      res.status(400).json({
        error: 'URL hoặc ID thư mục Google Drive không đúng định dạng.',
      });
      return;
    }

    const verification = await verifyDriveFolderAccess(folderId, accessToken);
    if (!verification.ok) {
      updateDriveConfig({
        connectionStatus: 'error',
        lastError: verification.error || 'Không thể truy cập thư mục Google Drive.',
      });
      insertAuditLog({
        actor: 'Quản trị viên',
        action: 'DRIVE_VERIFY_FAILED',
        entityType: 'drive',
        entityId: folderId,
        summary: verification.error || 'Kiểm tra quyền thư mục Google Drive thất bại.',
        status: 'error',
      });
      res.status(400).json(verification);
      return;
    }

    if (saveOnSuccess) {
      updateDriveConfig({
        rootFolderId: verification.folderId,
        rootFolderName: verification.folderName,
        rootFolderUrl: `https://drive.google.com/drive/folders/${verification.folderId}`,
        connectionStatus: 'connected_verified',
        lastVerifiedAt: new Date().toISOString(),
        lastError: null,
      });
      restartDriveSyncScheduler();
      insertAuditLog({
        actor: 'Quản trị viên',
        action: 'DRIVE_CONNECTED',
        entityType: 'drive',
        entityId: verification.folderId,
        summary: `Đã xác minh quyền đọc thư mục Google Drive "${verification.folderName}".`,
        status: 'success',
      });
    }

    res.json(verification);
  });

  app.put('/api/drive/config', requireAdmin, (req, res) => {
    const body = req.body || {};
    const updated = updateDriveConfig({
      syncIntervalMinutes:
        typeof body.syncIntervalMinutes === 'number' ? body.syncIntervalMinutes : undefined,
      autoSyncEnabled:
        typeof body.autoSyncEnabled === 'boolean' ? body.autoSyncEnabled : undefined,
      deletePolicy:
        body.deletePolicy === 'unpublish' ||
        body.deletePolicy === 'archive' ||
        body.deletePolicy === 'keep'
          ? body.deletePolicy
          : undefined,
      maxFileSizeMb:
        typeof body.maxFileSizeMb === 'number' ? body.maxFileSizeMb : undefined,
      folderRules: Array.isArray(body.folderRules) ? body.folderRules : undefined,
    });
    restartDriveSyncScheduler();
    insertAuditLog({
      actor: 'Quản trị viên',
      action: 'DRIVE_CONFIG',
      entityType: 'drive',
      summary: `Cập nhật cấu hình đồng bộ Drive (chu kỳ ${updated.syncIntervalMinutes} phút, xóa: ${updated.deletePolicy}).`,
      status: 'success',
    });
    res.json({ ok: true, config: updated });
  });

  app.post('/api/drive/disconnect', requireAdmin, (_req, res) => {
    clearRuntimeOAuthSession();
    const updated = updateDriveConfig({
      rootFolderId: '',
      rootFolderName: '',
      rootFolderUrl: '',
      connectedEmail: '',
      connectedDisplayName: '',
      connectionStatus: 'disconnected',
      lastVerifiedAt: null,
      lastError: null,
    });
    restartDriveSyncScheduler();
    insertAuditLog({
      actor: 'Quản trị viên',
      action: 'DRIVE_DISCONNECT',
      entityType: 'drive',
      summary: 'Đã ngắt kết nối Google Drive và xóa phiên OAuth tạm thời.',
      status: 'warning',
    });
    res.json({ ok: true, config: updated });
  });

  app.post('/api/drive/sync', requireAdmin, async (req, res) => {
    const headerToken = getBearerToken(req);
    if (headerToken) {
      const cfg = getDriveConfig();
      attachRuntimeOAuthSession(headerToken, cfg.connectedEmail, cfg.connectedDisplayName);
    }

    try {
      const log = await runDriveSync('manual', headerToken || undefined);
      insertAuditLog({
        actor: 'Quản trị viên',
        action: 'DRIVE_SYNC',
        entityType: 'drive',
        summary: `Đồng bộ thủ công Drive: phát hiện ${log.discoveredCount}, đồng bộ ${log.syncedCount}, bỏ qua ${log.skippedCount}, lỗi ${log.errorCount}.`,
        status: log.status === 'error' ? 'error' : log.status === 'partial' ? 'warning' : 'success',
      });
      res.json({ ok: log.status !== 'error', log });
    } catch (err) {
      res.status(409).json({
        error: err instanceof Error ? err.message : 'Không thể bắt đầu đồng bộ.',
      });
    }
  });

  // =====================================================================
  // 5. MEDIA ASSETS MANAGEMENT, UPLOAD, REORDER & ONE-CLICK BANNER (Protected)
  // =====================================================================
  app.get('/api/media', requireAdmin, (req, res) => {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    res.json({
      items: listMediaAssets({ category, status }),
    });
  });

  // Direct image upload from admin computer -> optimized WebP + thumbnail in /storage
  app.post('/api/media/upload', requireAdmin, async (req, res) => {
    try {
      const body = req.body || {};
      const dataUrl = typeof body.dataUrl === 'string' ? body.dataUrl : '';
      const filename = typeof body.filename === 'string' && body.filename.trim()
        ? body.filename.trim()
        : `upload-${Date.now()}.png`;
      const category = (typeof body.category === 'string' ? body.category : 'THU_VIEN_ANH') as DriveCategory;
      const courseId = typeof body.courseId === 'string' && body.courseId ? body.courseId : null;
      const title =
        typeof body.title === 'string' && body.title.trim()
          ? body.title.trim()
          : filename.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
      const altText =
        typeof body.altText === 'string' && body.altText.trim()
          ? body.altText.trim()
          : `${title} — EDUNEXA AI`;
      const autoPublish = body.autoPublish !== false && category !== 'CHO_DUYET';

      const match = dataUrl.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/i);
      if (!match) {
        res.status(400).json({
          error: 'Định dạng ảnh không hợp lệ. Chỉ chấp nhận JPG, PNG hoặc WEBP.',
        });
        return;
      }

      const mimeType = match[1].toLowerCase() === 'image/jpg' ? 'image/jpeg' : match[1].toLowerCase();
      const rawBuffer = Buffer.from(match[2], 'base64');
      if (rawBuffer.length > 15 * 1024 * 1024) {
        res.status(400).json({ error: 'Dung lượng ảnh vượt quá 15 MB.' });
        return;
      }

      const meta = await sharp(rawBuffer).metadata();
      if (!meta.width || !meta.height) {
        res.status(400).json({ error: 'Tệp ảnh không hợp lệ hoặc bị hỏng.' });
        return;
      }

      const checksum = crypto.createHash('md5').update(rawBuffer).digest('hex');
      const assetId = `media_${crypto.randomUUID().replace(/-/g, '').slice(0, 14)}`;
      const stem = `${assetId}_${checksum.slice(0, 8)}`;
      const fullFileName = `${stem}.webp`;
      const thumbFileName = `${stem}_thumb.webp`;

      const fullDiskPath = path.join(MEDIA_DIR, fullFileName);
      const thumbDiskPath = path.join(THUMBS_DIR, thumbFileName);

      const optimized = await sharp(rawBuffer)
        .rotate()
        .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 84 })
        .toFile(fullDiskPath);

      await sharp(rawBuffer)
        .rotate()
        .resize({ width: 480, height: 300, fit: 'cover', position: 'top' })
        .webp({ quality: 78 })
        .toFile(thumbDiskPath);

      const nowIso = new Date().toISOString();
      const publicationStatus: PublicationStatus =
        category === 'ANH_KHOA_HOC' && !courseId
          ? 'pending'
          : autoPublish
            ? 'published'
            : 'pending';

      const record: MediaAssetRecord = {
        id: assetId,
        driveFileId: `upload_${assetId}`,
        folderId: 'local_upload',
        filename,
        mimeType,
        fileSize: rawBuffer.length,
        width: optimized.width,
        height: optimized.height,
        checksum,
        modifiedTime: nowIso,
        title,
        altText,
        category,
        courseId: category === 'ANH_KHOA_HOC' ? courseId : null,
        displayOrder: 5,
        publicUrl: `/storage/media/${fullFileName}`,
        thumbnailUrl: `/storage/thumbs/${thumbFileName}`,
        publicationStatus,
        errorMessage: null,
        lastSyncedAt: nowIso,
        createdAt: nowIso,
      };

      upsertMediaAsset(record);
      insertAuditLog({
        actor: 'Quản trị viên',
        action: 'UPLOAD_MEDIA',
        entityType: 'media',
        entityId: assetId,
        summary: `Tải lên ảnh mới "${filename}" (${optimized.width}×${optimized.height} WebP) vào nhóm ${category}.`,
        status: 'success',
      });

      res.status(201).json({ ok: true, item: record });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Không thể xử lý ảnh tải lên.',
      });
    }
  });

  app.post('/api/media/reorder', requireAdmin, (req, res) => {
    const orderedIds = Array.isArray(req.body?.orderedIds)
      ? req.body.orderedIds.filter((id: unknown): id is string => typeof id === 'string')
      : [];
    if (orderedIds.length === 0) {
      res.status(400).json({ error: 'Danh sách sắp xếp không hợp lệ.' });
      return;
    }
    reorderMediaAssets(orderedIds);
    insertAuditLog({
      actor: 'Quản trị viên',
      action: 'REORDER_MEDIA',
      entityType: 'media',
      summary: `Cập nhật thứ tự hiển thị cho ${orderedIds.length} hình ảnh trong thư viện.`,
      status: 'success',
    });
    res.json({ ok: true });
  });

  // One-click "Đổi ảnh banner": promotes an image directly to the primary Hero Banner slot
  app.post('/api/media/:id/set-banner', requireAdmin, (req, res) => {
    const id = req.params.id;
    const asset = getMediaAssetById(id);
    if (!asset) {
      res.status(404).json({ error: 'Không tìm thấy ảnh này.' });
      return;
    }

    const updatedAsset = updateMediaAssetFields(id, {
      category: 'BANNER_HERO',
      courseId: null,
      displayOrder: 1,
      publicationStatus: 'published',
    });

    // Also promote directly into CMS heroShowcase (both draft and published if publishNow !== false)
    const cmsState = getCmsState();
    const draft = cmsState.draft;
    const existingIdx = draft.heroShowcase.findIndex((h) => h.mediaUrl === asset.publicUrl);
    const bannerItem = {
      id: existingIdx >= 0 ? draft.heroShowcase[existingIdx].id : `banner-${asset.id}`,
      label: asset.title.slice(0, 24) || 'Banner nổi bật',
      title: asset.title || 'Học liệu thực tế EDUNEXA',
      description: asset.altText || 'Học liệu số và hoạt động đào tạo ứng dụng AI tại EDUNEXA.',
      mediaType: 'image' as const,
      mediaUrl: asset.publicUrl,
      relatedCourseId: draft.courses[0]?.id || 'ai-toan-dien-cho-giao-vien',
      active: true,
    };

    const nextShowcase = [
      bannerItem,
      ...draft.heroShowcase.filter((h) => h.mediaUrl !== asset.publicUrl),
    ];

    const publishNow = req.body?.publishNow !== false;
    const nextSnapshot: CmsSnapshot = {
      ...draft,
      heroShowcase: nextShowcase,
    };

    const nextState = publishNow
      ? publishCmsDraft(nextSnapshot, 'Quản trị viên')
      : saveCmsDraft(nextSnapshot, 'Quản trị viên');

    insertAuditLog({
      actor: 'Quản trị viên',
      action: 'SET_BANNER',
      entityType: 'media',
      entityId: id,
      summary: `Đặt ảnh "${asset.title}" làm Banner Hero chính${publishNow ? ' và xuất bản ngay' : ' (bản nháp)'}.`,
      status: 'success',
    });

    res.json({ ok: true, item: updatedAsset, cmsState: nextState });
  });

  app.patch('/api/media/:id', requireAdmin, (req, res) => {
    const id = req.params.id;
    const existing = getMediaAssetById(id);
    if (!existing) {
      res.status(404).json({ error: 'Không tìm thấy ảnh này trong cơ sở dữ liệu.' });
      return;
    }

    const body = req.body || {};
    const nextCategory =
      typeof body.category === 'string' ? (body.category as DriveCategory) : existing.category;
    const nextCourseId =
      body.courseId === null
        ? null
        : typeof body.courseId === 'string'
          ? body.courseId || null
          : existing.courseId;

    const requestedStatus =
      typeof body.publicationStatus === 'string'
        ? (body.publicationStatus as PublicationStatus)
        : existing.publicationStatus;

    if (nextCategory === 'ANH_KHOA_HOC' && requestedStatus === 'published' && !nextCourseId) {
      res.status(400).json({
        error: 'Vui lòng chọn khóa học tương ứng trước khi xuất bản ảnh thuộc nhóm Ảnh Khóa Học.',
      });
      return;
    }

    const updated = updateMediaAssetFields(id, {
      title: typeof body.title === 'string' ? body.title.trim() : existing.title,
      altText: typeof body.altText === 'string' ? body.altText.trim() : existing.altText,
      category: nextCategory,
      courseId: nextCategory === 'ANH_KHOA_HOC' ? nextCourseId : null,
      displayOrder:
        typeof body.displayOrder === 'number' ? body.displayOrder : existing.displayOrder,
      publicationStatus: requestedStatus,
    });

    insertAuditLog({
      actor: 'Quản trị viên',
      action: 'UPDATE_MEDIA',
      entityType: 'media',
      entityId: id,
      summary: `Cập nhật ảnh "${updated?.title || existing.filename}" → nhóm ${nextCategory}, trạng thái ${requestedStatus}.`,
      status: 'success',
    });

    res.json({ ok: true, item: updated });
  });

  app.delete('/api/media/:id', requireAdmin, (req, res) => {
    const id = req.params.id;
    const removed = deleteMediaAssetById(id);
    if (!removed) {
      res.status(404).json({ error: 'Không tìm thấy ảnh để xóa.' });
      return;
    }
    insertAuditLog({
      actor: 'Quản trị viên',
      action: 'DELETE_MEDIA',
      entityType: 'media',
      entityId: id,
      summary: `Đã gỡ bỏ ảnh "${removed.title || removed.filename}" khỏi thư viện hệ thống.`,
      status: 'warning',
    });
    res.json({ ok: true });
  });

  // =====================================================================
  // 6. INQUIRIES (ĐĂNG KÝ & LIÊN HỆ) API (Protected)
  // =====================================================================
  app.get('/api/inquiries', requireAdmin, (req, res) => {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    res.json({ items: listInquiries({ status, search }) });
  });

  app.post('/api/inquiries', requireAdmin, (req, res) => {
    const body = req.body || {};
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    if (fullName.length < 2 || phone.length < 6) {
      res.status(400).json({ error: 'Vui lòng nhập đầy đủ họ tên và số điện thoại.' });
      return;
    }
    const created = createInquiry({
      fullName,
      phone,
      email: typeof body.email === 'string' ? body.email : '',
      courseId: typeof body.courseId === 'string' ? body.courseId : '',
      courseTitle: typeof body.courseTitle === 'string' ? body.courseTitle : '',
      note: typeof body.note === 'string' ? body.note : '',
      source: 'admin',
    });
    insertAuditLog({
      actor: 'Quản trị viên',
      action: 'CREATE_INQUIRY',
      entityType: 'inquiry',
      entityId: created.id,
      summary: `Thêm thủ công liên hệ đăng ký: ${fullName} (${phone}).`,
      status: 'success',
    });
    res.status(201).json({ ok: true, inquiry: created });
  });

  app.patch('/api/inquiries/:id', requireAdmin, (req, res) => {
    const id = req.params.id;
    const body = req.body || {};
    const validStatuses: InquiryStatus[] = ['new', 'contacted', 'enrolled', 'archived'];
    const status = validStatuses.includes(body.status) ? (body.status as InquiryStatus) : undefined;

    const updated = updateInquiry(id, {
      status,
      adminNotes: typeof body.adminNotes === 'string' ? body.adminNotes : undefined,
      courseId: typeof body.courseId === 'string' ? body.courseId : undefined,
      courseTitle: typeof body.courseTitle === 'string' ? body.courseTitle : undefined,
    });
    if (!updated) {
      res.status(404).json({ error: 'Không tìm thấy yêu cầu đăng ký này.' });
      return;
    }
    insertAuditLog({
      actor: 'Quản trị viên',
      action: 'UPDATE_INQUIRY',
      entityType: 'inquiry',
      entityId: id,
      summary: `Cập nhật liên hệ "${updated.fullName}" → trạng thái "${updated.status}".`,
      status: 'success',
    });
    res.json({ ok: true, inquiry: updated });
  });

  app.delete('/api/inquiries/:id', requireAdmin, (req, res) => {
    const id = req.params.id;
    const ok = deleteInquiry(id);
    if (!ok) {
      res.status(404).json({ error: 'Không tìm thấy bản ghi để xóa.' });
      return;
    }
    insertAuditLog({
      actor: 'Quản trị viên',
      action: 'DELETE_INQUIRY',
      entityType: 'inquiry',
      entityId: id,
      summary: `Đã xóa bản ghi đăng ký/liên hệ (${id}).`,
      status: 'warning',
    });
    res.json({ ok: true });
  });

  // =====================================================================
  // 7. AUDIT LOGS (NHẬT KÝ HỆ THỐNG) API (Protected)
  // =====================================================================
  app.get('/api/audit-logs', requireAdmin, (req, res) => {
    const limit = Math.min(200, Math.max(10, Number(req.query.limit) || 80));
    const action = typeof req.query.action === 'string' ? req.query.action : undefined;
    res.json({
      auditLogs: listAuditLogs(limit, action),
      syncLogs: listSyncLogs(30),
    });
  });

  // Start the 5-minute background Drive sync scheduler
  restartDriveSyncScheduler();

  // Mount Vite middleware in development OR serve static dist/ in production
  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EDUNEXA] Full-stack CMS server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[EDUNEXA] Failed to start server:', err);
  process.exit(1);
});
