import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  HardDrive,
  Plus,
  Trash2,
} from 'lucide-react';
import type {
  CmsSnapshot,
  CustomLandingSection,
  StandardSectionKey,
} from '../../types';
import { MediaFrame } from '../MediaFrame';
import { MediaPickerModal } from './MediaPickerModal';

interface LandingContentSectionProps {
  draft: CmsSnapshot;
  onUpdateDraft: (updater: (prev: CmsSnapshot) => CmsSnapshot) => void;
  adminSessionToken: string;
  onNotify: (msg: string) => void;
}

const STANDARD_SECTIONS: Array<{
  key: StandardSectionKey;
  index: string;
  label: string;
  desc: string;
}> = [
  { key: 'khoa-hoc', index: '01', label: 'Khóa học & Học liệu AI', desc: 'Bộ lọc nhóm kỹ năng và lưới thẻ khóa học / học liệu' },
  { key: 'giang-vien', index: '02', label: 'Giới thiệu giảng viên và EDUNEXA', desc: 'Hồ sơ Thầy Trần Đông & các kênh chính thức' },
  { key: 'phan-hoi', index: '03', label: 'Cộng đồng & Phản hồi xác thực', desc: 'Chia sẻ học viên có nguồn thực tế và ảnh Drive' },
  { key: 'hoi-dap', index: '04', label: 'Câu hỏi thường gặp (FAQ)', desc: 'Danh sách giải đáp thắc mắc trước khi đăng ký' },
  { key: 'dang-ky', index: '05', label: 'Khu vực đăng ký cuối trang', desc: 'Biểu mẫu đăng ký trực tiếp, học phí và mã VietQR' },
];

type SubTab = 'hero' | 'sections' | 'instructor' | 'faqs' | 'proof';

