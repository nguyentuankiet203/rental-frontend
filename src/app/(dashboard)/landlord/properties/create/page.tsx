"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createProperty } from "@/services/properties.service";
import { ArrowLeft, Upload, X, ImagePlus } from "lucide-react";

export default function CreatePropertyPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("address", form.address);
      formData.append("description", form.description);
      if (file) formData.append("image", file);
      await createProperty(formData);
      toast.success("Tạo bất động sản thành công!");
      router.push("/landlord/properties");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Tạo thất bại, vui lòng thử lại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
        >
          <ArrowLeft size={17} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Thêm bất động sản</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Điền thông tin để tạo tài sản mới
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Image Upload */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Ảnh bất động sản
          </label>

          {preview ? (
            <div className="relative w-full h-56 rounded-xl overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-44 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer transition">
              <ImagePlus size={28} className="text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-500">
                Nhấn để chọn ảnh
              </span>
              <span className="text-xs text-gray-400 mt-1">
                PNG, JPG, WEBP tối đa 10MB
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Info Fields */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <p className="text-sm font-semibold text-gray-700">Thông tin cơ bản</p>

          {/* Name */}
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              Tên bất động sản <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="VD: Nhà trọ Bình Thạnh"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="VD: 123 Đinh Tiên Hoàng, Bình Thạnh, TP.HCM"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              Mô tả
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Mô tả thêm về bất động sản..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>
        </div>

        {/* Actions */}
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
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                </svg>
                Đang tạo...
              </>
            ) : (
              <>
                <Upload size={15} />
                Tạo bất động sản
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}