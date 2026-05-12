"use client";

import { useAuthStore } from "@/store/auth.store";
import NotificationBell from "@/components/properties-rooms/NotificationBell";
import Link from "next/link";

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      {/* Left */}
      <div className="text-sm text-gray-500">
        Welcome back,
        <span className="ml-1 font-semibold text-gray-900">
          {user?.email}
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {/* Notification */}
        <div className="relative">
          <NotificationBell />
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200" />

        {/* User */}
        <div className="flex items-center gap-3">

          {/* Avatar */}
          <Link href="/profile">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-xs font-semibold cursor-pointer hover:ring-2 hover:ring-blue-400 transition">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </Link>

          {/* Logout */}
          <button
            onClick={logout}
            className="text-sm text-gray-600 hover:text-red-500 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}