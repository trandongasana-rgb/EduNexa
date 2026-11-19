/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { ArrowLeft, ArrowUp, ExternalLink, Eye, Send, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type {
  CmsSnapshot,
  Course,
  HeroMediaItem,
  PublicMediaResponse,
  SiteMediaConfig,
  StudentArtifact,
  SyncedMediaAsset,
} from './types';
import {
  DEFAULT_COURSES,
  DEFAULT_HERO_SHOWCASE,
  DEFAULT_SITE_MEDIA,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_STUDENT_ARTIFACTS,
  DEFAULT_TESTIMONIALS,
  HOMEPAGE_FAQS,
} from './data/initialData';
import {
  checkAdminSession,
  fetchPublicSite,
  publishCmsDraftApi,
} from './services/driveApi';
import { applyPageSeo } from './utils/seo';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { Footer } from './components/Footer';

const CoursesView = lazy(() =>
  import('./components/CoursesView').then((m) => ({ default: m.CoursesView }))
);
const CourseLandingView = lazy(() =>
  import('./components/CourseLandingView').then((m) => ({ default: m.CourseLandingView }))
);
const AdminView = lazy(() =>
  import('./components/AdminView').then((m) => ({ default: m.AdminView }))
);

function buildInitialFallbackSnapshot(): CmsSnapshot {
  return {
    heroContent: {
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
    },
    heroShowcase: DEFAULT_HERO_SHOWCASE.map((item) => ({ ...item, active: true })),
    courses: DEFAULT_COURSES.map((c, idx) => ({
      ...c,
      status: 'published',
      featured: idx === 0,
      displayOrder: (idx + 1) * 10,
    })),
    artifacts: DEFAULT_STUDENT_ARTIFACTS,
    testimonials: DEFAULT_TESTIMONIALS,
    instructor: {
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
      portraitUrl: DEFAULT_SITE_MEDIA.founderPortrait,
    },
    faqs: HOMEPAGE_FAQS.map((f, idx) => ({ id: `faq-${idx + 1}`, q: f.q, a: f.a })),
    sectionVisibility: {
      'gia-tri': true,
      'khoa-hoc': true,
      'san-pham': true,
      'lo-trinh': true,
      'quy-trinh': true,
      'giang-vien': true,
      'phan-hoi': true,
      'hoi-dap': true,
      'dang-ky': true,
    },
    customSections: [],
    siteMedia: DEFAULT_SITE_MEDIA,
    settings: DEFAULT_SITE_SETTINGS,
  };
}

function pageFromPathname(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/quan-tri' || clean.startsWith('/quan-tri/')) return 'admin';
  if (clean === '/khoa-hoc') return 'courses';
  if (clean.startsWith('/khoa-hoc/')) {
    const slug = decodeURIComponent(clean.slice('/khoa-hoc/'.length));
    if (slug) return `course-${slug}`;
  }
  return 'home';
}

function pathnameFromPage(page: string): string {
  if (page === 'admin') return '/quan-tri';
  if (page === 'courses') return '/khoa-hoc';
  if (page.startsWith('course-')) return `/khoa-hoc/${encodeURIComponent(page.slice('course-'.length))}`;
  return '/';
}

function parseNumericPriceVnd(priceStr: string): string | null {
  const digits = priceStr.replace(/[^\d]/g, '');
  return digits.length >= 4 ? digits : null;
}

export default function App() {
  const [publishedCms, setPublishedCms] = useState<CmsSnapshot>(() =>
    buildInitialFallbackSnapshot()
  );
  const [publicDriveMedia, setPublicDriveMedia] = useState<PublicMediaResponse | null>(null);
  const [previewDraft, setPreviewDraft] = useState<CmsSnapshot | null>(null);
  const [isPublishingFromPreview, setIsPublishingFromPreview] = useState(false);

  const [currentPage, setCurrentPage] = useState<string>(() =>
    typeof window !== 'undefined' ? pageFromPathname(window.location.pathname) : 'home'
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [dismissedMobileSticky, setDismissedMobileSticky] = useState(false);

  // Admin auth state restored from server HttpOnly cookie on reload (no localStorage secrets)
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSessionToken, setAdminSessionToken] = useState<string>('');

  const refreshPublicSite = useCallback(async () => {
    try {
      const data = await fetchPublicSite();
      if (data.cms) {
        setPublishedCms(data.cms);
      }
      if (data.media) {
        setPublicDriveMedia(data.media);
      }
    } catch {
      // Fall back gracefully if backend is temporarily restarting
    }
  }, []);

  // Load real backend CMS + Drive media + check persistent HttpOnly admin session on mount
  useEffect(() => {
    refreshPublicSite();
    checkAdminSession().then((res) => {
      if (res.authenticated) {
        setIsAdmin(true);
        if (res.sessionToken) {
          setAdminSessionToken(res.sessionToken);
        }
      }
    });
  }, [refreshPublicSite]);

  // Browser back/forward synchronization
  useEffect(() => {
    const onPopState = () => {
      setCurrentPage(pageFromPathname(window.location.pathname));
      setIsMobileMenuOpen(false);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateTo = useCallback((page: string) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    if (page === 'admin') {
      setPreviewDraft(null);
    }
    const targetPath = pathnameFromPage(page);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ page }, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      setIsMobileMenuOpen(false);
      if (currentPage !== 'home') {
        navigateTo('home');
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 140);
      } else {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [currentPage, navigateTo]
  );

  // Active snapshot: Draft Preview if admin clicked XEM TRƯỚC, otherwise Published SQLite snapshot
  const activeSnapshot = previewDraft || publishedCms;

  // Derive live website media by merging published Drive assets seamlessly
  const effectiveHeroShowcase = useMemo<HeroMediaItem[]>(() => {
    const cmsActiveBanners = (activeSnapshot.heroShowcase || []).filter(
      (b) => b.active !== false
    );
    const driveBanners = publicDriveMedia?.grouped?.BANNER_HERO || [];

    if (previewDraft) {
      return cmsActiveBanners.length > 0 ? cmsActiveBanners : DEFAULT_HERO_SHOWCASE;
    }

    if (driveBanners.length === 0) {
      return cmsActiveBanners.length > 0 ? cmsActiveBanners : DEFAULT_HERO_SHOWCASE;
    }

    const existingUrls = new Set(cmsActiveBanners.map((b) => b.mediaUrl));
    const driveMapped: HeroMediaItem[] = driveBanners
      .filter((asset) => !existingUrls.has(asset.publicUrl))
      .map((asset, index) => ({
        id: `drive-${asset.id}`,
        label: asset.title.length > 22 ? `Banner ${index + 1}` : asset.title,
        title: asset.title,
        description: asset.altText || 'Học liệu và hoạt động đào tạo thực tế tại EDUNEXA.',
        mediaType: 'image',
        mediaUrl: asset.publicUrl,
        relatedCourseId: activeSnapshot.courses[0]?.id,
        active: true,
      }));

    return [...cmsActiveBanners, ...driveMapped].slice(0, 4);
  }, [activeSnapshot.heroShowcase, activeSnapshot.courses, publicDriveMedia, previewDraft]);

  // Public courses: exclude hidden, sort by displayOrder, apply Drive course cover mapping if assigned
  const effectiveCourses = useMemo<Course[]>(() => {
    const driveCourseImages = publicDriveMedia?.grouped?.ANH_KHOA_HOC || [];
    const imageByCourseId = new Map<string, SyncedMediaAsset>();
    for (const asset of driveCourseImages) {
      if (asset.courseId && !imageByCourseId.has(asset.courseId)) {
        imageByCourseId.set(asset.courseId, asset);
      }
    }

    return [...(activeSnapshot.courses || [])]
      .filter((c) => c.status !== 'hidden')
      .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999))
      .map((course) => {
        const matched = imageByCourseId.get(course.id);
        if (matched && (!course.image || course.image.startsWith('/site-assets/'))) {
          return { ...course, image: matched.publicUrl };
        }
        return course;
      });
  }, [activeSnapshot.courses, publicDriveMedia]);

  const effectiveArtifacts = useMemo<StudentArtifact[]>(() => {
    const baseArtifacts = activeSnapshot.artifacts || [];
    const driveArtifacts = publicDriveMedia?.grouped?.SAN_PHAM_HOC_VIEN || [];
    if (driveArtifacts.length === 0) return baseArtifacts;

    const existingUrls = new Set(baseArtifacts.map((a) => a.image));
    const mapped: StudentArtifact[] = driveArtifacts
      .filter((asset) => !existingUrls.has(asset.publicUrl))
      .map((asset) => ({
        id: `drive-art-${asset.id}`,
        category: 'Sản phẩm học viên · Drive',
        title: asset.title,
        description: asset.altText || 'Sản phẩm thực hành được đồng bộ trực tiếp từ thư viện EDUNEXA.',
        image: asset.publicUrl,
        courseId: effectiveCourses[0]?.id || 'ai-toan-dien-cho-giao-vien',
        courseLabel: 'Khóa học AI Toàn Diện Cho Giáo Viên',
      }));

    return [...mapped, ...baseArtifacts];
  }, [activeSnapshot.artifacts, publicDriveMedia, effectiveCourses]);

  const effectiveSiteMedia = useMemo<SiteMediaConfig>(() => {
    const founderImages = publicDriveMedia?.grouped?.ANH_GIANG_VIEN || [];
    const base = activeSnapshot.siteMedia || DEFAULT_SITE_MEDIA;
    if (founderImages.length === 0 || previewDraft) return base;
    if (base.founderPortrait && !base.founderPortrait.startsWith('/site-assets/')) {
      return base;
    }
    return {
      ...base,
      founderPortrait: founderImages[0].publicUrl,
    };
  }, [activeSnapshot.siteMedia, publicDriveMedia, previewDraft]);

  const effectiveInstructor = useMemo(() => {
    const inst = activeSnapshot.instructor;
    if (!inst) return undefined;
    if (!inst.portraitUrl || inst.portraitUrl.startsWith('/site-assets/')) {
      return {
        ...inst,
        portraitUrl: effectiveSiteMedia.founderPortrait || inst.portraitUrl,
      };
    }
    return inst;
  }, [activeSnapshot.instructor, effectiveSiteMedia.founderPortrait]);

  const galleryImages = useMemo<SyncedMediaAsset[]>(
    () => publicDriveMedia?.grouped?.THU_VIEN_ANH || [],
    [publicDriveMedia]
  );

  const partnerImages = useMemo<SyncedMediaAsset[]>(
    () => publicDriveMedia?.grouped?.ANH_DOI_TAC || [],
    [publicDriveMedia]
  );

  const activeCourse = currentPage.startsWith('course-')
    ? effectiveCourses.find((c) => `course-${c.id}` === currentPage) ||
      activeSnapshot.courses.find((c) => `course-${c.id}` === currentPage)
    : undefined;

  // Dynamic per-page SEO, Open Graph, Canonical URL, and Schema.org JSON-LD
  useEffect(() => {
    const s = activeSnapshot.settings;
    const baseTitle = s.siteName || 'EDUNEXA AI — Đào Tạo Ứng Dụng AI Thực Chiến Cho Giáo Viên';
    const baseDesc =
      s.siteDescription ||
      'Học AI thực chiến dành cho giáo viên Việt Nam: tạo giáo án chuẩn 5512, slide bài giảng, trò chơi tương tác, mô phỏng 3D, Web App và video AI giáo dục.';

    if (currentPage === 'admin') {
      applyPageSeo({
        title: 'Quản trị nội dung (/quan-tri) — EDUNEXA AI',
        description: 'Khu vực quản trị nội dung, khóa học, hình ảnh và Google Drive của EDUNEXA AI.',
        path: '/quan-tri',
      });
      return;
    }

    if (currentPage === 'courses') {
      applyPageSeo({
        title: 'Danh Mục Khóa Học AI Cho Giáo Viên — EDUNEXA AI',
        description:
          'Khám phá các khóa học AI cho giáo viên theo nhóm: soạn giáo án, thiết kế slide, trò chơi và mô phỏng, video AI giáo dục, ứng dụng và trợ lý AI.',
        path: '/khoa-hoc',
        image: effectiveHeroShowcase[0]?.mediaUrl,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Danh mục khóa học AI cho giáo viên — EDUNEXA',
          description: baseDesc,
        },
      });
      return;
    }

    if (currentPage.startsWith('course-') && activeCourse) {
      const numericPrice = parseNumericPriceVnd(activeCourse.price);
      applyPageSeo({
        title: `${activeCourse.title} — EDUNEXA AI`,
        description: activeCourse.description.slice(0, 158),
        path: `/khoa-hoc/${encodeURIComponent(activeCourse.id)}`,
        image: activeCourse.image,
        type: 'article',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: activeCourse.title,
          description: activeCourse.fullDescription || activeCourse.description,
          provider: {
            '@type': 'EducationalOrganization',
            name: 'EDUNEXA AI',
            url: s.websiteUrl || window.location.origin,
          },
          ...(numericPrice
            ? {
                offers: {
                  '@type': 'Offer',
                  price: numericPrice,
                  priceCurrency: 'VND',
                  availability: 'https://schema.org/InStock',
                },
              }
            : {}),
        },
      });
      return;
    }

    // Homepage SEO + Organization + FAQPage structured data
    const faqEntities = (activeSnapshot.faqs || []).map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    }));

    applyPageSeo({
      title: baseTitle,
      description: baseDesc,
      path: '/',
      image: effectiveHeroShowcase[0]?.mediaUrl,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'EducationalOrganization',
          name: 'EDUNEXA AI',
          description: baseDesc,
          url: window.location.origin,
          telephone: s.hotlineDisplay,
        },
        ...(faqEntities.length > 0
          ? [
              {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqEntities,
              },
            ]
          : []),
      ],
    });
  }, [currentPage, activeCourse, activeSnapshot, effectiveHeroShowcase]);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(y > 24);
      setShowScrollTop(y > 420);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenPreview = useCallback((draftSnapshot: CmsSnapshot) => {
    setPreviewDraft(draftSnapshot);
    setCurrentPage('home');
    if (window.location.pathname !== '/') {
      window.history.pushState({ page: 'home', preview: true }, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePublishFromPreview = async () => {
    if (!previewDraft) return;
    setIsPublishingFromPreview(true);
    try {
      await publishCmsDraftApi(adminSessionToken, previewDraft);
      await refreshPublicSite();
      setPreviewDraft(null);
      navigateTo('admin');
    } catch {
      navigateTo('admin');
    } finally {
      setIsPublishingFromPreview(false);
    }
  };

  // =========================================================================
  // DEDICATED /quan-tri FULL-SCREEN CMS WORKSPACE
  // =========================================================================
  if (currentPage === 'admin') {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-6">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#081426] border-t-transparent animate-spin mx-auto" />
              <p className="text-sm font-semibold text-[#081426]">Đang tải khu vực quản trị EDUNEXA...</p>
            </div>
          </div>
        }
      >
        <AdminView
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
          adminSessionToken={adminSessionToken}
          setAdminSessionToken={setAdminSessionToken}
          onRefreshPublicSite={refreshPublicSite}
          onOpenPreview={handleOpenPreview}
          navigateTo={navigateTo}
        />
      </Suspense>
    );
  }

  const settings = activeSnapshot.settings;
  const showMobileBar =
    currentPage === 'home' &&
    isScrolled &&
    settings.mobileStickyEnabled &&
    !dismissedMobileSticky &&
    !isMobileMenuOpen;

  const mobileCtaTarget = settings.mobileStickyUrl || '#dang-ky';
  const isMobileCtaHash = mobileCtaTarget.startsWith('#');

  return (
    <div className="min-h-screen overflow-x-clip font-sans bg-white text-[#081426] selection:bg-[#F5BF35] selection:text-[#081426]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#F5BF35] focus:text-[#081426] focus:font-bold focus:rounded-lg focus:shadow-lg"
      >
        Chuyển đến nội dung chính
      </a>
      {/* DRAFT PREVIEW TOP BAR (Only visible when admin clicks XEM TRƯỚC) */}
      {previewDraft && (
        <div className="sticky top-0 z-50 bg-[#081426] text-white border-b border-[#F5BF35]/40 px-4 sm:px-6 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-semibold">
              <Eye className="w-4 h-4 text-[#F5BF35] shrink-0" />
              <span>
                Đang ở chế độ <strong className="text-[#F5BF35]">XEM TRƯỚC BẢN NHÁP</strong> (chưa hiển thị cho khách truy cập)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigateTo('admin')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#102644] hover:bg-[#16345C] border border-white/15 text-white font-semibold cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại /quan-tri</span>
              </button>
              <button
                type="button"
                disabled={isPublishingFromPreview}
                onClick={handlePublishFromPreview}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#F5BF35] hover:bg-[#E2AB22] disabled:opacity-60 text-[#081426] font-extrabold cursor-pointer whitespace-nowrap"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isPublishingFromPreview ? 'Đang xuất bản...' : 'Xuất bản ngay'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 01a. STICKY HEADER */}
      <Header
        currentPage={currentPage}
        isScrolled={isScrolled}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        navigateTo={navigateTo}
        scrollToSection={scrollToSection}
      />

      {/* MAIN CONTENT */}
      <main id="main-content">
        {currentPage === 'home' && (
          <HomeView
            courses={effectiveCourses}
            heroContent={activeSnapshot.heroContent}
            heroShowcase={effectiveHeroShowcase}
            artifacts={effectiveArtifacts}
            testimonials={activeSnapshot.testimonials}
            instructor={effectiveInstructor}
            faqs={activeSnapshot.faqs}
            sectionVisibility={activeSnapshot.sectionVisibility}
            customSections={activeSnapshot.customSections}
            siteMedia={effectiveSiteMedia}
            settings={settings}
            galleryImages={galleryImages}
            partnerImages={partnerImages}
            navigateTo={navigateTo}
            scrollToSection={scrollToSection}
          />
        )}

        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center p-8 bg-[#F7F9FC]">
              <div className="w-7 h-7 rounded-full border-2 border-[#081426] border-t-transparent animate-spin" />
            </div>
          }
        >
          {currentPage === 'courses' && (
            <CoursesView
              courses={effectiveCourses}
              settings={settings}
              navigateTo={navigateTo}
            />
          )}

          {currentPage.startsWith('course-') && (
            <CourseLandingView
              course={activeCourse}
              allCourses={effectiveCourses}
              artifacts={effectiveArtifacts}
              instructor={effectiveInstructor}
              founderPortraitFallback={effectiveSiteMedia.founderPortrait}
              settings={settings}
              navigateTo={navigateTo}
            />
          )}
        </Suspense>
      </main>

      {/* 11. FOOTER */}
      <Footer
        settings={settings}
        navigateTo={navigateTo}
        scrollToSection={scrollToSection}
      />

      {/* CONFIGURABLE MOBILE STICKY CTA (Compact <= 56px, respects 15% mobile cap) */}
      <AnimatePresence>
        {showMobileBar && (
          <motion.div
            initial={{ y: 64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 64, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#081426]/95 backdrop-blur-md border-t border-white/10 px-4 py-2.5 flex items-center justify-between gap-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {settings.mobileStickySublabel}
              </p>
            </div>
            {isMobileCtaHash ? (
              <button
                type="button"
                onClick={() => scrollToSection(mobileCtaTarget.slice(1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[38px] bg-[#F5BF35] text-[#081426] rounded-lg text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{settings.mobileStickyLabel}</span>
              </button>
            ) : (
              <a
                href={mobileCtaTarget}
                target={mobileCtaTarget.startsWith('http') ? '_blank' : undefined}
                rel={mobileCtaTarget.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[38px] bg-[#F5BF35] text-[#081426] rounded-lg text-xs font-bold whitespace-nowrap shrink-0"
              >
                <span>{settings.mobileStickyLabel}</span>
                {mobileCtaTarget.startsWith('http') && <ExternalLink className="w-3.5 h-3.5" />}
              </a>
            )}
            <button
              type="button"
              onClick={() => setDismissedMobileSticky(true)}
              className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
              aria-label="Ẩn thanh đăng ký nhanh"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SINGLE CLEAN SCROLL-TO-TOP BUTTON */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed right-5 z-40 w-11 h-11 rounded-full bg-[#081426] hover:bg-[#102644] text-[#F5BF35] border border-white/15 shadow-lg flex items-center justify-center cursor-pointer transition-colors ${
              showMobileBar ? 'bottom-16 md:bottom-6' : 'bottom-6'
            }`}
            aria-label="Cuộn lên đầu trang"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
