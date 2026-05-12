"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, ImagePlus, X, Save } from "lucide-react";

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState({
    name: "",
    address: "",
    description: "",
  });

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/properties/${params.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setForm({
        name: data.name || "",
        address: data.address || "",
        description: data.description || "",
      });
      setPreview(data.image || "");
    } catch {
      toast.error("Không thể tải thông tin bất động sản");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("address", form.address);
      formData.append("description", form.description);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/properties/${params.id}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (!res.ok) throw new Error();
      toast.success("Cập nhật thành công!");
      router.push("/landlord/properties");
    } catch {
      toast.error("Cập nhật thất bại, vui lòng thử lại");
    } finally {
      setSaving(false);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-6 max-w-2xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-4 w-40 rounded-lg bg-gray-100 animate-pulse" />
            <div className="h-3 w-56 rounded-lg bg-gray-100 animate-pulse" />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <div className="h-44 rounded-xl bg-gray-100 animate-pulse" />
          <div className="h-10 rounded-xl bg-gray-100 animate-pulse" />
          <div className="h-10 rounded-xl bg-gray-100 animate-pulse" />
          <div className="h-24 rounded-xl bg-gray-100 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition flex-shrink-0"
        >
          <ArrowLeft size={17} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Chỉnh sửa bất động sản</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Cập nhật thông tin và hình ảnh tài sản
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image */}
        <div>
          <label className="block text-sm text-gray-600 mb-1.5">
            Ảnh bất động sản
          </label>

          <div className="flex items-center gap-4">
            {/* Preview */}
            <div className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-400">
                  Chưa có ảnh
                </span>
              )}
            </div>

            {/* Upload */}
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition">
              Đổi ảnh

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    setSelectedFile(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
          </div>
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
              type="text"
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
              type="text"
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
            <label className="block text-sm text-gray-600 mb-1.5">Mô tả</label>
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
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save size={15} />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}