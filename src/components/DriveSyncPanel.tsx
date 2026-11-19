import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  CloudOff,
  FolderOpen,
  FolderSearch,
  RefreshCw,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Unlink,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import type {
  Course,
  DeletePolicy,
  DriveCategory,
  DriveStatusResponse,
  FolderGroupRule,
  FolderVerificationResult,
  PublicationStatus,
  SyncedMediaAsset,
} from '../types';
import {
  attachDriveOAuthSession,
  disconnectDriveApi,
  fetchAdminMediaAssets,
  fetchDriveStatus,
  triggerManualDriveSync,
  updateDriveConfigApi,
  updateMediaAssetApi,
  verifyDriveFolder,
} from '../services/driveApi';
import {
  getInMemoryGoogleToken,
  getInMemoryGoogleUser,
  initGoogleAuthListener,
  signInWithGoogleDrive,
  signOutGoogleDrive,
  type GoogleAccountInfo,
} from '../services/googleAuth';
import { openDriveFolderPicker } from '../services/googlePicker';
import { MediaFrame } from './MediaFrame';

interface DriveSyncPanelProps {
  adminSessionToken: string;
  courses: Course[];
  onMediaPublishedChange: () => Promise<void> | void;
  onNotify: (message: string) => void;
}

const CATEGORY_LABELS: Record<DriveCategory, string> = {
  BANNER_HERO: '01 · Banner Hero',
  ANH_KHOA_HOC: '02 · Ảnh Khóa Học',
  SAN_PHAM_HOC_VIEN: '03 · Sản Phẩm Học Viên',
  ANH_GIANG_VIEN: '04 · Ảnh Giảng Viên',
  THU_VIEN_ANH: '05 · Thư Viện Ảnh',
  ANH_DOI_TAC: '06 · Ảnh Đối Tác',
  CHO_DUYET: '07 · Chờ Duyệt',
};

const STATUS_BADGE: Record<
  PublicationStatus,
  { label: string; className: string }
> = {
  published: {
    label: 'Đã xuất bản',
    className: 'bg-teal-50 text-[#0D9488] border border-teal-200',
  },
  pending: {
    label: 'Chờ duyệt',
    className: 'bg-amber-50 text-amber-800 border border-amber-200',
  },
  unpublished: {
    label: 'Đang ẩn',
    className: 'bg-slate-100 text-slate-600 border border-slate-200',
  },
  archived: {
    label: 'Lưu trữ',
    className: 'bg-slate-100 text-slate-600 border border-slate-200',
  },
  deleted_in_drive: {
    label: 'Đã xóa trên Drive',
    className: 'bg-rose-50 text-rose-700 border border-rose-200',
  },
  error: {
    label: 'Lỗi xử lý',
    className: 'bg-rose-50 text-rose-700 border border-rose-200',
  },
};

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return 'Chưa có';
  try {
    return new Date(iso).toLocaleString('vi-VN', {
      hour12: false,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return iso;
  }
}

function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 KB';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function GoogleBrandIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
      />
    </svg>
  );
}

interface MediaAssetRowProps {
  asset: SyncedMediaAsset;
  courses: Course[];
  isSaving: boolean;
  onSave: (
    id: string,
    patch: {
      title: string;
      altText: string;
      category: DriveCategory;
      courseId: string | null;
      displayOrder: number;
      publicationStatus: PublicationStatus;
    }
  ) => Promise<void>;
}

