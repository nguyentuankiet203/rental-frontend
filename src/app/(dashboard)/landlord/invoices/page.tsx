"use client";

import { useEffect, useState } from "react";
import { getInvoices } from "@/services/invoices.service";
import { createPayment } from "@/services/payment.service";

export default function InvoicePage() {
  const [data, setData] = useState<any[]>([]);
  console.log(data);

  const [filters, setFilters] = useState({
    status: "",
    month: "",
  });

  const fetchData = async () => {
    try {
      const res = await getInvoices({
        ...filters,
        page: 1,
        limit: 10,
      });

      console.log("invoice API:", res);

      if (Array.isArray(res)) {
        setData(res);
      } else {
        setData(res.data || []);
      }
    } catch (err) {
      console.error(err);
      setData([]);
    }
  };

  const handlePay = async (invoiceId: number) => {
    const res = await createPayment(invoiceId);

    window.location.href = res.url;
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const statusColor: any = {
    PAID: "bg-green-100 text-green-600",
    UNPAID: "bg-yellow-100 text-yellow-600",
    OVERDUE: "bg-red-100 text-red-600",
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-5">
        Invoices
      </h1>

      {/* FILTER */}
      <div className="flex gap-3 mb-5">
        <select
          className="border px-3 py-2 rounded-lg"
          onChange={(e) =>
            setFilters({
              ...filters,
              status: e.target.value,
            })
          }
        >
          <option value="">All Status</option>
          <option value="PAID">PAID</option>
          <option value="UNPAID">UNPAID</option>
          <option value="OVERDUE">OVERDUE</option>
        </select>

        <input
          type="month"
          className="border px-3 py-2 rounded-lg"
          onChange={(e) =>
            setFilters({
              ...filters,
              month: e.target.value,
            })
          }
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-4">Tenant</th>
              <th className="p-4">Property</th>
              <th className="p-4">Room</th>
              <th className="p-4">Month</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-6 text-center text-gray-400"
                >
                  No invoices found
                </td>
              </tr>
            ) : (
              data.map((i: any) => (
                <tr
                  key={i.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4">
                    {i.contract?.tenant?.name}
                  </td>

                  <td className="p-4">
                    {i.contract?.room?.property?.name}
                  </td>

                  <td className="p-4">
                    Room #{i.contract?.room?.room_number}
                  </td>

                  <td className="p-4">
                    {i.month}
                  </td>

                  <td className="p-4 font-medium">
                    {Number(
                      i.total_amount
                    ).toLocaleString("vi-VN")}{" "}
                    ₫
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[i.status]}`}
                    >
                      {i.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}