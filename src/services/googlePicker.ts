// Official Google Picker loader for folder selection (client-side only, NO developer key required)

interface GooglePickerDocument {
  id: string;
  name: string;
  url?: string;
  mimeType?: string;
}

interface GooglePickerResponse {
  action: string;
  docs?: GooglePickerDocument[];
}

declare global {
  interface Window {
    gapi?: {
      load: (api: string, callback: { callback: () => void; onerror?: () => void }) => void;
    };
    google?: {
      picker?: {
        Action: {
          PICKED: string;
          CANCEL: string;
        };
        ViewId: {
          FOLDERS: string;
        };
        DocsView: new (viewId?: string) => {
          setIncludeFolders: (include: boolean) => unknown;
          setSelectFolderEnabled: (enabled: boolean) => unknown;
          setMimeTypes: (mimeTypes: string) => unknown;
        };
        PickerBuilder: new () => {
          setOAuthToken: (token: string) => unknown;
          setOrigin: (origin: string) => unknown;
          setTitle: (title: string) => unknown;
          addView: (view: unknown) => unknown;
          setCallback: (cb: (data: GooglePickerResponse) => void) => unknown;
          build: () => { setVisible: (visible: boolean) => void };
        };
      };
    };
  }
}

export interface PickedDriveFolder {
  id: string;
  name: string;
  url: string;
}

let pickerLoadPromise: Promise<void> | null = null;

function loadGooglePickerApi(): Promise<void> {
  if (window.google?.picker) {
    return Promise.resolve();
  }
  if (pickerLoadPromise) {
    return pickerLoadPromise;
  }

  pickerLoadPromise = new Promise<void>((resolve, reject) => {
    const onGapiReady = () => {
      if (!window.gapi) {
        reject(new Error('Không thể khởi tạo Google API (gapi).'));
        return;
      }
      window.gapi.load('picker', {
        callback: () => {
          if (window.google?.picker) {
            resolve();
          } else {
            reject(new Error('Google Picker không sẵn sàng trên trình duyệt này.'));
          }
        },
        onerror: () => {
          reject(new Error('Không thể tải thư viện Google Picker.'));
        },
      });
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://apis.google.com/js/api.js"]'
    );
    if (existingScript && window.gapi) {
      onGapiReady();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload = onGapiReady;
    script.onerror = () => {
      pickerLoadPromise = null;
      reject(new Error('Không thể kết nối tới https://apis.google.com/js/api.js.'));
    };
    document.head.appendChild(script);
  });

  return pickerLoadPromise;
}

export async function openDriveFolderPicker(
  accessToken: string
): Promise<PickedDriveFolder | null> {
  await loadGooglePickerApi();

  const pickerNs = window.google?.picker;
  if (!pickerNs) {
    throw new Error('Google Picker chưa sẵn sàng. Bạn vẫn có thể dán URL thư mục Drive trực tiếp.');
  }

  return new Promise<PickedDriveFolder | null>((resolve) => {
    const folderView = new pickerNs.DocsView(pickerNs.ViewId.FOLDERS);
    folderView.setIncludeFolders(true);
    folderView.setSelectFolderEnabled(true);
    folderView.setMimeTypes('application/vnd.google-apps.folder');

    const builder = new pickerNs.PickerBuilder();
    builder.setOAuthToken(accessToken);
    builder.setOrigin(`${window.location.protocol}//${window.location.host}`);
    builder.setTitle('Chọn thư mục gốc EDUNEXA_WEBSITE trên Google Drive');
    builder.addView(folderView);
    builder.setCallback((data: GooglePickerResponse) => {
      if (data.action === pickerNs.Action.PICKED && data.docs && data.docs[0]) {
        const doc = data.docs[0];
        resolve({
          id: doc.id,
          name: doc.name,
          url: doc.url || `https://drive.google.com/drive/folders/${doc.id}`,
        });
      } else if (data.action === pickerNs.Action.CANCEL) {
        resolve(null);
      }
    });

    const picker = builder.build();
    picker.setVisible(true);
  });
}
