// app/(public)/landing/landing-page.tsx
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
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function LandingPage() {
  const sampleLogos = [
    { url: "/logos/yonex.png", alt: "Brand 1", id: "b1" },
    { url: "/logos/victor.png", alt: "Brand 2", id: "b2" },
    { url: "/logos/lining.png", alt: "Brand 3", id: "b3" },
    { url: "/logos/vnb.png", alt: "Brand 4", id: "b4" },
    { url: "/logos/apacs.png", alt: "Brand 1", id: "b5" },
    { url: "/logos/felet.png", alt: "Brand 2", id: "b6" },
    { url: "/logos/bwf.png", alt: "Brand 3", id: "b7" },
    { url: "/logos/haiyen.png", alt: "Brand 4", id: "b8" },
  ];
  // Mock data
  const features = [
    {
      icon: TrophyIcon,
      title: "Giải đấu & bốc thăm tự động",
      description:
        "Tổ chức và quản lý các giải đấu cầu lông một cách chuyên nghiệp với hệ thống bốc thăm tự động.",
    },
    {
      icon: UsersIcon,
      title: "Câu lạc bộ & buổi đánh",
      description:
        "Kết nối với các câu lạc bộ địa phương và tìm kiếm đối thủ phù hợp với trình độ của bạn.",
    },
    {
      icon: ChartBarIcon,
      title: "Xếp hạng trình độ",
      description:
        "Hệ thống ELO rating chính xác giúp đánh giá và xếp hạng trình độ của từng người chơi.",
    },
    {
      icon: CpuChipIcon,
      title: "AI hỗ trợ",
      description:
        "Trí tuệ nhân tạo phân tích lối chơi và đưa ra gợi ý cải thiện kỹ thuật cá nhân.",
    },
  ];

  const benefits = [
    {
      icon: UserCircleIcon,
      title: "Người chơi",
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
      avatar: "/api/placeholder/64/64",
      content:
        "BadmintonNet đã giúp CLB chúng tôi quản lý thành viên và tổ chức giải đấu một cách chuyên nghiệp. Rất hài lòng với nền tảng này!",
    },
    {
      name: "Trần Thị Lan Anh",
      role: "Vận động viên nghiệp dư",
      avatar: "/api/placeholder/64/64",
      content:
        "Tôi đã tìm được rất nhiều đối thủ phù hợp và cải thiện trình độ đáng kể nhờ hệ thống xếp hạng chính xác của BadmintonNet.",
    },
    {
      name: "Lê Hoàng Nam",
      role: "Vận động viên nghiệp dư",
      avatar: "/api/placeholder/64/64",
      content:
        "Việc tổ chức giải đấu trở nên dễ dàng hơn bao giờ hết. Hệ thống bốc thăm và quản lý kết quả rất tiện lợi và minh bạch.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Kết nối cộng đồng <br />
              <span className="text-yellow-300">cầu lông Việt Nam</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Nền tảng toàn diện cho người yêu cầu lông - Tìm đối thủ, tham gia
              giải đấu, nâng cao trình độ với công nghệ AI hiện đại
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg">
                <Link href="/signup">Đăng ký miễn phí</Link>
              </Button>
              <Button
                className="
    px-8 py-4 rounded-lg text-lg font-semibold
    border border-gray-300
    bg-white text-gray-900
    hover:bg-gray-100
    dark:bg-gray-800 dark:text-white
    dark:border-gray-600
    dark:hover:bg-gray-700
    transition-colors duration-300
  "
              >
                <Link href="/events">Khám phá hoạt động</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Khám phá những công cụ mạnh mẽ giúp bạn trải nghiệm cầu lông tốt
              nhất
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Cách hoạt động
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Chỉ 4 bước đơn giản để bắt đầu hành trình cầu lông của bạn
            </p>
          </div>
          <ClubProcessAnimation />
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Lợi ích cho mọi đối tượng
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              BadmintonNet mang lại giá trị cho tất cả mọi người trong cộng đồng
              cầu lông
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                  <benefit.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {benefit.title}
                </h3>
                <ul className="space-y-2">
                  {benefit.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="text-gray-600 dark:text-gray-300 flex items-center"
                    >
                      <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mr-3"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Người dùng nói gì về chúng tôi
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Hàng nghìn người dùng đã tin tưởng và sử dụng BadmintonNet
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl"
              >
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                  {testimonial.content}
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full mr-4"></div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Các nhà tài trợ đồng hành cùng chúng tôi
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Chúng tôi tự hào khi nhận được sự đồng hành và tin tưởng từ các
              thương hiệu, tổ chức uy tín.
            </p>
          </div>
          <BrandMarquee logos={sampleLogos} />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng bắt đầu hành trình cầu lông?
          </h2>
          <p className="text-xl mb-8">
            Tham gia cùng hàng nghìn người chơi cầu lông trên khắp Việt Nam
          </p>

          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg">
            <Link href="/signup">Bắt đầu miễn phí ngay</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
    </div>
  );
}
