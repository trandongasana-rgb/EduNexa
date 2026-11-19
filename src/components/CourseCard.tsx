import React from 'react';
import { ArrowRight, Check, ExternalLink } from 'lucide-react';
import type { Course } from '../types';
import { MediaFrame } from './MediaFrame';

interface CourseCardProps {
  course: Course;
  onViewDetail: (courseId: string) => void;
  defaultRegisterUrl: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onViewDetail,
  defaultRegisterUrl,
}) => {
  const hasOriginalPrice =
    Boolean(course.originalPrice) &&
    course.originalPrice !== course.price &&
    course.price !== 'Liên hệ';

  const registerHref = course.registerUrl || defaultRegisterUrl;
  const isExternalRegister = registerHref.startsWith('http');

  return (
    <article className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-[0_2px_12px_rgba(8,20,38,0.04)] hover:shadow-[0_12px_30px_rgba(8,20,38,0.08)] transition-all duration-200 flex flex-col h-full overflow-hidden group">
      {/* 1. Ảnh bìa đúng tỷ lệ, không nhãn che ảnh */}
      <button
        type="button"
        onClick={() => onViewDetail(course.id)}
        className="block w-full text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5BF35]"
        aria-label={`Xem chi tiết khóa học ${course.title}`}
      >
        <MediaFrame
          src={course.image}
          alt={course.title}
          className="aspect-[16/10] w-full"
          imgClassName="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </button>

      {/* Body */}
      <div className="p-6 flex flex-col flex-grow">
        {/* 2. Đối tượng phù hợp (clean metadata line, zero pill clutter) */}
        <p className="text-xs font-semibold text-[#0D9488] mb-2">
          Đối tượng: {course.target}
        </p>

        {/* 3. Tên khóa học */}
        <h3 className="text-lg font-bold text-[#081426] leading-snug mb-2.5">
          <button
            type="button"
            onClick={() => onViewDetail(course.id)}
            className="text-left hover:text-[#102644] transition-colors cursor-pointer"
          >
            {course.title}
          </button>
        </h3>

        {/* 4. Kết quả học tập */}
        <p className="text-sm text-slate-600 leading-relaxed mb-5">
          <span className="font-semibold text-[#081426]">Kết quả: </span>
          {course.outcome || course.description}
        </p>

        {/* 5. Nội dung chính */}
        <div className="mb-6 flex-grow border-t border-slate-100 pt-4">
          <p className="text-xs font-semibold text-slate-500 mb-2.5">Nội dung chính</p>
          <ul className="space-y-2">
            {(course.benefits || []).slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 leading-snug">
                <Check className="w-4 h-4 text-[#0D9488] mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 6. Giá thực tế + 7. Hai nút hành động rõ ràng */}
        <div className="pt-4 border-t border-slate-100 mt-auto">
          <div className="flex items-baseline justify-between gap-3 mb-4">
            <div className="flex items-baseline gap-2.5 tabular-nums">
              <span className="text-2xl font-extrabold text-[#081426]">{course.price}</span>
              {hasOriginalPrice && (
                <span className="text-sm text-slate-400 line-through font-medium">
                  {course.originalPrice}
                </span>
              )}
            </div>
            {course.price === 'Liên hệ' && course.originalPrice && (
              <span className="text-xs text-slate-500">{course.originalPrice}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onViewDetail(course.id)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-300 text-[#081426] hover:bg-[#F7F9FC] hover:border-[#081426] text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Xem chi tiết</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={registerHref}
              target={isExternalRegister ? '_blank' : undefined}
              rel={isExternalRegister ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#F5BF35] hover:bg-[#E2AB22] text-[#081426] text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{course.registerLabel || 'Đăng ký'}</span>
              {isExternalRegister && <ExternalLink className="w-3.5 h-3.5" />}
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
