import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Expand,
  ExternalLink,
  Phone,
  PlayCircle,
  Users,
  MessageCircle,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type {
  Course,
  CourseCategoryId,
  CustomLandingSection,
  FaqItem,
  HeroContentConfig,
  HeroMediaItem,
  InstructorConfig,
  SectionVisibilityMap,
  SiteMediaConfig,
  SiteSettings,
  StudentArtifact,
  SyncedMediaAsset,
  TestimonialItem,
} from '../types';
import {
  COURSE_CATEGORIES,
  HOMEPAGE_FAQS,
  VIETQR_IMAGE,
} from '../data/initialData';
import { CourseCard } from './CourseCard';
import { MediaFrame } from './MediaFrame';
import { RegistrationForm } from './RegistrationForm';
import { ArtifactLightbox, type LightboxSlide } from './ArtifactLightbox';

interface HomeViewProps {
  courses: Course[];
  heroContent?: HeroContentConfig;
  heroShowcase: HeroMediaItem[];
  artifacts: StudentArtifact[];
  testimonials: TestimonialItem[];
  instructor?: InstructorConfig;
  faqs?: FaqItem[];
  sectionVisibility?: SectionVisibilityMap;
  customSections?: CustomLandingSection[];
  siteMedia: SiteMediaConfig;
  settings: SiteSettings;
  galleryImages?: SyncedMediaAsset[];
  partnerImages?: SyncedMediaAsset[];
  navigateTo: (page: string) => void;
  scrollToSection: (sectionId: string) => void;
}

const FALLBACK_HERO_CONTENT: HeroContentConfig = {
  kicker: 'Học viện AI Thực Chiến Dành Riêng Cho Giáo Viên Việt Nam · EDUNEXA',
  headlineLine1: 'Làm chủ AI trong dạy học.',
  headlineLine2: 'Soạn bài nhanh, tiết học bứt phá.',
  description:
    'Ứng dụng AI bài bản vào mọi công việc của người thầy: giáo án chuẩn 5512, slide bài giảng, trò chơi tương tác, mô phỏng 3D và video giáo dục — thực hành là dùng được ngay trên lớp.',
  primaryCtaLabel: 'Khám phá khóa học ngay',
  secondaryCtaLabel: 'Nhận tư vấn lộ trình',
  trustPoints: [
    'Hướng dẫn bằng tiếng Việt từng bước',
    'Kèm bộ câu lệnh & tài liệu thực hành',
    'Nhóm Zalo hỏi đáp và đồng hành',
  ],
};

const FALLBACK_INSTRUCTOR: InstructorConfig = {
  kicker: '02 · Người đồng hành cùng Thầy Cô',
  heading: 'Từ thực tiễn lớp học Việt Nam đến lộ trình AI dễ học, dễ làm',
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

const DEFAULT_VISIBILITY: SectionVisibilityMap = {
  'gia-tri': false,
  'khoa-hoc': true,
  'san-pham': false,
  'lo-trinh': false,
  'quy-trinh': false,
  'giang-vien': true,
  'phan-hoi': true,
  'hoi-dap': true,
  'dang-ky': true,
};

const REVEAL_PROPS = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 as const },
  transition: { duration: 0.35 },
};

