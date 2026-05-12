"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import {
  FileText,
  CalendarDays,
  Home,
  Wallet,
} from "lucide-react";

const contracts = [
  {
    id: 1,
    room: "Phòng A101",
    property: "Nhà trọ Bình Thạnh",
    start: "01/05/2026",
    end: "01/05/2027",
    rent: "3.500.000đ",
    status: "Đang hoạt động",
  },
];

export default function TenantContractsPage() {
  return (
    <RoleGuard allow={["TENANT"]}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hợp đồng của tôi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Danh sách hợp đồng thuê hiện tại
          </p>
        </div>

        <div className="space-y-4">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {contract.room}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {contract.property}
                  </p>
                </div>

                <div className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">
                  {contract.status}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <CalendarDays size={18} className="text-blue-600" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Thời gian
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {contract.start} - {contract.end}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Home size={18} className="text-purple-600" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Phòng
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {contract.room}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <Wallet size={18} className="text-green-600" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Tiền thuê
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {contract.rent}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RoleGuard>
  );
}