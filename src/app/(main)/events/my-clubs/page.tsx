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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import eventClubApiRequest from "@/apiRequest/club.event";
import { cookies } from "next/headers";

interface ClubEventsProps {
  searchParams: Promise<{ page?: string }>;
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
    MEN_DOUBLE: "bg-gradient-to-r from-blue-600 to-emerald-500 text-white",
    WOMEN_DOUBLE: "bg-gradient-to-r from-emerald-600 to-blue-500 text-white",
    MIXED_DOUBLE: "bg-gradient-to-r from-blue-500 to-emerald-600 text-white",
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

// Skeleton UI
const ClubEventsSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-50 dark:from-blue-900 dark:via-emerald-900 dark:to-blue-900">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-2 animate-pulse" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-none animate-pulse flex flex-col"
          >
            <div className="relative h-40 bg-gray-200 dark:bg-gray-700" />
            <CardContent className="p-4 flex-1">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              </div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export default async function ClubEvents({ searchParams }: ClubEventsProps) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const params = await searchParams;
  const page = parseInt(params.page || "0", 10);
  const size = 8;

  let events = [];
  let totalPages = 1;
  let currentPage = 0;
  let last = true;

  const response = await eventClubApiRequest.getMyClubsEventClubs(
    page,
    size,
    accessToken
  );
  events = response.payload.data.content || [];
  ({ totalPages, page: currentPage, last } = response.payload.data);

  return (
    <div className="min-h-screen p-4 lg:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-1">
        {/* Header */}
        <div className="mb-8 text-center">
          {/* Tiêu đề gradient */}
          <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Hoạt động của các CLB
          </h1>

          {/* Mô tả */}
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-6">
            Khám phá và tham gia các hoạt động thể thao sôi động
          </p>

          {/* Nút My Clubs */}
          <div className="flex justify-end">
            <Link href="/events">
              <Button
                variant="outline"
                className="border-2 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-medium px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Hoạt động vãng lai
              </Button>
            </Link>
          </div>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-blue-100/50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-blue-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-blue-600 dark:text-emerald-300 mb-2">
              Chưa có hoạt động nào
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Hãy quay lại sau để khám phá các hoạt động mới!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => {
              const isFull = event.joinedMember >= event.totalMember;
              const fillPercentage =
                (event.joinedMember / event.totalMember) * 100;

              return (
                <Card
                  key={event.id}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg border border-blue-100 dark:border-emerald-900 hover:border-blue-300 dark:hover:border-emerald-700 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Event Image */}
                  <div className="relative h-40 w-full">
                    <Image
                      src={event.image || "/api/placeholder/400/160"}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover  transition-transform duration-500"
                    />

                    {/* Categories */}
                    <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5">
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

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200/50 dark:bg-gray-700/50">
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
                      {/* Club Name Section */}
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/40 dark:to-emerald-900/40 rounded-md flex items-center justify-center flex-shrink-0">
                        <CircleStar className="w-3.5 h-3.5 text-blue-600 dark:text-emerald-300" />
                      </div>
                      <p className="text-sm text-blue-600 dark:text-emerald-400 line-clamp-1 font-medium">
                        {event.nameClub}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/40 dark:to-emerald-900/40 rounded-md flex items-center justify-center flex-shrink-0">
                          <Users className="w-3.5 h-3.5 text-blue-600 dark:text-emerald-300" />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          Đối tượng:{" "}
                        </span>
                      </div>
                      <Badge
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          event.openForOutside
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        }`}
                      >
                        {event.openForOutside
                          ? "Có vãng lai"
                          : "Chỉ thành viên CLB"}
                      </Badge>
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
                          {event.joinedMember}/{event.totalMember} người
                        </span>
                      </div>

                      {event.fee != null && event.fee > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/40 dark:to-emerald-900/40 rounded-md flex items-center justify-center flex-shrink-0">
                            <DollarSign className="w-3.5 h-3.5 text-blue-600 dark:text-emerald-300" />
                          </div>
                          <span className="text-sm text-blue-600 dark:text-emerald-400 font-semibold">
                            {formatCurrency(event.fee)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button
                      asChild
                      disabled={isFull}
                      className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 mt-auto ${
                        isFull
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                          : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700 hover:shadow-md transform hover:scale-105 active:scale-95"
                      }`}
                    >
                      <Link href={`/events/${event.id}`}>
                        {isFull ? "Đã đầy" : "Xem chi tiết"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {events.length > 0 && (
          <div className="flex justify-center items-center mt-10 gap-2 flex-wrap">
            {currentPage > 0 && (
              <Button
                asChild
                variant="outline"
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-blue-600 dark:text-emerald-300 hover:bg-blue-50 dark:hover:bg-emerald-900/20 border-blue-200 dark:border-emerald-800 shadow-sm hover:shadow-md"
              >
                <Link href={`?page=${currentPage - 1}`}>← Trước</Link>
              </Button>
            )}
            {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
              const pageIndex = Math.max(
                0,
                Math.min(currentPage - 2 + idx, totalPages - 1)
              );
              return (
                <Button
                  key={pageIndex}
                  asChild
                  variant={pageIndex === currentPage ? "default" : "outline"}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                    pageIndex === currentPage
                      ? "bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-md"
                      : "bg-white dark:bg-gray-800 text-blue-600 dark:text-emerald-300 hover:bg-blue-50 dark:hover:bg-emerald-900/20 border-blue-200 dark:border-emerald-800 shadow-sm hover:shadow-md"
                  }`}
                >
                  <Link href={`?page=${pageIndex}`}>{pageIndex + 1}</Link>
                </Button>
              );
            })}
            {!last && (
              <Button
                asChild
                variant="outline"
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-blue-600 dark:text-emerald-300 hover:bg-blue-50 dark:hover:bg-emerald-900/20 border-blue-200 dark:border-emerald-800 shadow-sm hover:shadow-md"
              >
                <Link href={`?page=${currentPage + 1}`}>Sau →</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
