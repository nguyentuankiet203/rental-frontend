"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { importRooms } from "@/services/room.service";
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  Upload,
  AlertCircle,
  CheckCircle2,
  BedDouble,
} from "lucide-react";

export default function ImportRoomsPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = Number(params.id);

  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const validateData = (rows: any[]) => {
    const errs: string[] = [];
    const numbers = new Set();
    rows.forEach((r, i) => {
      if (!r.room_number)
        errs.push(`Dòng ${i + 1}: Thiếu room_number`);
      if (!r.price_per_month)
        errs.push(`Dòng ${i + 1}: Thiếu price_per_month`);
      if (numbers.has(r.room_number))
        errs.push(`Dòng ${i + 1}: room_number bị trùng`);
      numbers.add(r.room_number);
    });
    setErrors(errs);
  };

  const handleFile = (selected: File) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const wb = XLSX.read(e.target.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws);
      validateData(json);
      setData(json);
    };
    reader.readAsBinaryString(selected);
    setFile(selected);
  };

  const handleImport = async () => {
    if (!data.length) return toast.error("Chưa có dữ liệu để import");
    if (errors.length) return toast.error("Vui lòng sửa các lỗi trước khi import");
    try {
      setLoading(true);
      await importRooms({ property_id: propertyId, rooms: data });
      toast.success("Import phòng thành công!");
      router.push(`/landlord/properties/${propertyId}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Import thất bại");
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-xl font-bold text-gray-900">Import phòng từ Excel</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Tải lên file Excel để import hàng loạt · Bất động sản #{propertyId}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* LEFT */}
        <div className="xl:col-span-2 space-y-5">
          {/* TEMPLATE DOWNLOAD */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">File mẫu Excel</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tải về và điền theo đúng format trước khi import
                </p>
              </div>
            </div>
            <a
              href="/template_rooms.xlsx"
              download
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 active:scale-95 transition-all shadow-sm self-start sm:self-auto flex-shrink-0"
            >
              <Download size={15} />
              Tải file mẫu
            </a>
          </div>

          {/* UPLOAD ZONE */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">Upload file Excel</p>

            <label
              className={`flex flex-col items-center justify-center w-full h-44 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                file
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-300"
              }`}
            >
              {file ? (
                <>
                  <CheckCircle2 size={28} className="text-blue-500 mb-2" />
                  <span className="text-sm font-semibold text-blue-700">{file.name}</span>
                  <span className="text-xs text-blue-500 mt-1">
                    {data.length} dòng · Nhấn để đổi file
                  </span>
                </>
              ) : (
                <>
                  <Upload size={28} className="text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-500">Nhấn để chọn file .xlsx</span>
                  <span className="text-xs text-gray-400 mt-1">Chỉ hỗ trợ định dạng Excel (.xlsx)</span>
                </>
              )}
              <input
                type="file"
                hidden
                accept=".xlsx"
                onChange={(e) => {
                  if (!e.target.files?.length) return;
                  handleFile(e.target.files[0]);
                }}
              />
            </label>

            {/* ERRORS */}
            {errors.length > 0 && (
              <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                  <p className="text-sm font-semibold text-red-700">
                    {errors.length} lỗi cần sửa
                  </p>
                </div>
                <div className="space-y-1.5">
                  {errors.map((err, i) => (
                    <div
                      key={i}
                      className="text-xs text-red-600 bg-white border border-red-100 rounded-lg px-3 py-2"
                    >
                      · {err}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={() => router.back()}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
              >
                Huỷ
              </button>
              <button
                disabled={loading || !data.length || errors.length > 0}
                onClick={handleImport}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang import...
                  </>
                ) : (
                  <>
                    <Upload size={15} />
                    Import {data.length > 0 ? `${data.length} phòng` : ""}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Preview */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">Xem trước dữ liệu</p>
                <p className="text-xs text-gray-400 mt-0.5">Dữ liệu đọc từ file Excel</p>
              </div>
              {data.length > 0 && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  errors.length > 0
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}>
                  {data.length} dòng
                </span>
              )}
            </div>

            {data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                  <FileSpreadsheet size={20} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">Chưa có dữ liệu</p>
                <p className="text-xs text-gray-400 mt-1">Upload file Excel để xem trước</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {data.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-3 hover:bg-white hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Phòng #{r.room_number}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {Number(r.price_per_month).toLocaleString("vi-VN")}₫/tháng
                        </p>
                      </div>
                    </div>
                    <BedDouble size={14} className="text-gray-300" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}