"use client";

import { useEffect, useState } from "react";
import { getContracts } from "@/services/contract.service";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  Building2,
  User,
  Calendar,
} from "lucide-react";

const statusConfig = {
  ACTIVE: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700 border-2 border-emerald-400",
    dot: "bg-emerald-500",
  },
  ENDED: {
    label: "Ended",
    className: "bg-slate-50 text-slate-600 border-2 border-slate-400",
    dot: "bg-slate-400",
  },
  EXPIRED: {
    label: "Expired",
    className: "bg-red-50 text-red-600 border-2 border-red-400",
    dot: "bg-red-500",
  },
};

export default function ContractPage() {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    propertyId: "",
    status: "",
    search: "",
  });

  useEffect(() => {
    fetchData();
  }, [page, filters]);

  const fetchData = async () => {
    try {
      const res = await getContracts({ ...filters, page, limit: 10 });
      if (Array.isArray(res)) {
        setData(res);
        setTotal(res.length);
      } else {
        setData(res.data || []);
        setTotal(res.total || 0);
      }
    } catch (err) {
      console.error("Fetch contracts error:", err);
      setData([]);
    }
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
        </div>
        <p className="text-sm text-gray-500 ml-12">
          Manage all rental agreements
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search tenant name..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            onChange={(e) => {
              const val = e.target.value;
              setFilters(prev => ({ ...prev, search: val }));
            }}
          />
        </div>
        <select
          className="px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer"
          onChange={(e) => {
            const val = e.target.value;
            setFilters(prev => ({ ...prev, status: val }));
          }}
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="ENDED">Ended</option>
          <option value="EXPIRED">Expired</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3.5">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Tenant
                </div>
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3.5">
                Room
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3.5">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  Property
                </div>
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3.5">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Period
                </div>
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3.5">
                Status
              </th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3.5">
                Rent Price
              </th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-gray-400">
                  <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No contracts found</p>
                </td>
              </tr>
            ) : (
              data.map((c) => {
                const status =
                  statusConfig[c.status as keyof typeof statusConfig];
                return (
                  <tr
                    key={c.id}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {c.tenant.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {c.tenant.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 text-sm font-semibold text-gray-700">
                        {c.room.room_number}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">
                        {c.room.property.name}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-gray-800">
                          {c.start_date}
                        </span>
                        <span className="mx-1.5 text-gray-300">→</span>
                        <span className="font-medium text-gray-800">
                          {c.end_date}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {status && (
                        <span
                          className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-semibold ${status.className}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                          />
                          {status.label}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-sm font-semibold text-gray-900">
                        {c.rent_price.toLocaleString("vi-VN")}
                        <span className="text-xs text-gray-400 font-normal ml-0.5">
                          đ
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/landlord/contracts/${c.id}/edit`}
                        className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {total > 0 && (
          <div className="border-t border-gray-100 px-5 py-3.5 flex items-center justify-between bg-gray-50/50">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-700">
                {(page - 1) * 10 + 1}–{Math.min(page * 10, total)}
              </span>{" "}
              of <span className="font-medium text-gray-700">{total}</span>{" "}
              contracts
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 text-xs font-medium rounded-lg transition-all ${
                        page === p
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-600 hover:bg-white hover:border hover:border-gray-200"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}