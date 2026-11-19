import React, { useState } from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import type { Course, CourseCategoryId, SiteSettings } from '../types';
import { COURSE_CATEGORIES } from '../data/initialData';
import { CourseCard } from './CourseCard';

interface CoursesViewProps {
  courses: Course[];
  settings: SiteSettings;
  navigateTo: (page: string) => void;
}

export function CoursesView({ courses, settings, navigateTo }: CoursesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CourseCategoryId>('ALL');

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      selectedCategory === 'ALL' || course.categoryIds.includes(selectedCategory);
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      course.title.toLowerCase().includes(q) ||
      course.description.toLowerCase().includes(q) ||
      course.target.toLowerCase().includes(q) ||
      course.outcome.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleOpenCourseRegister = (courseId: string) => {
    navigateTo(`course-${courseId}`);
    setTimeout(() => {
      document.getElementById('course-register-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 180);
  };

  return (
    <div className="bg-[#F7F9FC] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#081426] mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang chủ</span>
        </button>

        <div className="max-w-2xl mb-10">
          <p className="text-xs font-semibold text-[#0D9488] tracking-wide mb-2">
            Danh mục đào tạo · EDUNEXA
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#081426] leading-tight mb-3">
            Các khóa học AI dành cho giáo viên
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Lọc theo nhóm kỹ năng thực hành: soạn giáo án, thiết kế slide, trò chơi & mô phỏng, video AI, ứng dụng & trợ lý AI.
          </p>
        </div>

        {/* Search + Filter Controls */}
        <div className="space-y-4 mb-10">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên khóa học, nội dung, đối tượng..."
              className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm text-[#081426] focus:outline-none focus:border-[#081426]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#081426] p-1 cursor-pointer"
                aria-label="Xóa từ khóa tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {COURSE_CATEGORIES.map((cat) => {
              const categoryId = cat.id;
              const count =
                categoryId === 'ALL'
                  ? courses.length
                  : courses.filter((c) => c.categoryIds.includes(categoryId)).length;
              if (count === 0 && categoryId !== 'ALL') return null;

              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold border transition-colors whitespace-nowrap cursor-pointer tabular-nums ${
                    isActive
                      ? 'bg-[#081426] text-white border-[#081426]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-[#081426] hover:text-[#081426]'
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <motion.div
            key={selectedCategory + searchQuery}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
          >
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onViewDetail={(id) => navigateTo(`course-${id}`)}
                onQuickRegister={handleOpenCourseRegister}
                defaultRegisterUrl={settings.registrationFormUrl}
              />
            ))}
          </motion.div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <p className="text-lg font-bold text-[#081426] mb-2">
              Không tìm thấy khóa học phù hợp
            </p>
            <p className="text-sm text-slate-500 mb-5">
              Thầy Cô có thể thử từ khóa khác hoặc xem lại toàn bộ danh sách khóa học.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#081426] text-white text-sm font-semibold cursor-pointer"
            >
              Xem tất cả khóa học
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
