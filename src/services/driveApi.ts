import type {
  AdminOverviewResponse,
  AuditLogItem,
  CmsSnapshot,
  CmsStateResponse,
  DeletePolicy,
  DriveCategory,
  DriveConfig,
  DriveStatusResponse,
  FolderGroupRule,
  FolderVerificationResult,
  InquiryRecord,
  InquiryStatus,
  PublicationStatus,
  PublicMediaResponse,
  SyncedMediaAsset,
  SyncLogItem,
} from '../types';

async function parseJsonSafe<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) {
    throw new Error(`Máy chủ phản hồi rỗng (HTTP ${res.status}).`);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`Phản hồi không hợp lệ từ máy chủ (HTTP ${res.status}).`);
  }
  if (!res.ok) {
    const errObj = parsed as { error?: string };
    throw new Error(errObj?.error || `Yêu cầu thất bại (HTTP ${res.status}).`);
  }
  return parsed as T;
}

function buildHeaders(
  adminSessionToken?: string,
  googleAccessToken?: string | null
): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (adminSessionToken) {
    headers['x-admin-session'] = adminSessionToken;
  }
  if (googleAccessToken) {
    headers.Authorization = `Bearer ${googleAccessToken}`;
  }
  return headers;
}

// =========================================================================
// PUBLIC SITE & INQUIRIES
// =========================================================================
export async function fetchPublicMedia(): Promise<PublicMediaResponse> {
  const res = await fetch('/api/public/media', { cache: 'no-store' });
  return parseJsonSafe<PublicMediaResponse>(res);
}

export async function fetchPublicSite(): Promise<{
  cms: CmsSnapshot;
  cmsUpdatedAt: string;
  media: PublicMediaResponse;
}> {
  const res = await fetch('/api/public/site', { cache: 'no-store' });
  return parseJsonSafe<{
    cms: CmsSnapshot;
    cmsUpdatedAt: string;
    media: PublicMediaResponse;
  }>(res);
}

export async function submitPublicInquiry(input: {
  fullName: string;
  phone: string;
  email?: string;
  courseId?: string;
  courseTitle?: string;
  note?: string;
  source?: string;
  consentAccepted: boolean;
}): Promise<{ ok: boolean; inquiry: InquiryRecord }> {
  const res = await fetch('/api/public/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return parseJsonSafe<{ ok: boolean; inquiry: InquiryRecord }>(res);
}

// =========================================================================
// ADMIN AUTHENTICATION
// =========================================================================
export async function checkAdminSession(): Promise<{
  authenticated: boolean;
  sessionToken?: string;
}> {
  try {
    const res = await fetch('/api/admin/me', {
      credentials: 'same-origin',
      cache: 'no-store',
    });
    if (!res.ok) return { authenticated: false };
    return (await res.json()) as { authenticated: boolean; sessionToken?: string };
  } catch {
    return { authenticated: false };
  }
}

export async function loginAdminServer(
  password: string
): Promise<{ ok: boolean; sessionToken: string }> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  return parseJsonSafe<{ ok: boolean; sessionToken: string }>(res);
}

export async function logoutAdminServer(): Promise<void> {
  await fetch('/api/admin/logout', {
    method: 'POST',
    credentials: 'same-origin',
  }).catch(() => undefined);
}

