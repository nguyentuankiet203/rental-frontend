"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUsers, updateUser } from "@/services/user.service";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  User,
  Phone,
  Shield,
  Pencil,
} from "lucide-react";

const FIELD_CLASS =
  "flex items-center gap-2.5 border border-gray-200 rounded-xl px-3.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition bg-white";

const INPUT_CLASS =
  "flex-1 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent";

const ICON_CLASS = "text-gray-400 flex-shrink-0";

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params.id);

  const { register, handleSubmit, reset } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getUsers({ page: 1, limit: 999 });
        const found = (res.data || []).find((u: any) => u.id === userId);
        if (found) {
          setUser(found);
          reset(found);
        }
      } catch {
        toast.error("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      await updateUser(String(userId), data);
      toast.success("Cập nhật người dùng thành công!");
      router.push("/admin/users");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-4 w-36 rounded-lg bg-gray-100 animate-pulse" />
            <div className="h-3 w-48 rounded-lg bg-gray-100 animate-pulse" />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <div className="h-14 rounded-2xl bg-gray-100 animate-pulse" />
          <div className="h-10 rounded-xl bg-gray-100 animate-pulse" />
          <div className="h-10 rounded-xl bg-gray-100 animate-pulse" />
          <div className="h-10 rounded-xl bg-gray-100 animate-pulse" />
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold text-gray-900">Chỉnh sửa người dùng</h1>
          <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* USER PREVIEW */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() ||
                user?.email?.charAt(0)?.toUpperCase() ||
                "?"}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.name || "—"}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {user?.email} · ID #{user?.id}
              </p>
            </div>
          </div>
        </div>

        {/* FIELDS */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Pencil size={14} className="text-blue-500" />
            </div>
            <p className="text-sm font-semibold text-gray-900">Thông tin người dùng</p>
          </div>

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-600 mb-1.5 block">Họ tên</label>
            <div className={FIELD_CLASS}>
              <User size={15} className={ICON_CLASS} />
              <input
                placeholder="Nguyễn Văn A"
                className={INPUT_CLASS}
                {...register("name")}
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
                Đang lưu...
              </>
            ) : (
              <>
                <Pencil size={14} />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}