const MediaAssetRow: React.FC<MediaAssetRowProps> = ({
  asset,
  courses,
  isSaving,
  onSave,
}) => {
  const [title, setTitle] = useState(asset.title);
  const [altText, setAltText] = useState(asset.altText);
  const [category, setCategory] = useState<DriveCategory>(asset.category);
  const [courseId, setCourseId] = useState<string>(asset.courseId || '');
  const [displayOrder, setDisplayOrder] = useState<number>(asset.displayOrder);
  const [rowError, setRowError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(asset.title);
    setAltText(asset.altText);
    setCategory(asset.category);
    setCourseId(asset.courseId || '');
    setDisplayOrder(asset.displayOrder);
  }, [asset]);

  const badge = STATUS_BADGE[asset.publicationStatus] || STATUS_BADGE.pending;

  const submitPatch = async (nextStatus: PublicationStatus) => {
    setRowError(null);
    if (category === 'ANH_KHOA_HOC' && nextStatus === 'published' && !courseId) {
      setRowError('Vui lòng chọn đúng khóa học trước khi xuất bản ảnh thuộc nhóm Ảnh Khóa Học.');
      return;
    }
    try {
      await onSave(asset.id, {
        title: title.trim() || asset.filename,
        altText: altText.trim() || title.trim() || asset.filename,
        category,
        courseId: category === 'ANH_KHOA_HOC' ? courseId || null : null,
        displayOrder: Number(displayOrder) || 0,
        publicationStatus: nextStatus,
      });
    } catch (err) {
      setRowError(err instanceof Error ? err.message : 'Không thể lưu thay đổi.');
    }
  };

  return (
    <div className="p-4 rounded-xl bg-[#F7F9FC] border border-slate-200 flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-44 shrink-0 space-y-2">
        <MediaFrame
          src={asset.thumbnailUrl || asset.publicUrl}
          fallbackSrc={asset.publicUrl}
          alt={asset.altText}
          className="aspect-[16/10] w-full rounded-lg border border-slate-200"
        />
        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-500 tabular-nums">
          <span>
            {asset.width}×{asset.height}
          </span>
          <span>{formatFileSize(asset.fileSize)}</span>
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-mono text-slate-500 truncate" title={asset.filename}>
              {asset.filename} · MD5: {asset.checksum.slice(0, 8)}
            </p>
          </div>
          <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${badge.className}`}>
            {badge.label}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Tiêu đề hiển thị
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-[#081426]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Mô tả Alt SEO
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-[#081426]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Nhóm hiển thị
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DriveCategory)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-[#081426]"
            >
              {(Object.keys(CATEGORY_LABELS) as DriveCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>

          {category === 'ANH_KHOA_HOC' ? (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Gán cho khóa học
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-[#081426]"
              >
                <option value="">-- Chưa gán khóa học --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.id})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Đường dẫn WebP ổn định
              </label>
              <input
                type="text"
                readOnly
                value={asset.publicUrl}
                className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-mono text-slate-600"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Thứ tự hiển thị
            </label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-[#081426] tabular-nums"
            />
          </div>
        </div>

        {rowError && (
          <p className="text-xs font-semibold text-rose-600">{rowError}</p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80">
          <span className="text-[11px] text-slate-500">
            Đồng bộ lần cuối: {formatDateTime(asset.lastSyncedAt)}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => submitPatch(asset.publicationStatus)}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-[#081426] text-xs font-semibold text-[#081426] cursor-pointer disabled:opacity-50"
            >
              Lưu thông tin
            </button>

            {asset.publicationStatus !== 'published' ? (
              <button
                type="button"
                disabled={isSaving}
                onClick={() => submitPatch('published')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0D9488] hover:bg-[#0B7C72] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Phê duyệt & Xuất bản</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={isSaving}
                onClick={() => submitPatch('unpublished')}
                className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                Ẩn khỏi website
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export function DriveSyncPanel({
  adminSessionToken,
  courses,
  onMediaPublishedChange,
  onNotify,
}: DriveSyncPanelProps) {
  const [status, setStatus] = useState<DriveStatusResponse | null>(null);
  const [mediaItems, setMediaItems] = useState<SyncedMediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [googleUser, setGoogleUser] = useState<GoogleAccountInfo | null>(() =>
    getInMemoryGoogleUser()
  );
  const [hasClientToken, setHasClientToken] = useState<boolean>(() =>
    Boolean(getInMemoryGoogleToken())
  );
  const [authLoading, setAuthLoading] = useState(false);

  const [folderInput, setFolderInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyReport, setVerifyReport] = useState<FolderVerificationResult | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [savingMediaId, setSavingMediaId] = useState<string | null>(null);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);

  // Editable config draft
  const [draftRules, setDraftRules] = useState<FolderGroupRule[]>([]);
  const [draftAutoSync, setDraftAutoSync] = useState(true);
  const [draftInterval, setDraftInterval] = useState(5);
  const [draftDeletePolicy, setDraftDeletePolicy] = useState<DeletePolicy>('unpublish');
  const [draftMaxSizeMb, setDraftMaxSizeMb] = useState(15);

  // Media filters & guide accordion
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showGuide, setShowGuide] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const loadAll = useCallback(async () => {
    if (!adminSessionToken) {
      setLoading(false);
      setErrorMsg('Phiên quản trị máy chủ chưa sẵn sàng. Vui lòng đăng xuất và đăng nhập lại.');
      return;
    }
    try {
      const [statusData, mediaData] = await Promise.all([
        fetchDriveStatus(adminSessionToken),
        fetchAdminMediaAssets(adminSessionToken),
      ]);
      setStatus(statusData);
      setMediaItems(mediaData.items);
      setFolderInput((prev) => prev || statusData.config.rootFolderUrl || statusData.config.rootFolderId);
      setDraftRules(statusData.config.folderRules);
      setDraftAutoSync(statusData.config.autoSyncEnabled);
      setDraftInterval(statusData.config.syncIntervalMinutes);
      setDraftDeletePolicy(statusData.config.deletePolicy);
      setDraftMaxSizeMb(statusData.config.maxFileSizeMb);
      setErrorMsg(null);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Không thể tải trạng thái Google Drive từ máy chủ.'
      );
    } finally {
      setLoading(false);
    }
  }, [adminSessionToken]);

  useEffect(() => {
    loadAll();
    const unsub = initGoogleAuthListener((user) => {
      setGoogleUser(user);
      setHasClientToken(Boolean(getInMemoryGoogleToken()));
    });
    return unsub;
  }, [loadAll]);

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setErrorMsg(null);
    try {
      const { accessToken, user } = await signInWithGoogleDrive();
      setGoogleUser(user);
      setHasClientToken(true);
      await attachDriveOAuthSession(adminSessionToken, accessToken, {
        email: user.email,
        displayName: user.displayName,
      });
      await loadAll();
      onNotify(`Đã xác thực tài khoản Google: ${user.email}`);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Đăng nhập Google không thành công hoặc bị hủy bởi người dùng.'
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOpenPicker = async () => {
    const token = getInMemoryGoogleToken();
    if (!token) {
      setErrorMsg('Vui lòng đăng nhập Google trước khi mở Google Picker chọn thư mục.');
      return;
    }
    setErrorMsg(null);
    try {
      const picked = await openDriveFolderPicker(token);
      if (!picked) return;
      setFolderInput(picked.url);
      await handleVerifyAndSaveFolder(picked.id);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Không thể mở Google Picker. Bạn có thể dán trực tiếp URL thư mục Google Drive vào ô bên cạnh.'
      );
    }
  };

  const handleVerifyAndSaveFolder = async (overrideInput?: string) => {
    const token = getInMemoryGoogleToken();
    if (!token) {
      setErrorMsg('Vui lòng bấm "Đăng nhập với Google" để cấp quyền đọc thư mục trước khi kiểm tra.');
      return;
    }
    const targetInput = (overrideInput ?? folderInput).trim();
    if (!targetInput) {
      setErrorMsg('Vui lòng nhập URL hoặc ID thư mục Google Drive.');
      return;
    }

    setVerifying(true);
    setErrorMsg(null);
    setVerifyReport(null);
    try {
      const report = await verifyDriveFolder(adminSessionToken, token, targetInput, true);
      setVerifyReport(report);
      if (report.ok) {
        setFolderInput(`https://drive.google.com/drive/folders/${report.folderId}`);
        await loadAll();
        onNotify(`Đã xác minh quyền đọc thư mục "${report.folderName}".`);
      } else {
        setErrorMsg(report.error || 'Không thể xác minh quyền đọc thư mục.');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Kiểm tra quyền thư mục thất bại.');
    } finally {
      setVerifying(false);
    }
  };

  const handleManualSync = async () => {
    setSyncing(true);
    setErrorMsg(null);
    try {
      const token = getInMemoryGoogleToken();
      const result = await triggerManualDriveSync(adminSessionToken, token);
      await loadAll();
      await onMediaPublishedChange();
      if (result.log.status === 'error') {
        setErrorMsg(result.log.errorMessage || 'Đồng bộ gặp lỗi. Xem chi tiết nhật ký bên dưới.');
      } else {
        onNotify(
          `Đồng bộ hoàn tất: phát hiện ${result.log.discoveredCount} tệp, đồng bộ mới/cập nhật ${result.log.syncedCount}, bỏ qua ${result.log.skippedCount}, lỗi ${result.log.errorCount}.`
        );
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể chạy đồng bộ thủ công.');
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveConfig = async () => {
    setSavingConfig(true);
    setErrorMsg(null);
    try {
      await updateDriveConfigApi(adminSessionToken, {
        folderRules: draftRules,
        autoSyncEnabled: draftAutoSync,
        syncIntervalMinutes: draftInterval,
        deletePolicy: draftDeletePolicy,
        maxFileSizeMb: draftMaxSizeMb,
      });
      await loadAll();
      onNotify('Đã lưu cấu trúc thư mục và quy tắc đồng bộ Google Drive.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể lưu cấu hình Drive.');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleDisconnect = async () => {
    setErrorMsg(null);
    try {
      await signOutGoogleDrive();
      await disconnectDriveApi(adminSessionToken);
      setGoogleUser(null);
      setHasClientToken(false);
      setFolderInput('');
      setVerifyReport(null);
      setConfirmDisconnect(false);
      await loadAll();
      onNotify('Đã ngắt kết nối Google Drive và xóa phiên OAuth tạm thời.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể ngắt kết nối.');
    }
  };

  const handleSaveMediaAsset = async (
    id: string,
    patch: {
      title: string;
      altText: string;
      category: DriveCategory;
      courseId: string | null;
      displayOrder: number;
      publicationStatus: PublicationStatus;
    }
  ) => {
    setSavingMediaId(id);
    try {
      await updateMediaAssetApi(adminSessionToken, id, patch);
      await loadAll();
      await onMediaPublishedChange();
      onNotify('Đã cập nhật trạng thái hình ảnh và làm mới giao diện website.');
    } finally {
      setSavingMediaId(null);
    }
  };

  const filteredMedia = mediaItems.filter((item) => {
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && item.publicationStatus !== statusFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-sm text-slate-600 flex items-center gap-3">
        <RefreshCw className="w-4 h-4 animate-spin text-[#0D9488]" />
        <span>Đang kiểm tra trạng thái tích hợp Google Drive...</span>
      </div>
    );
  }

  // Honest connection status derived strictly from real API verification + live OAuth session
  const connectionStateLabel = status?.isOperational
    ? 'Hoạt động (Đã xác minh quyền đọc)'
    : status?.config.connectionStatus === 'connected_verified' && !status.hasLiveOAuth
      ? 'Đã cấu hình thư mục — Cần đăng nhập Google lại để đồng bộ'
      : status?.config.connectionStatus === 'error'
        ? 'Lỗi kết nối / Thiếu quyền truy cập'
        : 'Chưa kết nối Google Drive';

  const connectionToneClass = status?.isOperational
    ? 'bg-teal-50 border-teal-200 text-[#0D9488]'
    : status?.config.connectionStatus === 'error'
      ? 'bg-rose-50 border-rose-200 text-rose-700'
      : 'bg-amber-50 border-amber-200 text-amber-800';

  return (
    <div className="space-y-8">
      {/* =================================================================
          1. MÀN HÌNH KIỂM TRA TRẠNG THÁI (VERIFICATION SCREEN)
      ================================================================= */}
      <section className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <p className="text-xs font-semibold text-[#0D9488] mb-1">
              Trạng thái đồng bộ thực tế · Google Drive API v3
            </p>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#081426]">
              Kết nối Google Drive & Tự động đồng bộ hình ảnh
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleManualSync}
              disabled={syncing || !status?.config.rootFolderId}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5BF35] hover:bg-[#E2AB22] text-[#081426] text-xs font-extrabold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'ĐANG ĐỒNG BỘ...' : 'ĐỒNG BỘ NGAY'}</span>
            </button>
          </div>
        </div>

        {/* Connection Banner */}
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${connectionToneClass}`}>
          <div className="flex items-start gap-3">
            {status?.isOperational ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            ) : status?.config.connectionStatus === 'error' ? (
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <CloudOff className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-sm font-bold">{connectionStateLabel}</p>
              <p className="text-xs opacity-90 mt-0.5">
                {status?.config.rootFolderId ? (
                  <>
                    Thư mục đang liên kết: <strong>{status.config.rootFolderName || status.config.rootFolderId}</strong>
                    {status.config.connectedEmail ? ` · Tài khoản: ${status.config.connectedEmail}` : ''}
                  </>
                ) : (
                  'Đăng nhập Google bằng OAuth chính thức và chọn thư mục EDUNEXA_WEBSITE để bắt đầu đồng bộ.'
                )}
              </p>
            </div>
          </div>

          {status?.config.rootFolderUrl && (
            <a
              href={status.config.rootFolderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold underline shrink-0"
            >
              <span>Mở trên Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* 5 Real Verification Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="p-4 rounded-xl bg-[#F7F9FC] border border-slate-200">
            <p className="text-[11px] font-semibold text-slate-500">Ảnh phát hiện (lần gần nhất)</p>
            <p className="text-2xl font-extrabold text-[#081426] mt-1 tabular-nums">
              {status?.lastLog?.discoveredCount ?? 0}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#F7F9FC] border border-slate-200">
            <p className="text-[11px] font-semibold text-slate-500">Đã lưu / Đang xuất bản</p>
            <p className="text-2xl font-extrabold text-[#0D9488] mt-1 tabular-nums">
              {status?.counts.totalStored ?? 0}{' '}
              <span className="text-xs font-semibold text-slate-500">
                ({status?.counts.published ?? 0} hiện)
              </span>
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#F7F9FC] border border-slate-200">
            <p className="text-[11px] font-semibold text-slate-500">Đang chờ duyệt</p>
            <p className="text-2xl font-extrabold text-amber-700 mt-1 tabular-nums">
              {status?.counts.pending ?? 0}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#F7F9FC] border border-slate-200">
            <p className="text-[11px] font-semibold text-slate-500">Số ảnh lỗi (lần gần nhất)</p>
            <p className="text-2xl font-extrabold text-rose-600 mt-1 tabular-nums">
              {status?.lastLog?.errorCount ?? 0}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#F7F9FC] border border-slate-200 col-span-2 lg:col-span-1">
            <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Đồng bộ gần nhất</span>
            </p>
            <p className="text-xs font-bold text-[#081426] mt-2 leading-snug tabular-nums">
              {formatDateTime(status?.lastLog?.finishedAt)}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Lịch tự động:{' '}
              {status?.config.autoSyncEnabled
                ? `Mỗi ${status.config.syncIntervalMinutes} phút`
                : 'Đang tắt'}
            </p>
          </div>
        </div>

        {(errorMsg || status?.config.lastError) && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMsg || status?.config.lastError}</span>
          </div>
        )}
      </section>

      {/* =================================================================
          2. KẾT NỐI OAUTH & CHỌN THƯ MỤC GOOGLE DRIVE
      ================================================================= */}
      <section className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 space-y-6">
        <div className="pb-4 border-b border-slate-100">
          <h3 className="text-base sm:text-lg font-extrabold text-[#081426]">
            Bước 1 & 2 · Xác thực Google OAuth & Liên kết thư mục gốc
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access token chỉ lưu tạm trong bộ nhớ phiên để backend truy cập Google Drive API an toàn, không lưu trong localStorage và không yêu cầu công khai toàn bộ Drive.
          </p>
        </div>

        {/* Step 1: Official Google OAuth Sign-In */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#F7F9FC] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#081426] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
              <span>Bước 1 · Đăng nhập Google bằng OAuth chính thức</span>
            </p>
            <p className="text-xs text-slate-600">
              {hasClientToken && googleUser ? (
                <>
                  Đã đăng nhập: <strong className="text-[#081426]">{googleUser.displayName}</strong> ({googleUser.email}) — Phiên OAuth đang hoạt động.
                </>
              ) : (
                'Cấp quyền đọc chỉ các thư mục bạn chọn (drive.readonly, drive.file, drive.metadata.readonly).'
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={authLoading}
            className="inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 shadow-xs text-sm font-semibold text-[#1f1f1f] cursor-pointer shrink-0 disabled:opacity-60"
          >
            <GoogleBrandIcon />
            <span>
              {authLoading
                ? 'Đang xác thực...'
                : hasClientToken
                  ? 'Đổi tài khoản / Gia hạn OAuth'
                  : 'Đăng nhập với Google'}
            </span>
          </button>
        </div>

        {/* Step 2: Google Picker OR Folder URL Input + Permission Check */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#F7F9FC] border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-[#081426]">
                Bước 2 · Chọn thư mục EDUNEXA_WEBSITE
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Chọn trực tiếp bằng Google Picker hoặc dán URL / ID thư mục Drive rồi kiểm tra quyền đọc.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenPicker}
              disabled={!hasClientToken}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#081426] hover:bg-[#102644] text-white text-xs font-bold cursor-pointer shrink-0 disabled:opacity-45 disabled:cursor-not-allowed"
            >
              <FolderOpen className="w-4 h-4 text-[#F5BF35]" />
              <span>Chọn qua Google Picker</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={folderInput}
              onChange={(e) => setFolderInput(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/... hoặc ID thư mục"
              className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-[#081426] focus:outline-none focus:border-[#081426]"
            />
            <button
              type="button"
              onClick={() => handleVerifyAndSaveFolder()}
              disabled={verifying || !hasClientToken}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0B7C72] text-white text-xs font-bold cursor-pointer shrink-0 disabled:opacity-45 disabled:cursor-not-allowed"
            >
              <FolderSearch className="w-4 h-4" />
              <span>{verifying ? 'Đang kiểm tra...' : 'Kiểm tra quyền & Lưu'}</span>
            </button>
          </div>

          {/* Live Verification Output */}
          {verifyReport && verifyReport.ok && (
            <div className="p-4 rounded-xl bg-white border border-teal-200 space-y-2.5 text-xs">
              <p className="font-bold text-[#0D9488] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  Đã xác minh quyền đọc thư mục "{verifyReport.folderName}" ({verifyReport.detectedSubfolders.length} thư mục con).
                </span>
              </p>
              {verifyReport.detectedSubfolders.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {verifyReport.detectedSubfolders.map((sf) => (
                    <span
                      key={sf.id}
                      className={`px-2 py-1 rounded-md font-medium ${
                        sf.matchedCategory
                          ? 'bg-teal-50 text-[#0D9488] border border-teal-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {sf.name}
                      {sf.matchedLabel ? ` → ${sf.matchedLabel}` : ' (chưa khớp cấu hình)'}
                    </span>
                  ))}
                </div>
              )}
              {verifyReport.missingConfiguredFolders.length > 0 && (
                <p className="text-amber-700">
                  Thư mục chưa có trên Drive (bạn có thể tạo thêm khi cần):{' '}
                  <strong>{verifyReport.missingConfiguredFolders.join(', ')}</strong>
                </p>
              )}
            </div>
          )}

          {/* Disconnect Option */}
          {status?.config.rootFolderId && (
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Xác minh gần nhất: {formatDateTime(status.config.lastVerifiedAt)}
              </span>
              {!confirmDisconnect ? (
                <button
                  type="button"
                  onClick={() => setConfirmDisconnect(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  <span>Ngắt kết nối Google Drive</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-rose-700 font-semibold">Xác nhận ngắt?</span>
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Ngắt kết nối
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDisconnect(false)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 cursor-pointer"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* =================================================================
          3. CẤU TRÚC THƯ MỤC & QUY TẮC TỰ XUẤT BẢN
      ================================================================= */}
      <section className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#081426] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#0D9488]" />
              <span>Cấu trúc thư mục & Quy tắc hiển thị từng nhóm</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tùy chỉnh tên thư mục con trong EDUNEXA_WEBSITE, bật/tắt tự động xuất bản riêng từng nhóm và chính sách khi ảnh bị xóa trên Drive.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSaveConfig}
            disabled={savingConfig}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#081426] hover:bg-[#102644] text-white text-xs font-bold cursor-pointer shrink-0 w-fit disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#F5BF35]" />
            <span>{savingConfig ? 'Đang lưu...' : 'Lưu quy tắc đồng bộ'}</span>
          </button>
        </div>

        {/* Editable 7-Folder Mapping Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500">
                <th className="py-2.5 pr-3 font-semibold">Vị trí website</th>
                <th className="py-2.5 px-3 font-semibold">Tên thư mục trên Drive</th>
                <th className="py-2.5 px-3 font-semibold text-center">Quét đồng bộ</th>
                <th className="py-2.5 pl-3 font-semibold text-center">Tự xuất bản</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {draftRules.map((rule, idx) => {
                const isForcePending = rule.category === 'CHO_DUYET';
                return (
                  <tr key={rule.category}>
                    <td className="py-3 pr-3 font-semibold text-[#081426] whitespace-nowrap">
                      {rule.label}
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        value={rule.folderName}
                        onChange={(e) => {
                          const nextVal = e.target.value;
                          setDraftRules((prev) =>
                            prev.map((item, i) =>
                              i === idx ? { ...item, folderName: nextVal } : item
                            )
                          );
                        }}
                        className="w-full min-w-[200px] px-3 py-1.5 bg-[#F7F9FC] border border-slate-200 rounded-lg text-xs font-mono text-[#081426]"
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          setDraftRules((prev) =>
                            prev.map((item, i) =>
                              i === idx ? { ...item, enabled: !item.enabled } : item
                            )
                          )
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                          rule.enabled
                            ? 'bg-[#081426] text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {rule.enabled ? 'Đang bật' : 'Tắt'}
                      </button>
                    </td>
                    <td className="py-3 pl-3 text-center">
                      {isForcePending ? (
                        <span className="text-xs text-amber-700 font-semibold">
                          Luôn chờ duyệt
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setDraftRules((prev) =>
                              prev.map((item, i) =>
                                i === idx ? { ...item, autoPublish: !item.autoPublish } : item
                              )
                            )
                          }
                          className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                            rule.autoPublish
                              ? 'bg-[#0D9488] text-white'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {rule.autoPublish ? 'Tự xuất bản' : 'Chờ duyệt'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Sync Schedule, Delete Policy, Max File Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-[#F7F9FC] border border-slate-200 flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-[#081426]">Đồng bộ tự động</p>
              <p className="text-[11px] text-slate-500">Chạy nền định kỳ</p>
            </div>
            <button
              type="button"
              onClick={() => setDraftAutoSync((v) => !v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                draftAutoSync ? 'bg-[#081426] text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {draftAutoSync ? 'Bật' : 'Tắt'}
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Chu kỳ đồng bộ (phút)
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={draftInterval}
              onChange={(e) => setDraftInterval(Number(e.target.value) || 5)}
              className="w-full px-3 py-2 bg-[#F7F9FC] border border-slate-200 rounded-xl text-sm text-[#081426] tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Khi ảnh bị xóa trên Drive
            </label>
            <select
              value={draftDeletePolicy}
              onChange={(e) => setDraftDeletePolicy(e.target.value as DeletePolicy)}
              className="w-full px-3 py-2 bg-[#F7F9FC] border border-slate-200 rounded-xl text-sm text-[#081426]"
            >
              <option value="unpublish">Ngừng xuất bản (giữ dự phòng Hero)</option>
              <option value="archive">Chuyển vào lưu trữ (archived)</option>
              <option value="keep">Giữ nguyên hiển thị trên web</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Giới hạn dung lượng ảnh (MB)
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={draftMaxSizeMb}
              onChange={(e) => setDraftMaxSizeMb(Number(e.target.value) || 15)}
              className="w-full px-3 py-2 bg-[#F7F9FC] border border-slate-200 rounded-xl text-sm text-[#081426] tabular-nums"
            />
          </div>
        </div>
      </section>

      {/* =================================================================
          4. KHO ẢNH ĐÃ ĐỒNG BỘ & PHÊ DUYỆT XUẤT BẢN
      ================================================================= */}
      <section className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#081426]">
              Thư viện ảnh đồng bộ từ Drive ({filteredMedia.length}/{mediaItems.length})
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tất cả ảnh hợp lệ được tối ưu sang WebP kèm thumbnail và phục vụ ổn định từ bộ lưu trữ riêng (/storage), không dùng link xem trực tiếp Google Drive.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-[#F7F9FC] border border-slate-200 rounded-xl text-xs font-semibold text-[#081426]"
            >
              <option value="ALL">Tất cả thư mục</option>
              {(Object.keys(CATEGORY_LABELS) as DriveCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#F7F9FC] border border-slate-200 rounded-xl text-xs font-semibold text-[#081426]"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="published">Đã xuất bản</option>
              <option value="unpublished">Đang ẩn</option>
              <option value="deleted_in_drive">Đã xóa trên Drive</option>
            </select>
          </div>
        </div>

        {filteredMedia.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#F7F9FC] border border-dashed border-slate-300 text-center space-y-2">
            <p className="text-sm font-bold text-[#081426]">
              Chưa có hình ảnh nào phù hợp bộ lọc hiện tại
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Sau khi kết nối thư mục EDUNEXA_WEBSITE trên Google Drive và tải ảnh định dạng JPG, PNG hoặc WEBP vào các thư mục con, nhấn "ĐỒNG BỘ NGAY" để ảnh xuất hiện tại đây.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMedia.map((asset) => (
              <MediaAssetRow
                key={asset.id}
                asset={asset}
                courses={courses}
                isSaving={savingMediaId === asset.id}
                onSave={handleSaveMediaAsset}
              />
            ))}
          </div>
        )}
      </section>

      {/* =================================================================
          5. NHẬT KÝ ĐỒNG BỘ & HƯỚNG DẪN ĐẶT TÊN THƯ MỤC
      ================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sync Logs */}
        <section className="bg-white p-5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setShowLogs((v) => !v)}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <div>
              <h3 className="text-sm font-extrabold text-[#081426]">
                Nhật ký đồng bộ gần đây ({status?.logs.length ?? 0})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ghi nhận lỗi mạng, file sai định dạng và các lần đồng bộ tự động/thủ công.
              </p>
            </div>
            {showLogs ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {showLogs && (
            <div className="mt-4 space-y-3 max-h-80 overflow-y-auto pr-1">
              {status?.logs && status.logs.length > 0 ? (
                status.logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-[#F7F9FC] border border-slate-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[#081426]">
                        {log.triggerType === 'manual' ? 'Thủ công' : 'Tự động 5 phút'} ·{' '}
                        {formatDateTime(log.finishedAt)}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          log.status === 'success'
                            ? 'bg-teal-50 text-[#0D9488]'
                            : log.status === 'partial'
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                    <p className="text-slate-600 tabular-nums">
                      Phát hiện: {log.discoveredCount} · Đồng bộ: {log.syncedCount} · Bỏ qua: {log.skippedCount} · Xóa: {log.deletedCount} · Lỗi: {log.errorCount}
                    </p>
                    {log.details.length > 0 && (
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600">
                        {log.details.slice(0, 6).map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">Chưa có lịch sử đồng bộ.</p>
              )}
            </div>
          )}
        </section>

        {/* Course Slug & Folder Naming Guide */}
        <section className="bg-white p-5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setShowGuide((v) => !v)}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <div>
              <h3 className="text-sm font-extrabold text-[#081426]">
                Quy ước đặt tên file ảnh khóa học & thư mục Drive
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Giúp ảnh trong 02_ANH_KHOA_HOC tự khớp đúng khóa học, không gán nhầm.
              </p>
            </div>
            {showGuide ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {showGuide && (
            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <p>
                Đặt tên file ảnh trong thư mục <code className="px-1 py-0.5 bg-slate-100 rounded font-mono text-[#081426]">02_ANH_KHOA_HOC</code> chứa chính xác mã (slug) khóa học bên dưới. Ảnh không khớp mã sẽ tự chuyển về <strong>Chờ duyệt</strong> để bạn chọn khóa thủ công:
              </p>
              <ul className="space-y-1.5 font-mono text-[11px] bg-[#F7F9FC] p-3 rounded-xl border border-slate-200">
                {courses.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#081426]">{c.id}.jpg</span>
                    <span className="font-sans text-slate-500 truncate">{c.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