export function HomeView({
  courses,
  heroContent = FALLBACK_HERO_CONTENT,
  heroShowcase,
  testimonials,
  instructor = FALLBACK_INSTRUCTOR,
  faqs,
  sectionVisibility = DEFAULT_VISIBILITY,
  customSections = [],
  siteMedia,
  settings,
  galleryImages = [],
  partnerImages = [],
  navigateTo,
  scrollToSection,
}: HomeViewProps) {
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<CourseCategoryId>('ALL');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedRegCourseId, setSelectedRegCourseId] = useState<string>(
    courses[0]?.id || 'ai-toan-dien-cho-giao-vien'
  );

  // Interactive gallery lightbox state
  const [lightboxSlides, setLightboxSlides] = useState<LightboxSlide[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const safeHeroItems = heroShowcase.filter((item) => item.active !== false);
  const activeHeroItem = safeHeroItems[activeHeroIndex] || safeHeroItems[0];

  useEffect(() => {
    if (activeHeroIndex >= safeHeroItems.length && safeHeroItems.length > 0) {
      setActiveHeroIndex(0);
    }
  }, [activeHeroIndex, safeHeroItems.length]);

  useEffect(() => {
    if (courses.length > 0 && !courses.some((c) => c.id === selectedRegCourseId)) {
      setSelectedRegCourseId(courses[0].id);
    }
  }, [courses, selectedRegCourseId]);

  const filteredCourses =
    selectedCategory === 'ALL'
      ? courses
      : courses.filter((course) => course.categoryIds.includes(selectedCategory));

  const selectedRegCourse =
    courses.find((c) => c.id === selectedRegCourseId) || courses[0];

  const effectiveFaqs: FaqItem[] =
    faqs && faqs.length > 0
      ? faqs
      : HOMEPAGE_FAQS.map((f, idx) => ({ id: `faq-${idx + 1}`, q: f.q, a: f.a }));

  const visibleCustomSections = customSections.filter((s) => s.visible);
  const vis = { ...DEFAULT_VISIBILITY, ...sectionVisibility };
  const founderPortraitSrc = instructor.portraitUrl || siteMedia.founderPortrait;
  const zaloHref = settings.zaloConsultUrl?.trim() || '';
  const paymentHref = settings.paymentUrl?.trim() || '';

  const gallerySlides: LightboxSlide[] = useMemo(
    () =>
      galleryImages.map((img) => ({
        id: img.id,
        image: img.publicUrl,
        title: img.title || 'Hoạt động tập huấn EDUNEXA',
        category: 'Thư viện hình ảnh hoạt động',
        description: img.altText || img.title,
      })),
    [galleryImages]
  );

  const handleQuickRegister = (courseId: string) => {
    setSelectedRegCourseId(courseId);
    scrollToSection('dang-ky');
  };

  return (
    <div id="top">
      {/* =================================================================
          SECTION 01: HERO SECTION (Navy #081426 + Product Showcase)
      ================================================================= */}
      <section className="bg-[#081426] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
            {/* Left Copy & CTAs */}
            <div className="lg:col-span-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-[#16B8A6] tracking-wide mb-4">
                {heroContent.kicker}
              </p>

              <h1 className="text-[1.85rem] sm:text-5xl lg:text-[3.35rem] font-extrabold leading-[1.14] tracking-tight mb-5 sm:mb-6 break-words text-balance">
                <span className="block text-white">{heroContent.headlineLine1}</span>
                <span className="block text-[#F5BF35] mt-1.5">
                  {heroContent.headlineLine2}
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-slate-300 leading-relaxed max-w-xl mb-7 sm:mb-8">
                {heroContent.description}
              </p>

              {/* Primary + Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-8">
                <button
                  type="button"
                  onClick={() => scrollToSection('khoa-hoc')}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[50px] bg-[#F5BF35] hover:bg-[#E2AB22] text-[#081426] font-bold text-sm tracking-wide rounded-xl transition-colors duration-150 cursor-pointer whitespace-nowrap"
                >
                  <span>{heroContent.primaryCtaLabel || 'Khám phá khóa học ngay'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('dang-ky')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[50px] bg-[#102644] hover:bg-[#16345C] text-white border border-white/15 font-semibold text-sm tracking-wide rounded-xl transition-colors duration-150 cursor-pointer whitespace-nowrap"
                >
                  <span>{heroContent.secondaryCtaLabel || 'Nhận tư vấn lộ trình'}</span>
                </button>
              </div>

              {/* Clean unboxed context line (no fake metrics) */}
              {heroContent.trustPoints && heroContent.trustPoints.length > 0 && (
                <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-300">
                  {heroContent.trustPoints.map((point, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && (
                        <span aria-hidden="true" className="text-slate-600">
                          ·
                        </span>
                      )}
                      <span>{point}</span>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            {/* Right Interactive Product Showcase (Zero floating badges over media) */}
            <div className="lg:col-span-6">
              {activeHeroItem && (
                <div className="bg-[#102644] rounded-2xl border border-white/12 overflow-hidden shadow-[0_20px_48px_rgba(0,0,0,0.35)]">
                  <MediaFrame
                    src={activeHeroItem.mediaUrl}
                    alt={`${activeHeroItem.title} — Học liệu thực hành EDUNEXA AI`}
                    mediaType={activeHeroItem.mediaType}
                    posterUrl={activeHeroItem.posterUrl}
                    priority
                    className="aspect-[16/10] w-full bg-[#081426]"
                    imgClassName="w-full h-full object-cover object-top"
                  />

                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="text-xs font-semibold text-[#16B8A6] mb-1">
                          Sản phẩm thực hành · {activeHeroItem.label}
                        </p>
                        <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                          {activeHeroItem.title}
                        </h2>
                        <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
                          {activeHeroItem.description}
                        </p>
                      </div>
                      {activeHeroItem.relatedCourseId && (
                        <button
                          type="button"
                          onClick={() => navigateTo(`course-${activeHeroItem.relatedCourseId}`)}
                          className="shrink-0 text-xs font-semibold text-[#F5BF35] hover:underline whitespace-nowrap pt-1 cursor-pointer"
                        >
                          Xem khóa học
                        </button>
                      )}
                    </div>

                    {safeHeroItems.length > 1 && (
                      <div
                        role="tablist"
                        aria-label="Chọn học liệu trình diễn"
                        className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-white/10"
                      >
                        {safeHeroItems.slice(0, 4).map((item, idx) => {
                          const isActive = idx === activeHeroIndex;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              role="tab"
                              aria-selected={isActive}
                              onClick={() => setActiveHeroIndex(idx)}
                              className={`px-3 py-2 min-h-[38px] rounded-lg text-xs font-semibold transition-colors cursor-pointer truncate ${
                                isActive
                                  ? 'bg-[#F5BF35] text-[#081426]'
                                  : 'bg-[#081426]/60 text-slate-300 hover:text-white hover:bg-[#081426]'
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          SECTION 01: CÁC NHÓM KHÓA HỌC & HỌC LIỆU AI (Light #F7F9FC)
      ================================================================= */}
      {vis['khoa-hoc'] && (
        <section id="khoa-hoc" className="py-16 sm:py-20 lg:py-24 bg-[#F7F9FC] border-b border-slate-200/80">
          <motion.div
            {...REVEAL_PROPS}
            className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10"
          >
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold text-[#0D9488] tracking-wide mb-2.5">
                  01 · Khóa học & Học liệu AI
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#081426] leading-tight mb-3 text-balance">
                  Chọn đúng khóa học AI để nhẹ gánh soạn bài, nâng tầm tiết dạy
                </h2>
                <p className="text-base text-slate-600 leading-relaxed">
                  Lọc nhanh theo đúng nhu cầu của Thầy Cô: soạn giáo án, thiết kế slide, trò chơi & mô phỏng 3D, video bài giảng hay trọn bộ 23 Siêu SKILL AI.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigateTo('courses')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#081426] hover:text-[#0D9488] transition-colors shrink-0 cursor-pointer w-fit"
              >
                <span>Tìm kiếm trong danh mục đầy đủ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Category Filters (All requested groups + real dataset groups) */}
            <div
              role="tablist"
              aria-label="Lọc khóa học theo nhóm kỹ năng"
              className="mb-10 flex flex-wrap items-center gap-2"
            >
              {COURSE_CATEGORIES.map((cat) => {
                const catId = cat.id;
                const count =
                  catId === 'ALL'
                    ? courses.length
                    : courses.filter((c) => c.categoryIds.includes(catId)).length;
                if (count === 0 && catId !== 'ALL') return null;

                const isActive = selectedCategory === catId;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 min-h-[42px] rounded-xl text-xs sm:text-sm font-semibold border transition-colors whitespace-nowrap cursor-pointer tabular-nums ${
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

            {/* Smooth Filtered Course Cards Grid */}
            {filteredCourses.length > 0 ? (
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
              >
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onViewDetail={(id) => navigateTo(`course-${id}`)}
                    onQuickRegister={handleQuickRegister}
                    defaultRegisterUrl={settings.registrationFormUrl}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-base font-semibold text-[#081426] mb-2">
                  Chưa có khóa học trong nhóm này
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('ALL')}
                  className="text-sm font-semibold text-[#0D9488] hover:underline cursor-pointer"
                >
                  Xem toàn bộ khóa học
                </button>
              </div>
            )}
          </motion.div>
        </section>
      )}

      {/* =================================================================
          SECTION 02: GIỚI THIỆU GIẢNG VIÊN VÀ EDUNEXA (White #FFFFFF)
      ================================================================= */}
      {vis['giang-vien'] && (
        <section id="giang-vien" className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/80">
          <motion.div
            {...REVEAL_PROPS}
            className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-[#F7F9FC]">
                  <MediaFrame
                    src={founderPortraitSrc}
                    alt={`${instructor.name} — Giảng viên EDUNEXA AI`}
                    className="aspect-[4/5] w-full"
                    imgClassName="w-full h-full object-cover object-top"
                  />
                  <div className="px-6 py-4 bg-[#081426] text-white">
                    <p className="text-base font-bold">{instructor.name}</p>
                    <p className="text-xs text-slate-300 mt-0.5">{instructor.roleLine}</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <p className="text-xs font-semibold text-[#0D9488] tracking-wide mb-2.5">
                  {instructor.kicker}
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#081426] leading-tight mb-5">
                  {instructor.heading}
                </h2>

                <div className="space-y-4 text-base text-slate-600 leading-relaxed mb-6">
                  <p>{instructor.bioParagraph1}</p>
                  {instructor.bioParagraph2 && <p>{instructor.bioParagraph2}</p>}
                </div>

                {instructor.quote && (
                  <blockquote className="p-5 rounded-xl bg-[#F7F9FC] border border-slate-200 text-sm sm:text-base text-[#081426] font-medium italic leading-relaxed mb-8">
                    “{instructor.quote}”
                  </blockquote>
                )}

                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-3">
                    Kênh thông tin chính thức
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href={settings.hotlineTel}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F7F9FC] border border-slate-200 hover:border-[#081426] transition-colors"
                    >
                      <Phone className="w-4 h-4 text-[#0D9488] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">Hotline</p>
                        <p className="text-sm font-bold text-[#081426] tabular-nums">{settings.hotlineDisplay}</p>
                      </div>
                    </a>

                    {zaloHref && (
                      <a
                        href={zaloHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F7F9FC] border border-slate-200 hover:border-[#081426] transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 text-[#0D9488] shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500">Zalo tư vấn</p>
                          <p className="text-sm font-bold text-[#081426] truncate">Nhắn trực tiếp EDUNEXA</p>
                        </div>
                      </a>
                    )}

                    <a
                      href={settings.facebookPersonalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F7F9FC] border border-slate-200 hover:border-[#081426] transition-colors"
                    >
                      <Users className="w-4 h-4 text-[#0D9488] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">Facebook</p>
                        <p className="text-sm font-bold text-[#081426] truncate">Trần Đông</p>
                      </div>
                    </a>

                    <a
                      href={settings.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F7F9FC] border border-slate-200 hover:border-[#081426] transition-colors"
                    >
                      <PlayCircle className="w-4 h-4 text-[#0D9488] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">YouTube</p>
                        <p className="text-sm font-bold text-[#081426] truncate">@AITrainer.Offical</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* =================================================================
          SECTION 03: CỘNG ĐỒNG & PHẢN HỒI CÓ NGUỒN THỰC TẾ (Light #F7F9FC)
      ================================================================= */}
      {vis['phan-hoi'] && (
        <section id="phan-hoi" className="py-16 sm:py-20 lg:py-24 bg-[#F7F9FC] border-b border-slate-200/80">
          <motion.div
            {...REVEAL_PROPS}
            className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10"
          >
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold text-[#0D9488] tracking-wide mb-2.5">
                  03 · Cộng đồng Giáo viên AI EDUNEXA
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#081426] leading-tight mb-3 text-balance">
                  Không học một mình — Đồng hành trực tiếp cùng Cộng đồng Giáo viên AI EDUNEXA
                </h2>
                <p className="text-base text-slate-600 leading-relaxed">
                  EDUNEXA chỉ đăng tải chia sẻ thực tế có nguồn đối chiếu rõ ràng. Thầy Cô có thể
                  truy cập trực tiếp nhóm cộng đồng chính thức để xem bài thực hành và trao đổi với các giáo viên khác.
                </p>
              </div>

              <a
                href={settings.facebookCommunityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-white border border-slate-300 hover:border-[#081426] text-sm font-semibold text-[#081426] transition-colors shrink-0 w-fit"
              >
                <Users className="w-4 h-4 text-[#0D9488]" />
                <span>Mở Cộng đồng Facebook EDUNEXA</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {testimonials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                {testimonials.map((t) => (
                  <article
                    key={t.id}
                    className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col h-full"
                  >
                    {t.productImage && (
                      <MediaFrame
                        src={t.productImage}
                        alt={t.productCaption || t.name}
                        className="aspect-[16/10] w-full"
                        imgClassName="w-full h-full object-cover object-top"
                      />
                    )}

                    <div className="p-6 flex flex-col flex-grow">
                      {t.productCaption && (
                        <p className="text-xs font-semibold text-[#0D9488] mb-3">
                          {t.productCaption}
                        </p>
                      )}

                      <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6 flex-grow">
                        “{t.quote}”
                      </p>

                      <div className="pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-3 mb-3">
                          <MediaFrame
                            src={t.avatar}
                            alt={t.name}
                            className="w-11 h-11 rounded-full shrink-0 border border-slate-200"
                            imgClassName="w-full h-full object-cover object-top"
                          />
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-[#081426] truncate">{t.name}</h3>
                            <p className="text-xs text-slate-500 truncate">{t.role}</p>
                          </div>
                        </div>

                        <a
                          href={t.sourceUrl || settings.facebookCommunityUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#081426] transition-colors"
                        >
                          <span>{t.sourceLabel}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-7 sm:p-9 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <p className="text-xs font-semibold text-[#0D9488]">
                    Kênh đối chiếu thực tế từ cộng đồng giáo viên
                  </p>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#081426]">
                    Xem trực tiếp bài thực hành và trao đổi của giáo viên trong Cộng đồng EDUNEXA
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    Thay vì trích dẫn các nhận xét ẩn danh, Thầy Cô có thể tham gia trực tiếp nhóm
                    Facebook Cộng đồng Giáo viên AI EDUNEXA hoặc nhắn Zalo để xem sản phẩm thực hành mẫu
                    và trao đổi trực tiếp trước khi đăng ký.
                  </p>
                </div>
                <div className="lg:col-span-4 flex flex-col gap-3">
                  <a
                    href={settings.facebookCommunityUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[46px] rounded-xl bg-[#081426] hover:bg-[#102644] text-white text-sm font-bold transition-colors"
                  >
                    <Users className="w-4 h-4 text-[#F5BF35]" />
                    <span>Vào nhóm Facebook cộng đồng</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  {zaloHref && (
                    <a
                      href={zaloHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[46px] rounded-xl bg-[#F7F9FC] hover:bg-slate-200/70 border border-slate-200 text-[#081426] text-sm font-semibold transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-[#0D9488]" />
                      <span>Nhắn Zalo xem mẫu học liệu</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Real Drive Activity Photos (Only rendered when admin syncs & publishes real photos) */}
            {galleryImages.length > 0 && (
              <div className="mt-14 pt-12 border-t border-slate-200/90">
                <div className="max-w-2xl mb-8">
                  <p className="text-xs font-semibold text-[#0D9488] tracking-wide mb-2">
                    Thư viện hình ảnh hoạt động
                  </p>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#081426] leading-tight">
                    Khoảnh khắc tập huấn & đồng hành cùng Thầy Cô
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryImages.map((img, idx) => (
                    <figure
                      key={img.id}
                      className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden group"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setLightboxSlides(gallerySlides);
                          setLightboxIndex(idx);
                        }}
                        className="relative block w-full text-left cursor-pointer"
                        aria-label={`Phóng to ảnh: ${img.title || 'Hoạt động EDUNEXA'}`}
                      >
                        <MediaFrame
                          src={img.publicUrl}
                          fallbackSrc={img.thumbnailUrl}
                          alt={img.altText || img.title || 'Hình ảnh hoạt động EDUNEXA'}
                          className="aspect-[16/10] w-full"
                          imgClassName="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                        <span className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-[#081426]/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Expand className="w-4 h-4" />
                        </span>
                      </button>
                      {img.title && (
                        <figcaption className="px-4 py-3 text-xs font-semibold text-[#081426] border-t border-slate-100">
                          {img.title}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            )}

            {/* Real Drive Partner Logos (Only rendered when admin publishes real verified partner logos) */}
            {partnerImages.length > 0 && (
              <div className="mt-14 pt-12 border-t border-slate-200/90">
                <p className="text-xs font-semibold text-[#0D9488] tracking-wide mb-2">
                  Đơn vị & Đối tác đồng hành
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-5">
                  {partnerImages.map((partner) => (
                    <div
                      key={partner.id}
                      className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-center aspect-[16/9]"
                    >
                      <img
                        src={partner.publicUrl}
                        alt={partner.altText || partner.title}
                        loading="lazy"
                        decoding="async"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </section>
      )}

      {/* =================================================================
          DYNAMIC CUSTOM SECTIONS (Managed from /quan-tri -> 06. Landing Page)
      ================================================================= */}
      {visibleCustomSections.map((sec) => {
        const isNavy = sec.theme === 'navy';
        const bgClass = isNavy
          ? 'bg-[#081426] text-white border-white/10'
          : sec.theme === 'light'
          ? 'bg-[#F7F9FC] text-[#081426] border-slate-200/80'
          : 'bg-white text-[#081426] border-slate-200/80';

        return (
          <section key={sec.id} className={`py-16 sm:py-20 border-b ${bgClass}`}>
            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
              <div
                className={
                  sec.imageUrl
                    ? 'grid grid-cols-1 lg:grid-cols-12 gap-10 items-center'
                    : 'max-w-3xl'
                }
              >
                <div className={sec.imageUrl ? 'lg:col-span-6' : ''}>
                  {sec.kicker && (
                    <p
                      className={`text-xs font-semibold tracking-wide mb-2.5 ${
                        isNavy ? 'text-[#16B8A6]' : 'text-[#0D9488]'
                      }`}
                    >
                      {sec.kicker}
                    </p>
                  )}
                  <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-4">
                    {sec.title}
                  </h2>
                  <p
                    className={`text-base leading-relaxed whitespace-pre-line mb-6 ${
                      isNavy ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {sec.body}
                  </p>
                  {sec.ctaLabel && sec.ctaUrl && (
                    <a
                      href={sec.ctaUrl}
                      target={sec.ctaUrl.startsWith('http') ? '_blank' : undefined}
                      rel={sec.ctaUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F5BF35] hover:bg-[#E2AB22] text-[#081426] text-sm font-bold transition-colors"
                    >
                      <span>{sec.ctaLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {sec.imageUrl && (
                  <div className="lg:col-span-6">
                    <div className="rounded-2xl overflow-hidden border border-slate-200/20">
                      <MediaFrame
                        src={sec.imageUrl}
                        alt={sec.title}
                        className="aspect-[16/10] w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}

      {/* =================================================================
          SECTION 04: CÂU HỎI THƯỜNG GẶP (White #FFFFFF)
      ================================================================= */}
      {vis['hoi-dap'] && (
        <section id="hoi-dap" className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/80">
          <motion.div
            {...REVEAL_PROPS}
            className="max-w-4xl mx-auto px-5 sm:px-8"
          >
            <div className="mb-10">
              <p className="text-xs font-semibold text-[#0D9488] tracking-wide mb-2.5">
                04 · Giải đáp trước khi bắt đầu
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#081426] leading-tight mb-3 text-balance">
                Thầy Cô băn khoăn gì trước khi học AI cùng EDUNEXA?
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Những câu hỏi thực tế nhất Thầy Cô thường quan tâm trước khi chọn khóa học hoặc học liệu phù hợp.
              </p>
            </div>

            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {effectiveFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={faq.id || idx}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full py-5 text-left flex items-center justify-between gap-4 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5BF35] rounded"
                    >
                      <span className="text-base sm:text-lg font-bold text-[#081426] group-hover:text-[#102644] leading-snug">
                        {faq.q}
                      </span>
                      <span className="w-8 h-8 rounded-lg bg-[#F7F9FC] border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="pb-5 pr-10 text-sm sm:text-base text-slate-600 leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </section>
      )}

      {/* =================================================================
          SECTION 05: KHU VỰC ĐĂNG KÝ CUỐI TRANG (Navy #081426)
      ================================================================= */}
      {vis['dang-ky'] && (
        <section id="dang-ky" className="py-16 sm:py-20 lg:py-24 bg-[#081426] text-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="max-w-2xl mb-10">
              <p className="text-xs font-semibold text-[#16B8A6] tracking-wide mb-2.5">
                05 · Bắt đầu ngay hôm nay
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3 text-balance">
                Đăng ký khóa học phù hợp — Rút ngắn thời gian soạn giảng ngay tuần này
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                Chọn khóa học hoặc học liệu số, để lại thông tin liên hệ và xác nhận chính sách xử lý thông tin. Hệ
                thống lưu trực tiếp hồ sơ đăng ký và xác nhận ngay sau khi gửi thành công.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* Left: Real Conversion Registration Form */}
              <div className="lg:col-span-6">
                <RegistrationForm
                  courses={courses}
                  selectedCourseId={selectedRegCourse?.id || ''}
                  onSelectCourseId={setSelectedRegCourseId}
                  settings={settings}
                  source="homepage"
                  variant="dark"
                />
              </div>

              {/* Right: Synchronized Real Course Fee, VietQR & Existing Payment Info */}
              {selectedRegCourse && (
                <div className="lg:col-span-6">
                  <div className="bg-[#102644] rounded-2xl border border-white/12 p-6 sm:p-8 space-y-6">
                    <div>
                      <p className="text-xs font-semibold text-[#16B8A6] mb-1">
                        Khóa học đang chọn
                      </p>
                      <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                        {selectedRegCourse.title}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                      <div className="sm:col-span-7 space-y-3">
                        <div>
                          <p className="text-xs text-slate-400">Học phí thực tế</p>
                          <div className="flex items-baseline gap-2.5 mt-1 tabular-nums">
                            <span className="text-3xl font-extrabold text-[#F5BF35]">
                              {selectedRegCourse.price}
                            </span>
                            {selectedRegCourse.originalPrice &&
                              selectedRegCourse.originalPrice !== selectedRegCourse.price &&
                              selectedRegCourse.price !== 'Liên hệ' && (
                                <span className="text-sm text-slate-400 line-through">
                                  {selectedRegCourse.originalPrice}
                                </span>
                              )}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed">
                          <p className="text-xs font-semibold text-[#16B8A6] mb-1">
                            Thông tin chuyển khoản / Liên hệ
                          </p>
                          <p>{selectedRegCourse.paymentInfo}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => navigateTo(`course-${selectedRegCourse.id}`)}
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#F5BF35] hover:underline cursor-pointer"
                          >
                            <span>Xem trang chi tiết khóa học</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>

                          {paymentHref && (
                            <a
                              href={paymentHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#99F6E4] hover:underline"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Trang thanh toán</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>

                      {selectedRegCourse.price !== 'Liên hệ' && (
                        <div className="sm:col-span-5 flex flex-col items-center">
                          <div className="bg-white p-2.5 rounded-xl w-full max-w-[170px]">
                            <img
                              src={selectedRegCourse.vietQrImageUrl || VIETQR_IMAGE}
                              alt={
                                selectedRegCourse.vietQrImageUrl
                                  ? 'Mã VietQR thanh toán MB Bank EDUNEXA'
                                  : 'Mã VietQR thanh toán Techcombank EDUNEXA'
                              }
                              loading="lazy"
                              decoding="async"
                              className="w-full h-auto object-contain"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <p className="text-[11px] text-slate-300 mt-2 text-center">
                            {selectedRegCourse.vietQrImageUrl
                              ? 'Quét mã VietQR MB Bank'
                              : 'Quét mã VietQR Techcombank'}
                          </p>
                        </div>
                      )}
                    </div>

                    <ul className="pt-5 border-t border-white/10 space-y-2.5 text-xs sm:text-sm text-slate-200">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#16B8A6] mt-0.5 shrink-0" />
                        <span>Xem lại video bài giảng, tài liệu và kho câu lệnh mẫu chủ động theo lịch dạy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#16B8A6] mt-0.5 shrink-0" />
                        <span>Thực hành trực tiếp tạo sản phẩm ứng dụng ngay cho giáo án và lớp học</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#16B8A6] mt-0.5 shrink-0" />
                        <span>Tham gia nhóm Zalo hỏi đáp và đồng hành cùng giảng viên EDUNEXA</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Interactive Gallery Lightbox */}
      <ArtifactLightbox
        slides={lightboxSlides}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
        onViewCourse={(courseId) => navigateTo(`course-${courseId}`)}
      />
    </div>
  );
}
