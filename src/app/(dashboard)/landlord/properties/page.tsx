"use client";

import { useEffect, useState } from "react";
import { getProperties } from "@/services/properties.service";
import Link from "next/link";
import { Home, MapPin, Plus, Pencil, ArrowRight } from "lucide-react";

export default function PropertyPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getProperties();
      setData(res.data || res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-screen-xl">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bất động sản</h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý các tài sản cho thuê của bạn
          </p>
        </div>

        <Link
          href="/landlord/properties/create"
          className="inline-flex w-fit items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all duration-150 shadow-sm"
        >
          <Plus size={16} />
          Thêm bất động sản
        </Link>
      </div>

      {/* LOADING SKELETON */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
            >
              <div className="h-48 bg-gray-100 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-3/4 rounded-lg bg-gray-100 animate-pulse" />
                <div className="h-3 rounded-lg bg-gray-100 animate-pulse" />
                <div className="h-3 w-1/2 rounded-lg bg-gray-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && data.length === 0 && (
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
            <Home size={28} className="text-blue-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Chưa có bất động sản nào
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-xs">
            Bắt đầu bằng cách thêm bất động sản cho thuê đầu tiên của bạn.
          </p>
          <Link
            href="/landlord/properties/create"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all duration-150 shadow-sm"
          >
            <Plus size={16} />
            Thêm bất động sản
          </Link>
        </div>
      )}

      {/* PROPERTY GRID */}
      {!loading && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {data.map((p: any) => (
            <div
              key={p.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* IMAGE */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
                    <Home size={36} />
                    <span className="text-xs text-gray-400">Chưa có ảnh</span>
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Badge ID */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-600 shadow-sm">
                  #{p.id}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5">
                <h2 className="text-base font-semibold text-gray-900 truncate">
                  {p.name}
                </h2>

                <div className="flex items-start gap-1.5 mt-1.5">
                  <MapPin size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-500 line-clamp-1">{p.address}</p>
                </div>

                {/* FOOTER */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={`/landlord/properties/${p.id}/edit`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 active:scale-95 transition-all duration-150">
                    <Pencil size={13} />
                    Chỉnh sửa
                  </Link>

                  <Link
                    href={`/landlord/properties/${p.id}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:gap-2 transition-all duration-150"
                  >
                    Xem phòng
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}