import Database from 'better-sqlite3';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export type DriveCategory =
  | 'BANNER_HERO'
  | 'ANH_KHOA_HOC'
  | 'SAN_PHAM_HOC_VIEN'
  | 'ANH_GIANG_VIEN'
  | 'THU_VIEN_ANH'
  | 'ANH_DOI_TAC'
  | 'CHO_DUYET';

export type PublicationStatus =
  | 'published'
  | 'pending'
  | 'unpublished'
  | 'archived'
  | 'deleted_in_drive'
  | 'error';

export type DeletePolicy = 'unpublish' | 'archive' | 'keep';

export interface FolderGroupRule {
  category: DriveCategory;
  folderName: string;
  label: string;
  autoPublish: boolean;
  enabled: boolean;
}

export interface DriveConfigRecord {
  id: number;
  rootFolderId: string;
  rootFolderName: string;
  rootFolderUrl: string;
  connectedEmail: string;
  connectedDisplayName: string;
  connectionStatus: 'disconnected' | 'connected_verified' | 'error';
  lastVerifiedAt: string | null;
  lastError: string | null;
  syncIntervalMinutes: number;
  autoSyncEnabled: boolean;
  deletePolicy: DeletePolicy;
  maxFileSizeMb: number;
  folderRules: FolderGroupRule[];
}

export interface MediaAssetRecord {
  id: string;
  driveFileId: string;
  folderId: string;
  filename: string;
  mimeType: string;
  fileSize: number;
  width: number;
  height: number;
  checksum: string;
  modifiedTime: string;
  title: string;
  altText: string;
  category: DriveCategory;
  courseId: string | null;
  displayOrder: number;
  publicUrl: string;
  thumbnailUrl: string;
  publicationStatus: PublicationStatus;
  errorMessage: string | null;
  lastSyncedAt: string;
  createdAt: string;
}

export interface SyncLogRecord {
  id: number;
  startedAt: string;
  finishedAt: string;
  triggerType: 'manual' | 'scheduled' | 'verify';
  status: 'success' | 'partial' | 'error';
  discoveredCount: number;
  syncedCount: number;
  skippedCount: number;
  updatedCount: number;
  deletedCount: number;
  errorCount: number;
  errorMessage: string | null;
  details: string[];
}

export const DEFAULT_FOLDER_RULES: FolderGroupRule[] = [
  {
    category: 'BANNER_HERO',
    folderName: '01_BANNER_HERO',
    label: 'Banner Hero',
    autoPublish: true,
    enabled: true,
  },
  {
    category: 'ANH_KHOA_HOC',
    folderName: '02_ANH_KHOA_HOC',
    label: 'Ảnh Khóa Học',
    autoPublish: true,
    enabled: true,
  },
  {
    category: 'SAN_PHAM_HOC_VIEN',
    folderName: '03_SAN_PHAM_HOC_VIEN',
    label: 'Sản Phẩm Học Viên',
    autoPublish: true,
    enabled: true,
  },
  {
    category: 'ANH_GIANG_VIEN',
    folderName: '04_ANH_GIANG_VIEN',
    label: 'Ảnh Giảng Viên',
    autoPublish: true,
    enabled: true,
  },
  {
    category: 'THU_VIEN_ANH',
    folderName: '05_THU_VIEN_ANH',
    label: 'Thư Viện Ảnh',
    autoPublish: true,
    enabled: true,
  },
  {
    category: 'ANH_DOI_TAC',
    folderName: '06_ANH_DOI_TAC',
    label: 'Ảnh Đối Tác',
    autoPublish: true,
    enabled: true,
  },
  {
    category: 'CHO_DUYET',
    folderName: '07_CHO_DUYET',
    label: 'Chờ Duyệt',
    autoPublish: false,
    enabled: true,
  },
];

export const DATA_DIR = path.resolve(process.cwd(), 'data');
export const STORAGE_ROOT = path.resolve(process.cwd(), 'storage');
export const MEDIA_DIR = path.join(STORAGE_ROOT, 'media');
export const THUMBS_DIR = path.join(STORAGE_ROOT, 'thumbs');

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(MEDIA_DIR, { recursive: true });
fs.mkdirSync(THUMBS_DIR, { recursive: true });

