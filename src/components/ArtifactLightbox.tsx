import React, { useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export interface LightboxSlide {
  id: string;
  image: string;
  title: string;
  category?: string;
  description?: string;
  courseId?: string;
  courseLabel?: string;
}

interface ArtifactLightboxProps {
  slides: LightboxSlide[];
  activeIndex: number | null;
  onClose: () => void;
  onChangeIndex: (nextIndex: number) => void;
  onViewCourse?: (courseId: string) => void;
}

export function ArtifactLightbox({
  slides,
  activeIndex,
  onClose,
  onChangeIndex,
  onViewCourse,
}: ArtifactLightboxProps) {
  const isOpen = activeIndex !== null && slides.length > 0 && Boolean(slides[activeIndex]);
  const current = isOpen && activeIndex !== null ? slides[activeIndex] : null;

  useEffect(() => {
    if (!isOpen || activeIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onChangeIndex((activeIndex + 1) % slides.length);
      if (e.key === 'ArrowLeft') onChangeIndex((activeIndex - 1 + slides.length) % slides.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, activeIndex, slides.length, onClose, onChangeIndex]);

  return (
    <AnimatePresence>
      {isOpen && current && activeIndex !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#081426]/85 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#102644] text-white rounded-2xl border border-white/15 max-w-4xl w-full overflow-hidden shadow-2xl"
          >
            {/* Header bar */}
            <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between gap-4">
              <div className="min-w-0">
                {current.category && (
                  <p className="text-[11px] font-semibold text-[#16B8A6] truncate">
                    {current.category}
                  </p>
                )}
                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                  {current.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-400 tabular-nums">
                  {activeIndex + 1} / {slides.length}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-lg bg-[#081426] hover:bg-white/10 text-slate-200 cursor-pointer"
                  aria-label="Đóng xem ảnh"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Image viewport */}
            <div className="relative bg-[#081426] flex items-center justify-center max-h-[65vh] overflow-hidden">
              <img
                src={current.image}
                alt={current.title}
                className="max-h-[65vh] w-auto max-w-full object-contain"
                referrerPolicy="no-referrer"
              />

              {slides.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => onChangeIndex((activeIndex - 1 + slides.length) % slides.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#081426]/80 hover:bg-[#081426] border border-white/15 text-white flex items-center justify-center cursor-pointer"
                    aria-label="Ảnh trước"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeIndex((activeIndex + 1) % slides.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#081426]/80 hover:bg-[#081426] border border-white/15 text-white flex items-center justify-center cursor-pointer"
                    aria-label="Ảnh tiếp theo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Caption footer */}
            <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {current.description || current.title}
              </p>
              {current.courseId && onViewCourse && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewCourse(current.courseId!);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F5BF35] hover:bg-[#E2AB22] text-[#081426] text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Xem khóa học liên quan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
