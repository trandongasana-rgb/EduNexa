import React, { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import type { AuditLogItem, SyncLogItem } from '../../types';
import { fetchAuditLogsApi } from '../../services/driveApi';

interface SystemLogsSectionProps {
  adminSessionToken: string;
}

const ACTION_LABELS: Record<string, string> = {
  LOGIN: 'Đăng nhập',
  LOGIN_FAILED: 'Đăng nhập lỗi',
  LOGOUT: 'Đăng xuất',
  CHANGE_PASSWORD: 'Đổi mật khẩu',
  SAVE_DRAFT: 'Lưu nháp CMS',
  PUBLISH_SITE: 'Xuất bản website',
  RESET_CMS: 'Khôi phục mặc định',
  UPLOAD_MEDIA: 'Tải ảnh lên',
  UPDATE_MEDIA: 'Cập nhật ảnh',
  REORDER_MEDIA: 'Sắp xếp ảnh',
  SET_BANNER: 'Đổi Banner Hero',
  DELETE_MEDIA: 'Xóa ảnh',
  DRIVE_OAUTH: 'Xác thực Drive',
  DRIVE_CONNECTED: 'Kết nối thư mục Drive',
  DRIVE_VERIFY_FAILED: 'Lỗi kiểm tra Drive',
  DRIVE_CONFIG: 'Cấu hình Drive',
  DRIVE_DISCONNECT: 'Ngắt kết nối Drive',
  DRIVE_SYNC: 'Đồng bộ Drive',
  CREATE_INQUIRY: 'Đăng ký / Liên hệ mới',
  UPDATE_INQUIRY: 'Cập nhật liên hệ',
  DELETE_INQUIRY: 'Xóa liên hệ',
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
      second: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function SystemLogsSection({ adminSessionToken }: SystemLogsSectionProps) {
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLogItem[]>([]);
  const [actionFilter, setActionFilter] = useState('ALL');
  const [tab, setTab] = useState<'audit' | 'drive'>('audit');
  const [loading, setLoading] = useState(true);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAuditLogsApi(adminSessionToken, actionFilter);
      setAuditLogs(res.auditLogs);
      setSyncLogs(res.syncLogs);
    } finally {
      setLoading(false);
    }
  }, [adminSessionToken, actionFilter]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  return (
    <div className="space-y-6">
      <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-extrabold text-[#081426]">
              Nhật ký hoạt động hệ thống
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Ghi nhận toàn bộ lịch sử đăng nhập, lưu nháp, xuất bản nội dung, thay đổi hình ảnh và đồng bộ Google Drive.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex p-1 bg-[#F7F9FC] border border-slate-200 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setTab('audit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  tab === 'audit' ? 'bg-[#081426] text-white' : 'text-slate-600'
                }`}
              >
                Thao tác quản trị ({auditLogs.length})
              </button>
              <button
                type="button"
                onClick={() => setTab('drive')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  tab === 'drive' ? 'bg-[#081426] text-white' : 'text-slate-600'
                }`}
              >
                Đồng bộ Drive ({syncLogs.length})
              </button>
            </div>

            {tab === 'audit' && (
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="px-3 py-2 bg-[#F7F9FC] border border-slate-200 rounded-xl text-xs font-semibold text-[#081426]"
              >
                <option value="ALL">Tất cả hành động</option>
                {Object.entries(ACTION_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={loadLogs}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#081426] cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Làm mới</span>
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Đang tải nhật ký hệ thống...</p>
        ) : tab === 'audit' ? (
          auditLogs.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">
              Chưa có bản ghi nhật ký nào phù hợp bộ lọc.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2.5 pr-4 font-semibold whitespace-nowrap">Thời gian</th>
                    <th className="py-2.5 px-3 font-semibold whitespace-nowrap">Hành động</th>
                    <th className="py-2.5 px-3 font-semibold whitespace-nowrap">Người thực hiện</th>
                    <th className="py-2.5 px-3 font-semibold">Chi tiết</th>
                    <th className="py-2.5 pl-3 font-semibold text-right">Kết quả</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#F7F9FC]">
                      <td className="py-3 pr-4 font-mono text-slate-500 whitespace-nowrap tabular-nums">
                        {formatDateTime(log.timestamp)}
                      </td>
                      <td className="py-3 px-3 font-bold text-[#081426] whitespace-nowrap">
                        {ACTION_LABELS[log.action] || log.action}
                      </td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{log.actor}</td>
                      <td className="py-3 px-3 text-slate-700">{log.summary}</td>
                      <td className="py-3 pl-3 text-right whitespace-nowrap font-bold">
                        <span
                          className={
                            log.status === 'error'
                              ? 'text-rose-600'
                              : log.status === 'warning'
                                ? 'text-amber-700'
                                : 'text-[#0D9488]'
                          }
                        >
                          {log.status === 'error'
                            ? 'Lỗi'
                            : log.status === 'warning'
                              ? 'Cảnh báo'
                              : 'Thành công'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : syncLogs.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center">
            Chưa có lượt đồng bộ Google Drive nào được ghi nhận.
          </p>
        ) : (
          <div className="space-y-3">
            {syncLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-[#F7F9FC] border border-slate-200 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-[#081426] tabular-nums">
                    {log.triggerType === 'manual' ? 'Đồng bộ thủ công' : 'Đồng bộ tự động'} ·{' '}
                    {formatDateTime(log.finishedAt)}
                  </span>
                  <span
                    className={`font-bold ${
                      log.status === 'success'
                        ? 'text-[#0D9488]'
                        : log.status === 'partial'
                          ? 'text-amber-700'
                          : 'text-rose-600'
                    }`}
                  >
                    {log.status === 'success'
                      ? 'Thành công'
                      : log.status === 'partial'
                        ? 'Một phần'
                        : 'Lỗi'}
                  </span>
                </div>
                <p className="text-slate-600 tabular-nums">
                  Phát hiện: {log.discoveredCount} · Đồng bộ: {log.syncedCount} · Bỏ qua: {log.skippedCount} · Xóa: {log.deletedCount} · Lỗi: {log.errorCount}
                </p>
                {log.details.length > 0 && (
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                    {log.details.slice(0, 8).map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
