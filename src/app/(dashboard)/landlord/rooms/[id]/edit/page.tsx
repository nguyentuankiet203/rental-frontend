"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/services/api";
import {
  ArrowLeft,
  BedDouble,
  DollarSign,
  ImagePlus,
  Save,
  X,
} from "lucide-react";

const STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "Còn trống", color: "text-green-600 bg-green-50 border-green-200" },
  { value: "OCCUPIED", label: "Đang thuê", color: "text-red-600 bg-red-50 border-red-200" },
  { value: "MAINTENANCE", label: "Bảo trì", color: "text-amber-600 bg-amber-50 border-amber-200" },
];

export default function EditRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [room, setRoom] = useState<any>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    room_number: "",
    price_per_month: "",
    status: "AVAILABLE",
  });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/rooms/${roomId}`);
        const data = res.data;
        setRoom(data);
        setForm({
          room_number: data.room_number?.toString() || "",
          price_per_month: data.price_per_month?.toString() || "",
          status: data.status || "AVAILABLE",
        });
        setPreviewImages(data.images?.map((img: any) => img.image_url) || []);
      } catch {
        toast.error("Không thể tải thông tin phòng");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviewImages(files.map((f) => URL.createObjectURL(f)));
  };

  const removeNewImages = () => {
    setImages([]);
    setPreviewImages([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.patch(`/rooms/${roomId}`, {
        room_number: Number(form.room_number),
        price_per_month: Number(form.price_per_month),
        status: form.status,
      });
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((img) => formData.append("images", img));
        await api.post(`/rooms/${roomId}/images`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      toast.success("Cập nhật phòng thành công!");
      router.push(`/landlord/properties/${room?.property?.id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

  if (loading) {
    return (
      <div className="p-6 max-w-2xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-4 w-36 rounded-lg bg-gray-100 animate-pulse" />
            <div className="h-3 w-48 rounded-lg bg-gray-100 animate-pulse" />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <div className="h-10 rounded-xl bg-gray-100 animate-pulse" />
          <div className="h-10 rounded-xl bg-gray-100 animate-pulse" />
          <div className="h-10 rounded-xl bg-gray-100 animate-pulse" />
          <div className="h-36 rounded-xl bg-gray-100 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition flex-shrink-0"
        >
          <ArrowLeft size={17} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Chỉnh sửa phòng</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Cập nhật thông tin phòng #{roomId}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ROOM INFO */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <BedDouble size={15} className="text-blue-500" />
            </div>
            <p className="text-sm font-semibold text-gray-900">Thông tin phòng</p>
          </div>

          {/* Room number */}
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              Số phòng <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="room_number"
              value={form.room_number}
              onChange={handleChange}
              placeholder="VD: 101"
              className={inputClass}
            />
          </div>

          {/* Price */}
          <div >
            <label className="block text-sm text-gray-600 mb-1.5">
              Giá thuê / tháng (₫) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition bg-white">
              <DollarSign size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                name="price_per_month"
                value={form.price_per_month}
                onChange={handleChange}
                placeholder="VD: 3000000"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Trạng thái</label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, status: s.value }))}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    form.status === s.value
                      ? s.color + " ring-2 ring-offset-1"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* IMAGES */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <ImagePlus size={15} className="text-purple-500" />
              </div>
              <p className="text-sm font-semibold text-gray-900">Ảnh phòng</p>
            </div>
            {previewImages.length > 0 && images.length > 0 && (
              <button
                type="button"
                onClick={removeNewImages}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition"
              >
                <X size={13} />
                Xoá ảnh mới
              </button>
            )}
          </div>

          {previewImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
              {previewImages.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden border border-gray-200">
                  <img src={img} className="h-24 w-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <label className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all">
            <ImagePlus size={15} className="text-gray-400" />
            <span className="text-sm text-gray-500">
              {previewImages.length > 0 ? "Thay ảnh mới" : "Chọn ảnh phòng"}
            </span>
            <input
              type="file"
              multiple
              hidden
              accept="image/*"
              onChange={handleImageChange}
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