export async function changeAdminPasswordServer(
  adminSessionToken: string,
  currentPassword: string,
  newPassword: string
): Promise<{ ok: boolean }> {
  const res = await fetch('/api/admin/change-password', {
    method: 'POST',
    credentials: 'same-origin',
    headers: buildHeaders(adminSessionToken),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return parseJsonSafe<{ ok: boolean }>(res);
}

// =========================================================================
// ADMIN OVERVIEW & CMS DRAFT / PUBLISH
// =========================================================================
export async function fetchAdminOverview(
  adminSessionToken: string
): Promise<AdminOverviewResponse> {
  const res = await fetch('/api/admin/overview', {
    credentials: 'same-origin',
    headers: buildHeaders(adminSessionToken),
    cache: 'no-store',
  });
  return parseJsonSafe<AdminOverviewResponse>(res);
}

export async function fetchCmsState(adminSessionToken: string): Promise<CmsStateResponse> {
  const res = await fetch('/api/cms/state', {
    credentials: 'same-origin',
    headers: buildHeaders(adminSessionToken),
    cache: 'no-store',
  });
  return parseJsonSafe<CmsStateResponse>(res);
}

export async function saveCmsDraftApi(
  adminSessionToken: string,
  snapshot: CmsSnapshot,
  summary?: string
): Promise<{ ok: boolean; state: CmsStateResponse }> {
  const res = await fetch('/api/cms/draft', {
    method: 'PUT',
    credentials: 'same-origin',
    headers: buildHeaders(adminSessionToken),
    body: JSON.stringify({ snapshot, summary }),
  });
  return parseJsonSafe<{ ok: boolean; state: CmsStateResponse }>(res);
}

export async function publishCmsDraftApi(
  adminSessionToken: string,
  snapshot?: CmsSnapshot,
  summary?: string
): Promise<{ ok: boolean; state: CmsStateResponse }> {
  const res = await fetch('/api/cms/publish', {
    method: 'POST',
    credentials: 'same-origin',
    headers: buildHeaders(adminSessionToken),
    body: JSON.stringify({ snapshot, summary }),
  });
  return parseJsonSafe<{ ok: boolean; state: CmsStateResponse }>(res);
}

export async function resetCmsDefaultsApi(
  adminSessionToken: string
): Promise<{ ok: boolean; state: CmsStateResponse }> {
  const res = await fetch('/api/cms/reset', {
    method: 'POST',
    credentials: 'same-origin',
    headers: buildHeaders(adminSessionToken),
  });
  return parseJsonSafe<{ ok: boolean; state: CmsStateResponse }>(res);
}

// =========================================================================
// GOOGLE DRIVE API
// =========================================================================
export async function fetchDriveStatus(adminSessionToken: string): Promise<DriveStatusResponse> {
  const res = await fetch('/api/drive/status', {
    credentials: 'same-origin',
    headers: buildHeaders(adminSessionToken),
    cache: 'no-store',
  });
  return parseJsonSafe<DriveStatusResponse>(res);
}

export async function attachDriveOAuthSession(
  adminSessionToken: string,
  googleAccessToken: string,
  profile: { email: string; displayName: string }
): Promise<{ ok: boolean; email: string; displayName: string; scopes: string }> {
  const res = await fetch('/api/drive/session/attach', {
    method: 'POST',
    credentials: 'same-origin',
    headers: buildHeaders(adminSessionToken, googleAccessToken),
    body: JSON.stringify(profile),
  });
  return parseJsonSafe<{ ok: boolean; email: string; displayName: string; scopes: string }>(res);
}

export async function verifyDriveFolder(
  adminSessionToken: string,
  googleAccessToken: string,
  folderInput: string,
  save = true
): Promise<FolderVerificationResult> {
  const res = await fetch('/api/drive/verify-folder', {
    method: 'POST',
    credentials: 'same-origin',
    headers: buildHeaders(adminSessionToken, googleAccessToken),
    body: JSON.stringify({ folderInput, save }),
  });
  return parseJsonSafe<FolderVerificationResult>(res);
}

export async function updateDriveConfigApi(
  adminSessionToken: string,
  patch: {
    syncIntervalMinutes?: number;
    autoSyncEnabled?: boolean;
    deletePolicy?: DeletePolicy;
    maxFileSizeMb?: number;
    folderRules?: FolderGroupRule[];
  }
): Promise<{ ok: boolean; config: DriveConfig }> {
  const res = await fetch('/api/drive/config', {
    method: 'PUT',
    credentials: 'same-origin',
    headers: buildHeaders(adminSessionToken),
    body: JSON.stringify(patch),
  });
  return parseJsonSafe<{ ok: boolean; config: DriveConfig }>(res);
}

export async function disconnectDriveApi(
  adminSessionToken: string
): Promise<{ ok: boolean; config: DriveConfig }> {
  const res = await fetch('/api/drive/disconnect', {
    method: 'POST',
    credentials: 'same-origin',
    headers: buildHeaders(adminSessionToken),
  });
  return parseJsonSafe<{ ok: boolean; config: DriveConfig }>(res);
}

export async function triggerManualDriveSync(
  adminSessionToken: string,
  googleAccessToken?: string | null
): Promise<{ ok: boolean; log: SyncLogItem }> {
  const res = await fetch('/api/drive/sync', {
    method: 'POST',
    credentials: 'same-origin',
    headers: buildHeaders(adminSessionToken, googleAccessToken),
  });
  return parseJsonSafe<{ ok: boolean; log: SyncLogItem }>(res);
}

// =========================================================================
// MEDIA LIBRARY API (GRID, UPLOAD, REORDER, ONE-CLICK BANNER, APPROVAL)
// =========================================================================
export async function fetchAdminMediaAssets(
  adminSessionToken: string,
  filters?: { category?: string; status?: string }
): Promise<{ items: SyncedMediaAsset[] }> {
  const params = new URLSearchParams();
  if (filters?.category && filters.category !== 'ALL') {
    params.set('category', filters.category);
  }
  if (filters?.status && filters.status !== 'ALL') {
    params.set('status', filters.status);
  }
  const qs = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`/api/media${qs}`, {
    credentials: 'same-origin',
    headers: buildHeaders(adminSessionToken),
    cache: 'no-store',
  });
  return parseJsonSafe<{ items: SyncedMediaAsset[] }>(res);
}

export async function uploadMediaAssetApi(
  adminSessionToken: string,
  payload: {
    dataUrl: string;
    filename: string;
    category: DriveCategory;
    courseId?: string | null;
    title?: string;
    altText?: string;
    autoPublish?: boolean;
  }
): Promise<{ ok: boolean; item: SyncedMediaAsset }> {
  const res = await fetch('/api/media/upload', {
    method: 'POST',
    credentials: 'same-origin',
    headers: buildHeaders(adminSessionToken),
    body: JSON.stringify(payload),
  });
  return parseJsonSafe<{ ok: boolean; item: SyncedMediaAsset }>(res);
}

export async function reorderMediaAssetsApi(
  adminSessionToken: string,
  orderedIds: string[]
): Promise<{ ok: boolean }> {
  const res = await fetch('/api/media/reorder', {
    method: 'POST',
    credentials: 'same-origin',
    headers: buildHeaders(adminSessionToken),
    body: JSON.stringify({ orderedIds }),
  });
  return parseJsonSafe<{ ok: boolean }>(res);
}

export async function setMediaAsBannerApi(
  adminSessionToken: string,
  id: string,
  publishNow = true
): Promise<{ ok: boolean; item: SyncedMediaAsset; cmsState: CmsStateResponse }> {
  const res = await fetch(`/api/media/${encodeURIComponent(id)}/set-banner`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: buildHeaders(adminSessionToken),
    body: JSON.stringify({ publishNow }),
  });
  return parseJsonSafe<{ ok: boolean; item: SyncedMediaAsset; cmsState: CmsStateResponse }>(res);
}

