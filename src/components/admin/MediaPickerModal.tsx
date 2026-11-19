import React, { useEffect, useState } from 'react';
import { HardDrive, Image as ImageIcon, Search, Upload, X, Check } from 'lucide-react';
import type { DriveCategory, SyncedMediaAsset } from '../../types';
import { VN_TEACHER_IMAGE_PRESETS } from '../../data/initialData';
import { fetchAdminMediaAssets, uploadMediaAssetApi } from '../../services/driveApi';
import { MediaFrame } from '../MediaFrame';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, asset?: SyncedMediaAsset) => void;
  adminSessionToken: string;
  defaultCategory?: DriveCategory;
  title?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  adminSessionToken,
  defaultCategory = 'THU_VIEN_ANH',
  title = 'Chọn hình ảnh từ Thư viện Drive & Hệ thống',
}: MediaPickerModalProps) {
  const [tab, setTab] = useState<'drive' | 'presets' | 'upload'>('drive');
  const [assets, setAssets] = useState<SyncedMediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    setLoading(true);
    fetchAdminMediaAssets(adminSessionToken)
      .then((res) => {
        if (active) setAssets(res.items);
      })
      .catch(() => {
        if (active) setAssets([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isOpen, adminSessionToken]);

  if (!isOpen) return null;

  const filteredAssets = assets.filter((item) => {
    if (item.publicationStatus === 'archived' || item.publicationStatus === 'deleted_in_drive') {
      return false;
    }
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.filename.toLowerCase().includes(q) ||
        item.altText.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleFileUpload = (file: File) => {
    setUploadError(null);
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        if (typeof reader.result !== 'string') throw new Error('Không thể đọc tệp ảnh.');
        const res = await uploadMediaAssetApi(adminSessionToken, {
          dataUrl: reader.result,
          filename: file.name,
          category: defaultCategory,
          autoPublish: true,
        });
        setAssets((prev) => [res.item, ...prev]);
        onSelect(res.item.publicUrl, res.item);
        onClose();
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Tải ảnh lên máy chủ thất bại.');
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => {
      setUploadError('Không thể đọc tệp từ máy tính.');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#081426]/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-4xl max-h-[88vh] rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#081426]">{title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Chọn ảnh đã đồng bộ từ Google Drive, tải ảnh mới tối ưu WebP lên máy chủ hoặc dùng ảnh giáo viên EDUNEXA.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-[#081426] hover:bg-slate-100 cursor-pointer"
            aria-label="Đóng hộp chọn ảnh"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source Switcher */}
        <div className="px-6 py-3 bg-[#F7F9FC] border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex p-1 bg-white border border-slate-200 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setTab('drive')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                tab === 'drive' ? 'bg-[#081426] text-white' : 'text-slate-600 hover:text-[#081426]'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Thư viện Drive & Máy chủ ({assets.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('presets')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                tab === 'presets' ? 'bg-[#081426] text-white' : 'text-slate-600 hover:text-[#081426]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Bộ ảnh EDUNEXA ({VN_TEACHER_IMAGE_PRESETS.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('upload')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                tab === 'upload' ? 'bg-[#081426] text-white' : 'text-slate-600 hover:text-[#081426]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Tải ảnh mới lên</span>
            </button>
          </div>

          {tab === 'drive' && (
            <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
              <div className="relative flex-1 sm:w-52">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm tên ảnh..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-[#081426]"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-[#081426]"
              >
                <option value="ALL">Tất cả thư mục</option>
                <option value="BANNER_HERO">Banner Hero</option>
                <option value="ANH_KHOA_HOC">Ảnh Khóa Học</option>
                <option value="SAN_PHAM_HOC_VIEN">Sản Phẩm Học Viên</option>
                <option value="ANH_GIANG_VIEN">Ảnh Giảng Viên</option>
                <option value="THU_VIEN_ANH">Thư Viện Ảnh</option>
                <option value="ANH_DOI_TAC">Ảnh Đối Tác</option>
              </select>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {tab === 'drive' && (
            <>
              {loading ? (
                <p className="text-sm text-slate-500 py-10 text-center">
                  Đang tải danh sách hình ảnh...
                </p>
              ) : filteredAssets.length === 0 ? (
                <div className="py-12 px-6 text-center rounded-xl border border-dashed border-slate-300 bg-[#F7F9FC] space-y-2">
                  <p className="text-sm font-bold text-[#081426]">
                    Chưa có hình ảnh nào trong Thư viện Drive / Máy chủ
                  </p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Hãy đồng bộ từ mục 04. Google Drive hoặc chuyển sang tab "Tải ảnh mới lên" / "Bộ ảnh EDUNEXA" để chọn ngay.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredAssets.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelect(item.publicUrl, item);
                        onClose();
                      }}
                      className="group text-left rounded-xl border border-slate-200 hover:border-[#081426] overflow-hidden bg-white transition-colors cursor-pointer"
                    >
                      <MediaFrame
                        src={item.thumbnailUrl || item.publicUrl}
                        fallbackSrc={item.publicUrl}
                        alt={item.altText}
                        className="aspect-[16/10] w-full"
                      />
                      <div className="p-2.5 space-y-0.5">
                        <p className="text-xs font-bold text-[#081426] truncate">{item.title}</p>
                        <p className="text-[11px] text-slate-500 truncate tabular-nums">
                          {item.width}×{item.height} · {item.category}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'presets' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {VN_TEACHER_IMAGE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    onSelect(preset.url);
                    onClose();
                  }}
                  className="text-left rounded-xl border border-slate-200 hover:border-[#081426] overflow-hidden bg-white transition-colors cursor-pointer"
                >
                  <MediaFrame
                    src={preset.url}
                    alt={preset.label}
                    className="aspect-[16/10] w-full"
                  />
                  <div className="p-2.5 flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-[#081426] truncate">{preset.label}</p>
                    <Check className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {tab === 'upload' && (
            <div className="max-w-lg mx-auto py-8 text-center space-y-4">
              <div className="p-8 rounded-2xl border-2 border-dashed border-slate-300 bg-[#F7F9FC] space-y-3">
                <Upload className="w-8 h-8 text-[#0D9488] mx-auto" />
                <p className="text-sm font-bold text-[#081426]">
                  Tải ảnh từ máy tính lên kho lưu trữ tối ưu WebP
                </p>
                <p className="text-xs text-slate-500">
                  Hỗ trợ JPG, PNG, WEBP (tối đa 15 MB). Ảnh sẽ tự động nén WebP, tạo thumbnail và lưu bền vững trên máy chủ.
                </p>
                <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#081426] hover:bg-[#102644] text-white text-xs font-bold cursor-pointer">
                  <Upload className="w-4 h-4 text-[#F5BF35]" />
                  <span>{uploading ? 'Đang xử lý & tối ưu WebP...' : 'Chọn tệp ảnh'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={uploading}
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileUpload(f);
                    }}
                  />
                </label>
              </div>
              {uploadError && (
                <p className="text-xs font-semibold text-rose-600">{uploadError}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