export function LandingContentSection({
  draft,
  onUpdateDraft,
  adminSessionToken,
  onNotify,
}: LandingContentSectionProps) {
  const [subTab, setSubTab] = useState<SubTab>('hero');
  const [pickerTarget, setPickerTarget] = useState<{
    kind: 'instructor' | 'valueImage' | 'customSection' | 'artifact' | 'testimonialAvatar' | 'testimonialProduct';
    id?: string;
  } | null>(null);

  const handlePickedImage = (url: string) => {
    if (!pickerTarget) return;
    if (pickerTarget.kind === 'instructor') {
      onUpdateDraft((prev) => ({
        ...prev,
        instructor: { ...prev.instructor, portraitUrl: url },
        siteMedia: { ...prev.siteMedia, founderPortrait: url },
      }));
    } else if (pickerTarget.kind === 'valueImage') {
      onUpdateDraft((prev) => ({
        ...prev,
        siteMedia: { ...prev.siteMedia, valueSectionImage: url },
      }));
    } else if (pickerTarget.kind === 'customSection' && pickerTarget.id) {
      onUpdateDraft((prev) => ({
        ...prev,
        customSections: prev.customSections.map((s) =>
          s.id === pickerTarget.id ? { ...s, imageUrl: url } : s
        ),
      }));
    } else if (pickerTarget.kind === 'artifact' && pickerTarget.id) {
      onUpdateDraft((prev) => ({
        ...prev,
        artifacts: prev.artifacts.map((a) =>
          a.id === pickerTarget.id ? { ...a, image: url } : a
        ),
      }));
    } else if (pickerTarget.kind === 'testimonialAvatar' && pickerTarget.id) {
      onUpdateDraft((prev) => ({
        ...prev,
        testimonials: prev.testimonials.map((t) =>
          t.id === pickerTarget.id ? { ...t, avatar: url } : t
        ),
      }));
    } else if (pickerTarget.kind === 'testimonialProduct' && pickerTarget.id) {
      onUpdateDraft((prev) => ({
        ...prev,
        testimonials: prev.testimonials.map((t) =>
          t.id === pickerTarget.id ? { ...t, productImage: url } : t
        ),
      }));
    }
    setPickerTarget(null);
  };

  const addCustomSection = () => {
    const next: CustomLandingSection = {
      id: `custom-${Date.now()}`,
      kicker: 'Thông báo nổi bật',
      title: 'Tiêu đề nội dung mới trên trang chủ',
      body: 'Nhập nội dung giới thiệu, lịch tập huấn hoặc chương trình ưu đãi mới của EDUNEXA.',
      ctaLabel: 'Đăng ký ngay',
      ctaUrl: draft.settings.registrationFormUrl,
      visible: true,
      theme: 'light',
    };
    onUpdateDraft((prev) => ({
      ...prev,
      customSections: [...prev.customSections, next],
    }));
    onNotify('Đã thêm một section mới vào bản nháp Landing Page.');
  };

  const addFaq = () => {
    onUpdateDraft((prev) => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        {
          id: `faq-${Date.now()}`,
          q: 'Câu hỏi thường gặp mới?',
          a: 'Nhập câu trả lời rõ ràng và thực tế cho giáo viên.',
        },
      ],
    }));
    onNotify('Đã thêm câu hỏi thường gặp mới.');
  };

  const moveFaq = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= draft.faqs.length) return;
    onUpdateDraft((prev) => {
      const next = [...prev.faqs];
      [next[idx], next[target]] = [next[target], next[idx]];
      return { ...prev, faqs: next };
    });
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 flex flex-wrap gap-1.5">
        {[
          { id: 'hero' as const, label: 'Hero & Nút CTA' },
          { id: 'sections' as const, label: 'Thêm / Ẩn Section' },
          { id: 'instructor' as const, label: 'Giới thiệu giảng viên' },
          { id: 'faqs' as const, label: `Câu hỏi thường gặp (${draft.faqs.length})` },
          { id: 'proof' as const, label: `Học liệu khóa học & Phản hồi (${draft.testimonials.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSubTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors whitespace-nowrap ${
              subTab === tab.id
                ? 'bg-[#081426] text-white'
                : 'text-slate-600 hover:bg-[#F7F9FC] hover:text-[#081426]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: HERO & CTAs */}
      {subTab === 'hero' && (
        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-lg font-extrabold text-[#081426]">
              Nội dung Hero & Nút hành động (CTA)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chỉnh tiêu đề chính, mô tả, hai nút CTA và các dòng điểm nổi bật đầu trang.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dòng giới thiệu phía trên tiêu đề (Kicker)
              </label>
              <input
                type="text"
                value={draft.heroContent.kicker}
                onChange={(e) =>
                  onUpdateDraft((prev) => ({
                    ...prev,
                    heroContent: { ...prev.heroContent, kicker: e.target.value },
                  }))
                }
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tiêu đề Hero — Dòng 1 (Chữ trắng)
                </label>
                <input
                  type="text"
                  value={draft.heroContent.headlineLine1}
                  onChange={(e) =>
                    onUpdateDraft((prev) => ({
                      ...prev,
                      heroContent: { ...prev.heroContent, headlineLine1: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-[#081426]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tiêu đề Hero — Dòng 2 (Chữ vàng thương hiệu)
                </label>
                <input
                  type="text"
                  value={draft.heroContent.headlineLine2}
                  onChange={(e) =>
                    onUpdateDraft((prev) => ({
                      ...prev,
                      heroContent: { ...prev.heroContent, headlineLine2: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-[#081426]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mô tả Hero
              </label>
              <textarea
                rows={3}
                value={draft.heroContent.description}
                onChange={(e) =>
                  onUpdateDraft((prev) => ({
                    ...prev,
                    heroContent: { ...prev.heroContent, description: e.target.value },
                  }))
                }
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nhãn CTA chính (cuộn tới Khóa học)
                </label>
                <input
                  type="text"
                  value={draft.heroContent.primaryCtaLabel}
                  onChange={(e) =>
                    onUpdateDraft((prev) => ({
                      ...prev,
                      heroContent: { ...prev.heroContent, primaryCtaLabel: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-[#081426]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nhãn CTA phụ (cuộn tới Đăng ký & Tư vấn)
                </label>
                <input
                  type="text"
                  value={draft.heroContent.secondaryCtaLabel}
                  onChange={(e) =>
                    onUpdateDraft((prev) => ({
                      ...prev,
                      heroContent: { ...prev.heroContent, secondaryCtaLabel: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-[#081426]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Các điểm cam kết dưới CTA (mỗi dòng 1 ý)
              </label>
              <textarea
                rows={3}
                value={draft.heroContent.trustPoints.join('\n')}
                onChange={(e) =>
                  onUpdateDraft((prev) => ({
                    ...prev,
                    heroContent: {
                      ...prev.heroContent,
                      trustPoints: e.target.value.split('\n').filter((line) => line.trim()),
                    },
                  }))
                }
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
              />
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: SHOW / HIDE & ADD CUSTOM SECTIONS */}
      {subTab === 'sections' && (
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-lg font-extrabold text-[#081426]">
                Bật / Ẩn từng Section trên Landing Page
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Kiểm soát hiển thị các phần nội dung từ 01 đến 05 trên trang chủ công khai.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {STANDARD_SECTIONS.map((sec) => {
                const isVisible = draft.sectionVisibility[sec.key] !== false;
                return (
                  <div
                    key={sec.key}
                    className="py-3.5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm font-bold text-[#081426]">
                        <span className="text-[#0D9488] font-mono mr-2">{sec.index}</span>
                        {sec.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{sec.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateDraft((prev) => ({
                          ...prev,
                          sectionVisibility: {
                            ...prev.sectionVisibility,
                            [sec.key]: !isVisible,
                          },
                        }))
                      }
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer shrink-0 ${
                        isVisible
                          ? 'bg-[#081426] text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isVisible ? <Eye className="w-3.5 h-3.5 text-[#16B8A6]" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{isVisible ? 'Đang hiển thị' : 'Đang ẩn'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-extrabold text-[#081426]">
                  Section nội dung tùy chỉnh ({draft.customSections.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Thêm khối thông báo, lịch khai giảng hoặc chương trình tập huấn mới hiển thị ngay trên Landing Page.
                </p>
              </div>
              <button
                type="button"
                onClick={addCustomSection}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#081426] text-white text-xs font-bold cursor-pointer shrink-0 w-fit"
              >
                <Plus className="w-4 h-4 text-[#F5BF35]" />
                <span>Thêm section mới</span>
              </button>
            </div>

            {draft.customSections.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">
                Chưa có section tùy chỉnh nào. Nhấn "Thêm section mới" nếu muốn bổ sung khối nội dung riêng trên trang chủ.
              </p>
            ) : (
              <div className="space-y-4">
                {draft.customSections.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-4 rounded-xl bg-[#F7F9FC] border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-[#0D9488]">
                        Section tùy chỉnh · {sec.visible ? 'Đang hiện' : 'Đang ẩn'}
                      </span>
                      <div className="flex items-center gap-2">
                        <select
                          value={sec.theme}
                          onChange={(e) =>
                            onUpdateDraft((prev) => ({
                              ...prev,
                              customSections: prev.customSections.map((s) =>
                                s.id === sec.id
                                  ? { ...s, theme: e.target.value as 'white' | 'light' | 'navy' }
                                  : s
                              ),
                            }))
                          }
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-[#081426]"
                        >
                          <option value="white">Nền trắng</option>
                          <option value="light">Nền sáng (#F7F9FC)</option>
                          <option value="navy">Nền Navy (#081426)</option>
                        </select>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateDraft((prev) => ({
                              ...prev,
                              customSections: prev.customSections.map((s) =>
                                s.id === sec.id ? { ...s, visible: !s.visible } : s
                              ),
                            }))
                          }
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-[#081426] cursor-pointer"
                        >
                          {sec.visible ? 'Ẩn' : 'Hiện'}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateDraft((prev) => ({
                              ...prev,
                              customSections: prev.customSections.filter((s) => s.id !== sec.id),
                            }))
                          }
                          className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                          aria-label="Xóa section tùy chỉnh"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={sec.kicker}
                        onChange={(e) =>
                          onUpdateDraft((prev) => ({
                            ...prev,
                            customSections: prev.customSections.map((s) =>
                              s.id === sec.id ? { ...s, kicker: e.target.value } : s
                            ),
                          }))
                        }
                        placeholder="Nhãn dẫn (kicker)"
                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-[#081426]"
                      />
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) =>
                          onUpdateDraft((prev) => ({
                            ...prev,
                            customSections: prev.customSections.map((s) =>
                              s.id === sec.id ? { ...s, title: e.target.value } : s
                            ),
                          }))
                        }
                        placeholder="Tiêu đề section"
                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-[#081426]"
                      />
                    </div>

                    <textarea
                      rows={2}
                      value={sec.body}
                      onChange={(e) =>
                        onUpdateDraft((prev) => ({
                          ...prev,
                          customSections: prev.customSections.map((s) =>
                            s.id === sec.id ? { ...s, body: e.target.value } : s
                          ),
                        }))
                      }
                      placeholder="Nội dung chi tiết..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-[#081426]"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                      <input
                        type="text"
                        value={sec.ctaLabel || ''}
                        onChange={(e) =>
                          onUpdateDraft((prev) => ({
                            ...prev,
                            customSections: prev.customSections.map((s) =>
                              s.id === sec.id ? { ...s, ctaLabel: e.target.value } : s
                            ),
                          }))
                        }
                        placeholder="Nhãn nút CTA (tùy chọn)"
                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-[#081426]"
                      />
                      <input
                        type="text"
                        value={sec.ctaUrl || ''}
                        onChange={(e) =>
                          onUpdateDraft((prev) => ({
                            ...prev,
                            customSections: prev.customSections.map((s) =>
                              s.id === sec.id ? { ...s, ctaUrl: e.target.value } : s
                            ),
                          }))
                        }
                        placeholder="Liên kết nút CTA"
                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-[#081426]"
                      />
                      <button
                        type="button"
                        onClick={() => setPickerTarget({ kind: 'customSection', id: sec.id })}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#081426] text-white text-xs font-bold cursor-pointer"
                      >
                        <HardDrive className="w-3.5 h-3.5 text-[#F5BF35]" />
                        <span>{sec.imageUrl ? 'Đổi ảnh minh họa' : 'Chọn ảnh minh họa'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* TAB 3: INSTRUCTOR & VALUE SECTION MEDIA */}
      {subTab === 'instructor' && (
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-lg font-extrabold text-[#081426]">
                Nội dung giới thiệu giảng viên & EDUNEXA (Mục 02)
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4 space-y-3">
                <MediaFrame
                  src={draft.instructor.portraitUrl || draft.siteMedia.founderPortrait}
                  alt={draft.instructor.name}
                  className="aspect-[4/5] w-full rounded-xl border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setPickerTarget({ kind: 'instructor' })}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#081426] text-white text-xs font-bold cursor-pointer"
                >
                  <HardDrive className="w-3.5 h-3.5 text-[#F5BF35]" />
                  <span>Đổi ảnh giảng viên từ Drive</span>
                </button>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Họ tên giảng viên
                    </label>
                    <input
                      type="text"
                      value={draft.instructor.name}
                      onChange={(e) =>
                        onUpdateDraft((prev) => ({
                          ...prev,
                          instructor: { ...prev.instructor, name: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Chức danh / Vai trò
                    </label>
                    <input
                      type="text"
                      value={draft.instructor.roleLine}
                      onChange={(e) =>
                        onUpdateDraft((prev) => ({
                          ...prev,
                          instructor: { ...prev.instructor, roleLine: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tiêu đề mục Giới thiệu giảng viên
                  </label>
                  <input
                    type="text"
                    value={draft.instructor.heading}
                    onChange={(e) =>
                      onUpdateDraft((prev) => ({
                        ...prev,
                        instructor: { ...prev.instructor, heading: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-bold text-[#081426]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Đoạn giới thiệu 1
                  </label>
                  <textarea
                    rows={3}
                    value={draft.instructor.bioParagraph1}
                    onChange={(e) =>
                      onUpdateDraft((prev) => ({
                        ...prev,
                        instructor: { ...prev.instructor, bioParagraph1: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Đoạn giới thiệu 2
                  </label>
                  <textarea
                    rows={3}
                    value={draft.instructor.bioParagraph2}
                    onChange={(e) =>
                      onUpdateDraft((prev) => ({
                        ...prev,
                        instructor: { ...prev.instructor, bioParagraph2: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Câu trích dẫn triết lý đào tạo
                  </label>
                  <textarea
                    rows={2}
                    value={draft.instructor.quote}
                    onChange={(e) =>
                      onUpdateDraft((prev) => ({
                        ...prev,
                        instructor: { ...prev.instructor, quote: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm italic text-[#081426]"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* TAB 4: FAQs */}
      {subTab === 'faqs' && (
        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-extrabold text-[#081426]">
                Câu hỏi thường gặp ({draft.faqs.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Thêm, chỉnh sửa, sắp xếp thứ tự hoặc xóa câu hỏi hiển thị tại mục 09 trên Landing Page.
              </p>
            </div>
            <button
              type="button"
              onClick={addFaq}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#081426] text-white text-xs font-bold cursor-pointer shrink-0 w-fit"
            >
              <Plus className="w-4 h-4 text-[#F5BF35]" />
              <span>Thêm câu hỏi</span>
            </button>
          </div>

          <div className="space-y-4">
            {draft.faqs.map((faq, idx) => (
              <div
                key={faq.id}
                className="p-4 rounded-xl bg-[#F7F9FC] border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-[#0D9488] tabular-nums">
                    Câu hỏi #{idx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveFaq(idx, -1)}
                      disabled={idx === 0}
                      className="p-1.5 rounded bg-white border border-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveFaq(idx, 1)}
                      disabled={idx === draft.faqs.length - 1}
                      className="p-1.5 rounded bg-white border border-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateDraft((prev) => ({
                          ...prev,
                          faqs: prev.faqs.filter((f) => f.id !== faq.id),
                        }))
                      }
                      className="p-1.5 rounded bg-white border border-slate-200 text-slate-400 hover:text-rose-600 cursor-pointer"
                      aria-label="Xóa câu hỏi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={faq.q}
                  onChange={(e) =>
                    onUpdateDraft((prev) => ({
                      ...prev,
                      faqs: prev.faqs.map((f) =>
                        f.id === faq.id ? { ...f, q: e.target.value } : f
                      ),
                    }))
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-[#081426]"
                />
                <textarea
                  rows={2}
                  value={faq.a}
                  onChange={(e) =>
                    onUpdateDraft((prev) => ({
                      ...prev,
                      faqs: prev.faqs.map((f) =>
                        f.id === faq.id ? { ...f, a: e.target.value } : f
                      ),
                    }))
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-[#081426]"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 5: ARTIFACTS & TESTIMONIALS */}
      {subTab === 'proof' && (
        <div className="space-y-6">
          {/* Student Artifacts */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-lg font-extrabold text-[#081426]">
                Sản phẩm thực hành (Mục 04)
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {draft.artifacts.map((art) => (
                <div
                  key={art.id}
                  className="p-4 rounded-xl bg-[#F7F9FC] border border-slate-200 space-y-3"
                >
                  <MediaFrame
                    src={art.image}
                    alt={art.title}
                    className="aspect-[16/10] w-full rounded-lg border border-slate-200"
                  />
                  <input
                    type="text"
                    value={art.title}
                    onChange={(e) =>
                      onUpdateDraft((prev) => ({
                        ...prev,
                        artifacts: prev.artifacts.map((a) =>
                          a.id === art.id ? { ...a, title: e.target.value } : a
                        ),
                      }))
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#081426]"
                  />
                  <textarea
                    rows={2}
                    value={art.description}
                    onChange={(e) =>
                      onUpdateDraft((prev) => ({
                        ...prev,
                        artifacts: prev.artifacts.map((a) =>
                          a.id === art.id ? { ...a, description: e.target.value } : a
                        ),
                      }))
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-[#081426]"
                  />
                  <button
                    type="button"
                    onClick={() => setPickerTarget({ kind: 'artifact', id: art.id })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#081426] text-white text-xs font-semibold cursor-pointer"
                  >
                    <HardDrive className="w-3.5 h-3.5 text-[#F5BF35]" />
                    <span>Chọn ảnh từ Drive</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <h2 className="text-lg font-extrabold text-[#081426]">
                Phản hồi học viên có nguồn thực tế (Mục 08)
              </h2>
              <button
                type="button"
                onClick={() => {
                  onUpdateDraft((prev) => ({
                    ...prev,
                    testimonials: [
                      ...prev.testimonials,
                      {
                        id: `fb-${Date.now()}`,
                        name: 'Giáo viên học viên',
                        role: 'Giáo viên THPT',
                        quote: 'Chia sẻ thực tế sau khi thực hành khóa học EDUNEXA.',
                        sourceLabel: 'Chia sẻ từ Cộng đồng Giáo viên AI EDUNEXA',
                        sourceUrl: prev.settings.facebookCommunityUrl,
                        avatar: prev.siteMedia.founderPortrait,
                        productImage: prev.siteMedia.valueSectionImage,
                        productCaption: 'Học liệu thực hành',
                      },
                    ],
                  }));
                  onNotify('Đã thêm phản hồi mới vào bản nháp.');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#081426] text-white text-xs font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#F5BF35]" />
                <span>Thêm phản hồi</span>
              </button>
            </div>

            <div className="space-y-4">
              {draft.testimonials.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl bg-[#F7F9FC] border border-slate-200 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <MediaFrame
                        src={t.avatar}
                        alt={t.name}
                        className="w-10 h-10 rounded-full border border-slate-200 shrink-0"
                      />
                      <div className="flex flex-wrap gap-2">
                        <input
                          type="text"
                          value={t.name}
                          onChange={(e) =>
                            onUpdateDraft((prev) => ({
                              ...prev,
                              testimonials: prev.testimonials.map((x) =>
                                x.id === t.id ? { ...x, name: e.target.value } : x
                              ),
                            }))
                          }
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#081426]"
                        />
                        <input
                          type="text"
                          value={t.role}
                          onChange={(e) =>
                            onUpdateDraft((prev) => ({
                              ...prev,
                              testimonials: prev.testimonials.map((x) =>
                                x.id === t.id ? { ...x, role: e.target.value } : x
                              ),
                            }))
                          }
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-[#081426]"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateDraft((prev) => ({
                          ...prev,
                          testimonials: prev.testimonials.filter((x) => x.id !== t.id),
                        }))
                      }
                      className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={t.quote}
                    onChange={(e) =>
                      onUpdateDraft((prev) => ({
                        ...prev,
                        testimonials: prev.testimonials.map((x) =>
                          x.id === t.id ? { ...x, quote: e.target.value } : x
                        ),
                      }))
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-[#081426]"
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPickerTarget({ kind: 'testimonialAvatar', id: t.id })}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-[#081426] cursor-pointer"
                    >
                      Đổi ảnh đại diện
                    </button>
                    <button
                      type="button"
                      onClick={() => setPickerTarget({ kind: 'testimonialProduct', id: t.id })}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-[#081426] cursor-pointer"
                    >
                      Đổi ảnh sản phẩm
                    </button>
                    <input
                      type="text"
                      value={t.sourceLabel}
                      onChange={(e) =>
                        onUpdateDraft((prev) => ({
                          ...prev,
                          testimonials: prev.testimonials.map((x) =>
                            x.id === t.id ? { ...x, sourceLabel: e.target.value } : x
                          ),
                        }))
                      }
                      placeholder="Nguồn phản hồi"
                      className="flex-1 min-w-[200px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-[#081426]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      <MediaPickerModal
        isOpen={Boolean(pickerTarget)}
        onClose={() => setPickerTarget(null)}
        onSelect={handlePickedImage}
        adminSessionToken={adminSessionToken}
        defaultCategory={
          pickerTarget?.kind === 'instructor' ? 'ANH_GIANG_VIEN' : 'THU_VIEN_ANH'
        }
      />
    </div>
  );
}
