"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";

const FIELD_CLASS =
  "flex items-center gap-2.5 border border-gray-200 rounded-xl px-3.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition bg-white";

const INPUT_CLASS =
  "flex-1 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent";

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Đăng ký thất bại"
        );
      }

      toast.success(
        "Đăng ký thành công!"
      );

      router.push("/login");
    } catch (err: any) {
      toast.error(
        err.message ||
          "Có lỗi xảy ra"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="w-full max-w-sm">
        {/* LOGO */}
        <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg mb-4">
            <Building2 size={28} className="text-white" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
            RentSaaS
        </h1>

        <p className="text-sm text-gray-500 mt-1">
            Tạo tài khoản để bắt đầu
        </p>
        </div>

        {/* CARD */}
        <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4"
        >
        {/* NAME */}
        <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Họ và tên
            </label>

            <div className={FIELD_CLASS}>
            <User
                size={15}
                className="text-gray-400 flex-shrink-0"
            />

            <input
                type="text"
                name="name"
                placeholder="Nguyễn Văn A"
                className={INPUT_CLASS}
                value={form.name}
                onChange={handleChange}
                required
            />
            </div>
        </div>

        {/* EMAIL */}
        <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Email
            </label>

            <div className={FIELD_CLASS}>
            <Mail
                size={15}
                className="text-gray-400 flex-shrink-0"
            />

            <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                className={INPUT_CLASS}
                value={form.email}
                onChange={handleChange}
                required
            />
            </div>
        </div>

        {/* PHONE */}
        <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Số điện thoại
            </label>

            <div className={FIELD_CLASS}>
            <Phone
                size={15}
                className="text-gray-400 flex-shrink-0"
            />

            <input
                type="text"
                name="phone"
                placeholder="0123456789"
                className={INPUT_CLASS}
                value={form.phone}
                onChange={handleChange}
            />
            </div>
        </div>

        {/* PASSWORD */}
        <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Mật khẩu
            </label>

            <div className={FIELD_CLASS}>
            <Lock
                size={15}
                className="text-gray-400 flex-shrink-0"
            />

            <input
                type={
                showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="••••••••"
                className={INPUT_CLASS}
                value={form.password}
                onChange={handleChange}
                required
            />

            <button
                type="button"
                onClick={() =>
                setShowPassword(
                    !showPassword
                )
                }
                className="text-gray-400 hover:text-gray-600 transition"
            >
                {showPassword ? (
                <EyeOff size={16} />
                ) : (
                <Eye size={16} />
                )}
            </button>
            </div>
        </div>

        {/* SUBMIT */}
        <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm mt-2"
        >
            {loading ? (
            <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang xử lý...
            </>
            ) : (
            <>
                <ArrowRight size={15} />
                Tạo tài khoản
            </>
            )}
        </button>
        </form>

        {/* LOGIN */}
        <p className="text-center text-sm text-gray-500 mt-5">
        Đã có tài khoản?{" "}
        <Link
            href="/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
        >
            Đăng nhập
        </Link>
        </p>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-400 mt-6">
        © {new Date().getFullYear()} RentSaaS. All rights reserved.
        </p>
    </div>
    </div>

  );
}