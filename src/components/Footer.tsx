import React from 'react';
import { Shield, Phone, Globe, Users, PlayCircle, MessageCircle } from 'lucide-react';
import { EDUNEXA_LOGO } from '../data/initialData';
import type { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
  navigateTo: (page: string) => void;
  scrollToSection: (sectionId: string) => void;
}

export function Footer({ settings, navigateTo, scrollToSection }: FooterProps) {
  return (
    <footer id="footer" className="bg-[#081426] text-slate-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand & Mission */}
          <div className="md:col-span-5">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="inline-flex items-center mb-5 cursor-pointer"
              aria-label="Về đầu trang EDUNEXA"
            >
              <img
                src={EDUNEXA_LOGO}
                alt="Logo EDUNEXA AI"
                className="h-16 sm:h-20 w-auto object-contain"
              />
            </button>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md mb-6">
              Hệ thống đào tạo ứng dụng AI thực hành dành cho giáo viên và đơn vị giáo dục Việt Nam,
              hướng tới tạo ra học liệu số thực tế áp dụng ngay trong giảng dạy.
            </p>
            <div className="space-y-2.5 text-sm">
              <a
                href={settings.hotlineTel}
                className="flex items-center gap-2.5 text-slate-200 hover:text-[#F5BF35] transition-colors w-fit"
              >
                <Phone className="w-4 h-4 text-[#F5BF35] shrink-0" />
                <span>Hotline / Zalo: <strong className="text-white tabular-nums">{settings.hotlineDisplay}</strong></span>
              </a>
              <a
                href={settings.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-slate-300 hover:text-[#F5BF35] transition-colors w-fit"
              >
                <Globe className="w-4 h-4 text-[#F5BF35] shrink-0" />
                <span>{settings.websiteUrl.replace(/^https?:\/\//, '')}</span>
              </a>
            </div>
          </div>

          {/* Navigation Links (All functional) */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-bold text-white mb-4">Nội dung trang</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('gia-tri')}
                  className="hover:text-[#F5BF35] transition-colors cursor-pointer"
                >
                  Giá trị cho giáo viên
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('khoa-hoc')}
                  className="hover:text-[#F5BF35] transition-colors cursor-pointer"
                >
                  Các nhóm khóa học AI
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('san-pham')}
                  className="hover:text-[#F5BF35] transition-colors cursor-pointer"
                >
                  Sản phẩm thực hành
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('lo-trinh')}
                  className="hover:text-[#F5BF35] transition-colors cursor-pointer"
                >
                  Lộ trình 10 chuyên đề
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('hoi-dap')}
                  className="hover:text-[#F5BF35] transition-colors cursor-pointer"
                >
                  Câu hỏi thường gặp
                </button>
              </li>
            </ul>
          </div>

          {/* Verified Official Channels */}
          <div className="md:col-span-4">
            <h4 className="text-sm font-bold text-white mb-4">Kênh chính thức của EDUNEXA</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <a
                  href={settings.facebookCommunityUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 hover:text-[#F5BF35] transition-colors"
                >
                  <Users className="w-4 h-4 text-[#16B8A6] shrink-0" />
                  <span>Cộng đồng Facebook Giáo viên AI</span>
                </a>
              </li>
              <li>
                <a
                  href={settings.facebookPersonalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 hover:text-[#F5BF35] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#16B8A6] shrink-0" />
                  <span>Facebook Giảng viên Trần Đông</span>
                </a>
              </li>
              <li>
                <a
                  href={settings.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 hover:text-[#F5BF35] transition-colors"
                >
                  <PlayCircle className="w-4 h-4 text-[#16B8A6] shrink-0" />
                  <span>TikTok @trn.ng_ai.trainer</span>
                </a>
              </li>
              <li>
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 hover:text-[#F5BF35] transition-colors"
                >
                  <PlayCircle className="w-4 h-4 text-[#16B8A6] shrink-0" />
                  <span>YouTube @AITrainer.Offical</span>
                </a>
              </li>
              <li>
                <a
                  href={settings.registrationFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-[#F5BF35] font-semibold hover:underline"
                >
                  <span>Biểu mẫu đăng ký khóa học</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Admin Access */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; 2026 CONG TY TNHH MTV GIAO DUC EDUNEXA. Bảo lưu mọi quyền.</p>
          <button
            type="button"
            onClick={() => navigateTo('admin')}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#F5BF35] transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Quản trị nội dung & Hình ảnh</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
