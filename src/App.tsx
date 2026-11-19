/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowUp, ExternalLink, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type {
  Course,
  HeroMediaItem,
  PublicMediaResponse,
  SiteMediaConfig,
  SiteSettings,
  StudentArtifact,
  SyncedMediaAsset,
  TestimonialItem,
} from './types';
import {
  DEFAULT_COURSES,
  DEFAULT_HERO_SHOWCASE,
  DEFAULT_SITE_MEDIA,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_STUDENT_ARTIFACTS,
  DEFAULT_TESTIMONIALS,
  STORAGE_KEYS,
  loadFromStorage,
  saveToStorage,
} from './data/initialData';
import { fetchPublicMedia } from './services/driveApi';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { CoursesView } from './components/CoursesView';
import { CourseLandingView } from './components/CourseLandingView';
import { AdminView } from './components/AdminView';
import { Footer } from './components/Footer';

export default function App() {
  const [courses, setCourses] = useState<Course[]>(() =>
    loadFromStorage(STORAGE_KEYS.courses, DEFAULT_COURSES)
  );
  const [heroShowcase, setHeroShowcase] = useState<HeroMediaItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.heroShowcase, DEFAULT_HERO_SHOWCASE)
  );
  const [artifacts, setArtifacts] = useState<StudentArtifact[]>(() =>
    loadFromStorage(STORAGE_KEYS.artifacts, DEFAULT_STUDENT_ARTIFACTS)
  );
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.testimonials, DEFAULT_TESTIMONIALS)
  );
  const [siteMedia, setSiteMedia] = useState<SiteMediaConfig>(() =>
    loadFromStorage(STORAGE_KEYS.siteMedia, DEFAULT_SITE_MEDIA)
  );
  const [settings, setSettings] = useState<SiteSettings>(() =>
    loadFromStorage(STORAGE_KEYS.siteSettings, DEFAULT_SITE_SETTINGS)
  );

  // Live synced media published from Google Drive backend (/api/public/media)
  const [publicDriveMedia, setPublicDriveMedia] = useState<PublicMediaResponse | null>(null);

  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [dismissedMobileSticky, setDismissedMobileSticky] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  // Kept strictly in memory (never localStorage)
  const [adminSessionToken, setAdminSessionToken] = useState<string>('');

  const refreshPublicMedia = useCallback(async () => {
    try {
      const data = await fetchPublicMedia();
      setPublicDriveMedia(data);
    } catch {
      // Fall back gracefully to local default media if server is unavailable
    }
  }, []);

  useEffect(() => {
    refreshPublicMedia();
  }, [refreshPublicMedia]);

  // Sync persisted admin edits to localStorage
  useEffect(() => saveToStorage(STORAGE_KEYS.courses, courses), [courses]);
  useEffect(() => saveToStorage(STORAGE_KEYS.heroShowcase, heroShowcase), [heroShowcase]);
  useEffect(() => saveToStorage(STORAGE_KEYS.artifacts, artifacts), [artifacts]);
  useEffect(() => saveToStorage(STORAGE_KEYS.testimonials, testimonials), [testimonials]);
  useEffect(() => saveToStorage(STORAGE_KEYS.siteMedia, siteMedia), [siteMedia]);
  useEffect(() => saveToStorage(STORAGE_KEYS.siteSettings, settings), [settings]);

  // Derive live website media by merging published Drive assets with safe local fallbacks
  const effectiveHeroShowcase = useMemo<HeroMediaItem[]>(() => {
    const driveBanners = publicDriveMedia?.grouped?.BANNER_HERO || [];
    if (driveBanners.length === 0) {
      return heroShowcase.length > 0 ? heroShowcase : DEFAULT_HERO_SHOWCASE;
    }
    const mappedBanners: HeroMediaItem[] = driveBanners.map((asset, index) => ({
      id: `drive-${asset.id}`,
      label: asset.title.length > 22 ? `Banner ${index + 1}` : asset.title,
      title: asset.title,
      description: asset.altText || 'Học liệu và hoạt động đào tạo thực tế tại EDUNEXA.',
      mediaType: 'image',
      mediaUrl: asset.publicUrl,
      relatedCourseId: courses[0]?.id,
    }));
    // Keep up to 4 clean tabs in Hero showcase, falling back seamlessly if Drive banners are removed
    return mappedBanners.slice(0, 4);
  }, [publicDriveMedia, heroShowcase, courses]);

  const effectiveCourses = useMemo<Course[]>(() => {
    const driveCourseImages = publicDriveMedia?.grouped?.ANH_KHOA_HOC || [];
    if (driveCourseImages.length === 0) return courses;

    const imageByCourseId = new Map<string, SyncedMediaAsset>();
    for (const asset of driveCourseImages) {
      if (asset.courseId && !imageByCourseId.has(asset.courseId)) {
        imageByCourseId.set(asset.courseId, asset);
      }
    }

    return courses.map((course) => {
      const matched = imageByCourseId.get(course.id);
      return matched ? { ...course, image: matched.publicUrl } : course;
    });
  }, [publicDriveMedia, courses]);

  const effectiveArtifacts = useMemo<StudentArtifact[]>(() => {
    const driveArtifacts = publicDriveMedia?.grouped?.SAN_PHAM_HOC_VIEN || [];
    if (driveArtifacts.length === 0) return artifacts;

    const mapped: StudentArtifact[] = driveArtifacts.map((asset) => ({
      id: `drive-art-${asset.id}`,
      category: 'Sản phẩm học viên · Drive',
      title: asset.title,
      description: asset.altText || 'Sản phẩm thực hành được đồng bộ trực tiếp từ thư viện EDUNEXA.',
      image: asset.publicUrl,
      courseId: courses[0]?.id || 'ai-toan-dien-cho-giao-vien',
      courseLabel: 'Khóa học AI Toàn Diện Cho Giáo Viên',
    }));

    return [...mapped, ...artifacts];
  }, [publicDriveMedia, artifacts, courses]);

  const effectiveSiteMedia = useMemo<SiteMediaConfig>(() => {
    const founderImages = publicDriveMedia?.grouped?.ANH_GIANG_VIEN || [];
    if (founderImages.length === 0) return siteMedia;
    return {
      ...siteMedia,
      founderPortrait: founderImages[0].publicUrl,
    };
  }, [publicDriveMedia, siteMedia]);

  const galleryImages = useMemo<SyncedMediaAsset[]>(
    () => publicDriveMedia?.grouped?.THU_VIEN_ANH || [],
    [publicDriveMedia]
  );

  const partnerImages = useMemo<SyncedMediaAsset[]>(
    () => publicDriveMedia?.grouped?.ANH_DOI_TAC || [],
    [publicDriveMedia]
  );

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

  const navigateTo = useCallback((page: string) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      setIsMobileMenuOpen(false);
      if (currentPage !== 'home') {
        setCurrentPage('home');
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [currentPage]
  );

  const handleResetAllDefaults = useCallback(() => {
    setCourses(DEFAULT_COURSES);
    setHeroShowcase(DEFAULT_HERO_SHOWCASE);
    setArtifacts(DEFAULT_STUDENT_ARTIFACTS);
    setTestimonials(DEFAULT_TESTIMONIALS);
    setSiteMedia(DEFAULT_SITE_MEDIA);
    setSettings(DEFAULT_SITE_SETTINGS);
    Object.values(STORAGE_KEYS).forEach((key) => {
      if (key !== STORAGE_KEYS.adminPassword) {
        try {
          window.localStorage.removeItem(key);
        } catch {
          // ignore
        }
      }
    });
  }, []);

  const activeCourse = currentPage.startsWith('course-')
    ? effectiveCourses.find((c) => `course-${c.id}` === currentPage)
    : undefined;

  const showMobileBar =
    currentPage === 'home' &&
    isScrolled &&
    settings.mobileStickyEnabled &&
    !dismissedMobileSticky &&
    !isMobileMenuOpen;

  return (
    <div className="min-h-screen font-sans bg-white text-[#081426] selection:bg-[#F5BF35] selection:text-[#081426]">
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
      <main>
        {currentPage === 'home' && (
          <HomeView
            courses={effectiveCourses}
            heroShowcase={effectiveHeroShowcase}
            artifacts={effectiveArtifacts}
            testimonials={testimonials}
            siteMedia={effectiveSiteMedia}
            settings={settings}
            galleryImages={galleryImages}
            partnerImages={partnerImages}
            navigateTo={navigateTo}
            scrollToSection={scrollToSection}
          />
        )}

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
            settings={settings}
            navigateTo={navigateTo}
          />
        )}

        {currentPage === 'admin' && (
          <AdminView
            courses={courses}
            setCourses={setCourses}
            heroShowcase={heroShowcase}
            setHeroShowcase={setHeroShowcase}
            artifacts={artifacts}
            setArtifacts={setArtifacts}
            testimonials={testimonials}
            setTestimonials={setTestimonials}
            siteMedia={siteMedia}
            setSiteMedia={setSiteMedia}
            settings={settings}
            setSettings={setSettings}
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
            adminSessionToken={adminSessionToken}
            setAdminSessionToken={setAdminSessionToken}
            onRefreshPublicMedia={refreshPublicMedia}
            onResetAllDefaults={handleResetAllDefaults}
            navigateTo={navigateTo}
          />
        )}
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
            <a
              href={settings.mobileStickyUrl || settings.registrationFormUrl}
              target={
                (settings.mobileStickyUrl || settings.registrationFormUrl).startsWith('http')
                  ? '_blank'
                  : undefined
              }
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F5BF35] text-[#081426] rounded-lg text-xs font-bold whitespace-nowrap shrink-0"
            >
              <span>{settings.mobileStickyLabel}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
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
