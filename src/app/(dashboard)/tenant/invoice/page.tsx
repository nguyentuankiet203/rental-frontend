"use client";

import { useEffect, useState } from "react";
import { getMyInvoices, payInvoice } from "@/services/invoices.service";
import { formatMoney } from "@/services/dashboard";
import {
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  CalendarDays,
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string; icon: any }> = {
  PAID: {
    label: "Đã thanh toán",
    color: "bg-green-100 text-green-700",
    dot: "bg-green-500",
    icon: CheckCircle2,
  },
  OVERDUE: {
    label: "Quá hạn",
    color: "bg-red-100 text-red-600",
    dot: "bg-red-500",
    icon: AlertCircle,
  },
  UNPAID: {
    label: "Chưa thanh toán",
    color: "bg-amber-100 text-amber-600",
    dot: "bg-amber-500",
    icon: Clock,
  },
};

export default function TenantInvoicePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getMyInvoices();
      setData(res?.data || res || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePay = async (id: number) => {
    try {
      setLoadingId(id);
      const res = await payInvoice(id);
      if (res?.url) {
        window.location.href = res.url;
      } else {
        fetchData();
      }
    } finally {
      setLoadingId(null);
    }
  };

  const unpaidCount = data.filter((i) => i.status !== "PAID").length;
  const totalUnpaid = data
    .filter((i) => i.status !== "PAID")
    .reduce((sum, i) => sum + (i.total_amount || 0), 0);

  return (
    <div className="p-6 max-w-screen-xl space-y-5">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hóa đơn của tôi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi và thanh toán hóa đơn hàng tháng
          </p>
        </div>
        {!loading && data.length > 0 && (
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full self-start sm:self-auto">
            {data.length} hóa đơn
          </span>
        )}
      </div>

      {/* SUMMARY BANNER — chỉ hiện khi có hóa đơn chưa trả */}
      {!loading && unpaidCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={20} className="text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Bạn có {unpaidCount} hóa đơn chưa thanh toán
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              Tổng cộng:{" "}
              <span className="font-bold">{formatMoney(totalUnpaid)}</span>
            </p>
          </div>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 animate-pulse">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-gray-100 rounded-lg" />
                <div className="h-5 w-20 bg-gray-100 rounded-full" />
              </div>
              <div className="h-7 w-32 bg-gray-100 rounded-lg" />
              <div className="h-9 bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <Receipt size={24} className="text-gray-400" />
          </div>
          <p className="text-base font-semibold text-gray-900">Chưa có hóa đơn</p>
          <p className="text-sm text-gray-400 mt-1">
            Hóa đơn sẽ xuất hiện khi chủ trọ tạo cho bạn
          </p>
        </div>
      )}

      {/* INVOICE CARDS */}
      {!loading && data.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((inv) => {
            const status = STATUS_CONFIG[inv.status] ?? STATUS_CONFIG["UNPAID"];
            const StatusIcon = status.icon;
            const isPaying = loadingId === inv.id;

            return (
              <div
                key={inv.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow"
              >
                {/* TOP ROW */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <CalendarDays size={15} className="text-blue-500" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {inv.month}
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </div>

                {/* AMOUNT */}
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Số tiền</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatMoney(inv.total_amount)}
                  </p>
                </div>

                {/* PAY BUTTON */}
                {inv.status !== "PAID" ? (
                  <button
                    onClick={() => handlePay(inv.id)}
                    disabled={isPaying}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isPaying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <CreditCard size={15} />
                        Thanh toán ngay
                      </>
                    )}
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-2.5 bg-green-50 text-green-600 rounded-xl text-sm font-semibold">
                    <CheckCircle2 size={15} />
                    Đã thanh toán
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}