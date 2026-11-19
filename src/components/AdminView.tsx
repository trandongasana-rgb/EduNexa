import React, { useState } from 'react';
import {
  BookOpen,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  Shield,
  Eye,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Upload,
  Check,
  RotateCcw,
  Video,
  HardDrive,
} from 'lucide-react';
import type {
  Course,
  CourseCategoryId,
  HeroMediaItem,
  SiteMediaConfig,
  SiteSettings,
  StudentArtifact,
  TestimonialItem,
} from '../types';
import {
  COURSE_CATEGORIES,
  EDUNEXA_LOGO,
  VN_TEACHER_IMAGE_PRESETS,
} from '../data/initialData';
import { changeAdminPasswordServer, loginAdminServer } from '../services/driveApi';
import { MediaFrame } from './MediaFrame';
import { DriveSyncPanel } from './DriveSyncPanel';

interface AdminViewProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  heroShowcase: HeroMediaItem[];
  setHeroShowcase: React.Dispatch<React.SetStateAction<HeroMediaItem[]>>;
  artifacts: StudentArtifact[];
  setArtifacts: React.Dispatch<React.SetStateAction<StudentArtifact[]>>;
  testimonials: TestimonialItem[];
  setTestimonials: React.Dispatch<React.SetStateAction<TestimonialItem[]>>;
  siteMedia: SiteMediaConfig;
  setSiteMedia: React.Dispatch<React.SetStateAction<SiteMediaConfig>>;
  settings: SiteSettings;
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  adminSessionToken: string;
  setAdminSessionToken: React.Dispatch<React.SetStateAction<string>>;
  onRefreshPublicMedia: () => Promise<void>;
  onResetAllDefaults: () => void;
  navigateTo: (page: string) => void;
}

type AdminTab = 'drive' | 'media' | 'courses' | 'testimonials' | 'settings' | 'security';

function readFileAsDataUrl(file: File, onLoaded: (url: string) => void) {
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      onLoaded(reader.result);
    }
  };
  reader.readAsDataURL(file);
}

interface ImagePickerFieldProps {
  label: string;
  value: string;
  onChange: (nextUrl: string) => void;
  showPresets?: boolean;
}