export async function updateMediaAssetApi(
  adminSessionToken: string,
  id: string,
  patch: {
    title?: string;
    altText?: string;
    category?: DriveCategory;
    courseId?: string | null;
    displayOrder?: number;
    publicationStatus?: PublicationStatus;
  }
): Promise<{ ok: boolean; item: SyncedMediaAsset }> {
  const res = await fetch(`/api/media/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    credentials: 'same-origin',
    headers: buildHeaders(adminSessionToken),
    body: JSON.stringify(patch),
  });
  return parseJsonSafe<{ ok: boolean; item: SyncedMediaAsset }>(res);
}

export async function deleteMediaAssetApi(
  adminSessionToken: string,
  id: string
): Promise<{ ok: boolean }> {
  const res = await fetch(`/api/media/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'same-origin',
    headers: buildHeaders(adminSessionToken),
  });
  return parseJsonSafe<{ ok: boolean }>(res);
}

// =========================================================================
// INQUIRIES & AUDIT LOGS API
// =========================================================================
export async function fetchInquiriesApi(
  adminSessionToken: string,
  filters?: { status?: string; search?: string }
): Promise<{ items: InquiryRecord[] }> {
  const params = new URLSearchParams();
  if (filters?.status && filters.status !== 'ALL') params.set('status', filters.status);
  if (filters?.search?.trim()) params.set('search', filters.search.trim());
  const qs = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`/api/inquiries${qs}`, {
    credentials: 'same-origin',
    headers: buildHeaders(adminSessionToken),
    cache: 'no-store',
  });
  return parseJsonSafe<{ items: InquiryRecord[] }>(res);
}

export async function createAdminInquiryApi(
  adminSessionToken: string,
  input: {
    fullName: string;
    phone: string;
    email?: string;
    courseId?: string;
    courseTitle?: string;
    note?: string;
  }
): Promise<{ ok: boolean; inquiry: InquiryRecord }> {
  const res = await fetch('/api/inquiries', {
    method: 'POST',
    credentials: 'same-origin',
    headers: buildHeaders(adminSessionToken),
    body: JSON.stringify(input),
  });
  return parseJsonSafe<{ ok: boolean; inquiry: InquiryRecord }>(res);
}

export async function updateInquiryApi(
  adminSessionToken: string,
  id: string,
  patch: {
    status?: InquiryStatus;
    adminNotes?: string;
    courseId?: string;
    courseTitle?: string;
  }
): Promise<{ ok: boolean; inquiry: InquiryRecord }> {
  const res = await fetch(`/api/inquiries/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    credentials: 'same-origin',
    headers: buildHeaders(adminSessionToken),
    body: JSON.stringify(patch),
  });
  return parseJsonSafe<{ ok: boolean; inquiry: InquiryRecord }>(res);
}

export async function deleteInquiryApi(
  adminSessionToken: string,
  id: string
): Promise<{ ok: boolean }> {
  const res = await fetch(`/api/inquiries/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'same-origin',
    headers: buildHeaders(adminSessionToken),
  });
  return parseJsonSafe<{ ok: boolean }>(res);
}

export async function fetchAuditLogsApi(
  adminSessionToken: string,
  action?: string
): Promise<{ auditLogs: AuditLogItem[]; syncLogs: SyncLogItem[] }> {
  const qs = action && action !== 'ALL' ? `?action=${encodeURIComponent(action)}` : '';
  const res = await fetch(`/api/audit-logs${qs}`, {
    credentials: 'same-origin',
    headers: buildHeaders(adminSessionToken),
    cache: 'no-store',
  });
  return parseJsonSafe<{ auditLogs: AuditLogItem[]; syncLogs: SyncLogItem[] }>(res);
}
