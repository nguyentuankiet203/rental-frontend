"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createUser } from "@/services/user.service";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Phone,
  Shield,
  Upload,
  UserPlus,
} from "lucide-react";

const FIELD_CLASS =
  "flex items-center gap-2.5 border border-gray-200 rounded-xl px-3.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition bg-white";

const INPUT_CLASS =
  "flex-1 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent";

const ICON_CLASS = "text-gray-400 flex-shrink-0";

export default function CreateUserPage() {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("name", data.name);
      formData.append("phone", data.phone || "");
      formData.append("role", data.role);
      if (avatar) formData.append("avatar", avatar);

      await createUser(formData);
      toast.success("Tạo tài khoản thành công!");
      reset();
      setAvatar(null);
      router.push("/admin/users");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-xl">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition flex-shrink-0"
        >
          <ArrowLeft size={17} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tạo người dùng</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Thêm tài khoản mới vào hệ thống
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* ACCOUNT INFO */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <UserPlus size={15} className="text-blue-500" />
            </div>
            <p className="text-sm font-semibold text-gray-900">Thông tin tài khoản</p>
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-600 mb-1.5 block">
              Email <span className="text-red-500">*</span>
            </label>
            <div className={FIELD_CLASS}>
              <Mail size={15} className={ICON_CLASS} />
              <input
                placeholder="example@gmail.com"
                className={INPUT_CLASS}
                {...register("email", { required: true })}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-600 mb-1.5 block">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className={FIELD_CLASS}>
              <Lock size={15} className={ICON_CLASS} />
              <input
                type="password"
                placeholder="••••••••"
                className={INPUT_CLASS}
                {...register("password", { required: true })}
              />
            </div>
          </div>
        </div>

        {/* PERSONAL INFO */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <User size={15} className="text-purple-500" />
            </div>
            <p className="text-sm font-semibold text-gray-900">Thông tin cá nhân</p>
          </div>

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-600 mb-1.5 block">
              Họ tên <span className="text-red-500">*</span>
            </label>
            <div className={FIELD_CLASS}>
              <User size={15} className={ICON_CLASS} />
              <input
                placeholder="Nguyễn Văn A"
                className={INPUT_CLASS}
                {...register("name", { required: true })}
              />
            </div>
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm text-gray-600 mb-1.5 block">
              Số điện thoại
            </label>
            <div className={FIELD_CLASS}>
              <Phone size={15} className={ICON_CLASS} />
              <input
                placeholder="0123456789"
                className={INPUT_CLASS}
                {...register("phone")}
              />
            </div>
          </div>

          {/* ROLE */}
          <div>
            <label className="text-sm text-gray-600 mb-1.5 block">Vai trò</label>
            <div className={FIELD_CLASS}>
              <Shield size={15} className={ICON_CLASS} />
              <select
                className={`${INPUT_CLASS} cursor-pointer`}
                {...register("role")}
              >
                <option value="ADMIN">Admin</option>
                <option value="LANDLORD">Chủ trọ</option>
                <option value="TENANT">Khách thuê</option>
              </select>
            </div>
          </div>
        </div>

        {/* AVATAR */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Upload size={15} className="text-amber-500" />
            </div>
            <p className="text-sm font-semibold text-gray-900">Ảnh đại diện</p>
          </div>

          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer bg-gray-50 hover:border-blue-300 hover:bg-blue-50 transition">
            {avatar ? (
              <div className="flex flex-col items-center gap-1.5">
                <img
                  src={URL.createObjectURL(avatar)}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <p className="text-xs text-gray-500 max-w-[200px] truncate">
                  {avatar.name}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-1">
                  <Upload size={18} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-600">Tải ảnh lên</p>
                <p className="text-xs text-gray-400">PNG, JPG tối đa 5MB</p>
              </div>
            )}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                if (!e.target.files?.[0]) return;
                setAvatar(e.target.files[0]);
              }}
            />
          </label>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
          >
            Huỷ
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang tạo...
              </>
            ) : (
              <>
                <UserPlus size={14} />
                Tạo tài khoản
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}