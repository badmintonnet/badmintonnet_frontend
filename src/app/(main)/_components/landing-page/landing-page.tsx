import ClubProcessAnimation from "@/components/animation-component";
import BrandMarquee from "@/components/brand-marquee";
import { Button } from "@/components/ui/button";
import {
  TrophyIcon,
  UsersIcon,
  ChartBarIcon,
  CpuChipIcon,
  UserCircleIcon,
  BuildingStorefrontIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function LandingPage() {
  const sampleLogos = [
    { url: "/logos/yonex.png", alt: "Yonex", id: "b1" },
    { url: "/logos/victor.png", alt: "Victor", id: "b2" },
    { url: "/logos/lining.png", alt: "Li-Ning", id: "b3" },
    { url: "/logos/vnb.png", alt: "VNB", id: "b4" },
    { url: "/logos/apacs.png", alt: "Apacs", id: "b5" },
    { url: "/logos/felet.png", alt: "Felet", id: "b6" },
    { url: "/logos/bwf.png", alt: "BWF", id: "b7" },
    { url: "/logos/haiyen.png", alt: "Hải Yến", id: "b8" },
  ];

  const features = [
    {
      icon: TrophyIcon,
      title: "Giải đấu & bốc thăm tự động",
      description:
        "Tổ chức và quản lý giải đấu chuyên nghiệp với hệ thống bốc thăm tự động, bảng đấu trực quan.",
      color: "from-yellow-500 to-orange-500",
      bg: "bg-yellow-50 dark:bg-yellow-950",
    },
    {
      icon: UsersIcon,
      title: "Câu lạc bộ & buổi đánh",
      description:
        "Kết nối với các CLB địa phương, tìm kiếm đối thủ phù hợp và tham gia các buổi đánh gần bạn.",
      color: "from-green-500 to-emerald-500",
      bg: "bg-green-50 dark:bg-green-950",
    },
    {
      icon: ChartBarIcon,
      title: "Xếp hạng trình độ ELO",
      description:
        "Hệ thống ELO rating chính xác giúp đánh giá và xếp hạng trình độ của từng người chơi minh bạch.",
      color: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50 dark:bg-blue-950",
    },
    {
      icon: CpuChipIcon,
      title: "AI hỗ trợ cá nhân hoá",
      description:
        "Trí tuệ nhân tạo phân tích lối chơi, gợi ý đối thủ phù hợp và lịch thi đấu tối ưu cho bạn.",
      color: "from-purple-500 to-pink-500",
      bg: "bg-purple-50 dark:bg-purple-950",
    },
  ];

  const stats = [
    { value: "600+", label: "Câu lạc bộ" },
    { value: "10,000+", label: "Người chơi" },
    { value: "200+", label: "Giải đấu" },
    { value: "50,000+", label: "Buổi đánh" },
  ];

  const benefits = [
    {
      icon: UserCircleIcon,
      title: "Người chơi",
      gradient: "from-green-500 to-emerald-600",
      items: [
        "Tìm đối thủ phù hợp trình độ",
        "Theo dõi tiến bộ cá nhân",
        "Tham gia giải đấu chuyên nghiệp",
        "Kết nối cộng đồng cầu lông",
      ],
    },
    {
      icon: UsersIcon,
      title: "Câu lạc bộ",
      gradient: "from-blue-500 to-indigo-600",
      items: [
        "Quản lý thành viên hiệu quả",
        "Tổ chức sự kiện dễ dàng",
        "Theo dõi hoạt động CLB",
        "Mở rộng thành viên mới",
      ],
    },
    {
      icon: BuildingStorefrontIcon,
      title: "Nhà tài trợ",
      gradient: "from-orange-500 to-red-500",
      items: [
        "Quảng bá thương hiệu qua giải đấu",
        "Tiếp cận cộng đồng cầu lông rộng lớn",
        "Đồng hành cùng các sự kiện thể thao",
        "Xây dựng hình ảnh chuyên nghiệp",
      ],
    },
  ];

  const testimonials = [
    {
      name: "Nguyễn Văn Minh",
      role: "Chủ nhiệm CLB Sao Mai",
      initials: "VM",
      color: "from-green-500 to-emerald-600",
      rating: 5,
      content:
        "BadmintonNet đã giúp CLB chúng tôi quản lý thành viên và tổ chức giải đấu một cách chuyên nghiệp. Rất hài lòng với nền tảng này!",
    },
    {
      name: "Trần Thị Lan Anh",
      role: "Vận động viên nghiệp dư",
      initials: "LA",
      color: "from-blue-500 to-indigo-600",
      rating: 5,
      content:
        "Tôi đã tìm được rất nhiều đối thủ phù hợp và cải thiện trình độ đáng kể nhờ hệ thống xếp hạng chính xác của BadmintonNet.",
    },
    {
      name: "Lê Hoàng Nam",
      role: "Vận động viên nghiệp dư",
      initials: "HN",
      color: "from-purple-500 to-pink-600",
      rating: 5,
      content:
        "Việc tổ chức giải đấu trở nên dễ dàng hơn bao giờ hết. Hệ thống bốc thăm và quản lý kết quả rất tiện lợi và minh bạch.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-green-950 to-gray-900 text-white">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium mb-6">
              🏸 Nền tảng cầu lông #1 Việt Nam
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Kết nối cộng đồng
              <br />
              <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                cầu lông Việt Nam
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Tìm đối thủ, tham gia giải đấu, quản lý câu lạc bộ và nâng cao
              trình độ với công nghệ AI hiện đại — tất cả trên một nền tảng.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button className="bg-green-500 hover:bg-green-400 text-white px-8 py-6 rounded-xl text-base font-semibold shadow-lg shadow-green-900/40 transition-all hover:scale-105">
                  Đăng ký miễn phí
                </Button>
              </Link>
              <Link href="/events">
                <Button
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-white/10 px-8 py-6 rounded-xl text-base font-semibold transition-all hover:scale-105 bg-transparent"
                >
                  Khám phá hoạt động →
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl md:text-3xl font-bold text-green-400">
                    {s.value}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-green-600 dark:text-green-400 text-sm font-semibold uppercase tracking-widest">
              Tính năng
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              Mọi thứ bạn cần, một nơi duy nhất
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Khám phá bộ công cụ mạnh mẽ được thiết kế riêng cho cộng đồng cầu lông Việt Nam.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-green-600 dark:text-green-400 text-sm font-semibold uppercase tracking-widest">
              Cách hoạt động
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              Bắt đầu chỉ trong 4 bước
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Đăng ký và tham gia cộng đồng cầu lông ngay hôm nay.
            </p>
          </div>
          <ClubProcessAnimation />
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section id="benefits" className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-green-600 dark:text-green-400 text-sm font-semibold uppercase tracking-widest">
              Lợi ích
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              Dành cho mọi đối tượng
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              BadmintonNet mang lại giá trị thiết thực cho tất cả mọi người trong cộng đồng cầu lông.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className={`h-2 bg-gradient-to-r ${benefit.gradient}`} />
                <div className="p-8">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-5`}
                  >
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
                    {benefit.title}
                  </h3>
                  <ul className="space-y-3">
                    {benefit.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-green-600 dark:text-green-400 text-sm font-semibold uppercase tracking-widest">
              Đánh giá
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              Người dùng nói gì về chúng tôi
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Hàng nghìn người dùng đã tin tưởng và sử dụng BadmintonNet mỗi ngày.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-7 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {/* Quote mark */}
                <div className="text-5xl leading-none text-green-200 dark:text-green-900 font-serif mb-3 select-none">
                  "
                </div>
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex-1">
                  {t.content}
                </p>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPONSORS ── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium">
              Đối tác & nhà tài trợ đồng hành
            </p>
          </div>
          <BrandMarquee logos={sampleLogos} />
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-gray-900 via-green-950 to-gray-900 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/3 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium mb-6">
            🏸 Miễn phí để bắt đầu
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
            Sẵn sàng tham gia
            <br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              cộng đồng cầu lông?
            </span>
          </h2>
          <p className="text-gray-300 text-lg mb-10">
            Tham gia cùng hàng nghìn người chơi cầu lông trên khắp Việt Nam —
            hoàn toàn miễn phí.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button className="bg-green-500 hover:bg-green-400 text-white px-10 py-6 rounded-xl text-base font-semibold shadow-lg shadow-green-900/40 transition-all hover:scale-105">
                Bắt đầu miễn phí ngay
              </Button>
            </Link>
            <Link href="/clubs">
              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-white/10 px-10 py-6 rounded-xl text-base font-semibold transition-all hover:scale-105 bg-transparent"
              >
                Xem câu lạc bộ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
