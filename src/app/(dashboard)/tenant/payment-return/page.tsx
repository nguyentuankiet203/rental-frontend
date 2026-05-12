"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/services/api";

export default function PaymentReturnPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handle = async () => {
      const invoiceId = params.get("invoiceId");
      const amount = params.get("amount");

      await api.get("/payments/return", {
        params: { invoiceId, amount },
      });

      router.push("/tenant/invoices");
    };

    handle();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-xl font-semibold">
          Đang xử lý thanh toán...
        </div>
      </div>
    </div>
  );
}