import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CreditCard,
  Expand,
  ExternalLink,
  Laptop,
  MessageCircle,
  Phone,
  Users,
} from 'lucide-react';
import { motion } from 'motion/react';
import type {
  Course,
  InstructorConfig,
  SiteSettings,
  StudentArtifact,
} from '../types';
import { VIETQR_IMAGE } from '../data/initialData';
import { MediaFrame } from './MediaFrame';
import { RegistrationForm } from './RegistrationForm';
import { ArtifactLightbox, type LightboxSlide } from './ArtifactLightbox';

interface CourseLandingViewProps {
  course: Course | undefined;
  allCourses: Course[];
  artifacts: StudentArtifact[];
  instructor?: InstructorConfig;
  founderPortraitFallback: string;
  settings: SiteSettings;
  navigateTo: (page: string) => void;
}

const DEFAULT_INSTRUCTOR: InstructorConfig = {
  kicker: 'Giảng viên & Học viện EDUNEXA',
  heading: 'Đồng hành cùng giáo viên Việt Nam chuyển đổi số thực chất',
  name: 'Thầy Trần Đông (Trần Văn Đông)',
  roleLine: 'Nhà sáng lập EDUNEXA · Đào tạo ứng dụng AI trong giáo dục',
  bioParagraph1:
    'Thầy Trần Đông (Trần Văn Đông) là nhà sáng lập EDUNEXA, trực tiếp nghiên cứu, xây dựng giáo trình và hướng dẫn giáo viên ứng dụng trí tuệ nhân tạo vào soạn giảng, thiết kế học liệu số và tổ chức hoạt động lớp học.',
  bioParagraph2:
    'Các chương trình tại EDUNEXA được xây dựng theo hướng thực hành trực tiếp trên bối cảnh chương trình giáo dục phổ thông Việt Nam, giúp Thầy Cô tiếp cận công nghệ dễ hiểu, có hệ thống và áp dụng được vào công việc hằng ngày.',
  quote:
    'AI không thay thế người thầy, mà đóng vai trò công cụ hỗ trợ để người thầy có thêm không gian sáng tạo và tập trung tốt hơn cho học sinh.',
  portraitUrl: '',
};

const REVEAL_PROPS = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 as const },
  transition: { duration: 0.35 },
};

