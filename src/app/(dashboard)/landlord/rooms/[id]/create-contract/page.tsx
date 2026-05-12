"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import toast from "react-hot-toast";
import { getUsers } from "@/services/user.service";
import { createContract } from "@/services/contract.service";
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  User,
  CalendarDays,
  FileText,
  FilePlus2,
} from "lucide-react";

export default function CreateContractPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = Number(params.id);

  const [search, setSearch] = useState("");
  const [tenantList, setTenantList] = useState<any[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loadingTenant, setLoadingTenant] = useState(false);
  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState<any>(null);

  const fetchTenants = async () => {
    try {
      setLoadingTenant(true);
      const res = await getUsers({ page: 1, limit: 10, search, role: "TENANT" });
      setTenantList(res.data || []);
    } catch {
      toast.error("Không thể tải danh sách khách thuê");
    } finally {
      setLoadingTenant(false);
    }
  };
  const fetchRoom = async () => {
    try {
      const res = await api.get(`/rooms/${roomId}`);
      setRoom(res.data);
    } catch {
      toast.error("Không thể tải phòng");
    }
  };
  useEffect(() => {
    fetchRoom();
  }, []);
  
  useEffect(() => {
    fetchTenants();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => fetchTenants(), 400);
    return () => clearTimeout(delay);
  }, [search]);
  
  const handleSubmit = async () => {
     if (!selectedTenant || !startDate) {
      toast.error(
        "Vui lòng chọn khách thuê và ngày bắt đầu"
      );
      return;
    }

    if (endDate && endDate < startDate) {
      toast.error(
        "Ngày kết thúc không hợp lệ"
      );
      return;
    }
    
    try {
      setLoading(true);
      
      const payload = {
        room_id: roomId,
        tenant_id: selectedTenant.id,
        start_date: startDate,
        end_date: endDate || null,
      };

      await createContract(payload);
      toast.success("Tạo hợp đồng thành công!");
      router.back();
      router.push(`/landlord/properties/${room.property.id}`);

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Tạo hợp đồng thất bại");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

  return (
    <div className="p-6 max-w-2xl space-y-5">
      {/* HEADER */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 transition flex-shrink-0 mt-1"
        >
          <ArrowLeft size={17} />
        </button>

        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Tạo hợp đồng
          </h1>

          <p className="text-sm text-gray-500 mt-0.5">
            Phòng #{roomId} · Chọn khách thuê và thời hạn hợp đồng
          </p>
        </div>
      </div>

      {/* TENANT SEARCH */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <User size={15} className="text-blue-500" />
          </div>
          <p className="text-sm font-semibold text-gray-900">Chọn khách thuê</p>
        </div>

        {/* Search input */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 mb-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition bg-white">
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input
            placeholder="Tìm theo email..."
            className="flex-1 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tenant list */}
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          {loadingTenant ? (
            <div className="space-y-2 p-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : tenantList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <User size={22} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">Không tìm thấy khách thuê</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {tenantList.map((t: any) => {
                const isSelected = selectedTenant?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTenant(t)}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {t.email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {t.name || "Chưa đặt tên"}
                        </p>
                        <p className="text-xs text-gray-500">{t.email}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <CheckCircle2 size={17} className="text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* DATE RANGE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <CalendarDays size={15} className="text-indigo-500" />
          </div>
          <p className="text-sm font-semibold text-gray-900">Thời hạn hợp đồng</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              Ngày bắt đầu <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1.5">
              Ngày kết thúc
              <span className="text-gray-400 font-normal ml-1">(tuỳ chọn)</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* PREVIEW SUMMARY */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
            <FileText size={15} className="text-gray-500" />
          </div>
          <p className="text-sm font-semibold text-gray-900">Tóm tắt hợp đồng</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Phòng", value: `#${roomId}` },
            {
              label: "Khách thuê",
              value: selectedTenant?.email || "—",
            },
            {
              label: "Thời hạn",
              value:
                startDate && endDate
                  ? `${startDate} → ${endDate}`
                  : startDate
                  ? `Từ ${startDate}`
                  : "—",
            },
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
        >
          Huỷ
        </button>

        <button
          disabled={loading || !selectedTenant || !startDate}
          onClick={handleSubmit}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Đang tạo...
            </>
          ) : (
            <>
              <FilePlus2 size={15} />
              Tạo hợp đồng
            </>
          )}
        </button>
      </div>
    </div>
  );
}