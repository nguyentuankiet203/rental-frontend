"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Home,
  FileText,
  Receipt,
  LucideIcon,
  Building2,
} from "lucide-react";

type Role = "ADMIN" | "LANDLORD" | "TENANT";

type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const menuConfig: Record<Role, MenuItem[]> = {
  ADMIN: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Người dùng", href: "/admin/users", icon: Users },
  ],
  LANDLORD: [
    { label: "Dashboard", href: "/landlord", icon: LayoutDashboard },
    { label: "Bất động sản", href: "/landlord/properties", icon: Home },
    { label: "Người Thuê", href: "/landlord/tenant", icon: Receipt },
    { label: "Hợp đồng", href: "/landlord/contracts", icon: FileText },
    { label: "Hóa đơn", href: "/landlord/invoices", icon: Receipt },
  ],
  TENANT: [
    { label: "Dashboard", href: "/tenant", icon: LayoutDashboard },
    { label: "Hóa đơn", href: "/tenant/invoice", icon: Receipt },
    { label: "Hợp đồng", href: "/tenant/contract", icon: Receipt },
    { label: "Thông tin phòng", href: "/tenant/room", icon: Receipt },
  ],
};

export default function Sidebar() {
  const { user, loadUser } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    loadUser();
  }, []);

  const role = user?.role as Role | undefined;
  const menuItems = role ? menuConfig[role] : [];

  return (
    <aside className="w-60 h-full bg-slate-900 text-slate-400 flex flex-col">
      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-2 mb-2 mt-1">
          Điều hướng
        </p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/30"
                    : "hover:bg-slate-800 hover:text-slate-100"
                }
              `}
            >
              <Icon
                size={17}
                className={isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"}
              />
              <span className="text-sm font-medium">{item.label}</span>

              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-blue-300 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        {user && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-slate-300 truncate">
                {user.email}
              </span>
              <span className="text-[10px] text-slate-500 capitalize">
                {user.role?.toLowerCase()}
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}