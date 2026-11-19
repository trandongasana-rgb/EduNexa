import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Edit,
  Eye,
  EyeOff,
  GripVertical,
  HardDrive,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import type { Course, CourseCategoryId, CurriculumItem } from '../../types';
import { COURSE_CATEGORIES, VN_TEACHER_IMAGE_PRESETS } from '../../data/initialData';
import { MediaFrame } from '../MediaFrame';
import { MediaPickerModal } from './MediaPickerModal';

interface CoursesManagerSectionProps {
  courses: Course[];
  onChangeCourses: (nextCourses: Course[]) => void;
  defaultRegisterUrl: string;
  adminSessionToken: string;
  onNotify: (msg: string) => void;
}

export function CoursesManagerSection({
  courses,
  onChangeCourses,
  defaultRegisterUrl,
  adminSessionToken,
  onNotify,
}: CoursesManagerSectionProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'published' | 'hidden' | 'featured'>('ALL');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Course editor modal state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [draftImage, setDraftImage] = useState('');
  const [draftCategories, setDraftCategories] = useState<Exclude<CourseCategoryId, 'ALL'>[]>(['SOAN_GIAO_AN']);
  const [draftStatus, setDraftStatus] = useState<'published' | 'hidden'>('published');
  const [draftFeatured, setDraftFeatured] = useState(false);
  const [draftCurriculum, setDraftCurriculum] = useState<CurriculumItem[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const sortedCourses = [...courses].sort(
    (a, b) => (a.displayOrder ?? 100) - (b.displayOrder ?? 100)
  );

  const filteredCourses = sortedCourses.filter((c) => {
    if (statusFilter === 'published' && c.status === 'hidden') return false;
    if (statusFilter === 'hidden' && c.status !== 'hidden') return false;
    if (statusFilter === 'featured' && !c.featured) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.target.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const applyOrder = (ordered: Course[]) => {
    const normalized = ordered.map((c, idx) => ({
      ...c,
      displayOrder: (idx + 1) * 10,
    }));
    onChangeCourses(normalized);
  };

  const moveCourse = (id: string, direction: -1 | 1) => {
    const idx = sortedCourses.findIndex((c) => c.id === id);
    const targetIdx = idx + direction;
    if (idx === -1 || targetIdx < 0 || targetIdx >= sortedCourses.length) return;
    const next = [...sortedCourses];
    [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
    applyOrder(next);
    onNotify('Đã thay đổi thứ tự khóa học (nhấn Lưu nháp hoặc Xuất bản để ghi máy chủ).');
  };

  const handleDropReorder = (targetId: string) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }
    const next = [...sortedCourses];
    const fromIdx = next.findIndex((c) => c.id === draggedId);
    const toIdx = next.findIndex((c) => c.id === targetId);
    if (fromIdx === -1 || toIdx === -1) {
      setDraggedId(null);
      return;
    }
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    applyOrder(next);
    setDraggedId(null);
    onNotify('Đã sắp xếp lại thứ tự khóa học.');
  };

  const toggleStatus = (id: string) => {
    onChangeCourses(
      courses.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'hidden' ? 'published' : 'hidden' }
          : c
      )
    );
  };

  const toggleFeatured = (id: string) => {
    onChangeCourses(
      courses.map((c) => (c.id === id ? { ...c, featured: !c.featured } : c))
    );
  };

  const openModal = (course: Course | null) => {
    if (course) {
      setEditingCourse(course);
      setIsAdding(false);
      setDraftImage(course.image);
      setDraftCategories(course.categoryIds.length > 0 ? course.categoryIds : ['SOAN_GIAO_AN']);
      setDraftStatus(course.status === 'hidden' ? 'hidden' : 'published');
      setDraftFeatured(Boolean(course.featured));
      setDraftCurriculum(course.curriculum || []);
    } else {
      setEditingCourse(null);
      setIsAdding(true);
      setDraftImage(VN_TEACHER_IMAGE_PRESETS[0].url);
      setDraftCategories(['SOAN_GIAO_AN']);
      setDraftStatus('published');
      setDraftFeatured(false);
      setDraftCurriculum([
        { mod: 'Chuyên đề 01', title: 'Nền tảng & Quy trình thực hành', desc: '' },
      ]);
    }
  };

  const handleSaveCourse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const rawSlug = (editingCourse?.id || (fd.get('id') as string) || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-');

    const splitLines = (name: string) =>
      ((fd.get(name) as string) || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

    const benefits = splitLines('benefits');
    const gifts = splitLines('gifts');

    const nextCourse: Course = {
      id: rawSlug || `khoa-hoc-${Date.now()}`,
      title: ((fd.get('title') as string) || '').trim(),
      subtitle: ((fd.get('subtitle') as string) || '').trim(),
      categoryIds: draftCategories.length > 0 ? draftCategories : ['SOAN_GIAO_AN'],
      description: ((fd.get('description') as string) || '').trim(),
      fullDescription:
        ((fd.get('fullDescription') as string) || '').trim() ||
        ((fd.get('description') as string) || '').trim(),
      outcome: ((fd.get('outcome') as string) || '').trim(),
      image: draftImage || VN_TEACHER_IMAGE_PRESETS[0].url,
      target: ((fd.get('target') as string) || '').trim(),
      price: ((fd.get('price') as string) || '').trim(),
      originalPrice: ((fd.get('originalPrice') as string) || '').trim(),
      registerUrl: ((fd.get('registerUrl') as string) || '').trim() || defaultRegisterUrl,
      registerLabel: ((fd.get('registerLabel') as string) || '').trim() || undefined,
      benefits: benefits.length > 0 ? benefits : ['Thực hành từng bước trực tiếp'],
      pains: editingCourse?.pains || ['Cần quy trình ứng dụng AI bài bản cho công việc giảng dạy.'],
      solutions: editingCourse?.solutions || ['Thực hành tạo học liệu số áp dụng ngay trên lớp.'],
      curriculum: draftCurriculum.filter((item) => item.title.trim()),
      gifts: gifts.length > 0 ? gifts : ['Tài liệu & bộ câu lệnh mẫu thực hành'],
      paymentInfo:
        ((fd.get('paymentInfo') as string) || '').trim() ||
        'Techcombank (TCB) - STK: 88.3558.3558 - Chủ TK: CONG TY TNHH MTV GIAO DUC EDUNEXA',
      status: draftStatus,
      featured: draftFeatured,
      displayOrder: editingCourse?.displayOrder ?? (courses.length + 1) * 10,
    };

    if (isAdding) {
      onChangeCourses([...courses, nextCourse]);
      onNotify(`Đã thêm khóa học "${nextCourse.title}" vào bản nháp.`);
    } else {
      onChangeCourses(courses.map((c) => (c.id === nextCourse.id ? nextCourse : c)));
      onNotify(`Đã cập nhật khóa học "${nextCourse.title}" vào bản nháp.`);
    }
    setEditingCourse(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-extrabold text-[#081426]">
              Quản lý khóa học ({courses.length})
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Thêm, sửa, ẩn/xuất bản, đặt khóa nổi bật, chọn ảnh từ Drive và kéo thả sắp xếp thứ tự hiển thị.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openModal(null)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#081426] hover:bg-[#102644] text-white text-xs font-bold cursor-pointer shrink-0 w-fit"
          >
            <Plus className="w-4 h-4 text-[#F5BF35]" />
            <span>Thêm khóa học mới</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tên khóa học, mã slug hoặc đối tượng..."
              className="w-full pl-9 pr-3.5 py-2 bg-[#F7F9FC] border border-slate-200 rounded-xl text-sm text-[#081426]"
            />
          </div>
          <div className="inline-flex p-1 bg-[#F7F9FC] border border-slate-200 rounded-xl gap-1">
            {[
              { id: 'ALL' as const, label: 'Tất cả' },
              { id: 'published' as const, label: 'Đang xuất bản' },
              { id: 'hidden' as const, label: 'Đang ẩn' },
              { id: 'featured' as const, label: 'Nổi bật' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-[#081426] text-white'
                    : 'text-slate-600 hover:text-[#081426]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Courses List */}
        <div className="space-y-3">
          {filteredCourses.map((course, idx) => {
            const isHidden = course.status === 'hidden';
            return (
              <div
                key={course.id}
                draggable
                onDragStart={() => setDraggedId(course.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDropReorder(course.id)}
                className={`p-4 rounded-xl border transition-colors flex flex-col lg:flex-row items-start lg:items-center gap-4 ${
                  isHidden
                    ? 'bg-slate-50 border-slate-200/80 opacity-75'
                    : 'bg-[#F7F9FC] border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="flex flex-col items-center gap-1 text-slate-400">
                    <button
                      type="button"
                      onClick={() => moveCourse(course.id, -1)}
                      disabled={idx === 0}
                      className="p-1 hover:text-[#081426] disabled:opacity-30 cursor-pointer"
                      aria-label="Đưa lên trên"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <GripVertical className="w-4 h-4 cursor-grab" />
                    <button
                      type="button"
                      onClick={() => moveCourse(course.id, 1)}
                      disabled={idx === filteredCourses.length - 1}
                      className="p-1 hover:text-[#081426] disabled:opacity-30 cursor-pointer"
                      aria-label="Đưa xuống dưới"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <MediaFrame
                    src={course.image}
                    alt={course.title}
                    className="w-28 aspect-[16/10] rounded-lg border border-slate-200 shrink-0"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono text-slate-400 tabular-nums">#{idx + 1}</span>
                    <span className={isHidden ? 'font-bold text-slate-500' : 'font-bold text-[#0D9488]'}>
                      {isHidden ? 'Đang ẩn' : 'Đang xuất bản'}
                    </span>
                    {course.featured && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span className="font-bold text-amber-700">Khóa nổi bật</span>
                      </>
                    )}
                    <span className="text-slate-300">·</span>
                    <span className="font-mono text-slate-500">{course.id}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[#081426] leading-snug">
                    {course.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 tabular-nums">
                    <span className="font-bold text-[#081426]">{course.price}</span>
                    {course.originalPrice && (
                      <span className="line-through text-slate-400">{course.originalPrice}</span>
                    )}
                    <span className="text-slate-300">·</span>
                    <span>{course.target}</span>
                    <span className="text-slate-300">·</span>
                    <span>{course.curriculum.length} chuyên đề</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleFeatured(course.id)}
                    title={course.featured ? 'Bỏ nổi bật' : 'Đặt làm khóa nổi bật'}
                    className={`inline-flex items-center gap-1 px-2.5 py-2 rounded-lg border text-xs font-semibold cursor-pointer ${
                      course.featured
                        ? 'bg-amber-50 border-amber-300 text-amber-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-[#081426]'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${course.featured ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span>Nổi bật</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleStatus(course.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg bg-white border border-slate-200 hover:border-[#081426] text-xs font-semibold text-[#081426] cursor-pointer"
                  >
                    {isHidden ? <Eye className="w-3.5 h-3.5 text-[#0D9488]" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{isHidden ? 'Xuất bản' : 'Ẩn'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openModal(course)}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#081426] text-white text-xs font-semibold cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Sửa</span>
                  </button>

                  {confirmDeleteId === course.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          onChangeCourses(courses.filter((c) => c.id !== course.id));
                          setConfirmDeleteId(null);
                          onNotify(`Đã xóa khóa học "${course.title}" khỏi bản nháp.`);
                        }}
                        className="px-2.5 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold cursor-pointer"
                      >
                        Xác nhận
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 cursor-pointer"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(course.id)}
                      className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 cursor-pointer"
                      aria-label={`Xóa khóa học ${course.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Course Add / Edit Modal */}
      {(editingCourse || isAdding) && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#081426]/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 sm:p-7 border border-slate-200">
            <div className="flex items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-100">
              <h3 className="text-lg sm:text-xl font-extrabold text-[#081426]">
                {isAdding ? 'Thêm khóa học mới' : `Chỉnh sửa: ${editingCourse?.title}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingCourse(null);
                  setIsAdding(false);
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              {/* Cover Image with Drive Library Picker */}
              <div className="p-4 rounded-xl bg-[#F7F9FC] border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <MediaFrame
                  src={draftImage}
                  alt="Ảnh bìa khóa học"
                  className="w-full sm:w-40 aspect-[16/10] rounded-lg border border-slate-200 shrink-0"
                />
                <div className="flex-1 w-full space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Ảnh bìa khóa học (URL hoặc chọn từ Thư viện Drive đã đồng bộ)
                  </label>
                  <input
                    type="text"
                    value={draftImage}
                    onChange={(e) => setDraftImage(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-[#081426]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMediaPicker(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#081426] hover:bg-[#102644] text-white text-xs font-bold cursor-pointer"
                  >
                    <HardDrive className="w-3.5 h-3.5 text-[#F5BF35]" />
                    <span>Chọn ảnh từ Thư viện Drive / Tải ảnh mới</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã khóa học (slug)
                  </label>
                  <input
                    name="id"
                    defaultValue={editingCourse?.id}
                    required
                    disabled={!isAdding}
                    placeholder="ai-toan-dien-cho-giao-vien"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426] disabled:bg-slate-50 font-mono"
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
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tên khóa học
                  </label>
                  <input
                    name="title"
                    defaultValue={editingCourse?.title}
                    required
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
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
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
                  />
                </div>
              </div>

              {/* Status, Featured & Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#F7F9FC] border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Trạng thái hiển thị
                  </label>
                  <select
                    value={draftStatus}
                    onChange={(e) => setDraftStatus(e.target.value as 'published' | 'hidden')}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-[#081426]"
                  >
                    <option value="published">Đang xuất bản</option>
                    <option value="hidden">Đang ẩn khỏi web</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => setDraftFeatured((v) => !v)}
                    className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold cursor-pointer ${
                      draftFeatured
                        ? 'bg-amber-50 border-amber-300 text-amber-800'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${draftFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span>{draftFeatured ? 'Đang đặt Nổi bật' : 'Đặt làm Nổi bật'}</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nhóm khóa học
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {COURSE_CATEGORIES.filter((c) => c.id !== 'ALL').map((cat) => {
                      const catId = cat.id as Exclude<CourseCategoryId, 'ALL'>;
                      const active = draftCategories.includes(catId);
                      return (
                        <button
                          key={catId}
                          type="button"
                          onClick={() =>
                            setDraftCategories((prev) =>
                              prev.includes(catId)
                                ? prev.filter((x) => x !== catId)
                                : [...prev, catId]
                            )
                          }
                          className={`px-2 py-1 rounded text-[11px] font-semibold border cursor-pointer ${
                            active
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
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mô tả ngắn
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingCourse?.description}
                    required
                    rows={2}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mô tả đầy đủ (trang chi tiết khóa học)
                  </label>
                  <textarea
                    name="fullDescription"
                    defaultValue={editingCourse?.fullDescription}
                    rows={2}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nội dung chính / Điểm nổi bật (mỗi dòng 1 ý)
                  </label>
                  <textarea
                    name="benefits"
                    defaultValue={(editingCourse?.benefits || []).join('\n')}
                    rows={4}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-[#081426]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quà tặng & quyền lợi đi kèm (mỗi dòng 1 mục)
                  </label>
                  <textarea
                    name="gifts"
                    defaultValue={(editingCourse?.gifts || []).join('\n')}
                    rows={4}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-[#081426]"
                  />
                </div>
              </div>

              {/* Curriculum Builder */}
              <div className="p-4 rounded-xl bg-[#F7F9FC] border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#081426]">
                    Giáo trình / Các chuyên đề ({draftCurriculum.length})
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setDraftCurriculum((prev) => [
                        ...prev,
                        { mod: `Chuyên đề ${String(prev.length + 1).padStart(2, '0')}`, title: '', desc: '' },
                      ])
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-[#081426] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm chuyên đề</span>
                  </button>
                </div>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {draftCurriculum.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-start">
                      <input
                        type="text"
                        value={item.mod}
                        onChange={(e) =>
                          setDraftCurriculum((prev) =>
                            prev.map((m, i) => (i === idx ? { ...m, mod: e.target.value } : m))
                          )
                        }
                        placeholder="Chuyên đề 01"
                        className="col-span-3 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-[#081426]"
                      />
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          setDraftCurriculum((prev) =>
                            prev.map((m, i) => (i === idx ? { ...m, title: e.target.value } : m))
                          )
                        }
                        placeholder="Tên chuyên đề"
                        className="col-span-4 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-[#081426]"
                      />
                      <input
                        type="text"
                        value={item.desc || ''}
                        onChange={(e) =>
                          setDraftCurriculum((prev) =>
                            prev.map((m, i) => (i === idx ? { ...m, desc: e.target.value } : m))
                          )
                        }
                        placeholder="Mô tả ngắn nội dung"
                        className="col-span-4 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-[#081426]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setDraftCurriculum((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="col-span-1 p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                        aria-label="Xóa chuyên đề"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Giá bán</label>
                  <input
                    name="price"
                    defaultValue={editingCourse?.price}
                    required
                    placeholder="999.000đ"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Giá gốc</label>
                  <input
                    name="originalPrice"
                    defaultValue={editingCourse?.originalPrice}
                    placeholder="1.999.000đ"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nhãn nút CTA</label>
                  <input
                    name="registerLabel"
                    defaultValue={editingCourse?.registerLabel || ''}
                    placeholder="Đăng ký"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Link đăng ký thật</label>
                  <input
                    name="registerUrl"
                    defaultValue={editingCourse?.registerUrl || defaultRegisterUrl}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
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
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCourse(null);
                    setIsAdding(false);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#F5BF35] hover:bg-[#E2AB22] text-[#081426] text-xs font-extrabold cursor-pointer"
                >
                  Cập nhật vào bản nháp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={(url) => setDraftImage(url)}
        adminSessionToken={adminSessionToken}
        defaultCategory="ANH_KHOA_HOC"
        title="Chọn ảnh bìa khóa học từ Thư viện Drive"
      />
    </div>
  );
}
