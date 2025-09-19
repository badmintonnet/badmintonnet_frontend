import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Club,
  CircleStar,
  Building2,
  GraduationCap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import eventClubApiRequest from "@/apiRequest/club.event";
import { cookies } from "next/headers";

interface ClubEventsProps {
  searchParams: Promise<{ page?: string }>;
}

const statusMapVN: Record<string, string> = {
  DRAFT: "Chưa mở đăng ký",
  OPEN: "Mở đăng ký",
  CLOSED: "Đã đóng đăng ký",
  ONGOING: "Đang diễn ra",
  FINISHED: "Đã kết thúc",
  CANCELLED: "Bị hủy",
};
function getStatusBadgeStyle(status: string) {
  const styles: Record<string, string> = {
    DRAFT: "bg-white/95 text-gray-600 border border-gray-200 hover:bg-gray-50",
    OPEN: "bg-white/95 text-green-600 border border-green-200 hover:bg-green-50",
    CLOSED:
      "bg-white/95 text-yellow-600 border border-yellow-200 hover:bg-yellow-50",
    ONGOING:
      "bg-white/95 text-indigo-600 border border-indigo-200 hover:bg-indigo-50",
    FINISHED:
      "bg-white/95 text-purple-600 border border-purple-200 hover:bg-purple-50",
    CANCELLED: "bg-white/95 text-red-600 border border-red-200 hover:bg-red-50",
  };

  return (
    styles[status] ||
    "bg-white/95 text-gray-600 border border-gray-200 hover:bg-gray-50"
  );
}

// Map loại hoạt động sang tiếng Việt
const categoryMapVN: Record<string, string> = {
  MEN_SINGLE: "Đơn Nam",
  WOMEN_SINGLE: "Đơn Nữ",
  MEN_DOUBLE: "Đôi Nam",
  WOMEN_DOUBLE: "Đôi Nữ",
  MIXED_DOUBLE: "Đôi Nam Nữ",
};

// Màu sắc badge cho từng loại - sử dụng gradient xanh lá và xanh dương
function getCategoryGradient(category: string) {
  const gradients: Record<string, string> = {
    MEN_SINGLE: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
    WOMEN_SINGLE: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white",
    MEN_DOUBLE: "bg-gradient-to-r from-blue-600 to-blue-500 text-white",
    WOMEN_DOUBLE: "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white",
    MIXED_DOUBLE: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
  };
  return (
    gradients[category] ||
    "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
  );
}

