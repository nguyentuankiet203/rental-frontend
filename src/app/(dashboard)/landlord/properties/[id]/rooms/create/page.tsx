"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/services/api";
import { createBulkRooms } from "@/services/room.service";
import {
  ArrowLeft,
  BedDouble,
  ImagePlus,
  Upload,
  CheckCircle2,
  X,
} from "lucide-react";

export default function CreateBulkRoomsPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = Number(params.id);

  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [startNumber, setStartNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const preview = useMemo(() => {
    const start = startNumber ? Number(startNumber) : 1;
    return Array.from({ length: quantity }, (_, i) => ({
      name: `Phòng ${start + i}`,
      number: start + i,
    }));
  }, [quantity, startNumber]);

  const handleCreateBulk = async () => {
    if (!quantity || quantity <= 0)
      return toast.error("Số lượng phải lớn hơn 0");
    if (!price || Number(price) <= 0)
      return toast.error("Giá không hợp lệ");
    try {
      setLoading(true);
      const res = await createBulkRooms({
        property_id: propertyId,
        quantity: Number(quantity),
        price_per_month: Number(price),
        start_number: startNumber ? Number(startNumber) : undefined,
      });
      setRooms(res.data || []);
      toast.success("Tạo phòng thành công!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Tạo phòng thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImages = async () => {
    if (!selectedRoom) return toast.error("Vui lòng chọn phòng");
    if (!images.length) return toast.error("Vui lòng chọn ảnh");
    try {
      setUploading(true);
      const formData = new FormData();
      images.forEach((img) => formData.append("images", img));
      // Bỏ hoàn toàn headers — để axios/browser tự set với boundary đúng
      await api.post(`/rooms/${selectedRoom}/images`, formData);
      toast.success("Upload ảnh thành công!");
      setImages([]);
      router.push(`/landlord/properties/${propertyId}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Upload thất bại");
    } finally {
      setUploading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white";

  return (
    <div className="p-6 max-w-screen-xl space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition flex-shrink-0"
        >
          <ArrowLeft size={17} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tạo phòng hàng loạt</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Tự động tạo nhiều phòng cùng lúc · Bất động sản #{propertyId}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* LEFT: Form + Created rooms */}
        <div className="xl:col-span-2 space-y-5">
          {/* FORM CARD */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <BedDouble size={17} className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Cấu hình phòng</p>
                <p className="text-xs text-gray-400">Điền thông tin để tạo phòng</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">
                  Số lượng phòng <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className={inputClass}
                  placeholder="VD: 10"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1.5">
                  Giá thuê / tháng (₫) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={inputClass}
                  placeholder="VD: 3000000"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1.5">
                  Số phòng bắt đầu
                  <span className="text-gray-400 font-normal ml-1">(mặc định: 1)</span>
                </label>
                <input
                  type="number"
                  value={startNumber}
                  onChange={(e) => setStartNumber(e.target.value)}
                  className={inputClass}
                  placeholder="VD: 101"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={() => router.back()}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
              >
                Huỷ
              </button>
              <button
                disabled={loading}
                onClick={handleCreateBulk}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <BedDouble size={15} />
                    Tạo phòng
                  </>
                )}
              </button>
            </div>
          </div>

          {/* CREATED ROOMS */}
          {rooms.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Phòng đã tạo</p>
                  <p className="text-xs text-gray-400 mt-0.5">Chọn phòng để upload ảnh</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                  {rooms.length} phòng
                </span>
              </div>

              <div className="space-y-2.5">
                {rooms.map((room) => {
                  const isSelected = selectedRoom === room.id;
                  return (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3.5 cursor-pointer transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                          isSelected ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700"
                        }`}>
                          #{room.room_number}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Phòng #{room.room_number}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {Number(room.price_per_month).toLocaleString("vi-VN")}₫/tháng
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <CheckCircle2 size={18} className="text-blue-500" />
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoom(room.id);
                          }}
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                          }`}
                        >
                          Upload ảnh
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Preview + Upload */}
        <div className="space-y-5">
          {/* PREVIEW */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">Xem trước</p>
                <p className="text-xs text-gray-400 mt-0.5">Danh sách phòng sẽ tạo</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                {preview.length} phòng
              </span>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {preview.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 hover:bg-white hover:shadow-sm transition-all"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-400">Số #{r.number}</p>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IMAGE UPLOAD */}
          {selectedRoom && (
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Upload ảnh</p>
                  <p className="text-xs text-gray-400 mt-0.5">Phòng #{selectedRoom}</p>
                </div>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition"
                >
                  <X size={14} />
                </button>
              </div>

              <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all">
                <ImagePlus size={22} className="text-gray-400 mb-1.5" />
                <span className="text-sm font-medium text-gray-500">Chọn nhiều ảnh</span>
                <span className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP</span>
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={(e) => {
                    if (!e.target.files) return;
                    setImages(Array.from(e.target.files));
                  }}
                />
              </label>

              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden border border-gray-200">
                      <img
                        src={URL.createObjectURL(img)}
                        className="h-24 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <button
                disabled={uploading}
                onClick={handleUploadImages}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang upload...
                  </>
                ) : (
                  <>
                    <Upload size={15} />
                    Upload ảnh
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}