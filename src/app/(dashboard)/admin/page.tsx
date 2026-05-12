import RoleGuard from "@/components/auth/RoleGuard";
import { persist } from "zustand/middleware";
import Link from "next/link";
import {
  Users,
  Building2,
  FileText,
  Receipt,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

const stats = [
  {
    label: "Tổng người dùng",
    value: "—",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    label: "Bất động sản",
    value: "—",
    icon: Building2,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
  {
    label: "Hợp đồng",
    value: "—",
    icon: FileText,
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    label: "Hóa đơn",
    value: "—",
    icon: Receipt,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
];

const quickLinks = [
  {
    label: "Quản lý người dùng",
    desc: "Xem, phân quyền và quản lý tài khoản",
    href: "/admin/users",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Thống kê hệ thống",
    desc: "Báo cáo doanh thu và hoạt động",
    href: "/admin/users",
    icon: TrendingUp,
    color: "text-green-600",
    bg: "bg-green-50",
  },
];

export default function AdminPage() {
  return (
    <RoleGuard allow={["ADMIN"]}>
      <div className="p-6 max-w-screen-xl space-y-6">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Tổng quan hệ thống RentSaaS
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {link.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* INFO BANNER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Quyền quản trị viên</p>
              <p className="text-xs text-blue-100 mt-0.5">
                Bạn có toàn quyền quản lý hệ thống
              </p>
            </div>
          </div>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-blue-600 text-sm font-semibold hover:bg-blue-50 transition-colors self-start sm:self-auto flex-shrink-0"
          >
            <Users size={15} />
            Quản lý người dùng
          </Link>
        </div>
      </div>
    </RoleGuard>
  );
}