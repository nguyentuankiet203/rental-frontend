"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { useAuthStore } from "@/store/auth.store";
import {
  FileText,
  Receipt,
  BedDouble,
  Bell,
  ChevronRight,
  CalendarDays,
  Wallet,
} from "lucide-react";
import Link from "next/link";

const quickLinks = [
  {
    label: "Hợp đồng của tôi",
    desc: "Xem thông tin hợp đồng thuê phòng",
    href: "/tenant/contracts",
    icon: FileText,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Hóa đơn",
    desc: "Xem và thanh toán hóa đơn hàng tháng",
    href: "/tenant/invoices",
    icon: Receipt,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "Thông tin phòng",
    desc: "Chi tiết phòng bạn đang thuê",
    href: "/tenant/room",
    icon: BedDouble,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    label: "Thông báo",
    desc: "Tin nhắn và thông báo từ chủ trọ",
    href: "/tenant/notifications",
    icon: Bell,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

const stats = [
  {
    label: "Tháng thuê hiện tại",
    icon: CalendarDays,
    color: "text-blue-500",
    bg: "bg-blue-50",
    value: "—",
  },
  {
    label: "Hóa đơn chưa thanh toán",
    icon: Receipt,
    color: "text-red-500",
    bg: "bg-red-50",
    value: "—",
  },
  {
    label: "Tổng đã thanh toán",
    icon: Wallet,
    color: "text-green-500",
    bg: "bg-green-50",
    value: "—",
  },
];

export default function TenantPage() {
  const { user } = useAuthStore();

  return (
    <RoleGuard allow={["TENANT"]}>
      <div className="p-6 max-w-screen-xl space-y-6">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6">
          <p className="text-blue-100 text-sm mb-1">Xin chào 👋</p>
          <h1 className="text-2xl font-bold text-white">
            {user?.name || "Khách thuê"}
          </h1>
          <p className="text-blue-100 text-sm mt-1">
            Chào mừng bạn quay lại hệ thống quản lý phòng trọ
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">{s.label}</span>
                  <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <Icon size={17} className={s.color} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              </div>
            );
          })}
        </div>

        {/* QUICK LINKS */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Truy cập nhanh
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <Link
                  key={i}
                  href={link.href}
                  className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className={`w-12 h-12 rounded-xl ${link.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={22} className={link.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {link.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-gray-300 group-hover:text-blue-400 transition-colors flex-shrink-0"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}