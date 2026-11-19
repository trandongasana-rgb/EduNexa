import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  FileText,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react';
import type { Course, InquiryRecord, SiteSettings } from '../types';
import { submitPublicInquiry } from '../services/driveApi';

interface RegistrationFormProps {
  courses: Course[];
  selectedCourseId: string;
  onSelectCourseId?: (courseId: string) => void;
  lockCourseSelection?: boolean;
  settings: SiteSettings;
  source: string;
  variant?: 'dark' | 'light';
}

export function RegistrationForm({
  courses,
  selectedCourseId,
  onSelectCourseId,
  lockCourseSelection = false,
  settings,
  source,
  variant = 'dark',
}: RegistrationFormProps) {
  const [courseId, setCourseId] = useState(selectedCourseId);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [savedRecord, setSavedRecord] = useState<InquiryRecord | null>(null);

  useEffect(() => {
    setCourseId(selectedCourseId);
  }, [selectedCourseId]);

  const activeCourse =
    courses.find((c) => c.id === courseId) || courses[0];

  const handleCourseChange = (nextId: string) => {
    setCourseId(nextId);
    onSelectCourseId?.(nextId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (fullName.trim().length < 2) {
      setErrorMsg('Vui lòng nhập họ và tên đầy đủ của Thầy / Cô.');
      return;
    }
    if (phone.replace(/\D/g, '').length < 8) {
      setErrorMsg('Vui lòng nhập số điện thoại hoặc số Zalo hợp lệ (tối thiểu 8 chữ số).');
      return;
    }
    if (!consentAccepted) {
      setErrorMsg('Vui lòng tích đồng ý với chính sách xử lý thông tin trước khi gửi đăng ký.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitPublicInquiry({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        courseId: activeCourse?.id || '',
        courseTitle: activeCourse?.title || 'Tư vấn lộ trình khóa học AI',
        note: note.trim(),
        source,
        consentAccepted: true,
      });

      if (!res?.ok || !res?.inquiry?.id) {
        throw new Error('Máy chủ không xác nhận lưu bản ghi. Vui lòng thử lại.');
      }

      setSavedRecord(res.inquiry);
      setFullName('');
      setPhone('');
      setEmail('');
      setNote('');
      setConsentAccepted(false);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Không thể gửi đăng ký tới máy chủ. Vui lòng thử lại sau ít phút.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDark = variant === 'dark';
  const labelClass = isDark
    ? 'block text-xs font-semibold text-slate-300 mb-1.5'
    : 'block text-xs font-semibold text-slate-700 mb-1.5';
  const inputClass = isDark
    ? 'w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-[#081426] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F5BF35]'
    : 'w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-[#F7F9FC] border border-slate-300 text-sm text-[#081426] placeholder:text-slate-400 focus:outline-none focus:border-[#081426]';

  const registerFormHref = activeCourse?.registerUrl || settings.registrationFormUrl;
  const zaloHref = settings.zaloConsultUrl?.trim() || '';
  const paymentHref = settings.paymentUrl?.trim() || '';

  return (
    <>
      {savedRecord ? (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-2xl border p-6 space-y-4 ${
            isDark
              ? 'bg-[#102644] border-[#16B8A6]/50 text-white'
              : 'bg-[#F0FDFA] border-[#99F6E4] text-[#081426]'
          }`}
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#16B8A6] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base sm:text-lg font-extrabold leading-snug">
                Đăng ký đã được lưu thành công trên hệ thống EDUNEXA
              </h3>
              <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Cảm ơn <strong className={isDark ? 'text-white' : 'text-[#081426]'}>{savedRecord.fullName}</strong>. Đội ngũ tư vấn sẽ liên hệ qua số{' '}
                <strong className="tabular-nums">{savedRecord.phone}</strong> để hướng dẫn kích hoạt khóa học và mời vào nhóm Zalo hỗ trợ.
              </p>
            </div>
          </div>

          <dl
            className={`rounded-xl p-4 text-xs sm:text-sm space-y-2 border ${
              isDark
                ? 'bg-[#081426]/70 border-white/10 text-slate-200'
                : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <dt className={isDark ? 'text-slate-400' : 'text-slate-500'}>Mã tiếp nhận</dt>
              <dd className="font-bold font-mono text-[#16B8A6]">{savedRecord.id}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className={isDark ? 'text-slate-400' : 'text-slate-500'}>Khóa học đã chọn</dt>
              <dd className="font-bold text-right">{savedRecord.courseTitle || 'Tư vấn lộ trình AI'}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {zaloHref && (
              <a
                href={zaloHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[42px] rounded-xl bg-[#F5BF35] hover:bg-[#E2AB22] text-[#081426] text-xs font-bold transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Nhắn Zalo tư vấn ngay</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {paymentHref && (
              <a
                href={paymentHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[42px] rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-bold transition-colors whitespace-nowrap"
              >
                <CreditCard className="w-4 h-4" />
                <span>Đi tới trang thanh toán</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              type="button"
              onClick={() => setSavedRecord(null)}
              className={`px-4 py-2.5 min-h-[42px] rounded-xl text-xs font-semibold border cursor-pointer transition-colors ${
                isDark
                  ? 'border-white/20 text-slate-200 hover:bg-white/10'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Đăng ký thêm khóa học khác
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className={`rounded-2xl border p-5 sm:p-6 space-y-4 ${
            isDark
              ? 'bg-[#102644] border-white/12 text-white'
              : 'bg-white border-slate-200 text-[#081426]'
          }`}
        >
          {/* Step 1: Course Selection */}
          <div>
            <label htmlFor={`reg-course-${source}`} className={labelClass}>
              1. Chọn khóa học muốn đăng ký *
            </label>
            {lockCourseSelection && activeCourse ? (
              <div
                className={`px-3.5 py-2.5 min-h-[44px] rounded-xl border text-sm font-bold flex items-center justify-between gap-3 ${
                  isDark
                    ? 'bg-[#081426] border-white/15 text-white'
                    : 'bg-[#F7F9FC] border-slate-200 text-[#081426]'
                }`}
              >
                <span className="truncate">{activeCourse.title}</span>
                <span className="text-[#F5BF35] bg-[#081426] px-2.5 py-0.5 rounded-md text-xs font-extrabold tabular-nums shrink-0">
                  {activeCourse.price}
                </span>
              </div>
            ) : (
              <select
                id={`reg-course-${source}`}
                value={activeCourse?.id || ''}
                onChange={(e) => handleCourseChange(e.target.value)}
                className={`${inputClass} font-semibold cursor-pointer`}
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} — {c.price}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Step 2: Name & Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label htmlFor={`reg-name-${source}`} className={labelClass}>
                2. Họ và tên Thầy / Cô *
              </label>
              <input
                id={`reg-name-${source}`}
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="VD: Nguyễn Minh Anh"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor={`reg-phone-${source}`} className={labelClass}>
                Số điện thoại / Zalo *
              </label>
              <input
                id={`reg-phone-${source}`}
                type="tel"
                required
                autoComplete="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="VD: 0944 562 096"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label htmlFor={`reg-email-${source}`} className={labelClass}>
                Email nhận tài liệu (không bắt buộc)
              </label>
              <input
                id={`reg-email-${source}`}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@truonghoc.edu.vn"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor={`reg-note-${source}`} className={labelClass}>
                Cấp học / Môn dạy / Nhu cầu hỗ trợ
              </label>
              <input
                id={`reg-note-${source}`}
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="VD: Giáo viên Tiểu học, Toán THCS..."
                className={inputClass}
              />
            </div>
          </div>

          {/* Step 3: Mandatory Data Processing Policy Consent */}
          <div
            className={`p-3.5 rounded-xl border ${
              isDark
                ? 'bg-[#081426]/60 border-white/10'
                : 'bg-[#F7F9FC] border-slate-200'
            }`}
          >
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consentAccepted}
                onChange={(e) => {
                  setConsentAccepted(e.target.checked);
                  if (errorMsg) setErrorMsg('');
                }}
                className="mt-0.5 w-4 h-4 rounded accent-[#F5BF35] cursor-pointer shrink-0"
              />
              <span className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Tôi đồng ý để EDUNEXA thu thập và xử lý thông tin liên hệ trên nhằm tư vấn lộ trình,
                hướng dẫn đăng ký và hỗ trợ học tập theo{' '}
                <button
                  type="button"
                  onClick={() => setShowPolicyModal(true)}
                  className={`font-bold underline cursor-pointer ${
                    isDark ? 'text-[#F5BF35] hover:text-white' : 'text-[#081426] hover:text-[#0D9488]'
                  }`}
                >
                  Chính sách xử lý thông tin
                </button>
                . *
              </span>
            </label>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-start gap-2 border ${
                isDark
                  ? 'bg-rose-500/15 border-rose-400/35 text-rose-200'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Step 4: Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] bg-[#F5BF35] hover:bg-[#E2AB22] disabled:opacity-60 text-[#081426] font-extrabold text-sm rounded-xl transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Đang lưu đăng ký lên hệ thống...' : 'Gửi đăng ký khóa học'}</span>
          </button>

          {/* Verified Admin-Configured Support & Registration Links (Zero fake links) */}
          <div
            className={`pt-3 border-t flex flex-wrap items-center gap-2.5 text-xs ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}
          >
            {zaloHref && (
              <a
                href={zaloHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold border transition-colors whitespace-nowrap ${
                  isDark
                    ? 'bg-[#081426] border-white/15 text-slate-200 hover:border-[#16B8A6] hover:text-white'
                    : 'bg-[#F7F9FC] border-slate-200 text-[#081426] hover:border-[#081426]'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#16B8A6]" />
                <span>Zalo tư vấn</span>
              </a>
            )}

            {settings.hotlineTel && (
              <a
                href={settings.hotlineTel}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold border transition-colors whitespace-nowrap tabular-nums ${
                  isDark
                    ? 'bg-[#081426] border-white/15 text-slate-200 hover:border-[#F5BF35] hover:text-white'
                    : 'bg-[#F7F9FC] border-slate-200 text-[#081426] hover:border-[#081426]'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-[#F5BF35]" />
                <span>Hotline: {settings.hotlineDisplay}</span>
              </a>
            )}

            {registerFormHref && (
              <a
                href={registerFormHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold border transition-colors whitespace-nowrap ${
                  isDark
                    ? 'bg-[#081426] border-white/15 text-slate-200 hover:border-[#F5BF35] hover:text-white'
                    : 'bg-[#F7F9FC] border-slate-200 text-[#081426] hover:border-[#081426]'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[#F5BF35]" />
                <span>Biểu mẫu Google Form</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {paymentHref && (
              <a
                href={paymentHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold border transition-colors whitespace-nowrap ${
                  isDark
                    ? 'bg-[#081426] border-[#16B8A6]/40 text-[#99F6E4] hover:border-[#16B8A6]'
                    : 'bg-[#F0FDFA] border-[#99F6E4] text-[#0F766E] hover:border-[#0D9488]'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Trang thanh toán</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </form>
      )}

      {/* Privacy & Data Processing Policy Modal */}
      {showPolicyModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edunexa-policy-title"
          className="fixed inset-0 z-50 bg-[#081426]/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowPolicyModal(false)}
        >
          <div
            className="bg-white text-[#081426] rounded-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#0D9488] shrink-0" />
                <h3 id="edunexa-policy-title" className="text-base font-extrabold text-[#081426]">
                  Chính sách xử lý thông tin đăng ký — EDUNEXA
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPolicyModal(false)}
                className="p-1 text-slate-400 hover:text-[#081426] cursor-pointer"
                aria-label="Đóng chính sách"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <p>
                <strong className="text-[#081426]">1. Mục đích thu thập:</strong> Thông tin họ tên, số điện thoại/Zalo, email và ghi chú chuyên môn chỉ được sử dụng để tư vấn chương trình phù hợp, xác nhận đăng ký khóa học, cấp quyền truy cập tài liệu và hỗ trợ Thầy Cô trong nhóm Zalo học tập.
              </p>
              <p>
                <strong className="text-[#081426]">2. Phạm vi lưu trữ & bảo mật:</strong> Dữ liệu đăng ký được lưu trữ trên hệ thống quản trị nội bộ của EDUNEXA và chỉ có nhân sự phụ trách đào tạo được cấp quyền truy cập. EDUNEXA không chia sẻ, mua bán hoặc chuyển giao thông tin cho bên thứ ba.
              </p>
              <p>
                <strong className="text-[#081426]">3. Quyền của người đăng ký:</strong> Thầy Cô có quyền yêu cầu kiểm tra, cập nhật hoặc xóa thông tin cá nhân bất cứ lúc nào thông qua Hotline/Zalo{' '}
                <strong className="text-[#081426] tabular-nums">{settings.hotlineDisplay}</strong>
                {settings.contactEmail ? ` hoặc email ${settings.contactEmail}` : ''}.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setConsentAccepted(true);
                  setShowPolicyModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#081426] hover:bg-[#102644] text-white text-xs font-bold cursor-pointer"
              >
                Tôi đồng ý và đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
