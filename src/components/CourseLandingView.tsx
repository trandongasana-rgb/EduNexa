import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  ExternalLink,
  FileText,
  Phone,
  Users,
  MessageCircle,
  AlertCircle,
} from 'lucide-react';
import type { Course, SiteSettings } from '../types';
import { VIETQR_IMAGE } from '../data/initialData';
import { MediaFrame } from './MediaFrame';

interface CourseLandingViewProps {
  course: Course | undefined;
  settings: SiteSettings;
  navigateTo: (page: string) => void;
}

export function CourseLandingView({
  course,
  settings,
  navigateTo,
}: CourseLandingViewProps) {
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

  const registerHref = course.registerUrl || settings.registrationFormUrl;

  return (
    <div className="bg-[#F7F9FC]">
      {/* Breadcrumb Bar */}
      <div className="bg-[#102644] text-slate-300 border-b border-white/10">
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
        </div>
      </div>

      {/* Course Hero */}
      <section className="bg-[#081426] text-white py-14 sm:py-18 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs sm:text-sm font-semibold text-[#16B8A6] mb-3">
                {course.subtitle} · Đối tượng: {course.target}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-5">
                {course.title}
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6">
                {course.fullDescription || course.description}
              </p>

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
                  onClick={() =>
                    document.getElementById('course-register-section')?.scrollIntoView({
                      behavior: 'smooth',
                    })
                  }
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[50px] bg-[#F5BF35] hover:bg-[#E2AB22] text-[#081426] font-bold text-sm rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Đăng ký khóa học</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={registerHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[50px] bg-[#102644] hover:bg-[#16345C] text-white border border-white/15 font-semibold text-sm rounded-xl transition-colors whitespace-nowrap"
                >
                  <span>Mở biểu mẫu đăng ký</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-white/15 bg-[#102644]">
                <MediaFrame
                  src={course.image}
                  alt={course.title}
                  className="aspect-[16/10] w-full"
                  imgClassName="w-full h-full object-cover object-top"
                />
                <div className="p-5 border-t border-white/10">
                  <p className="text-xs font-semibold text-[#16B8A6] mb-1">Kết quả hướng tới</p>
                  <p className="text-sm text-slate-200 leading-relaxed">{course.outcome}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pains & Solutions */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Pains */}
          <div className="p-7 sm:p-8 rounded-2xl bg-[#F7F9FC] border border-slate-200">
            <p className="text-xs font-semibold text-slate-500 mb-2">Vấn đề thực tế</p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#081426] mb-5">
              Những vướng mắc chương trình giúp tháo gỡ
            </h2>
            <ul className="space-y-3.5">
              {course.pains.map((pain, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-700 leading-relaxed">
                  <AlertCircle className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                  <span>{pain}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div className="p-7 sm:p-8 rounded-2xl bg-[#F7F9FC] border border-slate-200">
            <p className="text-xs font-semibold text-[#0D9488] mb-2">Giải pháp thực hành</p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#081426] mb-5">
              Những gì Thầy Cô thực hiện được sau khóa học
            </h2>
            <ul className="space-y-3.5">
              {course.solutions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-800 leading-relaxed">
                  <Check className="w-5 h-5 text-[#0D9488] mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3 Pillars for Bộ Tài Liệu 03 Ngày */}
      {course.id === 'bo-tai-lieu-quan-trong' && (
        <section className="py-16 bg-[#F7F9FC] border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="max-w-2xl mb-10">
              <p className="text-xs font-semibold text-[#0D9488] mb-2">Cấu trúc cốt lõi</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#081426]">
                Hệ thống 3 trụ cột thực hành
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  num: '01',
                  title: 'Làm nhanh việc bắt buộc',
                  desc: 'Soạn kế hoạch bài dạy, đề kiểm tra, phiếu học tập và hồ sơ chuyên môn có quy trình rõ ràng.',
                },
                {
                  num: '02',
                  title: 'Làm tốt việc trên lớp',
                  desc: 'Thiết kế trò chơi học tập, mô phỏng 3D và thí nghiệm ảo tăng sự chủ động của học sinh.',
                },
                {
                  num: '03',
                  title: 'Làm hay việc truyền đạt',
                  desc: 'Chuyển hóa nội dung kiến thức thành video bài giảng và học liệu số trực quan.',
                },
              ].map((pillar) => (
                <div
                  key={pillar.num}
                  className="bg-white p-7 rounded-2xl border border-slate-200"
                >
                  <span className="text-2xl font-extrabold text-[#F5BF35] tabular-nums block mb-3">
                    {pillar.num}
                  </span>
                  <h3 className="text-lg font-bold text-[#081426] mb-2">{pillar.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Curriculum */}
      <section className="py-16 sm:py-20 bg-[#081426] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold text-[#16B8A6] mb-2">Nội dung chi tiết</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Chương trình học ({course.curriculum.length} phần)
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Sắp xếp theo trình tự từ nền tảng đến hoàn thiện sản phẩm phục vụ công việc giảng dạy.
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
        </div>
      </section>

      {/* Gifts / Included Resources */}
      {course.gifts.length > 0 && (
        <section className="py-16 bg-[#F7F9FC] border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="max-w-2xl mb-10">
              <p className="text-xs font-semibold text-[#0D9488] mb-2">Tài nguyên đi kèm</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#081426]">
                Quà tặng và học liệu đi kèm khóa học
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {course.gifts.map((gift, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-slate-200 flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F5BF35]/15 text-[#081426] flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-[#081426] leading-relaxed">
                    {gift}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Payment & Registration */}
      <section id="course-register-section" className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="rounded-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12">
            {/* Left Payment Details */}
            <div className="md:col-span-5 bg-[#081426] text-white p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-[#16B8A6] mb-2">
                  Thông tin học phí & thanh toán
                </p>
                <div className="flex items-baseline gap-3 mb-6 tabular-nums">
                  <span className="text-3xl font-extrabold text-[#F5BF35]">{course.price}</span>
                  {hasDiscount && (
                    <span className="text-sm text-slate-400 line-through">
                      {course.originalPrice}
                    </span>
                  )}
                </div>

                {course.price !== 'Liên hệ' && (
                  <div className="mb-6 flex flex-col items-center p-4 rounded-xl bg-[#102644] border border-white/10">
                    <div className="bg-white p-2.5 rounded-xl w-full max-w-[180px]">
                      <img
                        src={VIETQR_IMAGE}
                        alt="Mã VietQR thanh toán EDUNEXA"
                        className="w-full h-auto object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="text-xs text-slate-300 mt-2.5 text-center">
                      Quét mã VietQR Techcombank
                    </p>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-[#102644] border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed mb-6">
                  {course.paymentInfo}
                </div>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-300 pt-4 border-t border-white/10">
                <a
                  href={settings.hotlineTel}
                  className="flex items-center gap-2 hover:text-[#F5BF35] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#F5BF35]" />
                  <span>Hotline / Zalo: {settings.hotlineDisplay}</span>
                </a>
                <a
                  href={settings.facebookPersonalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#F5BF35] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#F5BF35]" />
                  <span>Facebook Giảng viên Trần Đông</span>
                </a>
                <a
                  href={settings.facebookCommunityUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#F5BF35] transition-colors"
                >
                  <Users className="w-4 h-4 text-[#F5BF35]" />
                  <span>Cộng đồng Giáo viên AI EDUNEXA</span>
                </a>
              </div>
            </div>

            {/* Right Direct Form Link */}
            <div className="md:col-span-7 p-7 sm:p-10 flex flex-col justify-center bg-white">
              <div className="w-12 h-12 rounded-xl bg-[#F5BF35]/15 text-[#081426] flex items-center justify-center mb-5">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#081426] mb-3">
                Hoàn tất đăng ký khóa học
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-7">
                Sau khi chuyển khoản học phí (hoặc khi cần tư vấn gói Coaching), Thầy Cô vui lòng điền
                thông tin vào biểu mẫu đăng ký chính thức của EDUNEXA để được kích hoạt tài khoản và
                mời vào nhóm Zalo hỗ trợ.
              </p>

              <a
                href={registerHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-fit px-8 py-3.5 min-h-[50px] bg-[#F5BF35] hover:bg-[#E2AB22] text-[#081426] font-bold text-sm rounded-xl transition-colors mb-4"
              >
                <span>ĐIỀN BIỂU MẪU ĐĂNG KÝ</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <p className="text-xs text-slate-500">
                Cần hỗ trợ trực tiếp? Gọi hoặc nhắn Zalo {settings.hotlineDisplay}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
