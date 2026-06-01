"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Edit } from "lucide-react";

import {
  getContractById,
  updateContract,
} from "@/services/contract.service";

export default function UpdateContractPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contract, setContract] = useState<any>(null);

  const [form, setForm] = useState({
    start_date: "",
    end_date: "",
    rent_price: 0,
    status: "ACTIVE",
  });

  useEffect(() => {
    fetchContract();
  }, []);
  useEffect(() => {
    if (id) {
      fetchContract();
    }
  }, [id]);

  const fetchContract = async () => {
    try {
      console.log("Contract ID:", id);
      const data = await getContractById(Number(id));
      setContract(data);
      console.log("Contract Data:", data);

      setForm({
        start_date: data.start_date?.slice(0, 10),
        end_date: data.end_date?.slice(0, 10),
        rent_price: data.rent_price,
        status: data.status,
      });
    } catch (error: any) {
      console.log(error.response?.data);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      if (new Date(form.end_date) <= new Date(form.start_date)) {
        toast.error("Ngày kết thúc phải lớn hơn ngày bắt đầu");
        return;
      }
      if (form.rent_price <= 0) {
        toast.error("Tiền thuê phải lớn hơn 0");
        return;
      }
      await updateContract(Number(id), form);

      toast.success("Update contract thành công!");

      router.push("/landlord/contracts");
    } catch (error) {
      console.error(error);
      toast.error("Update thất bại");
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Update Contract
      </h1>

      {contract && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-lg mb-3">
            Contract Information
          </h2>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium">Tenant:</span>{" "}
              {contract.tenant.name}
            </div>

            <div>
              <span className="font-medium">Email:</span>{" "}
              {contract.tenant.email}
            </div>

            <div>
              <span className="font-medium">Room:</span>{" "}
              {contract.room.name}
            </div>

            <div>
              <span className="font-medium">Room Number:</span>{" "}
              {contract.room.room_number}
            </div>

            <div>
              <span className="font-medium">Current Status:</span>{" "}
              {contract.status}
            </div>

            <div>
              <span className="font-medium">Current Rent:</span>{" "}
              {Number(contract.rent_price).toLocaleString("vi-VN")} đ
            </div>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow"
      >
        <div>
          <label className="block mb-1">
            Start Date
          </label>

          <input
            type="date"
            value={form.start_date}
            onChange={(e) =>
              setForm({
                ...form,
                start_date: e.target.value,
              })
            }
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">
            End Date
          </label>

          <input
            type="date"
            value={form.end_date}
            onChange={(e) =>
              setForm({
                ...form,
                end_date: e.target.value,
              })
            }
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">
            Rent Price
          </label>

          <input
            type="number"
            value={form.rent_price}
            onChange={(e) =>
              setForm({
                ...form,
                rent_price: Number(
                  e.target.value
                ),
              })
            }
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">
            Status
          </label>

          <select
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value,
              })
            }
            className="w-full border p-2 rounded"
          >
            <option value="ACTIVE">
              ACTIVE
            </option>

            <option value="ENDED">
              ENDED
            </option>

            <option value="EXPIRED">
              EXPIRED
            </option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                </svg>
                Đang lưu...
              </>
            ) : (
              <>
                <Edit size={15} />
                Lưu
                </>
            )}
          </button>

          <Link
            href="/landlord/contracts"
            className="border px-4 py-2 rounded"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}