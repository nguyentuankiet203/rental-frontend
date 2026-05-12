import Link from "next/link";
import {
  Building2,
  FileText,
  Receipt,
  Bell,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Quản lý bất động sản",
    desc: "Theo dõi toàn bộ tài sản, phòng trọ và tình trạng cho thuê trên một nền tảng duy nhất.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: FileText,
    title: "Hợp đồng thông minh",
    desc: "Tạo và quản lý hợp đồng thuê phòng dễ dàng, theo dõi trạng thái tự động.",
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    icon: Receipt,
    title: "Hóa đơn tự động",
    desc: "Hệ thống tự động tạo hóa đơn hàng tháng và thông báo nhắc nhở thanh toán.",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: Bell,
    title: "Thông báo realtime",
    desc: "Nhận thông báo tức thì khi có thanh toán, hợp đồng mới hoặc hóa đơn quá hạn.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: BarChart3,
    title: "Thống kê doanh thu",
    desc: "Biểu đồ doanh thu theo tháng, theo từng bất động sản.",
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
  {
    icon: ShieldCheck,
    title: "Phân quyền rõ ràng",
    desc: "Admin, Chủ trọ và Khách thuê với giao diện riêng biệt.",
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
];

const benefits = [
  "Tiết kiệm thời gian quản lý thủ công",
  "Giảm thiểu sai sót trong hóa đơn",
  "Theo dõi doanh thu mọi lúc mọi nơi",
  "Khách thuê tự thanh toán trực tuyến",
  "Thông báo tự động nhắc hạn hợp đồng",
  "Dữ liệu bảo mật và sao lưu tự động",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* BACKGROUND EFFECT */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_40%)]" />

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 relative">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <Building2 size={18} className="text-white" />
            </div>

            <span className="text-lg font-extrabold text-gray-900">
              RentSaaS
            </span>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center justify-center px-5 h-10 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Đăng nhập
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 h-10 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-200"
            >
              Đăng ký
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-200 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-6">
            <ShieldCheck size={13} />
            Nền tảng quản lý phòng trọ hiện đại
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Quản lý phòng trọ
            <span className="block text-blue-600">
              dễ dàng và chuyên nghiệp
            </span>
          </h1>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            RentSaaS giúp bạn quản lý bất động sản, hợp đồng, hóa đơn và khách
            thuê trên một nền tảng duy nhất — tiết kiệm thời gian và tăng hiệu
            quả vận hành.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200"
            >
              Đăng ký miễn phí
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
            >
              Đăng nhập
            </Link>
          </div>

          {/* CONTACT */}
          <p className="mt-5 text-sm text-gray-500">
            Cần hỗ trợ hoặc cấp quyền quản trị?{" "}
            <a
              href="https://zalo.me/0973519414"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition"
            >
              Liên hệ admin
            </a>
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Tất cả trong một nền tảng
            </h2>

            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Từ quản lý phòng trọ đến theo dõi doanh thu — mọi thứ được tối ưu
              để giúp bạn vận hành dễ dàng hơn.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;

              return (
                <div
                  key={i}
                  className="group bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-5`}
                  >
                    <Icon size={24} className={f.color} />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {f.title}
                  </h3>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* LEFT */}
            <div>
              <h2 className="text-4xl font-extrabold mb-5">
                Tại sao chọn RentSaaS?
              </h2>

              <p className="text-slate-300 mb-10 leading-relaxed">
                Hệ thống được thiết kế dành riêng cho chủ trọ và nhà quản lý bất
                động sản hiện đại.
              </p>

              <ul className="space-y-4">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2
                        size={16}
                        className="text-blue-400"
                      />
                    </div>

                    <span className="text-sm text-slate-200">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT CARD */}
            <div className="bg-white rounded-3xl p-8 text-gray-900 shadow-2xl">
              <p className="text-sm font-semibold text-blue-600 mb-2">
                Dành cho chủ trọ
              </p>

              <h3 className="text-3xl font-extrabold mb-7">
                Bắt đầu chỉ trong 5 phút
              </h3>

              <div className="space-y-5">
                {[
                  "Tạo tài khoản miễn phí",
                  "Thêm bất động sản và phòng",
                  "Tạo hợp đồng cho khách thuê",
                  "Hệ thống tự động xử lý phần còn lại",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      0{i + 1}
                    </div>

                    <p className="text-sm text-gray-600">{step}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/login"
                className="mt-8 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all"
              >
                Đăng nhập ngay
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-slate-900 to-indigo-950 py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Sẵn sàng bắt đầu?
          </h2>

          <p className="text-slate-300 mb-10 leading-relaxed">
            Tham gia cùng hàng trăm chủ trọ đang quản lý bất động sản thông
            minh hơn với RentSaaS.
          </p>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-900 font-bold hover:scale-105 transition-all shadow-xl"
          >
            Bắt đầu ngay hôm nay
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-8 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <Building2 size={15} className="text-white" />
            </div>

            <span className="text-sm font-bold text-gray-900">
              RentSaaS
            </span>
          </div>

          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} RentSaaS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
