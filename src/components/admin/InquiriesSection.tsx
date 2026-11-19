import React, { useCallback, useEffect, useState } from 'react';
import {
  Download,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserPlus,
} from 'lucide-react';
import type { Course, InquiryRecord, InquiryStatus, SiteSettings } from '../../types';
import {
  createAdminInquiryApi,
  deleteInquiryApi,
  fetchInquiriesApi,
  updateInquiryApi,
} from '../../services/driveApi';

interface InquiriesSectionProps {
  adminSessionToken: string;
  courses: Course[];
  settings: SiteSettings;
  onChangeSettings: (next: SiteSettings) => void;
  onNotify: (msg: string) => void;
}

const STATUS_LABELS: Record<InquiryStatus, { label: string; colorClass: string }> = {
  new: { label: 'Mới tiếp nhận', colorClass: 'text-amber-700' },
  contacted: { label: 'Đã liên hệ', colorClass: 'text-[#0D9488]' },
  enrolled: { label: 'Đã đăng ký học', colorClass: 'text-emerald-700' },
  archived: { label: 'Lưu trữ', colorClass: 'text-slate-500' },
};

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('vi-VN', {
      hour12: false,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function InquiriesSection({
  adminSessionToken,
  courses,
  settings,
  onChangeSettings,
  onNotify,
}: InquiriesSectionProps) {
  const [items, setItems] = useState<InquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Manual add form state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCourseId, setNewCourseId] = useState(courses[0]?.id || '');
  const [newNote, setNewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchInquiriesApi(adminSessionToken, {
        status: statusFilter,
        search,
      });
      setItems(res.items);
      setErrorMsg(null);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể tải danh sách đăng ký.');
    } finally {
      setLoading(false);
    }
  }, [adminSessionToken, statusFilter, search]);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const courseObj = courses.find((c) => c.id === newCourseId);
      await createAdminInquiryApi(adminSessionToken, {
        fullName: newName,
        phone: newPhone,
        email: newEmail,
        courseId: courseObj?.id || '',
        courseTitle: courseObj?.title || '',
        note: newNote,
      });
      setNewName('');
      setNewPhone('');
      setNewEmail('');
      setNewNote('');
      setShowAddForm(false);
      await loadInquiries();
      onNotify('Đã thêm bản ghi đăng ký/liên hệ mới vào cơ sở dữ liệu.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể thêm bản ghi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (
    id: string,
    patch: { status?: InquiryStatus; adminNotes?: string }
  ) => {
    try {
      await updateInquiryApi(adminSessionToken, id, patch);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
      );
      onNotify('Đã lưu cập nhật trạng thái liên hệ.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Cập nhật thất bại.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInquiryApi(adminSessionToken, id);
      setConfirmDeleteId(null);
      setItems((prev) => prev.filter((item) => item.id !== id));
      onNotify('Đã xóa bản ghi liên hệ.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Xóa thất bại.');
    }
  };

  const handleExportCsv = () => {
    if (items.length === 0) return;
    const header = ['Thời gian', 'Họ tên', 'Số điện thoại', 'Email', 'Khóa học', 'Trạng thái', 'Ghi chú học viên', 'Ghi chú quản trị'];
    const rows = items.map((i) => [
      formatDateTime(i.createdAt),
      i.fullName,
      i.phone,
      i.email,
      i.courseTitle,
      STATUS_LABELS[i.status]?.label || i.status,
      i.note,
      i.adminNotes,
    ]);
    const csvContent =
      '\uFEFF' +
      [header, ...rows]
        .map((row) => row.map((v) => `"${String(v || '').replace(/"/g, '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edunexa-dang-ky-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 1. Real Registration & Inquiry Submissions */}
      <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-extrabold text-[#081426]">
              Danh sách đăng ký & yêu cầu tư vấn ({items.length})
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Lưu trực tiếp các đăng ký gửi từ biểu mẫu cuối trang chủ hoặc do quản trị viên thêm mới.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#081426] text-white text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#F5BF35]" />
              <span>Thêm liên hệ</span>
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={items.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-[#081426] cursor-pointer disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất CSV</span>
            </button>
          </div>
        </div>

        {/* Manual Add Lead Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddLead}
            className="p-4 rounded-xl bg-[#F7F9FC] border border-slate-200 space-y-3"
          >
            <p className="text-xs font-bold text-[#081426] flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-[#0D9488]" />
              <span>Thêm học viên đăng ký thủ công (từ Zalo / Hotline)</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Họ và tên Thầy / Cô *"
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-[#081426]"
              />
              <input
                type="text"
                required
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Số điện thoại / Zalo *"
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-[#081426]"
              />
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Email (tùy chọn)"
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-[#081426]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={newCourseId}
                onChange={(e) => setNewCourseId(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-[#081426]"
              >
                <option value="">Chọn khóa học quan tâm</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Ghi chú nhu cầu (cấp học, bộ môn...)"
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-[#081426]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-1.5 rounded-lg bg-[#F5BF35] text-[#081426] text-xs font-bold cursor-pointer"
              >
                {submitting ? 'Đang lưu...' : 'Lưu liên hệ'}
              </button>
            </div>
          </form>
        )}

        {/* Search & Status Filter */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, số điện thoại, khóa học..."
              className="w-full pl-9 pr-3.5 py-2 bg-[#F7F9FC] border border-slate-200 rounded-xl text-sm text-[#081426]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#F7F9FC] border border-slate-200 rounded-xl text-xs font-semibold text-[#081426]"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="new">Mới tiếp nhận</option>
            <option value="contacted">Đã liên hệ</option>
            <option value="enrolled">Đã đăng ký học</option>
            <option value="archived">Lưu trữ</option>
          </select>
          <button
            type="button"
            onClick={loadInquiries}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#081426] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tải lại</span>
          </button>
        </div>

        {errorMsg && (
          <p className="text-xs font-semibold text-rose-600">{errorMsg}</p>
        )}

        {/* List */}
        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Đang tải dữ liệu đăng ký...</p>
        ) : items.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#F7F9FC] border border-dashed border-slate-300 text-center space-y-1.5">
            <p className="text-sm font-bold text-[#081426]">Chưa có yêu cầu đăng ký nào</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Khi giáo viên điền biểu mẫu đăng ký nhanh tại cuối trang chủ, thông tin sẽ tự động lưu tại đây theo thời gian thực.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((inq) => {
              const st = STATUS_LABELS[inq.status] || STATUS_LABELS.new;
              return (
                <div
                  key={inq.id}
                  className="p-4 rounded-xl bg-[#F7F9FC] border border-slate-200 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className={`font-bold ${st.colorClass}`}>{st.label}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-500 tabular-nums">
                          {formatDateTime(inq.createdAt)}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-500">
                          Nguồn: {inq.source === 'website' ? 'Biểu mẫu website' : 'Nhập tay'}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-[#081426] mt-1">
                        {inq.fullName}{' '}
                        <span className="font-mono text-xs font-semibold text-[#0D9488] ml-1">
                          {inq.phone}
                        </span>
                        {inq.email && (
                          <span className="text-xs font-normal text-slate-500 ml-2">
                            {inq.email}
                          </span>
                        )}
                      </p>
                      {inq.courseTitle && (
                        <p className="text-xs text-slate-600 mt-0.5">
                          Khóa học quan tâm: <strong>{inq.courseTitle}</strong>
                        </p>
                      )}
                      {inq.note && (
                        <p className="text-xs text-slate-600 mt-1">Lời nhắn: {inq.note}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={inq.status}
                        onChange={(e) =>
                          handleUpdate(inq.id, { status: e.target.value as InquiryStatus })
                        }
                        className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-[#081426]"
                      >
                        <option value="new">Mới tiếp nhận</option>
                        <option value="contacted">Đã liên hệ</option>
                        <option value="enrolled">Đã đăng ký học</option>
                        <option value="archived">Lưu trữ</option>
                      </select>

                      {confirmDeleteId === inq.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDelete(inq.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold cursor-pointer"
                          >
                            Xóa
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 cursor-pointer"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(inq.id)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 cursor-pointer"
                          aria-label="Xóa liên hệ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-200/70">
                    <input
                      type="text"
                      defaultValue={inq.adminNotes}
                      onBlur={(e) => {
                        if (e.target.value !== inq.adminNotes) {
                          handleUpdate(inq.id, { adminNotes: e.target.value });
                        }
                      }}
                      placeholder="Ghi chú nội bộ (tự lưu khi rời ô nhập)..."
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-[#081426]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 2. Public Contact Info & Official Channels */}
      <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-5">
        <div className="pb-3 border-b border-slate-100">
          <h2 className="text-lg font-extrabold text-[#081426] flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#0D9488]" />
            <span>Thông tin liên hệ & Kênh chính thức hiển thị trên website</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Chỉnh số Hotline/Zalo, Email, đường dẫn Google Form đăng ký và mạng xã hội chính thức (nhấn Lưu nháp / Xuất bản ở thanh trên).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Số Hotline / Zalo hiển thị
            </label>
            <input
              type="text"
              value={settings.hotlineDisplay}
              onChange={(e) => {
                const display = e.target.value;
                const digits = display.replace(/\D/g, '');
                onChangeSettings({
                  ...settings,
                  hotlineDisplay: display,
                  hotlineTel: digits ? `tel:${digits}` : settings.hotlineTel,
                });
              }}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426] tabular-nums"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email liên hệ
            </label>
            <input
              type="email"
              value={settings.contactEmail || ''}
              onChange={(e) =>
                onChangeSettings({ ...settings, contactEmail: e.target.value })
              }
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Link Zalo tư vấn (VD: https://zalo.me/0944562096)
            </label>
            <input
              type="url"
              value={settings.zaloConsultUrl || ''}
              onChange={(e) =>
                onChangeSettings({ ...settings, zaloConsultUrl: e.target.value })
              }
              placeholder="https://zalo.me/0944562096"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Link biểu mẫu đăng ký (Google Form)
            </label>
            <input
              type="url"
              value={settings.registrationFormUrl}
              onChange={(e) =>
                onChangeSettings({ ...settings, registrationFormUrl: e.target.value })
              }
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Link thanh toán / Trang thanh toán hiện có (tùy chọn)
            </label>
            <input
              type="url"
              value={settings.paymentUrl || ''}
              onChange={(e) =>
                onChangeSettings({ ...settings, paymentUrl: e.target.value })
              }
              placeholder="Để trống để dùng mã VietQR chuyển khoản hiện có"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Địa chỉ Website chính thức
            </label>
            <input
              type="url"
              value={settings.websiteUrl}
              onChange={(e) =>
                onChangeSettings({ ...settings, websiteUrl: e.target.value })
              }
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Link Cộng đồng Facebook
            </label>
            <input
              type="url"
              value={settings.facebookCommunityUrl}
              onChange={(e) =>
                onChangeSettings({ ...settings, facebookCommunityUrl: e.target.value })
              }
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Link Facebook Giảng viên
            </label>
            <input
              type="url"
              value={settings.facebookPersonalUrl}
              onChange={(e) =>
                onChangeSettings({ ...settings, facebookPersonalUrl: e.target.value })
              }
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Link TikTok
            </label>
            <input
              type="url"
              value={settings.tiktokUrl}
              onChange={(e) =>
                onChangeSettings({ ...settings, tiktokUrl: e.target.value })
              }
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Link YouTube
            </label>
            <input
              type="url"
              value={settings.youtubeUrl}
              onChange={(e) =>
                onChangeSettings({ ...settings, youtubeUrl: e.target.value })
              }
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-[#081426]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
