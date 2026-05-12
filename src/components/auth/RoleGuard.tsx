"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function RoleGuard({
  children,
  allow,
}: {
  children: React.ReactNode;
  allow: string[];
}) {
  const router = useRouter();

  const {
    user,
    loadUser,
  } = useAuthStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    loadUser();
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!user) return;

    if (!allow.includes(user.role)) {
      router.replace("/login");
    }
  }, [mounted, user]);

  if (!mounted) {
    return null;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}