const dbPath = path.join(DATA_DIR, 'edunexa.db');
export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS drive_config (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    rootFolderId TEXT NOT NULL DEFAULT '',
    rootFolderName TEXT NOT NULL DEFAULT '',
    rootFolderUrl TEXT NOT NULL DEFAULT '',
    connectedEmail TEXT NOT NULL DEFAULT '',
    connectedDisplayName TEXT NOT NULL DEFAULT '',
    connectionStatus TEXT NOT NULL DEFAULT 'disconnected',
    lastVerifiedAt TEXT,
    lastError TEXT,
    syncIntervalMinutes INTEGER NOT NULL DEFAULT 5,
    autoSyncEnabled INTEGER NOT NULL DEFAULT 1,
    deletePolicy TEXT NOT NULL DEFAULT 'unpublish',
    maxFileSizeMb INTEGER NOT NULL DEFAULT 15,
    folderRulesJson TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS media_assets (
    id TEXT PRIMARY KEY,
    driveFileId TEXT UNIQUE NOT NULL,
    folderId TEXT NOT NULL,
    filename TEXT NOT NULL,
    mimeType TEXT NOT NULL,
    fileSize INTEGER NOT NULL DEFAULT 0,
    width INTEGER NOT NULL DEFAULT 0,
    height INTEGER NOT NULL DEFAULT 0,
    checksum TEXT NOT NULL,
    modifiedTime TEXT NOT NULL,
    title TEXT NOT NULL,
    altText TEXT NOT NULL,
    category TEXT NOT NULL,
    courseId TEXT,
    displayOrder INTEGER NOT NULL DEFAULT 0,
    publicUrl TEXT NOT NULL,
    thumbnailUrl TEXT NOT NULL,
    publicationStatus TEXT NOT NULL DEFAULT 'pending',
    errorMessage TEXT,
    lastSyncedAt TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_media_category_status
    ON media_assets(category, publicationStatus, displayOrder);

  CREATE INDEX IF NOT EXISTS idx_media_course
    ON media_assets(courseId, publicationStatus);

  CREATE TABLE IF NOT EXISTS sync_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    startedAt TEXT NOT NULL,
    finishedAt TEXT NOT NULL,
    triggerType TEXT NOT NULL,
    status TEXT NOT NULL,
    discoveredCount INTEGER NOT NULL DEFAULT 0,
    syncedCount INTEGER NOT NULL DEFAULT 0,
    skippedCount INTEGER NOT NULL DEFAULT 0,
    updatedCount INTEGER NOT NULL DEFAULT 0,
    deletedCount INTEGER NOT NULL DEFAULT 0,
    errorCount INTEGER NOT NULL DEFAULT 0,
    errorMessage TEXT,
    detailsJson TEXT NOT NULL DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS admin_auth (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    passwordHash TEXT NOT NULL,
    salt TEXT NOT NULL,
    sessionSecret TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`);

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

// Seed default drive_config if absent
const existingConfig = db.prepare('SELECT id FROM drive_config WHERE id = 1').get();
if (!existingConfig) {
  db.prepare(
    `INSERT INTO drive_config (
      id, rootFolderId, rootFolderName, rootFolderUrl,
      connectedEmail, connectedDisplayName, connectionStatus,
      syncIntervalMinutes, autoSyncEnabled, deletePolicy, maxFileSizeMb, folderRulesJson
    ) VALUES (1, '', '', '', '', '', 'disconnected', 5, 1, 'unpublish', 15, ?)`
  ).run(JSON.stringify(DEFAULT_FOLDER_RULES));
}

// Seed default admin credentials if absent
const existingAdmin = db.prepare('SELECT id FROM admin_auth WHERE id = 1').get();
if (!existingAdmin) {
  const defaultPwd = process.env.ADMIN_INITIAL_PASSWORD || 'Dongbac2ty';
  const salt = crypto.randomBytes(16).toString('hex');
  const sessionSecret = crypto.randomBytes(32).toString('hex');
  db.prepare(
    'INSERT INTO admin_auth (id, passwordHash, salt, sessionSecret, updatedAt) VALUES (1, ?, ?, ?, ?)'
  ).run(hashPassword(defaultPwd, salt), salt, sessionSecret, new Date().toISOString());
}

export function verifyAdminPassword(candidate: string): boolean {
  const row = db
    .prepare('SELECT passwordHash, salt FROM admin_auth WHERE id = 1')
    .get() as { passwordHash: string; salt: string } | undefined;
  if (!row) return false;
  const derived = hashPassword(candidate, row.salt);
  return crypto.timingSafeEqual(Buffer.from(derived, 'hex'), Buffer.from(row.passwordHash, 'hex'));
}

export function updateAdminPassword(newPassword: string): void {
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(newPassword, salt);
  db.prepare('UPDATE admin_auth SET passwordHash = ?, salt = ?, updatedAt = ? WHERE id = 1').run(
    passwordHash,
    salt,
    new Date().toISOString()
  );
}

function getSessionSecret(): string {
  const row = db.prepare('SELECT sessionSecret FROM admin_auth WHERE id = 1').get() as {
    sessionSecret: string;
  };
  return row.sessionSecret;
}

export function createAdminSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({
      role: 'admin',
      iat: Date.now(),
      exp: Date.now() + 1000 * 60 * 60 * 12, // 12 hours
      nonce: crypto.randomBytes(8).toString('hex'),
    })
  ).toString('base64url');
  const sig = crypto
    .createHmac('sha256', getSessionSecret())
    .update(payload)
    .digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = crypto
    .createHmac('sha256', getSessionSecret())
    .update(payload)
    .digest('base64url');
  if (sig.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      role?: string;
      exp?: number;
    };
    return parsed.role === 'admin' && typeof parsed.exp === 'number' && parsed.exp > Date.now();
  } catch {
    return false;
  }
}

export function getDriveConfig(): DriveConfigRecord {
  const row = db.prepare('SELECT * FROM drive_config WHERE id = 1').get() as {
    id: number;
    rootFolderId: string;
    rootFolderName: string;
    rootFolderUrl: string;
    connectedEmail: string;
    connectedDisplayName: string;
    connectionStatus: 'disconnected' | 'connected_verified' | 'error';
    lastVerifiedAt: string | null;
    lastError: string | null;
    syncIntervalMinutes: number;
    autoSyncEnabled: number;
    deletePolicy: DeletePolicy;
    maxFileSizeMb: number;
    folderRulesJson: string;
  };

  let parsedRules: FolderGroupRule[] = DEFAULT_FOLDER_RULES;
  try {
    const parsed = JSON.parse(row.folderRulesJson);
    if (Array.isArray(parsed) && parsed.length > 0) {
      parsedRules = parsed;
    }
  } catch {
    parsedRules = DEFAULT_FOLDER_RULES;
  }

  return {
    id: row.id,
    rootFolderId: row.rootFolderId,
    rootFolderName: row.rootFolderName,
    rootFolderUrl: row.rootFolderUrl,
    connectedEmail: row.connectedEmail,
    connectedDisplayName: row.connectedDisplayName,
    connectionStatus: row.connectionStatus,
    lastVerifiedAt: row.lastVerifiedAt,
    lastError: row.lastError,
    syncIntervalMinutes: row.syncIntervalMinutes,
    autoSyncEnabled: Boolean(row.autoSyncEnabled),
    deletePolicy: row.deletePolicy,
    maxFileSizeMb: row.maxFileSizeMb,
    folderRules: parsedRules,
  };
}

export function updateDriveConfig(patch: Partial<DriveConfigRecord>): DriveConfigRecord {
  const current = getDriveConfig();
  const next: DriveConfigRecord = {
    ...current,
    ...patch,
    folderRules: patch.folderRules || current.folderRules,
  };

  db.prepare(
    `UPDATE drive_config SET
      rootFolderId = ?,
      rootFolderName = ?,
      rootFolderUrl = ?,
      connectedEmail = ?,
      connectedDisplayName = ?,
      connectionStatus = ?,
      lastVerifiedAt = ?,
      lastError = ?,
      syncIntervalMinutes = ?,
      autoSyncEnabled = ?,
      deletePolicy = ?,
      maxFileSizeMb = ?,
      folderRulesJson = ?
    WHERE id = 1`
  ).run(
    next.rootFolderId,
    next.rootFolderName,
    next.rootFolderUrl,
    next.connectedEmail,
    next.connectedDisplayName,
    next.connectionStatus,
    next.lastVerifiedAt,
    next.lastError,
    Math.max(1, Math.min(60, Number(next.syncIntervalMinutes) || 5)),
    next.autoSyncEnabled ? 1 : 0,
    next.deletePolicy,
    Math.max(1, Math.min(50, Number(next.maxFileSizeMb) || 15)),
    JSON.stringify(next.folderRules)
  );

  return getDriveConfig();
}

export function listMediaAssets(filters?: {
  category?: string;
  status?: string;
}): MediaAssetRecord[] {
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (filters?.category && filters.category !== 'ALL') {
    clauses.push('category = ?');
    params.push(filters.category);
  }
  if (filters?.status && filters.status !== 'ALL') {
    clauses.push('publicationStatus = ?');
    params.push(filters.status);
  }

  const where = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
  return db
    .prepare(
      `SELECT * FROM media_assets ${where} ORDER BY displayOrder ASC, lastSyncedAt DESC`
    )
    .all(...params) as MediaAssetRecord[];
}

export function getMediaAssetByDriveId(driveFileId: string): MediaAssetRecord | undefined {
  return db
    .prepare('SELECT * FROM media_assets WHERE driveFileId = ?')
    .get(driveFileId) as MediaAssetRecord | undefined;
}

export function getMediaAssetById(id: string): MediaAssetRecord | undefined {
  return db
    .prepare('SELECT * FROM media_assets WHERE id = ?')
    .get(id) as MediaAssetRecord | undefined;
}

export function upsertMediaAsset(asset: MediaAssetRecord): void {
  db.prepare(
    `INSERT INTO media_assets (
      id, driveFileId, folderId, filename, mimeType, fileSize, width, height,
      checksum, modifiedTime, title, altText, category, courseId, displayOrder,
      publicUrl, thumbnailUrl, publicationStatus, errorMessage, lastSyncedAt, createdAt
    ) VALUES (
      @id, @driveFileId, @folderId, @filename, @mimeType, @fileSize, @width, @height,
      @checksum, @modifiedTime, @title, @altText, @category, @courseId, @displayOrder,
      @publicUrl, @thumbnailUrl, @publicationStatus, @errorMessage, @lastSyncedAt, @createdAt
    )
    ON CONFLICT(driveFileId) DO UPDATE SET
      folderId = excluded.folderId,
      filename = excluded.filename,
      mimeType = excluded.mimeType,
      fileSize = excluded.fileSize,
      width = excluded.width,
      height = excluded.height,
      checksum = excluded.checksum,
      modifiedTime = excluded.modifiedTime,
      title = excluded.title,
      altText = excluded.altText,
      category = excluded.category,
      courseId = excluded.courseId,
      displayOrder = excluded.displayOrder,
      publicUrl = excluded.publicUrl,
      thumbnailUrl = excluded.thumbnailUrl,
      publicationStatus = excluded.publicationStatus,
      errorMessage = excluded.errorMessage,
      lastSyncedAt = excluded.lastSyncedAt`
  ).run(asset);
}

export function updateMediaAssetFields(
  id: string,
  patch: Partial<
    Pick<
      MediaAssetRecord,
      'title' | 'altText' | 'category' | 'courseId' | 'displayOrder' | 'publicationStatus'
    >
  >
): MediaAssetRecord | undefined {
  const existing = getMediaAssetById(id);
  if (!existing) return undefined;

  const updated: MediaAssetRecord = {
    ...existing,
    ...patch,
  };

  db.prepare(
    `UPDATE media_assets SET
      title = ?, altText = ?, category = ?, courseId = ?, displayOrder = ?, publicationStatus = ?
    WHERE id = ?`
  ).run(
    updated.title,
    updated.altText,
    updated.category,
    updated.courseId,
    Number(updated.displayOrder) || 0,
    updated.publicationStatus,
    id
  );

  return getMediaAssetById(id);
}

export function insertSyncLog(log: Omit<SyncLogRecord, 'id'>): SyncLogRecord {
  const result = db
    .prepare(
      `INSERT INTO sync_logs (
        startedAt, finishedAt, triggerType, status,
        discoveredCount, syncedCount, skippedCount, updatedCount, deletedCount, errorCount,
        errorMessage, detailsJson
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      log.startedAt,
      log.finishedAt,
      log.triggerType,
      log.status,
      log.discoveredCount,
      log.syncedCount,
      log.skippedCount,
      log.updatedCount,
      log.deletedCount,
      log.errorCount,
      log.errorMessage,
      JSON.stringify(log.details)
    );

  return {
    id: Number(result.lastInsertRowid),
    ...log,
  };
}

export function listSyncLogs(limit = 15): SyncLogRecord[] {
  const rows = db
    .prepare('SELECT * FROM sync_logs ORDER BY id DESC LIMIT ?')
    .all(limit) as Array<{
    id: number;
    startedAt: string;
    finishedAt: string;
    triggerType: 'manual' | 'scheduled' | 'verify';
    status: 'success' | 'partial' | 'error';
    discoveredCount: number;
    syncedCount: number;
    skippedCount: number;
    updatedCount: number;
    deletedCount: number;
    errorCount: number;
    errorMessage: string | null;
    detailsJson: string;
  }>;

  return rows.map((row) => ({
    id: row.id,
    startedAt: row.startedAt,
    finishedAt: row.finishedAt,
    triggerType: row.triggerType,
    status: row.status,
    discoveredCount: row.discoveredCount,
    syncedCount: row.syncedCount,
    skippedCount: row.skippedCount,
    updatedCount: row.updatedCount,
    deletedCount: row.deletedCount,
    errorCount: row.errorCount,
    errorMessage: row.errorMessage,
    details: (() => {
      try {
        return JSON.parse(row.detailsJson) as string[];
      } catch {
        return [];
      }
    })(),
  }));
}
