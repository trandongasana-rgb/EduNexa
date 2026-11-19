import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  STORAGE_ROOT,
  createAdminSessionToken,
  getDriveConfig,
  getMediaAssetById,
  listMediaAssets,
  listSyncLogs,
  updateAdminPassword,
  updateDriveConfig,
  updateMediaAssetFields,
  verifyAdminPassword,
  verifyAdminSessionToken,
  type DriveCategory,
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT || 3000);

function getBearerToken(req: express.Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice('Bearer '.length).trim();
  return token || null;
}

function requireAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  const sessionToken = req.header('x-admin-session') || undefined;
  if (!verifyAdminSessionToken(sessionToken)) {
    res.status(401).json({
      error: 'Phiên quản trị không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.',
    });
    return;
  }
  next();
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '5mb' }));

  // Serve optimized images & thumbnails from persistent local storage with immutable cache
  app.use(
    '/storage',
    express.static(STORAGE_ROOT, {
      maxAge: '365d',
      immutable: true,
      fallthrough: false,
    })
  );

  // =====================================================================
  // 1. PUBLIC READ-ONLY MEDIA API (Serves strictly approved/published items)
  // =====================================================================
  app.get('/api/public/media', (_req, res) => {
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

    res.json({
      updatedAt: new Date().toISOString(),
      totalPublished: published.length,
      grouped,
    });
  });

  // =====================================================================
  // 2. ADMIN AUTHENTICATION API (Server-side verification)
  // =====================================================================
  app.post('/api/admin/login', (req, res) => {
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!verifyAdminPassword(password)) {
      res.status(401).json({ error: 'Mật khẩu quản trị không chính xác.' });
      return;
    }
    const token = createAdminSessionToken();
    res.json({ ok: true, sessionToken: token });
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
    res.json({ ok: true });
  });

  // =====================================================================
  // 3. GOOGLE DRIVE CONNECTION, VERIFICATION & SYNC API (Protected)
  // =====================================================================
  app.get('/api/drive/status', requireAdmin, (_req, res) => {
    const config = getDriveConfig();
    const assets = listMediaAssets();
    const logs = listSyncLogs(10);
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

  // Attach client-obtained Google OAuth access token to server RAM for API access & 5-min scheduler
  app.post('/api/drive/session/attach', requireAdmin, async (req, res) => {
    const accessToken = getBearerToken(req);
    if (!accessToken) {
      res.status(401).json({ error: 'Thiếu Authorization Bearer token từ Google OAuth.' });
      return;
    }

    // Verify token against Google OAuth tokeninfo endpoint on server
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

  // Verify folder read permission with real Google Drive API call & optionally save folder
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
    }

    res.json(verification);
  });

  // Update folder rules, auto-publish switches, sync interval, delete policy
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
    res.json({ ok: true, config: updated });
  });

  // Disconnect Google Drive & clear runtime OAuth token
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
    res.json({ ok: true, config: updated });
  });

  // Trigger manual sync ("ĐỒNG BỘ NGAY")
  app.post('/api/drive/sync', requireAdmin, async (req, res) => {
    const headerToken = getBearerToken(req);
    if (headerToken) {
      const cfg = getDriveConfig();
      attachRuntimeOAuthSession(headerToken, cfg.connectedEmail, cfg.connectedDisplayName);
    }

    try {
      const log = await runDriveSync('manual', headerToken || undefined);
      res.json({ ok: log.status !== 'error', log });
    } catch (err) {
      res.status(409).json({
        error: err instanceof Error ? err.message : 'Không thể bắt đầu đồng bộ.',
      });
    }
  });

  // =====================================================================
  // 4. MEDIA ASSETS MANAGEMENT & APPROVAL API (Protected)
  // =====================================================================
  app.get('/api/media', requireAdmin, (req, res) => {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    res.json({
      items: listMediaAssets({ category, status }),
    });
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

    // Prevent publishing an ANH_KHOA_HOC item without a linked courseId
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

    res.json({ ok: true, item: updated });
  });

  // Start the 5-minute background scheduler
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
    console.log(`[EDUNEXA] Full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[EDUNEXA] Failed to start server:', err);
  process.exit(1);
});
