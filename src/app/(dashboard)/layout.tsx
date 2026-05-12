"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const { token } = useAuthStore();
    const router = useRouter();
    const { loadUser } = useAuthStore();

    useEffect(() => {
    loadUser();
    }, []);
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar cố định bên trái */}
      <aside className="w-60 flex-shrink-0 overflow-y-auto">
        <Sidebar />
      </aside>
      {/* Cột bên phải */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header cố định trên cùng */}
        <Header />
        {/* Nội dung cuộn được */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}