// Hàm định dạng ngày
function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Hàm định dạng thời gian - chỉ hiển thị giờ:phút
function formatTime(date: string | Date) {
  return new Date(date).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Hàm định dạng tiền tệ
function formatCurrency(amount: number) {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

// Info item component - tối ưu cho layout mới
const InfoItem = ({
  icon: Icon,
  label,
  value,
  className = "",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | React.ReactNode;
  className?: string;
}) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/40 dark:to-emerald-900/40 rounded-md flex items-center justify-center flex-shrink-0">
      <Icon className="w-3.5 h-3.5 text-blue-600 dark:text-emerald-300" />
    </div>
    <div className="flex-1 min-w-0">
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
        {label}:{" "}
      </span>
      <span className="text-sm font-semibold text-gray-900 dark:text-white">
        {value}
      </span>
    </div>
  </div>
);

export default async function MyJoinedClubEvents({
  searchParams,
}: ClubEventsProps) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const params = await searchParams;
  const page = parseInt(params.page || "0", 10);
  const size = 8;

  let events = [];
  let totalPages = 1;
  let currentPage = 0;
  let last = true;

  try {
    const response = await eventClubApiRequest.getMyJoinedEventClubs(
      page,
      size,
      accessToken
    );
    events = response.payload.data.content || [];
    ({ totalPages, page: currentPage, last } = response.payload.data);
  } catch (error) {
    console.error("Error fetching joined events:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-50 dark:from-blue-900 dark:via-emerald-900 dark:to-blue-900">
        <Card className="p-6 max-w-md w-full text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-blue-200 dark:border-emerald-800">
          <div className="w-16 h-16 bg-blue-100/50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-blue-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold text-blue-600 dark:text-emerald-300 mb-3">
            Lỗi tải dữ liệu
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-5 text-sm">
            Đã có lỗi xảy ra khi tải danh sách hoạt động đã tham gia. Vui lòng
            thử lại sau.
          </p>
          <Button
            asChild
            variant="outline"
            className="rounded-xl border-blue-300 dark:border-emerald-700 text-blue-600 dark:text-emerald-300 hover:bg-blue-50 dark:hover:bg-emerald-900/20"
          >
            <Link href="/events">Quay lại trang hoạt động</Link>
          </Button>
        </Card>
      </div>
    );
  }

  // Nếu không có hoạt động nào
  if (events.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-50 dark:from-blue-900 dark:via-emerald-900 dark:to-blue-900">
        <Card className="p-6 max-w-md w-full text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-blue-200 dark:border-emerald-800">
          <div className="w-16 h-16 bg-blue-100/50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-blue-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold text-blue-600 dark:text-emerald-300 mb-3">
            Chưa có hoạt động nào
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-5 text-sm">
            Bạn chưa tham gia hoạt động nào. Hãy khám phá và tham gia các hoạt
            động thú vị.
          </p>
          <Button
            asChild
            variant="outline"
            className="rounded-xl border-blue-300 dark:border-emerald-700 text-blue-600 dark:text-emerald-300 hover:bg-blue-50 dark:hover:bg-emerald-900/20"
          >
            <Link href="/events">Khám phá hoạt động</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-1">
        {/* Header */}
        <div className="mb-8 text-center">
          {/* Tiêu đề gradient */}
          <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Hoạt động đã tham gia
          </h1>

          {/* Mô tả */}
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-6">
            Danh sách các hoạt động bạn đã đăng ký tham gia.
          </p>

          {/* Nút quay lại */}
          <div className="flex justify-end">
            <Link href="/events">
              <Button
                variant="outline"
                className="border-2 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-medium px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Tất cả hoạt động
              </Button>
            </Link>
          </div>
        </div>

        {/* Grid hiển thị hoạt động */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => {
            const isFull = event.joinedMember >= event.totalMember;
            const fillPercentage =
              (event.joinedMember / event.totalMember) * 100;

            return (
              <Card
                key={event.id}
                className="group py-0 gap-2 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg border border-blue-100 dark:border-emerald-900 hover:border-blue-300 dark:hover:border-emerald-700 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Event Image */}
                <div className="relative h-40 w-full -m-0">
                  <Image
                    src={event.image || "/api/placeholder/400/160"}
                    alt={event.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover transition-transform duration-500 rounded-t-xl"
                  />

                  {/* Categories */}
                  <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5 z-10">
                    {event.categories?.map((cat) => (
                      <Badge
                        key={cat}
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full shadow-sm ${getCategoryGradient(
                          cat
                        )}`}
                      >
                        {categoryMapVN[cat] || cat}
                      </Badge>
                    ))}
                  </div>

                  <div className="absolute bottom-3 left-3 z-10">
                    <Badge
                      className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-lg backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${getStatusBadgeStyle(
                        event.status
                      )}`}
                    >
                      {statusMapVN[event.status]}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 right-3 z-10">
                    <Badge
                      className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-lg backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                        event.participantRole == "GUEST"
                          ? "bg-white/95 text-orange-600 border-orange-200 hover:bg-orange-50"
                          : "bg-white/95 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {event.participantRole == "GUEST" ? (
                          <>
                            <Users className="w-3 h-3" />
                            Vãng lai
                          </>
                        ) : (
                          <>
                            <Building2 className="w-3 h-3" />
                            CLB của tôi
                          </>
                        )}
                      </div>
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200/50 dark:bg-gray-700/50 z-10">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Card Content */}
                <CardContent className="p-4 flex flex-col flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 ">
                    {event.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/40 dark:to-emerald-900/40 rounded-md flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-emerald-300" />
                    </div>
                    <p className="text-sm text-blue-600 dark:text-emerald-400 line-clamp-1 font-medium">
                      {event.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/40 dark:to-emerald-900/40 rounded-md flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-emerald-300" />
                    </div>

                    <span className="text-sm text-blue-600 dark:text-emerald-400 line-clamp-1 font-medium">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Trình độ yêu cầu:
                      </span>{" "}
                      {event.minLevel.toFixed(1)} - {event.maxLevel.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    {/* Club Name Section */}
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/40 dark:to-emerald-900/40 rounded-md flex items-center justify-center flex-shrink-0">
                      <CircleStar className="w-3.5 h-3.5 text-blue-600 dark:text-emerald-300" />
                    </div>
                    <p className="text-sm text-blue-600 dark:text-emerald-400 line-clamp-1 font-medium">
                      {event.nameClub}
                    </p>
                  </div>

                  {/* Date and Time Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-lg p-3 mb-3">
                    <InfoItem
                      icon={Calendar}
                      label="Ngày"
                      value={formatDate(event.startTime)}
                      className="mb-2"
                    />
                    <InfoItem
                      icon={Clock}
                      label="Giờ"
                      value={`${formatTime(event.startTime)} - ${formatTime(
                        event.endTime
                      )}`}
                    />
                  </div>

                  {/* Members and Fee */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/40 dark:to-emerald-900/40 rounded-md flex items-center justify-center flex-shrink-0">
                        <Users className="w-3.5 h-3.5 text-blue-600 dark:text-emerald-300" />
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          isFull
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {event.joinedMember}/{event.totalMember} thành viên
                      </span>
                    </div>
                    <div className="flex items-center gap-2 ">
                      {/* Club Name Section */}
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/40 dark:to-emerald-900/40 rounded-md flex items-center justify-center flex-shrink-0">
                        <Users className="w-3.5 h-3.5 text-blue-600 dark:text-emerald-300" />
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white line-clamp-1 font-medium">
                        {event.joinedOpenMembers}/{event.maxOutsideMembers} vãng
                        lai
                      </p>
                    </div>
                  </div>

                  {event.fee != null && event.fee > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/40 dark:to-emerald-900/40 rounded-md flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-3.5 h-3.5 text-blue-600 dark:text-emerald-300" />
                      </div>
                      <span className="text-sm text-blue-600 dark:text-emerald-400 font-semibold">
                        {formatCurrency(event.fee)}
                      </span>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    asChild
                    disabled={isFull}
                    className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 mt-auto ${"bg-gradient-to-r from-emerald-500 to-emerald-600  hover:from-emerald-700 hover:to-emerald-800 dark:from-blue-400 dark:to-blue-500  dark:hover:from-blue-600 dark:hover:to-blue-700 text-white hover:shadow-md transform hover:scale-105 active:scale-95"}`}
                  >
                    <Link href={`/events/${event.slug}`}>Xem chi tiết</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <Link
                key={i}
                href={`/events/my-joined-events?page=${i}`}
                className={`px-4 py-2 rounded-lg ${
                  i === currentPage
                    ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                } transition-colors duration-200`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
