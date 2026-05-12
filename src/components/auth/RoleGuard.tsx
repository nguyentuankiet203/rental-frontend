"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoleGuard({
  children,
  allow,
}: {
  children: React.ReactNode;
  allow: string[];
}) {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    if (!allow.includes(user.role)) {
      router.push("/login"); // hoặc redirect về dashboard riêng
    }
  }, [user]);

  return <>{children}</>;
}