"use client";

import { useEffect, useState } from "react";
import { getContracts } from "@/services/contract.service";

export default function ContractPage() {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const statusColor = {
    ACTIVE: "bg-green-200",
    ENDED: "bg-gray-300",
    EXPIRED: "bg-red-200",
  };
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
      const res = await getContracts({
        ...filters,
        page,
        limit: 10,
      });

      console.log("contracts API:", res);

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

  return (
    <div className="p-6">

      <div className="flex gap-3 mb-4">
        <input
          placeholder="Search tenant..."
          className="border px-3 py-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
        />

        <select
          className="border px-3 py-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="">All Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="ENDED">ENDED</option>
          <option value="EXPIRED">EXPIRED</option>
        </select>
      </div>

      <table className="w-full border rounded-xl overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Tenant</th>
            <th className="p-2">Room</th>
            <th className="p-2">Property</th>
            <th className="p-2">Start</th>
            <th className="p-2">End</th>
            <th className="p-2">Status</th>
            <th className="p-2">Rent</th>
          </tr>
        </thead>

        <tbody>
          {data.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-2">{c.tenant.name}</td>
              <td className="p-2 text-center">{c.room.room_number}</td>
              <td className="p-2 text-center">{c.room.property.name}</td>
              <td className="p-2 text-center">{c.start_date}</td>
              <td className="p-2 text-center">{c.end_date}</td>
              <td className="p-2 text-center">
                <span className="px-2 py-1 rounded bg-gray-200 statusColor">
                  {c.status}
                </span>
              </td>
              <td className="p-2 text-right">
                {c.rent_price.toLocaleString("vi-VN")} đ
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4 gap-2">
        <button onClick={() => setPage(page - 1)}>Prev</button>
        <span>{page}</span>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}