function ImagePickerField({
  label,
  value,
  onChange,
  showPresets = true,
}: ImagePickerFieldProps) {
  return (
    <div className="space-y-2.5">
      <label className="block text-xs font-semibold text-slate-700">{label}</label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Dán đường dẫn ảnh hoặc tải ảnh từ máy tính..."
          className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426] focus:outline-none focus:border-[#081426]"
        />
        <label className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F7F9FC] border border-slate-300 hover:border-[#081426] text-xs font-semibold text-[#081426] cursor-pointer whitespace-nowrap">
          <Upload className="w-3.5 h-3.5" />
          <span>Tải ảnh lên</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) readFileAsDataUrl(file, onChange);
            }}
          />
        </label>
      </div>

      {showPresets && (
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-1">
          {VN_TEACHER_IMAGE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(preset.url)}
              title={preset.label}
              className={`relative aspect-[16/10] rounded-lg overflow-hidden border transition-all cursor-pointer ${
                value === preset.url
                  ? 'border-[#F5BF35] ring-2 ring-[#F5BF35]'
                  : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              <img
                src={preset.url}
                alt={preset.label}
                className="w-full h-full object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminView({
  courses,
  setCourses,
  heroShowcase,
  setHeroShowcase,
  artifacts,
  setArtifacts,
  testimonials,
  setTestimonials,
  siteMedia,
  setSiteMedia,
  settings,
  setSettings,
  isAdmin,
  setIsAdmin,
  adminSessionToken,
  setAdminSessionToken,
  onRefreshPublicMedia,
  onResetAllDefaults,
  navigateTo,
}: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('drive');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Course editing state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [courseDraftImage, setCourseDraftImage] = useState('');
  const [courseDraftCategories, setCourseDraftCategories] = useState<
    Exclude<CourseCategoryId, 'ALL'>[]
  >(['SOAN_GIANG']);
  const [confirmDeleteCourseId, setConfirmDeleteCourseId] = useState<string | null>(null);

  // Testimonial editing state
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);

  // Security form state
  const [securityMsg, setSecurityMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(
    null
  );
  const [confirmReset, setConfirmReset] = useState(false);

  const flashNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await loginAdminServer(passwordInput);
      if (res.ok && res.sessionToken) {
        setAdminSessionToken(res.sessionToken);
        setIsAdmin(true);
        setPasswordInput('');
      } else {
        setLoginError('Mật khẩu chưa chính xác. Vui lòng thử lại.');
      }
    } catch (err) {
      setLoginError(
        err instanceof Error ? err.message : 'Mật khẩu chưa chính xác hoặc máy chủ chưa phản hồi.'
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const openCourseModal = (course: Course | null) => {
    if (course) {
      setEditingCourse(course);
      setIsAddingCourse(false);
      setCourseDraftImage(course.image);
      setCourseDraftCategories(
        course.categoryIds.length > 0 ? course.categoryIds : ['SOAN_GIANG']
      );
    } else {
      setEditingCourse(null);
      setIsAddingCourse(true);
      setCourseDraftImage(VN_TEACHER_IMAGE_PRESETS[0].url);
      setCourseDraftCategories(['SOAN_GIANG']);
    }
  };

  const handleSaveCourse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rawId = (editingCourse?.id || (formData.get('id') as string) || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-');
    const benefitsRaw = (formData.get('benefits') as string) || '';
    const benefitsList = benefitsRaw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedCourse: Course = {
      id: rawId || `khoa-hoc-${Date.now()}`,
      title: ((formData.get('title') as string) || '').trim(),
      subtitle: ((formData.get('subtitle') as string) || '').trim(),
      categoryIds:
        courseDraftCategories.length > 0 ? courseDraftCategories : ['SOAN_GIANG'],
      description: ((formData.get('description') as string) || '').trim(),
      fullDescription:
        editingCourse?.fullDescription ||
        ((formData.get('description') as string) || '').trim(),
      outcome: ((formData.get('outcome') as string) || '').trim(),
      image: courseDraftImage || VN_TEACHER_IMAGE_PRESETS[0].url,
      target: ((formData.get('target') as string) || '').trim(),
      price: ((formData.get('price') as string) || '').trim(),
      originalPrice: ((formData.get('originalPrice') as string) || '').trim(),
      registerUrl:
        ((formData.get('registerUrl') as string) || '').trim() ||
        settings.registrationFormUrl,
      registerLabel:
        ((formData.get('registerLabel') as string) || '').trim() || undefined,
      benefits:
        benefitsList.length > 0
          ? benefitsList
          : editingCourse?.benefits || ['Thực hành theo từng bước cụ thể'],
      pains: editingCourse?.pains || [
        'Cần quy trình ứng dụng AI rõ ràng vào công việc giảng dạy.',
      ],
      solutions: editingCourse?.solutions || [
        'Thực hành trực tiếp tạo sản phẩm học liệu số phục vụ lớp học.',
      ],
      curriculum: editingCourse?.curriculum || [
        { mod: 'Phần 01', title: 'Tổng quan & Quy trình thực hành' },
      ],
      gifts: editingCourse?.gifts || ['Tài liệu & bộ câu lệnh mẫu thực hành'],
      paymentInfo:
        ((formData.get('paymentInfo') as string) || '').trim() ||
        editingCourse?.paymentInfo ||
        'Techcombank (TCB) - STK: 88.3558.3558 - Chủ TK: CONG TY TNHH MTV GIAO DUC EDUNEXA',
    };

    if (isAddingCourse) {
      setCourses((prev) => [...prev, updatedCourse]);
      flashNotice('Đã thêm khóa học mới.');
    } else {
      setCourses((prev) =>
        prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
      );
      flashNotice('Đã cập nhật thông tin khóa học.');
    }
    setEditingCourse(null);
    setIsAddingCourse(false);
  };

  const handleHeroItemUpdate = (
    id: string,
    patch: Partial<HeroMediaItem>
  ) => {
    setHeroShowcase((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const handleAddHeroItem = () => {
    const nextItem: HeroMediaItem = {
      id: `hero-${Date.now()}`,
      label: 'Học liệu mới',
      title: 'Sản phẩm học liệu thực tế của EDUNEXA',
      description: 'Mô tả ngắn gọn công dụng của sản phẩm trong giảng dạy.',
      mediaType: 'image',
      mediaUrl: VN_TEACHER_IMAGE_PRESETS[0].url,
      relatedCourseId: courses[0]?.id,
    };
    setHeroShowcase((prev) => [...prev, nextItem]);
    flashNotice('Đã thêm mục trình diễn mới vào Hero.');
  };

  const handleDeleteHeroItem = (id: string) => {
    if (heroShowcase.length <= 1) return;
    setHeroShowcase((prev) => prev.filter((item) => item.id !== id));
    flashNotice('Đã xóa mục khỏi khu vực trình diễn Hero.');
  };

  const handleSaveTestimonial = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    if (isAddingTestimonial) {
      setTestimonials((prev) => [...prev, editingTestimonial]);
      flashNotice('Đã thêm phản hồi học viên.');
    } else {
      setTestimonials((prev) =>
        prev.map((t) => (t.id === editingTestimonial.id ? editingTestimonial : t))
      );
      flashNotice('Đã cập nhật phản hồi học viên.');
    }
    setEditingTestimonial(null);
    setIsAddingTestimonial(false);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F7F9FC] px-5 py-16">
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="px-5 py-3 bg-[#081426] rounded-xl border border-white/10">
              <img
                src={EDUNEXA_LOGO}
                alt="Logo EDUNEXA"
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-center text-[#081426] mb-2">
            Quản trị EDUNEXA AI
          </h1>
          <p className="text-center text-slate-500 text-sm mb-7">
            Đăng nhập để quản lý khóa học, thay toàn bộ hình ảnh/video Hero và cấu hình trang.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-login-pwd"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Mật khẩu quản trị
              </label>
              <input
                id="admin-login-pwd"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Nhập mật khẩu..."
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-[#081426] focus:outline-none focus:border-[#081426]"
              />
            </div>
            {loginError && (
              <p className="text-xs font-semibold text-rose-600">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-[#081426] hover:bg-[#102644] text-white font-bold text-sm rounded-xl transition-colors cursor-pointer disabled:opacity-60"
            >
              {loginLoading ? 'Đang xác thực...' : 'Đăng nhập quản trị'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="w-full mt-4 py-2 text-sm text-slate-500 hover:text-[#081426] cursor-pointer"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <p className="text-xs font-semibold text-[#0D9488] mb-1">
              Hệ thống quản trị nội dung · EDUNEXA
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#081426]">
              Quản lý khóa học, hình ảnh & chuyển đổi
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-[#081426] text-sm font-semibold text-[#081426] cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Xem trang chủ</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAdminSessionToken('');
                setIsAdmin(false);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-rose-300 text-sm font-semibold text-rose-600 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* Inline Status Notice */}
        {statusNotice && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-[#081426] text-white text-sm font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-[#16B8A6] shrink-0" />
            <span>{statusNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-2 space-y-1">
              {[
                { id: 'drive' as const, label: 'Kết nối Google Drive', icon: HardDrive },
                { id: 'media' as const, label: 'Hình ảnh & Hero Showcase', icon: ImageIcon },
                { id: 'courses' as const, label: `Khóa học (${courses.length})`, icon: BookOpen },
                { id: 'testimonials' as const, label: `Phản hồi (${testimonials.length})`, icon: MessageSquare },
                { id: 'settings' as const, label: 'Liên kết & Sticky Mobile', icon: Settings },
                { id: 'security' as const, label: 'Mật khẩu & Khôi phục', icon: Shield },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#081426] text-white'
                        : 'text-slate-600 hover:bg-[#F7F9FC] hover:text-[#081426]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Tab Content */}
          <div className="lg:col-span-9 space-y-8">
            {/* =======================================================
                TAB 0: GOOGLE DRIVE AUTO-SYNC & MEDIA PIPELINE
            ======================================================= */}
            {activeTab === 'drive' && (
              <DriveSyncPanel
                adminSessionToken={adminSessionToken}
                courses={courses}
                onMediaPublishedChange={onRefreshPublicMedia}
                onNotify={flashNotice}
              />
            )}

            {/* =======================================================
                TAB 1: MEDIA & HERO SHOWCASE (Thay toàn bộ ảnh & video)
            ======================================================= */}
            {activeTab === 'media' && (
              <div className="space-y-8">
                {/* 1A. Hero Showcase Media */}
                <section className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-lg font-extrabold text-[#081426]">
                        Khu vực trình diễn bên phải Hero (Ảnh hoặc Video)
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Thay ảnh bằng file tải lên, đường dẫn ảnh hoặc link video YouTube / MP4 do EduNexa cung cấp.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddHeroItem}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#081426] text-white text-xs font-bold cursor-pointer shrink-0 w-fit"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm mục trình diễn</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {heroShowcase.map((item, index) => (
                      <div
                        key={item.id}
                        className="p-5 rounded-xl bg-[#F7F9FC] border border-slate-200 space-y-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-bold text-[#0D9488] tabular-nums">
                            Mục #{index + 1} · {item.label}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="inline-flex p-0.5 bg-white border border-slate-200 rounded-lg text-xs">
                              <button
                                type="button"
                                onClick={() =>
                                  handleHeroItemUpdate(item.id, { mediaType: 'image' })
                                }
                                className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                                  item.mediaType === 'image'
                                    ? 'bg-[#081426] text-white'
                                    : 'text-slate-600'
                                }`}
                              >
                                Ảnh
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleHeroItemUpdate(item.id, { mediaType: 'video' })
                                }
                                className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer inline-flex items-center gap-1 ${
                                  item.mediaType === 'video'
                                    ? 'bg-[#081426] text-white'
                                    : 'text-slate-600'
                                }`}
                              >
                                <Video className="w-3 h-3" />
                                Video
                              </button>
                            </div>

                            {heroShowcase.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteHeroItem(item.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                                aria-label="Xóa mục Hero"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                          <div className="md:col-span-4">
                            <MediaFrame
                              src={item.mediaUrl}
                              alt={item.title}
                              mediaType={item.mediaType}
                              className="aspect-[16/10] w-full rounded-xl border border-slate-200"
                            />
                          </div>

                          <div className="md:col-span-8 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                  Tên nút chuyển tab
                                </label>
                                <input
                                  type="text"
                                  value={item.label}
                                  onChange={(e) =>
                                    handleHeroItemUpdate(item.id, { label: e.target.value })
                                  }
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-[#081426]"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                  Tiêu đề sản phẩm
                                </label>
                                <input
                                  type="text"
                                  value={item.title}
                                  onChange={(e) =>
                                    handleHeroItemUpdate(item.id, { title: e.target.value })
                                  }
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-[#081426]"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Mô tả ngắn
                              </label>
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) =>
                                  handleHeroItemUpdate(item.id, { description: e.target.value })
                                }
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-[#081426]"
                              />
                            </div>

                            {item.mediaType === 'video' ? (
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                  Link Video (YouTube hoặc file MP4 trực tiếp)
                                </label>
                                <input
                                  type="text"
                                  value={item.mediaUrl}
                                  onChange={(e) =>
                                    handleHeroItemUpdate(item.id, { mediaUrl: e.target.value })
                                  }
                                  placeholder="https://www.youtube.com/watch?v=... hoặc https://.../demo.mp4"
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-[#081426]"
                                />
                              </div>
                            ) : (
                              <ImagePickerField
                                label="Hình ảnh trình diễn"
                                value={item.mediaUrl}
                                onChange={(url) =>
                                  handleHeroItemUpdate(item.id, { mediaUrl: url })
                                }
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 1B. Site Section Photos (Value section & Founder portrait) */}
                <section className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 space-y-6">
                  <div className="pb-4 border-b border-slate-100">
                    <h2 className="text-lg font-extrabold text-[#081426]">
                      Hình ảnh mục Giá trị & Chân dung Giảng viên
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Mọi thay đổi được lưu tự động và áp dụng ngay lập tức trên trang chủ.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl bg-[#F7F9FC] border border-slate-200 space-y-4">
                      <MediaFrame
                        src={siteMedia.valueSectionImage}
                        alt="Ảnh mục Giá trị"
                        className="aspect-[16/10] w-full rounded-xl"
                      />
                      <ImagePickerField
                        label="Ảnh mục 02 — Giá trị cho giáo viên"
                        value={siteMedia.valueSectionImage}
                        onChange={(url) => {
                          setSiteMedia((prev) => ({ ...prev, valueSectionImage: url }));
                          flashNotice('Đã cập nhật ảnh mục Giá trị.');
                        }}
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-[#F7F9FC] border border-slate-200 space-y-4">
                      <MediaFrame
                        src={siteMedia.founderPortrait}
                        alt="Chân dung Giảng viên Trần Đông"
                        className="aspect-[16/10] w-full rounded-xl"
                      />
                      <ImagePickerField
                        label="Ảnh mục 07 — Giảng viên Trần Đông"
                        value={siteMedia.founderPortrait}
                        onChange={(url) => {
                          setSiteMedia((prev) => ({ ...prev, founderPortrait: url }));
                          flashNotice('Đã cập nhật ảnh chân dung giảng viên.');
                        }}
                      />
                    </div>
                  </div>
                </section>

                {/* 1C. 6 Student Practical Artifact Images */}
                <section className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 space-y-5">
                  <div className="pb-4 border-b border-slate-100">
                    <h2 className="text-lg font-extrabold text-[#081426]">
                      Hình ảnh mục 04 — Sản phẩm học viên thực hành
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {artifacts.map((art) => (
                      <div
                        key={art.id}
                        className="p-4 rounded-xl bg-[#F7F9FC] border border-slate-200 space-y-3"
                      >
                        <MediaFrame
                          src={art.image}
                          alt={art.title}
                          className="aspect-[16/10] w-full rounded-xl"
                        />
                        <p className="text-sm font-bold text-[#081426]">{art.title}</p>
                        <ImagePickerField
                          label="Ảnh minh họa sản phẩm"
                          value={art.image}
                          onChange={(url) => {
                            setArtifacts((prev) =>
                              prev.map((item) =>
                                item.id === art.id ? { ...item, image: url } : item
                              )
                            );
                            flashNotice(`Đã cập nhật ảnh: ${art.title}`);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* =======================================================
                TAB 2: COURSE MANAGEMENT
            ======================================================= */}
            {activeTab === 'courses' && (
              <section className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#081426]">
                      Danh sách khóa học ({courses.length})
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Chỉnh sửa ảnh bìa, kết quả học tập, giá thực tế và đường dẫn đăng ký thật của từng khóa.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCourseModal(null)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#081426] text-white text-xs font-bold cursor-pointer w-fit"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm khóa học</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 rounded-xl bg-[#F7F9FC] border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                    >
                      <MediaFrame
                        src={course.image}
                        alt={course.title}
                        className="w-full sm:w-28 aspect-[16/10] rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-[#081426] leading-snug">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">{course.target}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mt-2 tabular-nums">
                          <span className="font-bold text-[#081426]">{course.price}</span>
                          {course.originalPrice && (
                            <span className="text-slate-400 line-through">
                              {course.originalPrice}
                            </span>
                          )}
                          <span className="text-slate-400">·</span>
                          <span className="text-[#0D9488] truncate max-w-[240px]">
                            {course.registerUrl}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => openCourseModal(course)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-[#081426] text-xs font-semibold text-[#081426] cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Sửa</span>
                        </button>

                        {confirmDeleteCourseId === course.id ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setCourses((prev) => prev.filter((c) => c.id !== course.id));
                                setConfirmDeleteCourseId(null);
                                flashNotice('Đã xóa khóa học.');
                              }}
                              className="px-3 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold cursor-pointer"
                            >
                              Xác nhận xóa
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteCourseId(null)}
                              className="px-2.5 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 cursor-pointer"
                            >
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteCourseId(course.id)}
                            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-300 cursor-pointer"
                            aria-label={`Xóa khóa học ${course.title}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* =======================================================
                TAB 3: TESTIMONIALS WITH REAL SOURCE
            ======================================================= */}
            {activeTab === 'testimonials' && (
              <section className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#081426]">
                      Phản hồi học viên có nguồn thực tế
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Cập nhật các chia sẻ thực tế từ nhóm Zalo, cộng đồng Facebook kèm ảnh học liệu và liên kết nguồn.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingTestimonial(true);
                      setEditingTestimonial({
                        id: `fb-${Date.now()}`,
                        name: '',
                        role: 'Giáo viên',
                        quote: '',
                        sourceLabel: 'Chia sẻ từ Cộng đồng Giáo viên AI EDUNEXA',
                        sourceUrl: settings.facebookCommunityUrl,
                        avatar: VN_TEACHER_IMAGE_PRESETS[0].url,
                        productImage: VN_TEACHER_IMAGE_PRESETS[2].url,
                        productCaption: 'Học liệu thực hành',
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#081426] text-white text-xs font-bold cursor-pointer w-fit"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm phản hồi</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {testimonials.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 rounded-xl bg-[#F7F9FC] border border-slate-200 flex flex-col sm:flex-row items-start gap-4"
                    >
                      <MediaFrame
                        src={t.avatar}
                        alt={t.name}
                        className="w-12 h-12 rounded-full shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#081426]">
                          {t.name} <span className="font-normal text-slate-500">· {t.role}</span>
                        </p>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">“{t.quote}”</p>
                        <p className="text-xs text-[#0D9488] mt-1.5">{t.sourceLabel}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingTestimonial(false);
                            setEditingTestimonial({ ...t });
                          }}
                          className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-[#081426] cursor-pointer"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTestimonials((prev) => prev.filter((item) => item.id !== t.id));
                            flashNotice('Đã xóa phản hồi.');
                          }}
                          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-rose-600 cursor-pointer"
                          aria-label="Xóa phản hồi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* =======================================================
                TAB 4: SETTINGS & MOBILE STICKY CTA
            ======================================================= */}
            {activeTab === 'settings' && (
              <section className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-lg font-extrabold text-[#081426]">
                    Cấu hình liên kết đăng ký, liên hệ & thanh nổi trên di động
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Link biểu mẫu đăng ký mặc định
                    </label>
                    <input
                      type="url"
                      value={settings.registrationFormUrl}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          registrationFormUrl: e.target.value,
                        }))
                      }
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Số Hotline / Zalo hiển thị
                    </label>
                    <input
                      type="text"
                      value={settings.hotlineDisplay}
                      onChange={(e) => {
                        const display = e.target.value;
                        const digits = display.replace(/\D/g, '');
                        setSettings((prev) => ({
                          ...prev,
                          hotlineDisplay: display,
                          hotlineTel: digits ? `tel:${digits}` : prev.hotlineTel,
                        }));
                      }}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Link Cộng đồng Facebook
                    </label>
                    <input
                      type="url"
                      value={settings.facebookCommunityUrl}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          facebookCommunityUrl: e.target.value,
                        }))
                      }
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Link Facebook cá nhân
                    </label>
                    <input
                      type="url"
                      value={settings.facebookPersonalUrl}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          facebookPersonalUrl: e.target.value,
                        }))
                      }
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                    />
                  </div>
                </div>

                {/* Mobile Sticky CTA Toggle & Config */}
                <div className="p-5 rounded-xl bg-[#F7F9FC] border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-[#081426]">
                        Thanh đăng ký / liên hệ nổi trên điện thoại
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Chỉ hiển thị gọn ở mép dưới khi người dùng cuộn trang trên màn hình di động.
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={settings.mobileStickyEnabled}
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          mobileStickyEnabled: !prev.mobileStickyEnabled,
                        }))
                      }
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        settings.mobileStickyEnabled
                          ? 'bg-[#081426] text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {settings.mobileStickyEnabled ? 'Đang bật' : 'Đang tắt'}
                    </button>
                  </div>

                  {settings.mobileStickyEnabled && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Nhãn nút CTA
                        </label>
                        <input
                          type="text"
                          value={settings.mobileStickyLabel}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              mobileStickyLabel: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-[#081426]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Dòng phụ hỗ trợ
                        </label>
                        <input
                          type="text"
                          value={settings.mobileStickySublabel}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              mobileStickySublabel: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-[#081426]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Đường dẫn khi bấm
                        </label>
                        <input
                          type="text"
                          value={settings.mobileStickyUrl}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              mobileStickyUrl: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-[#081426]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => flashNotice('Cấu hình đã được lưu tự động.')}
                  className="px-6 py-2.5 rounded-xl bg-[#F5BF35] hover:bg-[#E2AB22] text-[#081426] text-sm font-bold cursor-pointer"
                >
                  Lưu cấu hình
                </button>
              </section>
            )}

            {/* =======================================================
                TAB 5: SECURITY & RESET DEFAULTS
            ======================================================= */}
            {activeTab === 'security' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-white p-6 rounded-2xl border border-slate-200">
                  <h2 className="text-lg font-extrabold text-[#081426] mb-5">
                    Thay đổi mật khẩu quản trị
                  </h2>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formEl = e.currentTarget;
                      const fd = new FormData(formEl);
                      const current = (fd.get('currentPassword') as string) || '';
                      const next = (fd.get('newPassword') as string) || '';
                      const confirm = (fd.get('confirmPassword') as string) || '';
                      if (next.length < 6) {
                        setSecurityMsg({
                          type: 'error',
                          text: 'Mật khẩu mới cần tối thiểu 6 ký tự.',
                        });
                        return;
                      }
                      if (next !== confirm) {
                        setSecurityMsg({ type: 'error', text: 'Xác nhận mật khẩu chưa khớp.' });
                        return;
                      }
                      try {
                        await changeAdminPasswordServer(adminSessionToken, current, next);
                        setSecurityMsg({
                          type: 'success',
                          text: 'Đã cập nhật mật khẩu quản trị trên máy chủ thành công.',
                        });
                        formEl.reset();
                      } catch (err) {
                        setSecurityMsg({
                          type: 'error',
                          text:
                            err instanceof Error
                              ? err.message
                              : 'Không thể cập nhật mật khẩu quản trị.',
                        });
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mật khẩu hiện tại
                      </label>
                      <input
                        name="currentPassword"
                        type="password"
                        required
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mật khẩu mới
                      </label>
                      <input
                        name="newPassword"
                        type="password"
                        required
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nhập lại mật khẩu mới
                      </label>
                      <input
                        name="confirmPassword"
                        type="password"
                        required
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                      />
                    </div>
                    {securityMsg && (
                      <p
                        className={`text-xs font-semibold ${
                          securityMsg.type === 'success' ? 'text-[#0D9488]' : 'text-rose-600'
                        }`}
                      >
                        {securityMsg.text}
                      </p>
                    )}
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#081426] hover:bg-[#102644] text-white text-sm font-bold cursor-pointer"
                    >
                      Cập nhật mật khẩu
                    </button>
                  </form>
                </section>

                <section className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#081426] mb-2">
                      Khôi phục dữ liệu mặc định
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      Đưa toàn bộ khóa học, hình ảnh Hero, sản phẩm thực hành và cấu hình liên hệ về
                      trạng thái chuẩn ban đầu của EDUNEXA.
                    </p>
                  </div>

                  {!confirmReset ? (
                    <button
                      type="button"
                      onClick={() => setConfirmReset(true)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 hover:border-rose-400 text-sm font-semibold text-[#081426] cursor-pointer w-fit"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Khôi phục dữ liệu mặc định</span>
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-3">
                      <p className="text-xs font-semibold text-rose-800">
                        Xác nhận đặt lại toàn bộ dữ liệu đã chỉnh sửa trên trình duyệt này?
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onResetAllDefaults();
                            setConfirmReset(false);
                            flashNotice('Đã khôi phục toàn bộ dữ liệu mặc định.');
                          }}
                          className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold cursor-pointer"
                        >
                          Xác nhận khôi phục
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmReset(false)}
                          className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* COURSE ADD / EDIT MODAL */}
      {(editingCourse || isAddingCourse) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#081426]/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-200">
            <h2 className="text-xl font-extrabold text-[#081426] mb-5">
              {isAddingCourse ? 'Thêm khóa học mới' : 'Chỉnh sửa khóa học'}
            </h2>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã khóa học (slug)
                  </label>
                  <input
                    name="id"
                    defaultValue={editingCourse?.id}
                    required
                    disabled={!isAddingCourse}
                    placeholder="ai-toan-dien-cho-giao-vien"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426] disabled:bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Đối tượng phù hợp
                  </label>
                  <input
                    name="target"
                    defaultValue={editingCourse?.target}
                    required
                    placeholder="Giáo viên mọi cấp học"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên khóa học
                </label>
                <input
                  name="title"
                  defaultValue={editingCourse?.title}
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phụ đề ngắn
                </label>
                <input
                  name="subtitle"
                  defaultValue={editingCourse?.subtitle}
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nhóm khóa học
                </label>
                <div className="flex flex-wrap gap-2">
                  {COURSE_CATEGORIES.filter((c) => c.id !== 'ALL').map((cat) => {
                    const catId = cat.id as Exclude<CourseCategoryId, 'ALL'>;
                    const checked = courseDraftCategories.includes(catId);
                    return (
                      <button
                        key={catId}
                        type="button"
                        onClick={() => {
                          setCourseDraftCategories((prev) =>
                            prev.includes(catId)
                              ? prev.filter((item) => item !== catId)
                              : [...prev, catId]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                          checked
                            ? 'bg-[#081426] text-white border-[#081426]'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kết quả học tập (hiển thị trên thẻ khóa học)
                </label>
                <textarea
                  name="outcome"
                  defaultValue={editingCourse?.outcome || editingCourse?.description}
                  required
                  rows={2}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mô tả khóa học
                </label>
                <textarea
                  name="description"
                  defaultValue={editingCourse?.description}
                  required
                  rows={2}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nội dung chính (mỗi dòng 1 ý)
                </label>
                <textarea
                  name="benefits"
                  defaultValue={(editingCourse?.benefits || []).join('\n')}
                  rows={3}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Giá thực tế
                  </label>
                  <input
                    name="price"
                    defaultValue={editingCourse?.price}
                    required
                    placeholder="999.000đ"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Giá gốc (nếu có)
                  </label>
                  <input
                    name="originalPrice"
                    defaultValue={editingCourse?.originalPrice}
                    placeholder="1.999.000đ"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Đường dẫn đăng ký thật
                  </label>
                  <input
                    name="registerUrl"
                    defaultValue={editingCourse?.registerUrl || settings.registrationFormUrl}
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nhãn nút đăng ký (mặc định: Đăng ký)
                  </label>
                  <input
                    name="registerLabel"
                    defaultValue={editingCourse?.registerLabel || ''}
                    placeholder="Đăng ký"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Thông tin chuyển khoản / thanh toán
                </label>
                <input
                  name="paymentInfo"
                  defaultValue={editingCourse?.paymentInfo}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                />
              </div>

              <ImagePickerField
                label="Ảnh bìa khóa học"
                value={courseDraftImage}
                onChange={setCourseDraftImage}
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCourse(null);
                    setIsAddingCourse(false);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#F5BF35] hover:bg-[#E2AB22] text-[#081426] text-sm font-bold cursor-pointer"
                >
                  Lưu khóa học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TESTIMONIAL ADD / EDIT MODAL */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#081426]/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-200">
            <h2 className="text-xl font-extrabold text-[#081426] mb-5">
              {isAddingTestimonial ? 'Thêm phản hồi học viên' : 'Chỉnh sửa phản hồi'}
            </h2>
            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Họ tên Thầy / Cô
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.name}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chức danh / Cấp học
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.role}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, role: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nội dung chia sẻ thực tế
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingTestimonial.quote}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nguồn phản hồi
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.sourceLabel}
                    onChange={(e) =>
                      setEditingTestimonial({
                        ...editingTestimonial,
                        sourceLabel: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Link nguồn kiểm chứng
                  </label>
                  <input
                    type="url"
                    required
                    value={editingTestimonial.sourceUrl}
                    onChange={(e) =>
                      setEditingTestimonial({
                        ...editingTestimonial,
                        sourceUrl: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chú thích học liệu thực hành
                </label>
                <input
                  type="text"
                  value={editingTestimonial.productCaption}
                  onChange={(e) =>
                    setEditingTestimonial({
                      ...editingTestimonial,
                      productCaption: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-[#081426]"
                />
              </div>

              <ImagePickerField
                label="Ảnh đại diện học viên"
                value={editingTestimonial.avatar}
                onChange={(url) =>
                  setEditingTestimonial({ ...editingTestimonial, avatar: url })
                }
                showPresets={false}
              />

              <ImagePickerField
                label="Ảnh sản phẩm học liệu"
                value={editingTestimonial.productImage}
                onChange={(url) =>
                  setEditingTestimonial({ ...editingTestimonial, productImage: url })
                }
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTestimonial(null);
                    setIsAddingTestimonial(false);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#F5BF35] hover:bg-[#E2AB22] text-[#081426] text-sm font-bold cursor-pointer"
                >
                  Lưu phản hồi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
