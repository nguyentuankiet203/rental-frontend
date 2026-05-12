"use client";

import { useEffect, useState } from "react";
import { getProperties } from "@/services/properties.service";
import { formatMoney } from "@/services/dashboard";
import {
  getInvoiceSummary,
  getRevenueAnalytics,
} from "@/services/invoices.service";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Clock,
  AlertCircle,
  FileX,
} from "lucide-react";
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<any[]>([]);
  const year = new Date().getFullYear();
  const fillMissingMonths = (data: any[], props: any[]) => {
    return Array.from({ length: 12 }, (_, i) => {
      const month = `${year}-${String(i + 1).padStart(2, "0")}`;
      const found = data.find((d) => d.month === month);
      if (found) return found;
      const empty: any = { month };
      props.forEach((p) => { empty[`property_${p.id}`] = 0; });
      return empty;
    });
  };
  useEffect(() => {
    getProperties().then((props) => {
      setProperties(props);
      setSelectedProperties(props);
    });
  }, []);
  useEffect(() => {
    if (!selectedProperties.length) return;
    const load = async () => {
      const sum = await getInvoiceSummary(selectedProperties.map((p) => p.id));
      setSummary(sum);
      const chart = await getRevenueAnalytics({
        propertyIds: selectedProperties.map((p) => p.id).join(","),
        year,
      });
      const map: Record<string, any> = {};
      chart.forEach((i: any) => {
        if (!map[i.month]) map[i.month] = { month: i.month };
        map[i.month][`property_${i.property_id}`] = Number(i.revenue);
      });
      setChartData(fillMissingMonths(Object.values(map), selectedProperties));
    };
    load();
  }, [selectedProperties]);
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-3 min-w-[160px]">
        <p className="text-xs text-gray-400 mb-2 font-medium">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center justify-between gap-4 text-sm mb-1">
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ background: p.color }}
              />
              <span className="text-gray-600">{p.name}</span>
            </span>
            <span className="font-semibold text-gray-900">
              {Number(p.value).toLocaleString("vi-VN")}đ
            </span>
          </div>
        ))}
      </div>
    );
  };
  const statCards = [
    {
      label: "Đã thanh toán",
      value: summary ? formatMoney(summary.total_paid) : "—",
      icon: TrendingUp,
      color: "bg-blue-600",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
      highlight: true,
    },
    {
      label: "Chưa thanh toán",
      value: summary ? formatMoney(summary.total_unpaid) : "—",
      icon: Clock,
      color: "bg-amber-500",
      textColor: "text-amber-500",
      bgLight: "bg-amber-50",
    },
    {
      label: "Quá hạn",
      value: summary ? formatMoney(summary.total_overdue) : "—",
      icon: AlertCircle,
      color: "bg-red-500",
      textColor: "text-red-500",
      bgLight: "bg-red-50",
    },
    {
      label: "Số hóa đơn quá hạn",
      value: summary ? summary.overdue_count : "—",
      icon: FileX,
      color: "bg-rose-500",
      textColor: "text-rose-500",
      bgLight: "bg-rose-50",
    },
  ];
  return (
    <div className="p-6 space-y-6 max-w-screen-xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-sm text-gray-500 mt-1">
          Dữ liệu tài chính năm {year}
        </p>
      </div>
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`rounded-2xl p-5 border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow ${
                card.highlight ? "ring-2 ring-blue-500/20" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500 font-medium">
                  {card.label}
                </span>
                <div className={`w-9 h-9 rounded-xl ${card.bgLight} flex items-center justify-center`}>
                  <Icon size={18} className={card.textColor} />
                </div>
              </div>
              {summary ? (
                <p className={`text-2xl font-bold ${card.highlight ? "text-blue-600" : "text-gray-900"}`}>
                  {card.value}
                </p>
              ) : (
                <div className="h-8 w-3/4 bg-gray-100 rounded-lg animate-pulse mt-1" />
              )}
            </div>
          );
        })}
      </div>
      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Doanh thu theo tháng
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Chỉ tính hóa đơn đã thanh toán
            </p>
          </div>
          {/* Property Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedProperties(properties)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selectedProperties.length === properties.length
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              Tất cả
            </button>
            {properties.map((p) => {
              const active = selectedProperties.some((sp) => sp.id === p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedProperties((prev) =>
                      active
                        ? prev.filter((x) => x.id !== p.id)
                        : [...prev, p]
                    );
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    active
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full h-[320px] bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                // dataKey="month"
                tickFormatter={(m) => m.slice(5)}
                dataKey="month"
                tick={{ fontSize: 12 }}
              />

              <YAxis width={70}
                tickMargin={10}
                tickFormatter={(v) =>
                  new Intl.NumberFormat("vi-VN", {
                    notation: "compact",
                  }).format(v)
                }
              />

              <Tooltip content={<CustomTooltip />} />

              <Legend />

              {selectedProperties.map((p: any, index: number) => (
                <Line
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                  connectNulls
                  key={p.id}
                  name={p.name || `Property ${p.id}`}
                  type="monotone"
                  dataKey={`property_${p.id}`}
                  stroke={COLORS[index % COLORS.length]}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}