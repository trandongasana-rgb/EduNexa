import React, { useCallback, useEffect, useState } from 'react';
import {
  Check,
  Eye,
  EyeOff,
  GripVertical,
  Image as ImageIcon,
  Layers,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type {
  Course,
  DriveCategory,
  PublicationStatus,
  SyncedMediaAsset,
} from '../../types';
import {
  deleteMediaAssetApi,
  fetchAdminMediaAssets,
  reorderMediaAssetsApi,
  setMediaAsBannerApi,
  updateMediaAssetApi,
  uploadMediaAssetApi,
} from '../../services/driveApi';
import { MediaFrame } from '../MediaFrame';

interface MediaLibrarySectionProps {
  adminSessionToken: string;
  courses: Course[];
  onRefreshAll: () => Promise<void>;
  onNotify: (msg: string) => void;
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

const STATUS_META: Record<PublicationStatus, { label: string; colorClass: string }> = {
  published: { label: 'Đã xuất bản', colorClass: 'text-[#0D9488]' },
  pending: { label: 'Chờ duyệt', colorClass: 'text-amber-700' },
  unpublished: { label: 'Đang ẩn', colorClass: 'text-slate-500' },
  archived: { label: 'Bỏ sử dụng', colorClass: 'text-slate-400' },
  deleted_in_drive: { label: 'Đã xóa trên Drive', colorClass: 'text-rose-600' },
  error: { label: 'Lỗi xử lý', colorClass: 'text-rose-600' },
};

function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 KB';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function MediaLibrarySection({
  adminSessionToken,
  courses,
  onRefreshAll,
  onNotify,
}: MediaLibrarySectionProps) {
  const [items, setItems] = useState<SyncedMediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [uploadCategory, setUploadCategory] = useState<DriveCategory>('THU_VIEN_ANH');
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Drag-and-drop state
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Lightbox preview & edit modal
  const [previewItem, setPreviewItem] = useState<SyncedMediaAsset | null>(null);
  const [editingItem, setEditingItem] = useState<SyncedMediaAsset | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAlt, setEditAlt] = useState('');
  const [editCategory, setEditCategory] = useState<DriveCategory>('THU_VIEN_ANH');
  const [editCourseId, setEditCourseId] = useState('');
  const [editStatus, setEditStatus] = useState<PublicationStatus>('published');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAdminMediaAssets(adminSessionToken);
      setItems(res.items);
      setErrorMsg(null);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể tải thư viện hình ảnh.');
    } finally {
      setLoading(false);
    }
  }, [adminSessionToken]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const openEditor = (asset: SyncedMediaAsset) => {
    setEditingItem(asset);
    setEditTitle(asset.title);
    setEditAlt(asset.altText);
    setEditCategory(asset.category);
    setEditCourseId(asset.courseId || '');
    setEditStatus(asset.publicationStatus);
  };

  const handleSaveEditor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (editCategory === 'ANH_KHOA_HOC' && editStatus === 'published' && !editCourseId) {
      setErrorMsg('Vui lòng chọn khóa học tương ứng trước khi xuất bản ảnh thuộc nhóm Ảnh Khóa Học.');
      return;
    }
    setSavingId(editingItem.id);
    setErrorMsg(null);
    try {
      await updateMediaAssetApi(adminSessionToken, editingItem.id, {
        title: editTitle.trim() || editingItem.filename,
        altText: editAlt.trim() || editTitle.trim() || editingItem.filename,
        category: editCategory,
        courseId: editCategory === 'ANH_KHOA_HOC' ? editCourseId || null : null,
        publicationStatus: editStatus,
      });
      setEditingItem(null);
      await loadMedia();
      await onRefreshAll();
      onNotify('Đã lưu thông tin hình ảnh và cập nhật website.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Lưu thay đổi thất bại.');
    } finally {
      setSavingId(null);
    }
  };

  const handleQuickStatus = async (asset: SyncedMediaAsset, nextStatus: PublicationStatus) => {
    if (asset.category === 'ANH_KHOA_HOC' && nextStatus === 'published' && !asset.courseId) {
      openEditor(asset);
      setErrorMsg('Ảnh thuộc nhóm Ảnh Khóa Học cần chọn đúng khóa học trước khi phê duyệt xuất bản.');
      return;
    }
    setSavingId(asset.id);
    setErrorMsg(null);
    try {
      await updateMediaAssetApi(adminSessionToken, asset.id, {
        publicationStatus: nextStatus,
      });
      await loadMedia();
      await onRefreshAll();
      const label = STATUS_META[nextStatus]?.label || nextStatus;
      onNotify(`Đã chuyển "${asset.title}" sang trạng thái: ${label}.`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể đổi trạng thái ảnh.');
    } finally {
      setSavingId(null);
    }
  };

  const handleOneClickBanner = async (asset: SyncedMediaAsset) => {
    setSavingId(asset.id);
    setErrorMsg(null);
    try {
      await setMediaAsBannerApi(adminSessionToken, asset.id, true);
      await loadMedia();
      await onRefreshAll();
      onNotify(`Đã đổi Banner Hero chính sang ảnh "${asset.title}" và xuất bản ngay.`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể đặt ảnh làm Banner Hero.');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setSavingId(id);
    setErrorMsg(null);
    try {
      await deleteMediaAssetApi(adminSessionToken, id);
      setConfirmDeleteId(null);
      await loadMedia();
      await onRefreshAll();
      onNotify('Đã gỡ bỏ hình ảnh khỏi thư viện máy chủ.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể xóa ảnh.');
    } finally {
      setSavingId(null);
    }
  };

  const handleUploadFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setErrorMsg(null);
    let uploadedCount = 0;
    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            typeof reader.result === 'string'
              ? resolve(reader.result)
              : reject(new Error('Không đọc được ảnh.'));
          reader.onerror = () => reject(new Error('Lỗi đọc file ảnh.'));
          reader.readAsDataURL(file);
        });
        await uploadMediaAssetApi(adminSessionToken, {
          dataUrl,
          filename: file.name,
          category: uploadCategory,
          autoPublish: uploadCategory !== 'CHO_DUYET' && uploadCategory !== 'ANH_KHOA_HOC',
        });
        uploadedCount++;
      }
      await loadMedia();
      await onRefreshAll();
      onNotify(`Đã tải lên và tối ưu WebP thành công ${uploadedCount} ảnh.`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Lỗi khi tải ảnh lên.');
    } finally {
      setUploading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && item.publicationStatus !== statusFilter) return false;
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

  const handleDropReorder = async (targetId: string) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }
    const nextList = [...items];
    const fromIdx = nextList.findIndex((i) => i.id === draggedId);
    const toIdx = nextList.findIndex((i) => i.id === targetId);
    if (fromIdx === -1 || toIdx === -1) {
      setDraggedId(null);
      return;
    }
    const [moved] = nextList.splice(fromIdx, 1);
    nextList.splice(toIdx, 0, moved);
    setItems(nextList);
    setDraggedId(null);

    try {
      await reorderMediaAssetsApi(
        adminSessionToken,
        nextList.map((i) => i.id)
      );
      await onRefreshAll();
      onNotify('Đã lưu thứ tự sắp xếp hình ảnh vào cơ sở dữ liệu.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể lưu thứ tự sắp xếp.');
      await loadMedia();
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar: Search, Filters, Upload */}
      <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-extrabold text-[#081426]">
              Thư viện hình ảnh ({filteredItems.length}/{items.length})
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Quản lý toàn bộ ảnh đồng bộ từ Google Drive và ảnh tải lên máy chủ. Kéo thả thẻ ảnh để sắp xếp thứ tự hiển thị.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value as DriveCategory)}
              aria-label="Chọn thư mục đích khi tải ảnh"
              className="px-3 py-2 bg-[#F7F9FC] border border-slate-200 rounded-xl text-xs font-semibold text-[#081426]"
            >
              {(Object.keys(CATEGORY_LABELS) as DriveCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  Tải vào: {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
            <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#081426] hover:bg-[#102644] text-white text-xs font-bold cursor-pointer whitespace-nowrap">
              <Upload className="w-3.5 h-3.5 text-[#F5BF35]" />
              <span>{uploading ? 'Đang tải & nén WebP...' : 'Tải ảnh lên máy chủ'}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                disabled={uploading}
                className="hidden"
                onChange={(e) => handleUploadFiles(e.target.files)}
              />
            </label>
          </div>
        </div>

        {/* Search & Filter Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên file, tiêu đề hoặc alt text..."
              className="w-full pl-9 pr-3.5 py-2 bg-[#F7F9FC] border border-slate-200 rounded-xl text-sm text-[#081426] focus:outline-none focus:border-[#081426]"
            />
          </div>

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
            <option value="published">Đã xuất bản</option>
            <option value="pending">Chờ duyệt</option>
            <option value="unpublished">Đang ẩn</option>
            <option value="archived">Bỏ sử dụng</option>
            <option value="deleted_in_drive">Đã xóa trên Drive</option>
          </select>

          <button
            type="button"
            onClick={loadMedia}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#081426] text-xs font-semibold text-[#081426] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Làm mới</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {errorMsg}
          </div>
        )}
      </section>

      {/* Grid Gallery */}
      {loading ? (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-sm text-slate-500">
          Đang tải dữ liệu hình ảnh từ máy chủ...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
          <ImageIcon className="w-9 h-9 text-slate-400 mx-auto" />
          <p className="text-base font-bold text-[#081426]">
            Chưa có hình ảnh nào phù hợp bộ lọc
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Bạn có thể tải ảnh trực tiếp bằng nút "Tải ảnh lên máy chủ" ở trên hoặc kết nối và đồng bộ thư mục tại mục 04. Google Drive.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredItems.map((asset) => {
            const st = STATUS_META[asset.publicationStatus] || STATUS_META.pending;
            const isSaving = savingId === asset.id;
            const isDriveSource = !asset.driveFileId.startsWith('upload_');
            const courseObj = asset.courseId
              ? courses.find((c) => c.id === asset.courseId)
              : undefined;

            return (
              <article
                key={asset.id}
                draggable
                onDragStart={() => setDraggedId(asset.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDropReorder(asset.id)}
                className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col ${
                  draggedId === asset.id
                    ? 'border-[#F5BF35] opacity-60'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Preview Surface */}
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => setPreviewItem(asset)}
                    className="block w-full cursor-pointer text-left"
                    title="Nhấn để xem trước kích thước đầy đủ"
                  >
                    <MediaFrame
                      src={asset.thumbnailUrl || asset.publicUrl}
                      fallbackSrc={asset.publicUrl}
                      alt={asset.altText}
                      className="aspect-[16/10] w-full"
                    />
                  </button>
                  <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-lg bg-[#081426]/80 text-white text-[11px] font-semibold flex items-center gap-1 cursor-grab">
                    <GripVertical className="w-3.5 h-3.5 text-[#F5BF35]" />
                    <span>Kéo sắp xếp</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewItem(asset)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-[#081426]/80 text-white hover:bg-[#081426] cursor-pointer"
                    aria-label="Xem trước ảnh"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Metadata & Actions */}
                <div className="p-4 flex flex-col flex-grow space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className={`font-bold ${st.colorClass}`}>{st.label}</span>
                      <span className="text-slate-400 tabular-nums">
                        {asset.width}×{asset.height} · {formatFileSize(asset.fileSize)}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#081426] leading-snug line-clamp-1">
                      {asset.title}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                      {CATEGORY_LABELS[asset.category]} · {isDriveSource ? 'Google Drive' : 'Tải lên'}
                    </p>
                    {courseObj && (
                      <p className="text-[11px] font-semibold text-[#0D9488] truncate">
                        Khóa học: {courseObj.title}
                      </p>
                    )}
                  </div>

                  {/* Primary Action Row */}
                  <div className="pt-3 border-t border-slate-100 mt-auto space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleOneClickBanner(asset)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F5BF35] hover:bg-[#E2AB22] text-[#081426] text-xs font-bold cursor-pointer whitespace-nowrap disabled:opacity-50"
                        title="Đặt ảnh này làm Banner Hero chính bằng một thao tác"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Đặt làm Banner</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditor(asset)}
                        className="px-3 py-1.5 rounded-lg bg-[#F7F9FC] border border-slate-200 hover:border-[#081426] text-xs font-semibold text-[#081426] cursor-pointer"
                      >
                        Chỉnh sửa
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-1.5 text-xs">
                      <div className="flex items-center gap-1.5">
                        {asset.publicationStatus !== 'published' ? (
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => handleQuickStatus(asset, 'published')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-50 text-[#0D9488] hover:bg-teal-100 font-semibold cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Phê duyệt</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => handleQuickStatus(asset, 'unpublished')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Ẩn</span>
                          </button>
                        )}

                        {asset.publicationStatus !== 'archived' && (
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => handleQuickStatus(asset, 'archived')}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-slate-500 hover:bg-slate-100 font-medium cursor-pointer"
                          >
                            <Layers className="w-3.5 h-3.5" />
                            <span>Bỏ dùng</span>
                          </button>
                        )}
                      </div>

                      {confirmDeleteId === asset.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDelete(asset.id)}
                            className="px-2 py-1 rounded bg-rose-600 text-white font-bold cursor-pointer"
                          >
                            Xóa
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1 rounded bg-slate-100 text-slate-600 cursor-pointer"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(asset.id)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                          aria-label="Xóa ảnh khỏi thư viện"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Full-size Lightbox Preview Modal */}
      {previewItem && (
        <div
          className="fixed inset-0 z-[120] bg-[#081426]/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden border border-slate-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#081426] truncate">{previewItem.title}</p>
                <p className="text-xs text-slate-500 font-mono truncate">
                  {previewItem.filename} · {previewItem.width}×{previewItem.height} · {previewItem.publicUrl}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-[#081426] flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={previewItem.publicUrl}
                alt={previewItem.altText}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="px-5 py-3 bg-[#F7F9FC] flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-600">Alt: {previewItem.altText}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = previewItem;
                    setPreviewItem(null);
                    openEditor(target);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 font-semibold text-[#081426] cursor-pointer"
                >
                  Chỉnh sửa thông tin
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const target = previewItem;
                    setPreviewItem(null);
                    handleOneClickBanner(target);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#F5BF35] text-[#081426] font-bold cursor-pointer"
                >
                  Đặt làm Banner Hero
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Metadata Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[120] bg-[#081426]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-[#081426]">Chỉnh sửa hình ảnh</h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditor} className="space-y-4">
              <MediaFrame
                src={editingItem.thumbnailUrl || editingItem.publicUrl}
                alt={editingItem.altText}
                className="aspect-[16/9] w-full rounded-xl border border-slate-200"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tiêu đề hiển thị
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mô tả Alt Text (SEO & Trợ năng)
                </label>
                <input
                  type="text"
                  required
                  value={editAlt}
                  onChange={(e) => setEditAlt(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vị trí hiển thị trên website
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as DriveCategory)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
                  >
                    {(Object.keys(CATEGORY_LABELS) as DriveCategory[]).map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_LABELS[cat]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Trạng thái xuất bản
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as PublicationStatus)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
                  >
                    <option value="published">Đã xuất bản</option>
                    <option value="pending">Chờ duyệt</option>
                    <option value="unpublished">Đang ẩn</option>
                    <option value="archived">Bỏ sử dụng (Lưu trữ)</option>
                  </select>
                </div>
              </div>

              {editCategory === 'ANH_KHOA_HOC' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gán cho khóa học tương ứng
                  </label>
                  <select
                    value={editCourseId}
                    onChange={(e) => setEditCourseId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
                  >
                    <option value="">-- Chọn khóa học --</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={savingId === editingItem.id}
                  className="px-5 py-2 rounded-xl bg-[#081426] hover:bg-[#102644] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
