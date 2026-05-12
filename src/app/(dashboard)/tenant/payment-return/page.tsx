"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/services/api";

function PaymentReturnContent() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handle = async () => {
      try {
        const invoiceId = params.get("invoiceId");
        const amount = params.get("amount");

        await api.get("/payments/return", {
          params: { invoiceId, amount },
        });

        router.push("/tenant/invoices");
      } catch (error) {
        console.error(error);
        router.push("/tenant/invoices");
      }
    };

    handle();
  }, [params, router]);

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

export default function PaymentReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <div className="text-xl font-semibold">
            Đang tải...
          </div>
        </div>
      }
    >
      <PaymentReturnContent />
    </Suspense>
  );
}