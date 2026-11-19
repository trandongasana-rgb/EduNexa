import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  Cloud,
  ExternalLink,
  Eye,
  FileText,
  HardDrive,
  Image as ImageIcon,
  KeyRound,
  LayoutDashboard,
  LayoutTemplate,
  Lock,
  LogOut,
  Menu,
  MessageSquare,
  RefreshCw,
  RotateCcw,
  Save,
  Send,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import type {
  AdminOverviewResponse,
  CmsSnapshot,
  CmsStateResponse,
} from '../types';
import { EDUNEXA_LOGO } from '../data/initialData';
import {
  changeAdminPasswordServer,
  fetchAdminOverview,
  fetchCmsState,
  loginAdminServer,
  logoutAdminServer,
  publishCmsDraftApi,
  resetCmsDefaultsApi,
  saveCmsDraftApi,
} from '../services/driveApi';
import { DriveSyncPanel } from './DriveSyncPanel';
import { CoursesManagerSection } from './admin/CoursesManagerSection';
import { MediaLibrarySection } from './admin/MediaLibrarySection';
import { BannersManagerSection } from './admin/BannersManagerSection';
import { LandingContentSection } from './admin/LandingContentSection';
import { InquiriesSection } from './admin/InquiriesSection';
import { SystemLogsSection } from './admin/SystemLogsSection';

export type AdminTabKey =
  | 'overview'
  | 'courses'
  | 'media'
  | 'drive'
  | 'banners'
  | 'landing'
  | 'inquiries'
  | 'settings'
  | 'logs';

interface AdminViewProps {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  adminSessionToken: string;
  setAdminSessionToken: (token: string) => void;
  onRefreshPublicSite: () => Promise<void>;
  onOpenPreview: (draft: CmsSnapshot) => void;
  navigateTo: (page: string) => void;
  initialTab?: AdminTabKey;
}

const SIDEBAR_ITEMS: Array<{
  key: AdminTabKey;
  code: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { key: 'overview', code: '01', label: 'Tổng quan', icon: LayoutDashboard },
  { key: 'courses', code: '02', label: 'Quản lý khóa học', icon: BookOpen },
  { key: 'media', code: '03', label: 'Thư viện hình ảnh', icon: ImageIcon },
  { key: 'drive', code: '04', label: 'Google Drive', icon: HardDrive },
  { key: 'banners', code: '05', label: 'Quản lý banner', icon: LayoutTemplate },
  { key: 'landing', code: '06', label: 'Nội dung Landing Page', icon: SlidersHorizontal },
  { key: 'inquiries', code: '07', label: 'Đăng ký và liên hệ', icon: MessageSquare },
  { key: 'settings', code: '08', label: 'Cài đặt website', icon: Settings },
  { key: 'logs', code: '09', label: 'Nhật ký hệ thống', icon: FileText },
];

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
    });
  } catch {
    return iso;
  }
}