export function CourseLandingView({
  course,
  allCourses,
  artifacts,
  instructor = DEFAULT_INSTRUCTOR,
  founderPortraitFallback,
  settings,
  navigateTo,
}: CourseLandingViewProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter artifacts related to this course (fallback to general curriculum artifacts if none explicitly linked)
  const courseArtifacts = useMemo(() => {
    if (!course) return [];
    const direct = artifacts.filter((a) => a.courseId === course.id);
    if (direct.length > 0) return direct;
    return artifacts.slice(0, 3);
  }, [artifacts, course]);

  const lightboxSlides: LightboxSlide[] = useMemo(
    () =>
      courseArtifacts.map((item) => ({
        id: item.id,
        image: item.image,
        title: item.title,
        category: item.category,
        description: item.description,
      })),
    [courseArtifacts]
  );

  if (!course) {
    return (
      <div className="py-28 px-5 text-center bg-[#F7F9FC] min-h-[60vh]">
        <h1 className="text-2xl font-bold text-[#081426] mb-3">
          Khóa học không tồn tại hoặc đã được cập nhật
        </h1>
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="px-6 py-3 rounded-xl bg-[#081426] text-white text-sm font-semibold cursor-pointer"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  const hasDiscount =
    Boolean(course.originalPrice) &&
    course.originalPrice !== course.price &&
    course.price !== 'Liên hệ';

  const isCoaching = course.categoryIds.includes('COACHING');
  const isManual = course.categoryIds.includes('TAI_LIEU_CAM_NANG') && course.curriculum.length <= 5;
  const zaloHref = settings.zaloConsultUrl?.trim() || '';
  const paymentHref = settings.paymentUrl?.trim() || '';
  const portraitSrc = instructor.portraitUrl || founderPortraitFallback;

  const learningFormats = isCoaching
    ? [
        {
          icon: Users,
          title: 'Kèm cặp trực tiếp theo nhu cầu riêng',
          desc: 'Thiết kế lộ trình sát môn học, cấp học hoặc mục tiêu chuyển đổi số của cá nhân, tổ chuyên môn hay nhà trường.',
        },
        {
          icon: Laptop,
          title: 'Thực hành ngay trên bài giảng thực tế',
          desc: 'Cùng giảng viên xử lý trực tiếp giáo án, học liệu và quy trình dạy học đang triển khai tại đơn vị.',
        },
        {
          icon: MessageCircle,
          title: 'Hỗ trợ giải đáp trực tiếp qua Zalo',
          desc: 'Trao đổi nhanh khi gặp vướng mắc trong quá trình ứng dụng thực tế tại lớp học.',
        },
      ]
    : [
        {
          icon: Laptop,
          title: isManual ? 'Bộ tài liệu điện tử & hướng dẫn từng bước' : 'Video bài giảng tiếng Việt xem chủ động',
          desc: isManual
            ? 'Tài liệu được biên soạn theo từng bước cụ thể, dễ tra cứu lại bất cứ lúc nào trên máy tính hoặc điện thoại.'
            : 'Chủ động sắp xếp thời gian học theo lịch giảng dạy và xem lại thao tác bất cứ khi nào cần.',
        },
        {
          icon: BookOpen,
          title: 'Tài liệu & kho câu lệnh mẫu thực hành',
          desc: 'Kèm khung câu lệnh chuẩn hóa cho bối cảnh giáo dục Việt Nam để Thầy Cô áp dụng ngay vào bài dạy.',
        },
        {
          icon: MessageCircle,
          title: 'Nhóm Zalo hỏi đáp và đồng hành',
          desc: 'Trao đổi chuyên môn, gửi sản phẩm thực hành và nhận giải đáp vướng mắc cùng giảng viên và cộng đồng giáo viên.',
        },
      ];

  const scrollToRegister = () => {
    document.getElementById('course-register-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#F7F9FC]">
      {/* Breadcrumb Bar */}
      <nav
        aria-label="Điều hướng đường dẫn"
        className="bg-[#102644] text-slate-300 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-3 flex items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="inline-flex items-center gap-1.5 text-slate-200 hover:text-[#F5BF35] font-semibold whitespace-nowrap cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Trang chủ</span>
            </button>
            <span className="text-slate-500">/</span>
            <button
              type="button"
              onClick={() => navigateTo('courses')}
              className="text-slate-300 hover:text-white whitespace-nowrap hidden sm:inline cursor-pointer"
            >
              Khóa học
            </button>
            <span className="text-slate-500 hidden sm:inline">/</span>
            <span className="text-[#F5BF35] font-semibold truncate">{course.title}</span>
          </div>

          <button
            type="button"
            onClick={scrollToRegister}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#F5BF35] hover:bg-[#E2AB22] text-[#081426] text-xs font-bold whitespace-nowrap cursor-pointer"
          >
            <span>Đăng ký ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* =================================================================
          01. GIỚI THIỆU KHÓA HỌC (Hero)
      ================================================================= */}
      <section className="bg-[#081426] text-white py-12 sm:py-16 lg:py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs sm:text-sm font-semibold text-[#16B8A6] mb-3">
                01 · Giới thiệu chương trình · Đối tượng: {course.target}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-5">
                {course.title}
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6">
                {course.fullDescription || course.description}
              </p>

              {/* Real price & discount */}
              <div className="flex flex-wrap items-baseline gap-4 mb-8 tabular-nums">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#F5BF35]">
                  {course.price}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-slate-400 line-through">
                    {course.originalPrice}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3.5">
                <button
                  type="button"
                  onClick={scrollToRegister}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[50px] bg-[#F5BF35] hover:bg-[#E2AB22] text-[#081426] font-extrabold text-sm rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Đăng ký khóa học ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {zaloHref && (
                  <a
                    href={zaloHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[50px] bg-[#102644] hover:bg-[#16345C] text-white border border-white/15 font-semibold text-sm rounded-xl transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 text-[#16B8A6]" />
                    <span>Nhắn Zalo tư vấn</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-white/15 bg-[#102644]">
                <MediaFrame
                  src={course.image}
                  alt={`Ảnh đại diện khóa học ${course.title} — EDUNEXA`}
                  priority
                  className="aspect-[16/10] w-full"
                  imgClassName="w-full h-full object-cover object-top"
                />
                <div className="p-5 border-t border-white/10">
                  <p className="text-xs font-semibold text-[#16B8A6] mb-1">
                    Mục tiêu đầu ra chính
                  </p>
                  <p className="text-sm text-slate-200 leading-relaxed">{course.outcome}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          02. KẾT QUẢ HỌC TẬP (Vấn đề tháo gỡ + Kết quả đạt được)
      ================================================================= */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <motion.div
          {...REVEAL_PROPS}
          className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-10"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-[#0D9488] tracking-wide mb-2">
              02 · Kết quả học tập
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#081426] leading-tight mb-3">
              Thầy Cô nhận được gì sau khi hoàn thành khóa học?
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              {course.outcome}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-7 sm:p-8 rounded-2xl bg-[#F7F9FC] border border-slate-200">
              <p className="text-xs font-semibold text-slate-500 mb-2">Vấn đề thực tế</p>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#081426] mb-5">
                Những vướng mắc chương trình giúp tháo gỡ
              </h3>
              <ul className="space-y-3.5">
                {course.pains.map((pain, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm sm:text-base text-slate-700 leading-relaxed"
                  >
                    <AlertCircle className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                    <span>{pain}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-7 sm:p-8 rounded-2xl bg-[#F7F9FC] border border-slate-200">
              <p className="text-xs font-semibold text-[#0D9488] mb-2">Năng lực ứng dụng</p>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#081426] mb-5">
                Kết quả thực hành sau khóa học
              </h3>
              <ul className="space-y-3.5">
                {(course.solutions.length > 0 ? course.solutions : course.benefits).map(
                  (item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm sm:text-base text-slate-800 leading-relaxed"
                    >
                      <Check className="w-5 h-5 text-[#0D9488] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* =================================================================
          03. NỘI DUNG CHƯƠNG TRÌNH
      ================================================================= */}
      <section className="py-16 sm:py-20 bg-[#081426] text-white border-b border-white/10">
        <motion.div
          {...REVEAL_PROPS}
          className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10"
        >
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold text-[#16B8A6] mb-2">
              03 · Nội dung chương trình
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Lộ trình chi tiết ({course.curriculum.length} phần)
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Sắp xếp theo trình tự từ nền tảng đến hoàn thiện học liệu phục vụ công việc giảng dạy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {course.curriculum.map((mod, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#102644] border border-white/10"
              >
                <p className="text-xs font-bold text-[#F5BF35] mb-1.5 tabular-nums">
                  {mod.mod || `Phần ${idx + 1}`}
                </p>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                  {mod.title}
                </h3>
                {mod.desc && (
                  <p className="text-sm text-slate-300 leading-relaxed">{mod.desc}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* =================================================================
          04. SẢN PHẨM THỰC HÀNH (Interactive Lightbox Gallery)
      ================================================================= */}
      {courseArtifacts.length > 0 && (
        <section className="py-16 bg-white border-b border-slate-200/80">
          <motion.div
            {...REVEAL_PROPS}
            className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10"
          >
            <div className="max-w-2xl mb-10">
              <p className="text-xs font-semibold text-[#0D9488] mb-2">
                04 · Sản phẩm thực hành
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#081426] mb-2">
                Học liệu thực tế giáo viên tạo ra trong khóa học
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Nhấn vào từng học liệu để xem ảnh kích thước đầy đủ.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courseArtifacts.map((artifact, idx) => (
                <article
                  key={artifact.id}
                  className="bg-[#F7F9FC] rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 flex flex-col group"
                >
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className="relative block w-full text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5BF35]"
                    aria-label={`Phóng to sản phẩm: ${artifact.title}`}
                  >
                    <MediaFrame
                      src={artifact.image}
                      alt={`Sản phẩm thực hành: ${artifact.title}`}
                      className="aspect-[16/10] w-full"
                      imgClassName="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <span className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-[#081426]/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Expand className="w-4 h-4" />
                    </span>
                  </button>
                  <div className="p-5 flex-grow">
                    <p className="text-xs font-semibold text-[#0D9488] mb-1">
                      {artifact.category}
                    </p>
                    <h3 className="text-base font-bold text-[#081426] mb-1.5 leading-snug">
                      {artifact.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {artifact.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* =================================================================
          05. HÌNH THỨC HỌC & 06. GIẢNG VIÊN
      ================================================================= */}
      <section className="py-16 bg-[#F7F9FC] border-b border-slate-200/80">
        <motion.div
          {...REVEAL_PROPS}
          className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-16"
        >
          {/* 05. Hình thức học */}
          <div>
            <div className="max-w-2xl mb-8">
              <p className="text-xs font-semibold text-[#0D9488] mb-2">
                05 · Hình thức học & hỗ trợ
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#081426]">
                Cách tổ chức học tập và đồng hành
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {learningFormats.map((fmt, idx) => {
                const Icon = fmt.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#081426] text-[#F5BF35] flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-[#081426] mb-2">{fmt.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{fmt.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 06. Giảng viên */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4">
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-[#F7F9FC]">
                  <MediaFrame
                    src={portraitSrc}
                    alt={instructor.name}
                    className="aspect-[4/5] w-full"
                  />
                </div>
              </div>
              <div className="lg:col-span-8">
                <p className="text-xs font-semibold text-[#0D9488] mb-2">
                  06 · Giảng viên phụ trách
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#081426] mb-1">
                  {instructor.name}
                </h2>
                <p className="text-sm font-semibold text-slate-500 mb-4">
                  {instructor.roleLine}
                </p>
                <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed mb-5">
                  <p>{instructor.bioParagraph1}</p>
                  {instructor.bioParagraph2 && <p>{instructor.bioParagraph2}</p>}
                </div>
                {instructor.quote && (
                  <blockquote className="p-4 rounded-xl bg-[#F7F9FC] border border-slate-200 text-sm text-[#081426] italic font-medium">
                    “{instructor.quote}”
                  </blockquote>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* =================================================================
          07. GIÁ, ƯU ĐÃI THỰC TẾ & 08. HƯỚNG DẪN ĐĂNG KÝ
      ================================================================= */}
      <section id="course-register-section" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 space-y-12">
          {/* Tài nguyên đi kèm */}
          {course.gifts.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[#0D9488] mb-2">
                07 · Giá, ưu đãi thực tế & tài nguyên đi kèm
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#081426] mb-6">
                Tài nguyên và hỗ trợ đi kèm chương trình
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {course.gifts.map((gift, idx) => (
                  <div
                    key={idx}
                    className="bg-[#F7F9FC] p-5 rounded-2xl border border-slate-200 flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#F5BF35]/20 text-[#081426] flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-semibold text-[#081426] leading-relaxed">
                      {gift}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3-Step Registration Guide + Live Form + Official VietQR */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Fee, Existing VietQR Payment & 3-Step Guide */}
            <div className="lg:col-span-5 bg-[#081426] text-white rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <p className="text-xs font-semibold text-[#16B8A6] mb-2">
                  08 · Học phí & Hướng dẫn đăng ký
                </p>
                <div className="flex items-baseline gap-3 tabular-nums">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#F5BF35]">
                    {course.price}
                  </span>
                  {hasDiscount && (
                    <span className="text-base text-slate-400 line-through">
                      {course.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* 3-step guide */}
              <ol className="space-y-3 text-xs sm:text-sm text-slate-200 border-y border-white/10 py-5">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-[#F5BF35] text-[#081426] font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                    1
                  </span>
                  <span>
                    Điền họ tên, số điện thoại/Zalo và đồng ý chính sách xử lý thông tin ở biểu mẫu bên cạnh.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-[#F5BF35] text-[#081426] font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                    2
                  </span>
                  <span>
                    {course.price === 'Liên hệ'
                      ? 'Đội ngũ EDUNEXA liên hệ trao đổi mục tiêu và báo phương án phù hợp.'
                      : 'Chuyển khoản học phí qua mã VietQR Techcombank (hoặc đợi tư vấn qua Zalo trước khi chuyển khoản).'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-[#F5BF35] text-[#081426] font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                    3
                  </span>
                  <span>
                    Nhận tài khoản học tập, bộ tài liệu và tham gia nhóm Zalo hỏi đáp đồng hành.
                  </span>
                </li>
              </ol>

              {/* Existing VietQR & Transfer Info */}
              {course.price !== 'Liên hệ' && (
                <div className="flex flex-col items-center p-4 rounded-xl bg-[#102644] border border-white/10">
                  <div className="bg-white p-2.5 rounded-xl w-full max-w-[175px]">
                    <img
                      src={VIETQR_IMAGE}
                      alt="Mã VietQR thanh toán Techcombank EDUNEXA"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <p className="text-xs text-slate-300 mt-2.5 text-center">
                    Quét mã VietQR Techcombank (luồng thanh toán chính thức)
                  </p>
                </div>
              )}

              <div className="p-4 rounded-xl bg-[#102644] border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed">
                {course.paymentInfo}
              </div>

              {paymentHref && (
                <a
                  href={paymentHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs sm:text-sm font-bold transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Mở trang thanh toán hiện có</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <a
                  href={settings.hotlineTel}
                  className="flex items-center gap-2 hover:text-[#F5BF35] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#F5BF35]" />
                  <span className="tabular-nums">Hotline / Zalo: {settings.hotlineDisplay}</span>
                </a>
                {zaloHref && (
                  <a
                    href={zaloHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-[#F5BF35] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#16B8A6]" />
                    <span>Nhắn trực tiếp Zalo tư vấn EDUNEXA</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right: Real Backend Registration Form with Policy Consent */}
            <div className="lg:col-span-7">
              <div className="mb-5">
                <h2 className="text-2xl font-extrabold text-[#081426] mb-1.5">
                  Đăng ký khóa học: {course.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Thông tin đăng ký được lưu trực tiếp trên hệ thống EDUNEXA và xác nhận ngay sau khi lưu thành công.
                </p>
              </div>

              <RegistrationForm
                courses={allCourses}
                selectedCourseId={course.id}
                lockCourseSelection
                settings={settings}
                source={`course:${course.id}`}
                variant="light"
              />
            </div>
          </div>
        </div>
      </section>

      <ArtifactLightbox
        slides={lightboxSlides}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />
    </div>
  );
}
