import { getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google Drive scopes matching the provisioned OAuth configuration
export const DRIVE_OAUTH_SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
];

// Strictly in-memory OAuth access token (NEVER persisted to localStorage or sessionStorage)
let cachedAccessToken: string | null = null;
let cachedUser: GoogleAccountInfo | null = null;
let authListenerInitialized = false;

export interface GoogleAccountInfo {
  email: string;
  displayName: string;
  photoURL: string | null;
}

function mapFirebaseUser(user: User | null): GoogleAccountInfo | null {
  if (!user) return null;
  return {
    email: user.email || '',
    displayName: user.displayName || user.email || 'Tài khoản Google',
    photoURL: user.photoURL || null,
  };
}

export function initGoogleAuthListener(
  onUserChange?: (user: GoogleAccountInfo | null) => void
): () => void {
  if (!authListenerInitialized) {
    authListenerInitialized = true;
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        cachedAccessToken = null;
        cachedUser = null;
      } else {
        cachedUser = mapFirebaseUser(user);
      }
    });
  }

  return onAuthStateChanged(auth, (user) => {
    const mapped = mapFirebaseUser(user);
    if (!user) {
      cachedAccessToken = null;
      cachedUser = null;
    } else {
      cachedUser = mapped;
    }
    onUserChange?.(mapped);
  });
}

export function getInMemoryGoogleToken(): string | null {
  return cachedAccessToken;
}

export function getInMemoryGoogleUser(): GoogleAccountInfo | null {
  return cachedUser;
}

export async function signInWithGoogleDrive(): Promise<{
  accessToken: string;
  user: GoogleAccountInfo;
}> {
  const provider = new GoogleAuthProvider();
  for (const scope of DRIVE_OAUTH_SCOPES) {
    provider.addScope(scope);
  }
  provider.setCustomParameters({
    prompt: 'select_account consent',
  });

  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const accessToken = credential?.accessToken;

  if (!accessToken) {
    throw new Error(
      'Không nhận được Google OAuth access token. Vui lòng cho phép quyền đọc Google Drive khi đăng nhập.'
    );
  }

  const userInfo: GoogleAccountInfo = mapFirebaseUser(result.user) || {
    email: '',
    displayName: 'Tài khoản Google',
    photoURL: null,
  };

  cachedAccessToken = accessToken;
  cachedUser = userInfo;

  return { accessToken, user: userInfo };
}

export async function signOutGoogleDrive(): Promise<void> {
  cachedAccessToken = null;
  cachedUser = null;
  try {
    await signOut(auth);
  } catch {
    // ignore sign-out network error
  }
}
