"use client";

import { useState } from "react";
import { login } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Mail, Lock, LogIn, Building2 } from "lucide-react";

const FIELD_CLASS =
  "flex items-center gap-2.5 border border-gray-200 rounded-xl px-3.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition bg-white";

const INPUT_CLASS =
  "flex-1 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      const data = await login(email, password);

      if (!data.user) throw new Error("Không tìm thấy thông tin người dùng");

      setAuth(data.user, data.access_token);
      toast.success("Đăng nhập thành công!");

      if (data.user.role === "ADMIN") router.push("/admin");
      else if (data.user.role === "LANDLORD") router.push("/landlord");
      else router.push("/tenant");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "Đăng nhập thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* LOGO */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg mb-4">
            <Building2 size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">RentSaaS</h1>
          <p className="text-sm text-gray-500 mt-1">
            Đăng nhập để tiếp tục
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Email
            </label>
            <div className={FIELD_CLASS}>
              <Mail size={15} className="text-gray-400 flex-shrink-0" />
              <input
                type="email"
                placeholder="example@gmail.com"
                className={INPUT_CLASS}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="email"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Mật khẩu
            </label>
            <div className={FIELD_CLASS}>
              <Lock size={15} className="text-gray-400 flex-shrink-0" />
              <input
                type="password"
                placeholder="••••••••"
                className={INPUT_CLASS}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* SUBMIT */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang đăng nhập...
              </>
            ) : (
              <>
                <LogIn size={15} />
                Đăng nhập
              </>
            )}
          </button>
        </div>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} RentSaaS. All rights reserved.
        </p>
      </div>
    </div>
  );
}