export function AdminView({
  isAdmin,
  setIsAdmin,
  adminSessionToken,
  setAdminSessionToken,
  onRefreshPublicSite,
  onOpenPreview,
  navigateTo,
  initialTab = 'overview',
}: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<AdminTabKey>(initialTab);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // CMS state from SQLite backend
  const [cmsState, setCmsState] = useState<CmsStateResponse | null>(null);
  const [draft, setDraft] = useState<CmsSnapshot | null>(null);
  const [localDirty, setLocalDirty] = useState(false);
  const [isLoadingCms, setIsLoadingCms] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [loadError, setLoadError] = useState('');

  // Overview stats
  const [overview, setOverview] = useState<AdminOverviewResponse | null>(null);
  const [isLoadingOverview, setIsLoadingOverview] = useState(false);

  // Settings tab state
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdFeedback, setPwdFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ text: string; kind: 'ok' | 'err' } | null>(null);

  const notify = useCallback((text: string, kind: 'ok' | 'err' = 'ok') => {
    setToast({ text, kind });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const loadAllAdminData = useCallback(async () => {
    if (!isAdmin) return;
    setIsLoadingCms(true);
    setIsLoadingOverview(true);
    setLoadError('');
    try {
      const [stateRes, overviewRes] = await Promise.all([
        fetchCmsState(adminSessionToken),
        fetchAdminOverview(adminSessionToken),
      ]);
      setCmsState(stateRes);
      setDraft(stateRes.draft);
      setLocalDirty(false);
      setOverview(overviewRes);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể tải dữ liệu quản trị.';
      setLoadError(msg);
      if (msg.includes('401') || msg.includes('hết hạn') || msg.includes('quyền')) {
        setIsAdmin(false);
        setAdminSessionToken('');
      }
    } finally {
      setIsLoadingCms(false);
      setIsLoadingOverview(false);
    }
  }, [isAdmin, adminSessionToken, setIsAdmin, setAdminSessionToken]);

  const refreshOverviewOnly = useCallback(async () => {
    if (!isAdmin) return;
    setIsLoadingOverview(true);
    try {
      const overviewRes = await fetchAdminOverview(adminSessionToken);
      setOverview(overviewRes);
    } catch {
      // ignore transient error
    } finally {
      setIsLoadingOverview(false);
    }
  }, [isAdmin, adminSessionToken]);

  useEffect(() => {
    if (isAdmin) {
      loadAllAdminData();
    }
  }, [isAdmin, loadAllAdminData]);

  useEffect(() => {
    if (isAdmin && activeTab === 'overview') {
      refreshOverviewOnly();
    }
  }, [isAdmin, activeTab, refreshOverviewOnly]);

  const updateDraft = useCallback((updater: (prev: CmsSnapshot) => CmsSnapshot) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return updater(prev);
    });
    setLocalDirty(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const res = await loginAdminServer(passwordInput);
      setAdminSessionToken(res.sessionToken);
      setIsAdmin(true);
      setPasswordInput('');
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Mật khẩu quản trị không chính xác.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdminServer();
    setAdminSessionToken('');
    setIsAdmin(false);
    setCmsState(null);
    setDraft(null);
    setOverview(null);
    setLocalDirty(false);
  };

  const handleSaveDraft = async (): Promise<CmsSnapshot | null> => {
    if (!draft) return null;
    setIsSavingDraft(true);
    try {
      const res = await saveCmsDraftApi(adminSessionToken, draft);
      setCmsState(res.state);
      setDraft(res.state.draft);
      setLocalDirty(false);
      notify('Đã lưu bản Nháp lên máy chủ. Website công khai chưa thay đổi cho tới khi bấm XUẤT BẢN.');
      refreshOverviewOnly();
      return res.state.draft;
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Không thể lưu bản Nháp.', 'err');
      return null;
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handlePreview = async () => {
    if (!draft) return;
    if (localDirty) {
      const saved = await handleSaveDraft();
      if (!saved) return;
      onOpenPreview(saved);
      return;
    }
    onOpenPreview(draft);
  };

  const handlePublish = async () => {
    if (!draft) return;
    setIsPublishing(true);
    try {
      const res = await publishCmsDraftApi(adminSessionToken, draft);
      setCmsState(res.state);
      setDraft(res.state.draft);
      setLocalDirty(false);
      await onRefreshPublicSite();
      await refreshOverviewOnly();
      notify('Đã xuất bản nội dung mới lên website công khai EDUNEXA.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Không thể xuất bản nội dung.', 'err');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRefreshAfterMediaChange = useCallback(async () => {
    await onRefreshPublicSite();
    if (!isAdmin) return;
    try {
      const [stateRes, overviewRes] = await Promise.all([
        fetchCmsState(adminSessionToken),
        fetchAdminOverview(adminSessionToken),
      ]);
      setCmsState(stateRes);
      if (!localDirty) {
        setDraft(stateRes.draft);
      }
      setOverview(overviewRes);
    } catch {
      // ignore
    }
  }, [isAdmin, adminSessionToken, localDirty, onRefreshPublicSite]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdFeedback(null);
    if (newPwd.length < 6) {
      setPwdFeedback({ type: 'err', text: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdFeedback({ type: 'err', text: 'Mật khẩu xác nhận không trùng khớp.' });
      return;
    }
    setIsChangingPwd(true);
    try {
      await changeAdminPasswordServer(adminSessionToken, currentPwd, newPwd);
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
      setPwdFeedback({
        type: 'ok',
        text: 'Đã cập nhật mật khẩu quản trị trên máy chủ thành công.',
      });
      notify('Đã đổi mật khẩu quản trị thành công.');
    } catch (err) {
      setPwdFeedback({
        type: 'err',
        text: err instanceof Error ? err.message : 'Đổi mật khẩu thất bại.',
      });
    } finally {
      setIsChangingPwd(false);
    }
  };

  const handleResetDefaults = async () => {
    setIsResetting(true);
    try {
      const res = await resetCmsDefaultsApi(adminSessionToken);
      setCmsState(res.state);
      setDraft(res.state.draft);
      setLocalDirty(false);
      setConfirmResetOpen(false);
      await onRefreshPublicSite();
      await refreshOverviewOnly();
      notify('Đã khôi phục toàn bộ nội dung mặc định và cập nhật website công khai.');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Không thể khôi phục mặc định.', 'err');
    } finally {
      setIsResetting(false);
    }
  };

  // =========================================================================
  // 1. DEDICATED ADMIN LOGIN SCREEN (/quan-tri)
  // =========================================================================
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#081426] flex flex-col justify-center items-center px-5 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-5 border-b border-slate-100">
            <img
              src={EDUNEXA_LOGO}
              alt="EDUNEXA AI"
              className="h-11 w-auto object-contain"
            />
            <span className="text-xs font-bold text-[#0D9488] tracking-wide uppercase">
              /quan-tri
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#081426] text-[#F5BF35] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-[#081426] leading-tight">
                Đăng nhập Quản trị EDUNEXA
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Khu vực quản trị nội dung, khóa học, hình ảnh và Google Drive
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 mt-6">
            <div>
              <label
                htmlFor="admin-password-input"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Mật khẩu quản trị
              </label>
              <input
                id="admin-password-input"
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setLoginError('');
                }}
                placeholder="Nhập mật khẩu quản trị viên"
                autoFocus
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-[#081426] focus:outline-none focus:border-[#081426]"
              />
              {loginError && (
                <p className="text-xs text-rose-600 font-semibold mt-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{loginError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-[#081426] hover:bg-[#102644] disabled:opacity-60 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              {isLoggingIn ? 'Đang xác thực tài khoản...' : 'Đăng nhập hệ thống quản trị'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#081426] font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại website công khai</span>
            </button>
            <span className="inline-flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0D9488]" />
              <span>Xác thực máy chủ</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  const currentTabMeta =
    SIDEBAR_ITEMS.find((item) => item.key === activeTab) || SIDEBAR_ITEMS[0];
  const hasUnpublished = localDirty || Boolean(cmsState?.hasUnpublishedChanges);

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#081426] flex">
      {/* =================================================================
          MOBILE SIDEBAR BACKDROP
      ================================================================= */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#081426]/60 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* =================================================================
          LEFT SIDEBAR (260px Navy #081426 — Exact 9 Required Sections)
      ================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[264px] bg-[#081426] text-white flex flex-col border-r border-white/10 transition-transform duration-200 lg:translate-x-0 lg:static lg:shrink-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('overview');
              setMobileSidebarOpen(false);
            }}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <img
              src={EDUNEXA_LOGO}
              alt="EDUNEXA"
              className="h-9 w-auto object-contain"
            />
            <div className="text-left leading-tight">
              <span className="block text-xs font-extrabold tracking-wide text-white">
                EDUNEXA CMS
              </span>
              <span className="block text-[11px] text-slate-400">
                Quản trị nội dung
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white cursor-pointer"
            aria-label="Đóng thanh điều hướng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Exact 9 Sidebar Menu Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Menu quản trị">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            const badgeCount =
              item.key === 'inquiries' && overview && overview.inquiries.newCount > 0
                ? overview.inquiries.newCount
                : item.key === 'media' && overview && overview.media.pending > 0
                ? overview.media.pending
                : 0;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setActiveTab(item.key);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#102644] text-white font-bold ring-1 ring-[#F5BF35]/50'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white font-medium'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#F5BF35]' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">
                    <span className="text-[11px] font-bold text-slate-400 tabular-nums mr-1.5">
                      {item.code}.
                    </span>
                    {item.label}
                  </span>
                </span>
                {badgeCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md bg-[#F5BF35] text-[#081426] text-[11px] font-extrabold tabular-nums shrink-0">
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Utility Links */}
        <div className="p-3 border-t border-white/10 space-y-1.5 shrink-0">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-[#16B8A6]" />
              <span>Xem website công khai</span>
            </span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất quản trị</span>
          </button>
        </div>
      </aside>

      {/* =================================================================
          MAIN CONTENT SHELL
      ================================================================= */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Sticky Top Workflow Bar: LƯU NHÁP · XEM TRƯỚC · XUẤT BẢN */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg border border-slate-200 text-[#081426] cursor-pointer"
                aria-label="Mở menu quản trị"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-extrabold text-[#081426] truncate">
                  {currentTabMeta.code}. {currentTabMeta.label}
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                  {hasUnpublished ? (
                    <span className="font-semibold text-amber-700">
                      {localDirty
                        ? 'Có chỉnh sửa chưa lưu nháp'
                        : 'Có bản nháp chưa xuất bản lên website'}
                    </span>
                  ) : (
                    <span className="font-semibold text-[#0D9488]">
                      Đã đồng bộ với bản đang xuất bản
                    </span>
                  )}
                  {cmsState?.publishedUpdatedAt && (
                    <span className="text-slate-400 tabular-nums hidden sm:inline">
                      · Xuất bản gần nhất: {formatDateTime(cmsState.publishedUpdatedAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Required Global Workflow Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                disabled={!draft || isSavingDraft || isPublishing}
                onClick={handleSaveDraft}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl border border-slate-300 bg-white hover:bg-[#F7F9FC] hover:border-[#081426] disabled:opacity-50 text-[#081426] text-xs font-bold whitespace-nowrap cursor-pointer transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingDraft ? 'Đang lưu...' : 'LƯU NHÁP'}</span>
              </button>

              <button
                type="button"
                disabled={!draft || isSavingDraft || isPublishing}
                onClick={handlePreview}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl border border-[#081426] bg-[#102644] hover:bg-[#081426] disabled:opacity-50 text-white text-xs font-bold whitespace-nowrap cursor-pointer transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-[#F5BF35]" />
                <span>XEM TRƯỚC</span>
              </button>

              <button
                type="button"
                disabled={!draft || isSavingDraft || isPublishing}
                onClick={handlePublish}
                className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-xl bg-[#F5BF35] hover:bg-[#E2AB22] disabled:opacity-50 text-[#081426] text-xs font-extrabold whitespace-nowrap cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isPublishing ? 'Đang xuất bản...' : 'XUẤT BẢN'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Inline Notification Banner */}
        {toast && (
          <div className="px-4 sm:px-6 lg:px-8 pt-4">
            <div
              className={`max-w-7xl mx-auto px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 ${
                toast.kind === 'err'
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-[#F0FDFA] border-[#99F6E4] text-[#0F766E]'
              }`}
            >
              <span className="flex items-center gap-2">
                {toast.kind === 'err' ? (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                )}
                <span>{toast.text}</span>
              </span>
              <button
                type="button"
                onClick={() => setToast(null)}
                className="p-1 opacity-70 hover:opacity-100 cursor-pointer"
                aria-label="Đóng thông báo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Workspace Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            {loadError ? (
              <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center">
                <p className="text-sm font-bold text-rose-700 mb-3">{loadError}</p>
                <button
                  type="button"
                  onClick={loadAllAdminData}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#081426] text-white text-xs font-bold cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Tải lại dữ liệu</span>
                </button>
              </div>
            ) : isLoadingCms || !draft ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-sm text-slate-500">
                Đang tải dữ liệu hệ thống quản trị từ máy chủ...
              </div>
            ) : (
              <>
                {/* =========================================================
                    01. TỔNG QUAN
                ========================================================= */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Top Action Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-extrabold text-[#081426]">
                          Tổng quan hệ thống EDUNEXA
                        </h2>
                        <p className="text-sm text-slate-600 mt-0.5">
                          Số liệu thực tế được truy vấn trực tiếp từ cơ sở dữ liệu máy chủ.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={refreshOverviewOnly}
                        disabled={isLoadingOverview}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#081426] text-xs font-semibold text-[#081426] cursor-pointer"
                      >
                        <RefreshCw
                          className={`w-3.5 h-3.5 ${isLoadingOverview ? 'animate-spin' : ''}`}
                        />
                        <span>Làm mới số liệu</span>
                      </button>
                    </div>

                    {/* 4 KPI Cards (Single elevation, tabular-nums, zero fake stats) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                      <button
                        type="button"
                        onClick={() => setActiveTab('courses')}
                        className="text-left bg-white rounded-2xl border border-slate-200 hover:border-[#081426] p-5 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold text-slate-500">Khóa học</span>
                          <BookOpen className="w-4 h-4 text-[#0D9488]" />
                        </div>
                        <p className="text-3xl font-extrabold text-[#081426] tabular-nums">
                          {overview?.courses.published ?? draft.courses.filter((c) => c.status !== 'hidden').length}
                        </p>
                        <p className="text-xs text-slate-500 mt-1.5 tabular-nums">
                          Đang hiển thị / {overview?.courses.total ?? draft.courses.length} tổng ·{' '}
                          {overview?.courses.featured ?? draft.courses.filter((c) => c.featured).length} nổi bật
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('media')}
                        className="text-left bg-white rounded-2xl border border-slate-200 hover:border-[#081426] p-5 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold text-slate-500">Thư viện hình ảnh</span>
                          <ImageIcon className="w-4 h-4 text-[#0D9488]" />
                        </div>
                        <p className="text-3xl font-extrabold text-[#081426] tabular-nums">
                          {overview?.media.total ?? 0}
                        </p>
                        <p className="text-xs text-slate-500 mt-1.5 tabular-nums">
                          {overview?.media.published ?? 0} đã xuất bản · {overview?.media.pending ?? 0} chờ duyệt
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('inquiries')}
                        className="text-left bg-white rounded-2xl border border-slate-200 hover:border-[#081426] p-5 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold text-slate-500">Đăng ký & Liên hệ</span>
                          <MessageSquare className="w-4 h-4 text-[#0D9488]" />
                        </div>
                        <p className="text-3xl font-extrabold text-[#081426] tabular-nums">
                          {overview?.inquiries.total ?? 0}
                        </p>
                        <p className="text-xs text-slate-500 mt-1.5 tabular-nums">
                          {overview?.inquiries.newCount ?? 0} mới tiếp nhận · {overview?.inquiries.enrolledCount ?? 0} đã đăng ký
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('drive')}
                        className="text-left bg-white rounded-2xl border border-slate-200 hover:border-[#081426] p-5 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold text-slate-500">Google Drive</span>
                          <Cloud className="w-4 h-4 text-[#0D9488]" />
                        </div>
                        <p className="text-base font-extrabold text-[#081426] truncate">
                          {overview?.drive.connectionStatus === 'connected_verified'
                            ? overview.drive.rootFolderName || 'Đã kết nối'
                            : 'Chưa kết nối'}
                        </p>
                        <p className="text-xs text-slate-500 mt-2 tabular-nums">
                          {overview?.drive.lastSyncedAt
                            ? `Đồng bộ: ${formatDateTime(overview.drive.lastSyncedAt)}`
                            : 'Chưa chạy đồng bộ nào'}
                        </p>
                      </button>
                    </div>

                    {/* Draft/Publish Status + Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-bold text-[#081426] mb-1">
                            Trạng thái xuất bản nội dung
                          </h3>
                          <p className="text-xs text-slate-500 mb-5">
                            Mọi chỉnh sửa được lưu ở bản Nháp trên máy chủ. Bấm XUẤT BẢN để đồng bộ ngay ra website công khai.
                          </p>

                          <dl className="space-y-3 text-sm border-t border-slate-100 pt-4">
                            <div className="flex items-center justify-between gap-3">
                              <dt className="text-slate-500">Bản Nháp gần nhất</dt>
                              <dd className="font-semibold text-[#081426] tabular-nums">
                                {formatDateTime(cmsState?.draftUpdatedAt)}
                              </dd>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <dt className="text-slate-500">Bản Xuất bản gần nhất</dt>
                              <dd className="font-semibold text-[#081426] tabular-nums">
                                {formatDateTime(cmsState?.publishedUpdatedAt)}
                              </dd>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <dt className="text-slate-500">Banner đang hoạt động</dt>
                              <dd className="font-semibold text-[#081426] tabular-nums">
                                {overview?.banners.active ?? draft.heroShowcase.filter((b) => b.active !== false).length} /{' '}
                                {overview?.banners.total ?? draft.heroShowcase.length}
                              </dd>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <dt className="text-slate-500">Trạng thái đồng bộ</dt>
                              <dd
                                className={`font-bold ${
                                  hasUnpublished ? 'text-amber-700' : 'text-[#0D9488]'
                                }`}
                              >
                                {hasUnpublished ? 'Có thay đổi chưa xuất bản' : 'Đã đồng bộ'}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5 mt-6 pt-4 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setActiveTab('courses')}
                            className="px-3.5 py-2.5 rounded-xl bg-[#F7F9FC] hover:bg-slate-200/70 text-xs font-bold text-[#081426] cursor-pointer"
                          >
                            Sửa khóa học
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab('landing')}
                            className="px-3.5 py-2.5 rounded-xl bg-[#F7F9FC] hover:bg-slate-200/70 text-xs font-bold text-[#081426] cursor-pointer"
                          >
                            Sửa Landing Page
                          </button>
                        </div>
                      </div>

                      {/* Recent Real Audit Logs */}
                      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <div>
                            <h3 className="text-base font-bold text-[#081426]">
                              Hoạt động hệ thống gần đây
                            </h3>
                            <p className="text-xs text-slate-500">
                              Ghi nhận tự động khi lưu nháp, xuất bản, đồng bộ Drive hoặc tiếp nhận đăng ký.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveTab('logs')}
                            className="text-xs font-bold text-[#0D9488] hover:underline whitespace-nowrap cursor-pointer"
                          >
                            Xem toàn bộ nhật ký
                          </button>
                        </div>

                        {overview && overview.recentLogs.length > 0 ? (
                          <div className="divide-y divide-slate-100">
                            {overview.recentLogs.slice(0, 7).map((log) => (
                              <div
                                key={log.id}
                                className="py-3 flex items-start justify-between gap-4 text-xs"
                              >
                                <div className="min-w-0">
                                  <p className="font-semibold text-[#081426] leading-snug">
                                    {log.summary}
                                  </p>
                                  <p className="text-slate-400 mt-0.5">
                                    {log.actor} · {log.action}
                                  </p>
                                </div>
                                <span className="text-slate-400 tabular-nums whitespace-nowrap shrink-0">
                                  {formatDateTime(log.timestamp)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500 py-8 text-center">
                            Chưa có bản ghi nhật ký nào.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* =========================================================
                    02. QUẢN LÝ KHÓA HỌC
                ========================================================= */}
                {activeTab === 'courses' && (
                  <CoursesManagerSection
                    courses={draft.courses}
                    onChangeCourses={(nextCourses) =>
                      updateDraft((prev) => ({ ...prev, courses: nextCourses }))
                    }
                    defaultRegisterUrl={draft.settings.registrationFormUrl}
                    adminSessionToken={adminSessionToken}
                    onNotify={(msg) => notify(msg)}
                  />
                )}

                {/* =========================================================
                    03. THƯ VIỆN HÌNH ẢNH
                ========================================================= */}
                {activeTab === 'media' && (
                  <MediaLibrarySection
                    adminSessionToken={adminSessionToken}
                    courses={draft.courses}
                    onRefreshAll={handleRefreshAfterMediaChange}
                    onNotify={(msg) => notify(msg)}
                  />
                )}

                {/* =========================================================
                    04. GOOGLE DRIVE
                ========================================================= */}
                {activeTab === 'drive' && (
                  <DriveSyncPanel
                    adminSessionToken={adminSessionToken}
                    courses={draft.courses}
                    onMediaPublishedChange={handleRefreshAfterMediaChange}
                    onNotify={(msg) => notify(msg)}
                  />
                )}

                {/* =========================================================
                    05. QUẢN LÝ BANNER
                ========================================================= */}
                {activeTab === 'banners' && (
                  <BannersManagerSection
                    banners={draft.heroShowcase}
                    onChangeBanners={(nextBanners) =>
                      updateDraft((prev) => ({ ...prev, heroShowcase: nextBanners }))
                    }
                    courses={draft.courses}
                    adminSessionToken={adminSessionToken}
                    onNotify={(msg) => notify(msg)}
                  />
                )}

                {/* =========================================================
                    06. NỘI DUNG LANDING PAGE
                ========================================================= */}
                {activeTab === 'landing' && (
                  <LandingContentSection
                    draft={draft}
                    onUpdateDraft={updateDraft}
                    adminSessionToken={adminSessionToken}
                    onNotify={(msg) => notify(msg)}
                  />
                )}

                {/* =========================================================
                    07. ĐĂNG KÝ VÀ LIÊN HỆ
                ========================================================= */}
                {activeTab === 'inquiries' && (
                  <InquiriesSection
                    adminSessionToken={adminSessionToken}
                    courses={draft.courses}
                    settings={draft.settings}
                    onChangeSettings={(nextSettings) =>
                      updateDraft((prev) => ({ ...prev, settings: nextSettings }))
                    }
                    onNotify={(msg) => notify(msg)}
                  />
                )}

                {/* =========================================================
                    08. CÀI ĐẶT WEBSITE
                ========================================================= */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    {/* General Website Metadata & Footer */}
                    <section className="bg-white rounded-2xl border border-slate-200 p-6">
                      <h2 className="text-base font-extrabold text-[#081426] mb-1">
                        Thông tin nhận diện & Chân trang website
                      </h2>
                      <p className="text-xs text-slate-500 mb-5">
                        Sau khi chỉnh sửa, nhấn LƯU NHÁP hoặc XUẤT BẢN ở thanh trên để áp dụng.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Tên website (Title)
                          </label>
                          <input
                            type="text"
                            value={draft.settings.siteName || ''}
                            onChange={(e) =>
                              updateDraft((prev) => ({
                                ...prev,
                                settings: { ...prev.settings, siteName: e.target.value },
                              }))
                            }
                            placeholder="EDUNEXA AI — Đào tạo ứng dụng AI thực chiến cho giáo viên"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#081426]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Dòng bản quyền chân trang
                          </label>
                          <input
                            type="text"
                            value={draft.settings.copyrightText || ''}
                            onChange={(e) =>
                              updateDraft((prev) => ({
                                ...prev,
                                settings: { ...prev.settings, copyrightText: e.target.value },
                              }))
                            }
                            placeholder="© 2026 CONG TY TNHH MTV GIAO DUC EDUNEXA. Bảo lưu mọi quyền."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#081426]"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Mô tả SEO (Meta Description)
                          </label>
                          <textarea
                            rows={2}
                            value={draft.settings.siteDescription || ''}
                            onChange={(e) =>
                              updateDraft((prev) => ({
                                ...prev,
                                settings: { ...prev.settings, siteDescription: e.target.value },
                              }))
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#081426]"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Mô tả giới thiệu tại Footer
                          </label>
                          <textarea
                            rows={2}
                            value={draft.settings.footerDescription || ''}
                            onChange={(e) =>
                              updateDraft((prev) => ({
                                ...prev,
                                settings: { ...prev.settings, footerDescription: e.target.value },
                              }))
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#081426]"
                          />
                        </div>
                      </div>
                    </section>

                    {/* Mobile Sticky CTA Config */}
                    <section className="bg-white rounded-2xl border border-slate-200 p-6">
                      <div className="flex items-center justify-between gap-4 mb-5">
                        <div>
                          <h2 className="text-base font-extrabold text-[#081426]">
                            Thanh kêu gọi đăng ký trên điện thoại (Mobile Sticky Bar)
                          </h2>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Hiển thị gọn ở cạnh dưới màn hình điện thoại khi người dùng cuộn trang chủ.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            updateDraft((prev) => ({
                              ...prev,
                              settings: {
                                ...prev.settings,
                                mobileStickyEnabled: !prev.settings.mobileStickyEnabled,
                              },
                            }))
                          }
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                            draft.settings.mobileStickyEnabled
                              ? 'bg-[#081426] text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {draft.settings.mobileStickyEnabled ? 'Đang bật' : 'Đang tắt'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Nhãn nút CTA
                          </label>
                          <input
                            type="text"
                            value={draft.settings.mobileStickyLabel}
                            onChange={(e) =>
                              updateDraft((prev) => ({
                                ...prev,
                                settings: { ...prev.settings, mobileStickyLabel: e.target.value },
                              }))
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#081426]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Dòng phụ hiển thị bên trái
                          </label>
                          <input
                            type="text"
                            value={draft.settings.mobileStickySublabel}
                            onChange={(e) =>
                              updateDraft((prev) => ({
                                ...prev,
                                settings: { ...prev.settings, mobileStickySublabel: e.target.value },
                              }))
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#081426]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Liên kết đích
                          </label>
                          <input
                            type="text"
                            value={draft.settings.mobileStickyUrl}
                            onChange={(e) =>
                              updateDraft((prev) => ({
                                ...prev,
                                settings: { ...prev.settings, mobileStickyUrl: e.target.value },
                              }))
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#081426]"
                          />
                        </div>
                      </div>
                    </section>

                    {/* Admin Account Security + Reset Defaults */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6">
                        <div className="flex items-center gap-2.5 mb-1">
                          <KeyRound className="w-4 h-4 text-[#0D9488]" />
                          <h2 className="text-base font-extrabold text-[#081426]">
                            Đổi mật khẩu tài khoản quản trị
                          </h2>
                        </div>
                        <p className="text-xs text-slate-500 mb-5">
                          Mật khẩu được mã hóa (scrypt) và lưu bền vững trên cơ sở dữ liệu máy chủ.
                        </p>

                        <form onSubmit={handleChangePassword} className="space-y-3.5">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Mật khẩu hiện tại
                            </label>
                            <input
                              type="password"
                              required
                              value={currentPwd}
                              onChange={(e) => setCurrentPwd(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#081426]"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                Mật khẩu mới (tối thiểu 6 ký tự)
                              </label>
                              <input
                                type="password"
                                required
                                minLength={6}
                                value={newPwd}
                                onChange={(e) => setNewPwd(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#081426]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                Nhập lại mật khẩu mới
                              </label>
                              <input
                                type="password"
                                required
                                minLength={6}
                                value={confirmPwd}
                                onChange={(e) => setConfirmPwd(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#081426]"
                              />
                            </div>
                          </div>

                          {pwdFeedback && (
                            <p
                              className={`text-xs font-semibold ${
                                pwdFeedback.type === 'ok' ? 'text-[#0D9488]' : 'text-rose-600'
                              }`}
                            >
                              {pwdFeedback.text}
                            </p>
                          )}

                          <button
                            type="submit"
                            disabled={isChangingPwd}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#081426] hover:bg-[#102644] disabled:opacity-50 text-white text-xs font-bold cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            <span>{isChangingPwd ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}</span>
                          </button>
                        </form>
                      </section>

                      <section className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2.5 mb-1">
                            <RotateCcw className="w-4 h-4 text-rose-600" />
                            <h2 className="text-base font-extrabold text-[#081426]">
                              Khôi phục dữ liệu mặc định
                            </h2>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed mt-2">
                            Đưa toàn bộ khóa học, banner, nội dung Landing Page, FAQ và cài đặt về bộ
                            mặc định ban đầu của EDUNEXA. Không xóa ảnh đã đồng bộ từ Google Drive và
                            không xóa danh sách đăng ký học viên.
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100">
                          {!confirmResetOpen ? (
                            <button
                              type="button"
                              onClick={() => setConfirmResetOpen(true)}
                              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold cursor-pointer"
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>Khôi phục cấu hình mặc định</span>
                            </button>
                          ) : (
                            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-3">
                              <p className="text-xs font-bold text-rose-800">
                                Xác nhận khôi phục toàn bộ nội dung về mặc định và xuất bản lại?
                              </p>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  disabled={isResetting}
                                  onClick={handleResetDefaults}
                                  className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold cursor-pointer"
                                >
                                  {isResetting ? 'Đang khôi phục...' : 'Xác nhận khôi phục'}
                                </button>
                                <button
                                  type="button"
                                  disabled={isResetting}
                                  onClick={() => setConfirmResetOpen(false)}
                                  className="px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                                >
                                  Hủy
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </section>
                    </div>
                  </div>
                )}

                {/* =========================================================
                    09. NHẬT KÝ HỆ THỐNG
                ========================================================= */}
                {activeTab === 'logs' && (
                  <SystemLogsSection adminSessionToken={adminSessionToken} />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
