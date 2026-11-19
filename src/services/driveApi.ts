import type {
  DeletePolicy,
  DriveCategory,
  DriveConfig,
  DriveStatusResponse,
  FolderGroupRule,
  FolderVerificationResult,
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

function buildHeaders(adminSessionToken: string, googleAccessToken?: string | null): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-admin-session': adminSessionToken,
  };
  if (googleAccessToken) {
    headers.Authorization = `Bearer ${googleAccessToken}`;
  }
  return headers;
}

export async function fetchPublicMedia(): Promise<PublicMediaResponse> {
  const res = await fetch('/api/public/media', { cache: 'no-store' });
  return parseJsonSafe<PublicMediaResponse>(res);
}

export async function loginAdminServer(password: string): Promise<{ ok: boolean; sessionToken: string }> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  return parseJsonSafe<{ ok: boolean; sessionToken: string }>(res);
}

export async function changeAdminPasswordServer(
  adminSessionToken: string,
  currentPassword: string,
  newPassword: string
): Promise<{ ok: boolean }> {
  const res = await fetch('/api/admin/change-password', {
    method: 'POST',
    headers: buildHeaders(adminSessionToken),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return parseJsonSafe<{ ok: boolean }>(res);
}

export async function fetchDriveStatus(adminSessionToken: string): Promise<DriveStatusResponse> {
  const res = await fetch('/api/drive/status', {
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
    headers: buildHeaders(adminSessionToken, googleAccessToken),
  });
  return parseJsonSafe<{ ok: boolean; log: SyncLogItem }>(res);
}

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
    headers: buildHeaders(adminSessionToken),
    cache: 'no-store',
  });
  return parseJsonSafe<{ items: SyncedMediaAsset[] }>(res);
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
    headers: buildHeaders(adminSessionToken),
    body: JSON.stringify(patch),
  });
  return parseJsonSafe<{ ok: boolean; item: SyncedMediaAsset }>(res);
}
