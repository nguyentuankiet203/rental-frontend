"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Bell, BellOff, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth.store";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
} from "@/services/notification.service";

export default function NotificationBell() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  // Đóng khi click ngoài
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Socket + fetch
  useEffect(() => {
    if (!user?.id) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001", {
      auth: { userId: user.id },
    });

    socket.on("notification", (data) => {
      if (!data?.id) return;
      setNotifications((prev) => [{ ...data, isRead: false }, ...prev]);
      setUnread((prev) => prev + 1);
      toast.success(data.title);
    });

    const load = async () => {
      setLoading(true);
      try {
        const [noti, count] = await Promise.all([
          getNotifications(),
          getUnreadCount(),
        ]);
        // TypeORM trả camelCase: isRead, createdAt
        setNotifications(
          noti.map((n: any) => ({
            ...n,
            isRead: n.isRead ?? n.is_read ?? false,
            createdAt: n.createdAt ?? n.created_at,
          }))
        );
        setUnread(count);
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => { socket.disconnect(); };
  }, [user?.id]);

  const handleRead = async (id: number) => {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnread((u) => Math.max(u - 1, 0));
  };

  const handleReadAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnread(0);
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return d.toLocaleDateString("vi-VN");
  };

  return (
    <div ref={ref} className="relative">
      {/* BELL BUTTON */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition"
      >
        <Bell size={19} className="text-gray-600" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold px-1 rounded-full flex items-center justify-center animate-pulse">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-[360px] bg-white shadow-2xl rounded-2xl border border-gray-100 z-50 overflow-hidden">
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Bell size={15} className="text-gray-500" />
              <span className="text-sm font-semibold text-gray-900">
                Thông báo
              </span>
              {unread > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
                  {unread}
                </span>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={handleReadAll}
                className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 transition"
              >
                <CheckCheck size={13} />
                Đọc tất cả
              </button>
            )}
          </div>

          {/* CONTENT */}
          <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-50">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-1.5 animate-pulse">
                    <div className="h-3.5 w-3/4 bg-gray-100 rounded" />
                    <div className="h-3 w-full bg-gray-100 rounded" />
                    <div className="h-2.5 w-1/4 bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                  <BellOff size={20} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-600">
                  Không có thông báo
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Thông báo mới sẽ hiện ở đây
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && handleRead(n.id)}
                  className={`px-4 py-3.5 cursor-pointer transition-colors ${
                    !n.isRead
                      ? "bg-blue-50/70 hover:bg-blue-100/60"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm leading-snug ${!n.isRead ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                      {n.title}
                    </p>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {n.message}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1.5">
                    {formatTime(n.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* FOOTER */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-2.5 text-center">
              <button className="text-xs text-blue-500 hover:text-blue-700 font-medium transition">
                Xem tất cả thông báo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}