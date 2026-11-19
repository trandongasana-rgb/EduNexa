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
  BookOpenCheck,
  Presentation,
  Boxes,
  Clapperboard,
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
  ROADMAP_MODULES,
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
  kicker: 'Chương trình đào tạo ứng dụng AI cho giáo viên · EDUNEXA',
  headlineLine1: 'HỌC AI THỰC CHIẾN.',
  headlineLine2: 'TẠO HỌC LIỆU DÙNG ĐƯỢC NGAY.',
  description:
    'Từ giáo án, slide, trò chơi tương tác đến video mô phỏng và ứng dụng giáo dục. Học theo quy trình thực hành, tạo sản phẩm phù hợp với công việc giảng dạy.',
  primaryCtaLabel: 'KHÁM PHÁ KHÓA HỌC',
  secondaryCtaLabel: 'XEM SẢN PHẨM THỰC TẾ',
  trustPoints: [
    'Hướng dẫn bằng tiếng Việt từng bước',
    'Kèm bộ câu lệnh & tài liệu thực hành',
    'Nhóm Zalo hỏi đáp và đồng hành',
  ],
};

const FALLBACK_INSTRUCTOR: InstructorConfig = {
  kicker: '07 · Giảng viên & Học viện EDUNEXA',
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

const DEFAULT_VISIBILITY: SectionVisibilityMap = {
  'gia-tri': true,
  'khoa-hoc': true,
  'san-pham': true,
  'lo-trinh': true,
  'quy-trinh': true,
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

const TEACHER_VALUES = [
  {
    index: '01',
    icon: BookOpenCheck,
    title: 'Chuẩn hóa hồ sơ bài dạy & đề kiểm tra',
    description:
      'Xây dựng kế hoạch bài dạy chuẩn 5512, ma trận đề theo 4 mức độ nhận thức, phiếu học tập và khung sáng kiến kinh nghiệm rõ ràng.',
  },
  {
    index: '02',
    icon: Presentation,
    title: 'Thiết kế slide & hoạt động lớp học sinh động',
    description:
      'Chuyển hóa dàn ý bài giảng thành slide trình chiếu mạch lạc cùng trò chơi khởi động, củng cố kiến thức giúp học sinh chủ động tham gia.',
  },
  {
    index: '03',
    icon: Boxes,
    title: 'Xây dựng mô phỏng 3D, thí nghiệm ảo & Web App',
    description:
      'Minh họa trực quan kiến thức trừu tượng bằng mô hình 3D, thí nghiệm ảo và ứng dụng ôn tập chạy trên trình duyệt mà không cần tự viết code.',
  },
  {
    index: '04',
    icon: Clapperboard,
    title: 'Sản xuất video bài giảng & trợ lý AI môn học',
    description:
      'Tạo video giáo dục có nhân vật minh họa, học liệu đồ họa Canva và trợ lý AI nạp tài liệu bộ môn phục vụ công việc giảng dạy hằng ngày.',
  },
];

const LEARNING_STAGES = [
  {
    stage: 1 as const,
    label: 'Giai đoạn 01',
    title: 'Nền tảng AI & Nghiệp vụ soạn giảng',
    subtitle: 'Chuyên đề 01 – 04',
  },
  {
    stage: 2 as const,
    label: 'Giai đoạn 02',
    title: 'Trò chơi, Thí nghiệm ảo, 3D & Web App',
    subtitle: 'Chuyên đề 05 – 08',
  },
  {
    stage: 3 as const,
    label: 'Giai đoạn 03',
    title: 'Canva AI & Video AI Giáo dục',
    subtitle: 'Chuyên đề 09 – 10',
  },
];

const SUPPORT_STEPS = [
  {
    step: '01',
    title: 'Chọn đúng chương trình theo nhu cầu',
    description:
      'Bắt đầu từ tài liệu nền tảng, chuyên đề soạn giảng, hoạt động lớp học, video bài giảng hoặc lộ trình toàn diện 10 chuyên đề.',
  },
  {
    step: '02',
    title: 'Học thực hành theo từng thao tác',
    description:
      'Theo dõi bài giảng tiếng Việt trực quan kèm mẫu câu lệnh chuẩn hóa và tài liệu hướng dẫn, chủ động xem lại khi cần.',
  },
  {
    step: '03',
    title: 'Tạo học liệu dùng ngay cho môn học',
    description:
      'Mỗi phần học đều hướng đến sản phẩm cụ thể (giáo án, slide, trò chơi, mô phỏng hoặc video) để áp dụng vào tiết dạy thực tế.',
  },
  {
    step: '04',
    title: 'Hỏi đáp & đồng hành qua nhóm Zalo',
    description:
      'Trao đổi trực tiếp vướng mắc kỹ thuật, cập nhật quy trình mới và chia sẻ kinh nghiệm cùng giảng viên và cộng đồng giáo viên.',
  },
];

export function HomeView({
  courses,
  heroContent = FALLBACK_HERO_CONTENT,
  heroShowcase,
  artifacts,
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
  const [activeStage, setActiveStage] = useState<1 | 2 | 3>(1);
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

  const stageModules = ROADMAP_MODULES.filter((m) => m.stage === activeStage);

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

  const artifactSlides: LightboxSlide[] = useMemo(
    () =>
      artifacts.map((a) => ({
        id: a.id,
        image: a.image,
        title: a.title,
        category: a.category,
        description: a.description,
        courseId: a.courseId,
        courseLabel: a.courseLabel,
      })),
    [artifacts]
  );

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

              <h1 className="text-[1.85rem] sm:text-5xl lg:text-[3.35rem] font-extrabold leading-[1.14] tracking-tight mb-5 sm:mb-6 break-words">
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
                  <span>{heroContent.primaryCtaLabel || 'KHÁM PHÁ KHÓA HỌC'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('san-pham')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[50px] bg-[#102644] hover:bg-[#16345C] text-white border border-white/15 font-semibold text-sm tracking-wide rounded-xl transition-colors duration-150 cursor-pointer whitespace-nowrap"
                >
                  <span>{heroContent.secondaryCtaLabel || 'XEM SẢN PHẨM THỰC TẾ'}</span>
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
          SECTION 02: GIÁ TRỊ MÀ GIÁO VIÊN NHẬN ĐƯỢC (White #FFFFFF)
      ================================================================= */}
      {vis['gia-tri'] && (
        <section id="gia-tri" className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/80">
          <motion.div
            {...REVEAL_PROPS}
            className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-5">
                <p className="text-xs font-semibold text-[#0D9488] tracking-wide mb-2.5">
                  02 · Giá trị cốt lõi
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#081426] leading-tight mb-4">
                  Ứng dụng AI đúng quy trình cho công việc giảng dạy hằng ngày
                </h2>
                <p className="text-base text-slate-600 leading-relaxed mb-8">
                  Thay vì thử nghiệm rời rạc hàng chục công cụ, chương trình tại EDUNEXA tập trung vào
                  quy trình rõ ràng gắn trực tiếp với nhiệm vụ chuyên môn của giáo viên Việt Nam.
                </p>

                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-[#F7F9FC]">
                  <MediaFrame
                    src={siteMedia.valueSectionImage}
                    alt="Giáo viên Việt Nam thực hành ứng dụng AI trong giảng dạy cùng EDUNEXA"
                    className="aspect-[16/10] w-full"
                  />
                  <div className="px-5 py-3.5 text-xs text-slate-600 border-t border-slate-200/80">
                    Thực hành trực tiếp trên giáo án, học liệu và bài giảng của chính bộ môn Thầy Cô đang phụ trách.
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {TEACHER_VALUES.map((val) => {
                  const Icon = val.icon;
                  return (
                    <div
                      key={val.index}
                      className="p-6 rounded-2xl bg-[#F7F9FC] border border-slate-200/80 hover:border-slate-300 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#081426]">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-slate-400 tabular-nums">
                            {val.index}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-[#081426] mb-2 leading-snug">
                          {val.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {val.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* =================================================================
          SECTION 03: CÁC NHÓM KHÓA HỌC AI (Light #F7F9FC)
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
                  03 · Chương trình đào tạo
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#081426] leading-tight mb-3">
                  Các nhóm khóa học AI cho giáo viên
                </h2>
                <p className="text-base text-slate-600 leading-relaxed">
                  Lọc theo đúng nhu cầu giảng dạy của Thầy Cô: soạn giáo án, thiết kế slide, trò chơi & mô phỏng, video AI hoặc ứng dụng & trợ lý AI.
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
          SECTION 04: GALLERY HỌC LIỆU THỰC HÀNH (White #FFFFFF)
      ================================================================= */}
      {vis['san-pham'] && (
        <section id="san-pham" className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/80">
          <motion.div
            {...REVEAL_PROPS}
            className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10"
          >
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-semibold text-[#0D9488] tracking-wide mb-2.5">
                04 · Đầu ra thực hành
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#081426] leading-tight mb-3">
                Sản phẩm giáo viên có thể thực hành tạo ra
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Mỗi chuyên đề hướng tới học liệu cụ thể có thể biên tập lại theo sách giáo khoa và bộ
                môn. Nhấn vào từng ảnh để xem phóng to trong thư viện học liệu.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {artifacts.map((artifact, idx) => (
                <article
                  key={artifact.id}
                  className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden flex flex-col group hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(8,20,38,0.07)] transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setLightboxSlides(artifactSlides);
                      setLightboxIndex(idx);
                    }}
                    className="relative block w-full text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5BF35]"
                    aria-label={`Xem phóng to học liệu: ${artifact.title}`}
                  >
                    <MediaFrame
                      src={artifact.image}
                      alt={`${artifact.title} — ${artifact.category} EDUNEXA`}
                      className="aspect-[16/10] w-full"
                      imgClassName="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <span className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-[#081426]/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Expand className="w-4 h-4" />
                    </span>
                  </button>
                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-xs font-semibold text-[#0D9488] mb-1.5">
                      {artifact.category}
                    </p>
                    <h3 className="text-base sm:text-lg font-bold text-[#081426] leading-snug mb-2">
                      {artifact.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-5 flex-grow">
                      {artifact.description}
                    </p>
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <span className="text-xs text-slate-500 truncate">
                        {artifact.courseLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() => navigateTo(`course-${artifact.courseId}`)}
                        className="text-xs font-bold text-[#081426] hover:text-[#0D9488] inline-flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <span>Xem khóa</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* =================================================================
          SECTION 05: LỘ TRÌNH HỌC TỪNG BƯỚC (Navy #081426)
      ================================================================= */}
      {vis['lo-trinh'] && (
        <section id="lo-trinh" className="py-16 sm:py-20 lg:py-24 bg-[#081426] text-white border-b border-white/10">
          <motion.div
            {...REVEAL_PROPS}
            className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10"
          >
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold text-[#16B8A6] tracking-wide mb-2.5">
                  05 · Lộ trình 10 chuyên đề
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3">
                  Lộ trình học từng bước từ nền tảng đến sản phẩm hoàn chỉnh
                </h2>
                <p className="text-base text-slate-300 leading-relaxed">
                  Hệ thống 10 chuyên đề được sắp xếp theo trình tự thực tế: làm chủ nền tảng và soạn
                  giảng trước, sau đó mở rộng sang trò chơi, mô phỏng 3D, Web App và video AI giáo dục.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigateTo('course-ai-toan-dien-cho-giao-vien')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[46px] bg-[#F5BF35] hover:bg-[#E2AB22] text-[#081426] font-bold text-sm rounded-xl transition-colors cursor-pointer shrink-0 w-fit"
              >
                <span>Xem trọn bộ 10 chuyên đề</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8" role="tablist">
              {LEARNING_STAGES.map((st) => {
                const isActive = activeStage === st.stage;
                return (
                  <button
                    key={st.stage}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveStage(st.stage)}
                    className={`text-left p-5 rounded-xl border transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#102644] border-[#F5BF35] text-white'
                        : 'bg-[#0C1D35] border-white/10 text-slate-300 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className={isActive ? 'text-[#F5BF35] font-bold' : 'text-slate-400 font-semibold'}>
                        {st.label}
                      </span>
                      <span className="text-slate-400 tabular-nums">{st.subtitle}</span>
                    </div>
                    <div className="text-sm sm:text-base font-bold text-white leading-snug">
                      {st.title}
                    </div>
                  </button>
                );
              })}
            </div>

            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {stageModules.map((mod) => (
                <div
                  key={mod.num}
                  className="p-6 rounded-2xl bg-[#102644] border border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-extrabold text-[#F5BF35] tabular-nums">
                        Chuyên đề {mod.num}
                      </span>
                      <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                      {mod.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                      {mod.summary}
                    </p>
                  </div>
                  <div className="pt-3.5 border-t border-white/10 text-xs sm:text-sm text-slate-200 flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#16B8A6] mt-0.5 shrink-0" />
                    <span>
                      <strong className="text-white font-semibold">Đầu ra:</strong> {mod.output}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* =================================================================
          SECTION 06: QUY TRÌNH HỌC VÀ HỖ TRỢ (Light #F7F9FC)
      ================================================================= */}
      {vis['quy-trinh'] && (
        <section id="quy-trinh" className="py-16 sm:py-20 lg:py-24 bg-[#F7F9FC] border-b border-slate-200/80">
          <motion.div
            {...REVEAL_PROPS}
            className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10"
          >
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-semibold text-[#0D9488] tracking-wide mb-2.5">
                06 · Phương pháp đồng hành
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#081426] leading-tight mb-3">
                Quy trình học và hỗ trợ tại EDUNEXA
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Thiết kế để giáo viên bận rộn vẫn theo kịp tiến độ, chủ động thực hành lại và có kênh
                hỏi đáp rõ ràng khi triển khai vào lớp học.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SUPPORT_STEPS.map((item) => (
                <div
                  key={item.step}
                  className="bg-white p-6 rounded-2xl border border-slate-200/90 flex flex-col"
                >
                  <span className="text-2xl font-extrabold text-[#F5BF35] tabular-nums mb-4">
                    {item.step}
                  </span>
                  <h3 className="text-base font-bold text-[#081426] mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* =================================================================
          SECTION 07: GIỚI THIỆU GIẢNG VIÊN VÀ EDUNEXA (White #FFFFFF)
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
          SECTION 08: CỘNG ĐỒNG & PHẢN HỒI CÓ NGUỒN THỰC TẾ (Light #F7F9FC)
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
                  08 · Cộng đồng & Phản hồi xác thực
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#081426] leading-tight mb-3">
                  Kết nối trực tiếp cùng Cộng đồng Giáo viên AI EDUNEXA
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
          SECTION 09: CÂU HỎI THƯỜNG GẶP (White #FFFFFF)
      ================================================================= */}
      {vis['hoi-dap'] && (
        <section id="hoi-dap" className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/80">
          <motion.div
            {...REVEAL_PROPS}
            className="max-w-4xl mx-auto px-5 sm:px-8"
          >
            <div className="mb-10">
              <p className="text-xs font-semibold text-[#0D9488] tracking-wide mb-2.5">
                09 · Giải đáp thắc mắc
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#081426] leading-tight mb-3">
                Câu hỏi thường gặp
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Những thông tin Thầy Cô thường quan tâm trước khi lựa chọn chương trình học.
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
          SECTION 10: KHU VỰC ĐĂNG KÝ CUỐI TRANG (Navy #081426)
      ================================================================= */}
      {vis['dang-ky'] && (
        <section id="dang-ky" className="py-16 sm:py-20 lg:py-24 bg-[#081426] text-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="max-w-2xl mb-10">
              <p className="text-xs font-semibold text-[#16B8A6] tracking-wide mb-2.5">
                10 · Đăng ký tham gia & Tư vấn lộ trình
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3">
                Đăng ký khóa học AI phù hợp cho môn học của Thầy Cô
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                Chọn khóa học, để lại thông tin liên hệ và xác nhận chính sách xử lý thông tin. Hệ
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
                              src={VIETQR_IMAGE}
                              alt="Mã VietQR thanh toán Techcombank EDUNEXA"
                              loading="lazy"
                              decoding="async"
                              className="w-full h-auto object-contain"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <p className="text-[11px] text-slate-300 mt-2 text-center">
                            Quét mã VietQR Techcombank
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
