"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import {
  BedDouble,
  Wifi,
  Bath,
  MapPin,
} from "lucide-react";

export default function TenantRoomPage() {
  return (
    <RoleGuard allow={["TENANT"]}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Thông tin phòng
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Chi tiết phòng bạn đang thuê
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200"
            className="w-full h-64 object-cover"
          />

          <div className="p-5">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Phòng A101
                </h2>

                <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                  <MapPin size={14} />
                  Bình Thạnh, TP.HCM
                </div>
              </div>

              <div className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">
                Đang thuê
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <BedDouble size={18} className="text-blue-600 mb-2" />
                <p className="text-xs text-gray-500">Loại phòng</p>
                <p className="text-sm font-semibold text-gray-900">
                  Studio
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <Wifi size={18} className="text-green-600 mb-2" />
                <p className="text-xs text-gray-500">Internet</p>
                <p className="text-sm font-semibold text-gray-900">
                  Miễn phí
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <Bath size={18} className="text-purple-600 mb-2" />
                <p className="text-xs text-gray-500">Nhà vệ sinh</p>
                <p className="text-sm font-semibold text-gray-900">
                  Riêng
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}