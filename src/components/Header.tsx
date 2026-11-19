import React, { useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { EDUNEXA_LOGO } from '../data/initialData';

interface HeaderProps {
  currentPage: string;
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navigateTo: (page: string) => void;
  scrollToSection: (sectionId: string) => void;
}

const NAV_ITEMS = [
  { label: 'Giá trị', sectionId: 'gia-tri' },
  { label: 'Khóa học', sectionId: 'khoa-hoc' },
  { label: 'Sản phẩm', sectionId: 'san-pham' },
  { label: 'Lộ trình', sectionId: 'lo-trinh' },
  { label: 'Hỏi đáp', sectionId: 'hoi-dap' },
];

export function Header({
  currentPage,
  isScrolled,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  navigateTo,
  scrollToSection,
}: HeaderProps) {
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-200 ${
        isScrolled
          ? 'bg-[#081426]/95 backdrop-blur-md border-b border-white/10 shadow-sm'
          : 'bg-[#081426] border-b border-white/[0.06]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-4 lg:gap-8 h-[68px]">
          {/* Zone 1: Clean Brand Logo */}
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="flex items-center shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5BF35] rounded-md"
            aria-label="Trang chủ EDUNEXA"
          >
            <img
              src={EDUNEXA_LOGO}
              alt="EDUNEXA AI"
              className="h-10 sm:h-11 lg:h-12 w-auto object-contain"
            />
          </button>

          {/* Zone 2: 5 Concise Single-Line Nav Links */}
          <nav
            aria-label="Điều hướng chính"
            className="hidden md:flex items-center gap-4 lg:gap-7 text-sm font-medium text-slate-300"
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.sectionId}
                type="button"
                onClick={() => scrollToSection(item.sectionId)}
                className="py-1.5 text-slate-200 hover:text-[#F5BF35] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5BF35] rounded"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="hidden md:flex items-center shrink-0">
            <button
              type="button"
              onClick={() => scrollToSection('dang-ky')}
              className="inline-flex items-center gap-2 px-4 lg:px-5 py-2.5 bg-[#F5BF35] hover:bg-[#E2AB22] text-[#081426] text-sm font-bold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Đăng ký học</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburger Trigger */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu điều hướng'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#081426]/70 backdrop-blur-xs z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 w-[290px] max-w-[85vw] bg-[#081426] text-white z-[70] md:hidden border-l border-white/10 shadow-2xl flex flex-col"
            >
              <div className="px-5 py-4 flex items-center justify-between border-b border-white/10">
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="flex items-center cursor-pointer"
                  aria-label="Trang chủ EDUNEXA"
                >
                  <img src={EDUNEXA_LOGO} alt="EDUNEXA AI" className="h-10 w-auto object-contain" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Đóng menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav aria-label="Điều hướng di động" className="flex-1 px-5 py-6 flex flex-col justify-between overflow-y-auto">
                <ul className="space-y-1">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.sectionId}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(item.sectionId)}
                        className="w-full text-left px-3 py-3 text-base font-semibold text-slate-100 hover:text-[#F5BF35] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      type="button"
                      onClick={() => navigateTo('courses')}
                      className={`w-full text-left px-3 py-3 text-base font-semibold rounded-lg transition-colors cursor-pointer ${
                        currentPage === 'courses'
                          ? 'text-[#F5BF35] bg-white/5'
                          : 'text-slate-100 hover:text-[#F5BF35] hover:bg-white/5'
                      }`}
                    >
                      Danh mục khóa học
                    </button>
                  </li>
                </ul>

                <div className="pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => scrollToSection('dang-ky')}
                    className="w-full py-3.5 px-5 bg-[#F5BF35] hover:bg-[#E2AB22] text-[#081426] font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Đăng ký khóa học</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
