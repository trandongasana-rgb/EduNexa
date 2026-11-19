import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  HardDrive,
  Image as ImageIcon,
  Plus,
  Trash2,
  Video,
} from 'lucide-react';
import type { Course, HeroMediaItem } from '../../types';
import { VN_TEACHER_IMAGE_PRESETS } from '../../data/initialData';
import { MediaFrame } from '../MediaFrame';
import { MediaPickerModal } from './MediaPickerModal';

interface BannersManagerSectionProps {
  banners: HeroMediaItem[];
  onChangeBanners: (next: HeroMediaItem[]) => void;
  courses: Course[];
  adminSessionToken: string;
  onNotify: (msg: string) => void;
}

export function BannersManagerSection({
  banners,
  onChangeBanners,
  courses,
  adminSessionToken,
  onNotify,
}: BannersManagerSectionProps) {
  const [pickerBannerId, setPickerBannerId] = useState<string | null>(null);

  const updateBanner = (id: string, patch: Partial<HeroMediaItem>) => {
    onChangeBanners(banners.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const addBanner = () => {
    const created: HeroMediaItem = {
      id: `banner-${Date.now()}`,
      label: `Banner #${banners.length + 1}`,
      title: 'Học liệu AI thực chiến EDUNEXA',
      description: 'Mô tả ngắn gọn giá trị học liệu hiển thị bên phải Hero.',
      mediaType: 'image',
      mediaUrl: VN_TEACHER_IMAGE_PRESETS[0].url,
      relatedCourseId: courses[0]?.id,
      active: true,
    };
    onChangeBanners([...banners, created]);
    onNotify('Đã thêm banner mới vào bản nháp.');
  };

  const moveBanner = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= banners.length) return;
    const next = [...banners];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChangeBanners(next);
  };

  const removeBanner = (id: string) => {
    if (banners.length <= 1) return;
    onChangeBanners(banners.filter((b) => b.id !== id));
    onNotify('Đã xóa banner khỏi bản nháp.');
  };

  return (
    <div className="space-y-6">
      <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-extrabold text-[#081426]">
              Quản lý Banner Hero Showcase ({banners.length})
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Quản lý bộ ảnh hoặc video trình diễn sản phẩm thực tế bên phải khu vực Hero. Có thể chọn trực tiếp từ Thư viện Drive.
            </p>
          </div>

          <button
            type="button"
            onClick={addBanner}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#081426] hover:bg-[#102644] text-white text-xs font-bold cursor-pointer shrink-0 w-fit"
          >
            <Plus className="w-4 h-4 text-[#F5BF35]" />
            <span>Thêm banner mới</span>
          </button>
        </div>

        <div className="space-y-5">
          {banners.map((item, idx) => {
            const isActive = item.active !== false;
            return (
              <div
                key={item.id}
                className={`p-5 rounded-xl border space-y-4 ${
                  isActive ? 'bg-[#F7F9FC] border-slate-200' : 'bg-slate-50 border-slate-200 opacity-75'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-extrabold text-[#081426] tabular-nums">
                      Vị trí #{idx + 1}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className={isActive ? 'font-bold text-[#0D9488]' : 'font-semibold text-slate-500'}>
                      {isActive ? 'Đang hiển thị' : 'Đang ẩn'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => moveBanner(idx, -1)}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                      aria-label="Di chuyển lên"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBanner(idx, 1)}
                      disabled={idx === banners.length - 1}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                      aria-label="Di chuyển xuống"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <div className="inline-flex p-0.5 bg-white border border-slate-200 rounded-lg text-xs">
                      <button
                        type="button"
                        onClick={() => updateBanner(item.id, { mediaType: 'image' })}
                        className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer inline-flex items-center gap-1 ${
                          item.mediaType === 'image' ? 'bg-[#081426] text-white' : 'text-slate-600'
                        }`}
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>Ảnh</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => updateBanner(item.id, { mediaType: 'video' })}
                        className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer inline-flex items-center gap-1 ${
                          item.mediaType === 'video' ? 'bg-[#081426] text-white' : 'text-slate-600'
                        }`}
                      >
                        <Video className="w-3 h-3" />
                        <span>Video</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateBanner(item.id, { active: !isActive })}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-[#081426] cursor-pointer"
                    >
                      {isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-[#0D9488]" />}
                      <span>{isActive ? 'Ẩn' : 'Hiện'}</span>
                    </button>

                    {banners.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBanner(item.id)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 cursor-pointer"
                        aria-label="Xóa banner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-4 space-y-2">
                    <MediaFrame
                      src={item.mediaUrl}
                      alt={item.title}
                      mediaType={item.mediaType}
                      className="aspect-[16/10] w-full rounded-xl border border-slate-200"
                    />
                    {item.mediaType === 'image' && (
                      <button
                        type="button"
                        onClick={() => setPickerBannerId(item.id)}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#081426] hover:bg-[#102644] text-white text-xs font-bold cursor-pointer"
                      >
                        <HardDrive className="w-3.5 h-3.5 text-[#F5BF35]" />
                        <span>Đổi ảnh từ Thư viện Drive</span>
                      </button>
                    )}
                  </div>

                  <div className="md:col-span-8 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Nhãn nút tab
                        </label>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => updateBanner(item.id, { label: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-[#081426]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Liên kết khóa học (tùy chọn)
                        </label>
                        <select
                          value={item.relatedCourseId || ''}
                          onChange={(e) =>
                            updateBanner(item.id, { relatedCourseId: e.target.value || undefined })
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-[#081426]"
                        >
                          <option value="">Không gắn khóa học</option>
                          {courses.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tiêu đề hiển thị dưới ảnh
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateBanner(item.id, { title: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-[#081426]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mô tả ngắn
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateBanner(item.id, { description: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-[#081426]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {item.mediaType === 'video'
                          ? 'Đường dẫn Video YouTube hoặc MP4 trực tiếp'
                          : 'Đường dẫn hình ảnh'}
                      </label>
                      <input
                        type="text"
                        value={item.mediaUrl}
                        onChange={(e) => updateBanner(item.id, { mediaUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-[#081426]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <MediaPickerModal
        isOpen={Boolean(pickerBannerId)}
        onClose={() => setPickerBannerId(null)}
        onSelect={(url) => {
          if (pickerBannerId) {
            updateBanner(pickerBannerId, { mediaUrl: url, mediaType: 'image' });
          }
        }}
        adminSessionToken={adminSessionToken}
        defaultCategory="BANNER_HERO"
        title="Chọn ảnh Banner Hero từ Thư viện Drive"
      />
    </div>
  );
}
