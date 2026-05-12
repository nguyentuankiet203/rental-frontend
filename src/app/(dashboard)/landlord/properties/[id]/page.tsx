"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getRooms, deleteRoom } from "@/services/room.service";
import { endContract } from "@/services/contract.service";
import ConfirmDeleteModal from "@/components/properties-rooms/ConfirmDeleteModal";
import { Pencil, Trash2, BedDouble, Users, CheckCircle2, BarChart3, FileSpreadsheet, Plus } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RoomPage() {
  const params = useParams();
  const id = params.id as string;

  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await getRooms(Number(id));
      setRooms(res.data || res);
    } catch {
      toast.error("Không thể tải danh sách phòng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchRooms();
  }, [id]);

  const total = rooms.length;
  const occupied = rooms.filter((r) => r.status !== "AVAILABLE").length;
  const available = rooms.filter((r) => r.status === "AVAILABLE").length;
  const occupancyRate = Math.round((occupied / (total || 1)) * 100);

  const stats = [
    { label: "Tổng phòng", value: total, icon: BedDouble, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Đang thuê", value: occupied, icon: Users, color: "text-red-500", bg: "bg-red-50" },
    { label: "Còn trống", value: available, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
    { label: "Tỉ lệ lấp đầy", value: `${occupancyRate}%`, icon: BarChart3, color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  return (
    <div className="p-6 max-w-screen-xl space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý phòng</h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi tình trạng phòng, khách thuê và hợp đồng
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href={`/landlord/properties/${id}/rooms/import`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
          >
            <FileSpreadsheet size={15} />
            Import Excel
          </Link>

          <Link
            href={`/landlord/properties/${id}/rooms/create`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
          >
            <Plus size={15} />
            Thêm phòng
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">{s.label}</span>
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <Icon size={17} className={s.color} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Danh sách phòng</h2>
          {!loading && rooms.length > 0 && (
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {rooms.length} phòng
            </span>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && rooms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
              <BedDouble size={24} className="text-blue-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Chưa có phòng nào</h3>
            <p className="text-sm text-gray-500 mt-1 mb-5">Bắt đầu bằng cách thêm phòng đầu tiên.</p>
            <Link
              href={`/landlord/properties/${id}/rooms/create`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Plus size={15} />
              Thêm phòng
            </Link>
          </div>
        )}

        {/* TABLE */}
        {!loading && rooms.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3">Phòng</th>
                  <th className="px-6 py-3">Khách thuê</th>
                  <th className="px-6 py-3">Giá thuê</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3 text-right">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {rooms.map((r: any) => (
                  <tr key={r.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* ROOM */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {r.images?.length > 0 ? (
                          <img
                            src={r.images[0].image_url}
                            alt={r.name}
                            className="w-12 h-12 object-cover rounded-xl border border-gray-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                            <BedDouble size={16} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{r.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">Phòng #{r.room_number}</p>
                        </div>
                      </div>
                    </td>

                    {/* TENANT */}
                    <td className="px-6 py-4">
                      {r.currentTenant ? (
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0">
                            {r.currentTenant?.email?.[0]?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{r.currentTenant.email}</p>
                            <button
                              onClick={async () => {
                                await endContract(r.contractId);
                                toast.success("Đã kết thúc hợp đồng");
                                fetchRooms();
                              }}
                              className="text-xs text-red-500 hover:text-red-600 hover:underline mt-0.5"
                            >
                              Kết thúc hợp đồng
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Chưa có khách</span>
                      )}
                    </td>

                    {/* PRICE */}
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        {r.price_per_month.toLocaleString("vi-VN")}₫
                      </span>
                      <span className="text-xs text-gray-400">/tháng</span>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        r.status === "AVAILABLE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          r.status === "AVAILABLE" ? "bg-green-500" : "bg-red-500"
                        }`} />
                        {r.status === "AVAILABLE" ? "Còn trống" : "Đang thuê"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {r.status === "AVAILABLE" && (
                          <Link
                            href={`/landlord/rooms/${r.id}/create-contract`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 active:scale-95 transition-all"
                          >
                            Tạo hợp đồng
                          </Link>
                        )}

                        <Link
                          href={`/landlord/rooms/${r.id}/edit`}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 active:scale-95 transition-all"
                        >
                          <Pencil size={14} />
                        </Link>

                        <button
                          onClick={() => {
                            setSelectedId(r.id);
                            setOpenConfirm(true);
                          }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 active:scale-95 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
      {openConfirm && (
        <ConfirmDeleteModal
          openConfirm={openConfirm}
          setOpenConfirm={setOpenConfirm}
          selectedId={selectedId}
          deleting={deleting}
          setDeleting={setDeleting}
          deleteRoom={deleteRoom}
          fetchRooms={fetchRooms}
          toast={toast}
        />
      )}
    </div>
  );
}