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
import FilterForm from "./_components/filter-form";
import {
  BadmintonCategory,
  EventStatus,
} from "@/schemaValidations/event.schema";

interface ClubEventsProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    province?: string;
    ward?: string;
    quickTimeFilter?: string;
    isFree?: string;
    minFee?: string;
    maxFee?: string;
    startDate?: string;
    endDate?: string;
    levels?: string;
    categories?: string;
    participantSize?: string;
    minRating?: string;
    facilityNames?: string;
    status?: string;
  }>;
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

export default async function ClubEvents({ searchParams }: ClubEventsProps) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const params = await searchParams;
  const page = parseInt(params.page || "0", 10);
  const size = 8;
  const searchQuery = params.search || "";
  const province = params.province || "";
  const ward = params.ward || "";
  const quickTimeFilter = params.quickTimeFilter || "";
  const isFree =
    params.isFree !== undefined ? params.isFree === "true" : undefined;
  const minFee =
    params.minFee !== undefined ? Number(params.minFee) : undefined;
  const maxFee =
    params.maxFee !== undefined ? Number(params.maxFee) : undefined;
  const startDate = params.startDate || "";
  const endDate = params.endDate || "";
  const levels = (params.levels || "").split(",").filter(Boolean);
  const categories = (params.categories || "").split(",").filter(Boolean);
  const participantSize = params.participantSize || "";
  const minRatingParam = params.minRating || "";
  const minRating = minRatingParam ? Number(minRatingParam) : undefined;
  const facilityNames = (params.facilityNames || "").split(",").filter(Boolean);
  const status = (params.status || "").split(",").filter(Boolean);

  let events = [];
  let totalPages = 1;
  let currentPage = 0;
  let last = true;

  try {
    const response = await eventClubApiRequest.getAllPublicEventClubs(
      page,
      size,
      accessToken,
      searchQuery,
      province,
      ward,
      quickTimeFilter,
      isFree,
      minFee,
      maxFee,
      startDate,
      endDate,
      {
        levels: levels.length ? levels : undefined,
        categories: categories.length
          ? (categories.filter(
              (cat): cat is BadmintonCategory => !!cat
            ) as BadmintonCategory[])
          : undefined,
        participantSize: participantSize || undefined,
        minRating,
        facilityNames: facilityNames.length ? facilityNames : undefined,
        status: status.length ? (status as EventStatus[]) : undefined,
      }
    );
    events = response.payload.data.content || [];
    ({ totalPages, page: currentPage, last } = response.payload.data);
  } catch (error) {
    console.error("Error fetching events:", error);
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
            Đã có lỗi xảy ra khi tải danh sách hoạt động. Vui lòng thử lại sau.
          </p>
          <Button
            asChild
            variant="outline"
            className="rounded-xl border-blue-300 dark:border-emerald-700 text-blue-600 dark:text-emerald-300 hover:bg-blue-50 dark:hover:bg-emerald-900/20"
          >
            <Link href="/">Quay lại trang chủ</Link>
          </Button>
        </Card>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Hoạt động của các CLB
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Khám phá và tham gia các hoạt động công khai mọi người đều có thể
            tham gia.
          </p>
        </div>

        {/* Horizontal Filter - For All Devices */}
        <div className="mb-6">
          <FilterForm
            searchQuery={searchQuery}
            province={province}
            ward={ward}
            quickTimeFilter={quickTimeFilter}
            isFree={isFree}
            minFee={minFee ?? 0}
            maxFee={maxFee ?? 500}
            startDate={startDate}
            endDate={endDate}
          />
        </div>

        {accessToken && (
          <div className="flex flex-wrap gap-4 justify-end mb-6">
            <Link href="/events/my-joined-events">
              <Button
                variant="outline"
                className="border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-medium px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Hoạt động đã tham gia
              </Button>
            </Link>
            <Link href="/events/my-clubs">
              <Button
                variant="outline"
                className="border-2 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-medium px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Hoạt động CLB đã tham gia
              </Button>
            </Link>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-6">
          {/* Events Content */}
          <main>
            {/* Events Grid */}
            <div className="grid  gap-6">
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
                <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-6">
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

                            {event.facility ? (
                              <div className="flex flex-col">
                                {/* Hiển thị tên sân và địa chỉ */}
                                <p className="text-sm text-blue-600 dark:text-emerald-400 font-medium line-clamp-1">
                                  <a
                                    href={`https://www.google.com/maps?q=${event.facility.latitude},${event.facility.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {event.facility.name}
                                  </a>
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm text-blue-600 dark:text-emerald-400 line-clamp-1 font-medium">
                                {event.location}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/40 dark:to-emerald-900/40 rounded-md flex items-center justify-center flex-shrink-0">
                              <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-emerald-300" />
                            </div>

                            <span className="text-sm text-blue-600 dark:text-emerald-400 line-clamp-1 font-medium">
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                Trình độ yêu cầu:
                              </span>{" "}
                              {event.minLevel.toFixed(1)} -{" "}
                              {event.maxLevel.toFixed(1)}
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
                              value={`${formatTime(
                                event.startTime
                              )} - ${formatTime(event.endTime)}`}
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
                                {event.joinedMember}/{event.totalMember} thành
                                viên
                              </span>
                            </div>
                            <div className="flex items-center gap-2 ">
                              {/* Club Name Section */}
                              <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/40 dark:to-emerald-900/40 rounded-md flex items-center justify-center flex-shrink-0">
                                <Users className="w-3.5 h-3.5 text-blue-600 dark:text-emerald-300" />
                              </div>
                              <p className="text-sm text-gray-900 dark:text-white line-clamp-1 font-medium">
                                {event.joinedOpenMembers}/
                                {event.maxOutsideMembers} vãng lai
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
                            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 mt-auto ${
                              isFull
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                                : "bg-gradient-to-r from-emerald-500 to-emerald-600  hover:from-emerald-700 hover:to-emerald-800 dark:from-blue-400 dark:to-blue-500  dark:hover:from-blue-600 dark:hover:to-blue-700 text-white hover:shadow-md transform hover:scale-105 active:scale-95"
                            }`}
                          >
                            <Link href={`/events/${event.slug}`}>
                              {isFull ? "Đã đầy" : "Xem chi tiết"}
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination */}
            {events.length > 0 && (
              <div className="flex justify-center items-center mt-10 gap-2 flex-wrap">
                {currentPage > 0 && (
                  <Button
                    asChild
                    variant="outline"
                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-blue-600 dark:text-emerald-300 hover:bg-blue-50 dark:hover:bg-emerald-900/20 border-blue-200 dark:border-emerald-800 shadow-sm hover:shadow-md"
                  >
                    <Link
                      href={`?page=${currentPage - 1}${
                        searchQuery
                          ? `&search=${encodeURIComponent(searchQuery)}`
                          : ""
                      }${province ? `&province=${province}` : ""}${
                        ward ? `&ward=${ward}` : ""
                      }${
                        quickTimeFilter
                          ? `&quickTimeFilter=${encodeURIComponent(
                              quickTimeFilter
                            )}`
                          : ""
                      }${isFree !== undefined ? `&isFree=${isFree}` : ""}${
                        minFee !== undefined ? `&minFee=${minFee}` : ""
                      }${maxFee !== undefined ? `&maxFee=${maxFee}` : ""}${
                        startDate
                          ? `&startDate=${encodeURIComponent(startDate)}`
                          : ""
                      }${
                        endDate ? `&endDate=${encodeURIComponent(endDate)}` : ""
                      }${
                        levels.length
                          ? `&levels=${encodeURIComponent(levels.join(","))}`
                          : ""
                      }${
                        categories.length
                          ? `&categories=${encodeURIComponent(
                              categories.join(",")
                            )}`
                          : ""
                      }${
                        participantSize
                          ? `&participantSize=${encodeURIComponent(
                              participantSize
                            )}`
                          : ""
                      }${
                        minRating !== undefined ? `&minRating=${minRating}` : ""
                      }${
                        facilityNames.length
                          ? `&clubNames=${encodeURIComponent(
                              facilityNames.join(",")
                            )}`
                          : ""
                      }${
                        status.length
                          ? `&status=${encodeURIComponent(status.join(","))}`
                          : ""
                      }`}
                    >
                      ← Trước
                    </Link>
                  </Button>
                )}
                {Array.from({ length: totalPages }, (_, pageIndex) => (
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
                    <Link
                      href={`?page=${pageIndex}${
                        searchQuery
                          ? `&search=${encodeURIComponent(searchQuery)}`
                          : ""
                      }${province ? `&province=${province}` : ""}${
                        ward ? `&ward=${ward}` : ""
                      }${
                        quickTimeFilter
                          ? `&quickTimeFilter=${encodeURIComponent(
                              quickTimeFilter
                            )}`
                          : ""
                      }${isFree !== undefined ? `&isFree=${isFree}` : ""}${
                        minFee !== undefined ? `&minFee=${minFee}` : ""
                      }${maxFee !== undefined ? `&maxFee=${maxFee}` : ""}${
                        startDate
                          ? `&startDate=${encodeURIComponent(startDate)}`
                          : ""
                      }${
                        endDate ? `&endDate=${encodeURIComponent(endDate)}` : ""
                      }${
                        levels.length
                          ? `&levels=${encodeURIComponent(levels.join(","))}`
                          : ""
                      }${
                        categories.length
                          ? `&categories=${encodeURIComponent(
                              categories.join(",")
                            )}`
                          : ""
                      }${
                        participantSize
                          ? `&participantSize=${encodeURIComponent(
                              participantSize
                            )}`
                          : ""
                      }${
                        minRating !== undefined ? `&minRating=${minRating}` : ""
                      }${
                        facilityNames.length
                          ? `&clubNames=${encodeURIComponent(
                              facilityNames.join(",")
                            )}`
                          : ""
                      }${
                        status.length
                          ? `&status=${encodeURIComponent(status.join(","))}`
                          : ""
                      }`}
                    >
                      {pageIndex + 1}
                    </Link>
                  </Button>
                ))}
                {!last && (
                  <Button
                    asChild
                    variant="outline"
                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-blue-600 dark:text-emerald-300 hover:bg-blue-50 dark:hover:bg-emerald-900/20 border-blue-200 dark:border-emerald-800 shadow-sm hover:shadow-md"
                  >
                    <Link
                      href={`?page=${currentPage + 1}${
                        searchQuery
                          ? `&search=${encodeURIComponent(searchQuery)}`
                          : ""
                      }${province ? `&province=${province}` : ""}${
                        ward ? `&ward=${ward}` : ""
                      }${
                        quickTimeFilter
                          ? `&quickTimeFilter=${encodeURIComponent(
                              quickTimeFilter
                            )}`
                          : ""
                      }${isFree !== undefined ? `&isFree=${isFree}` : ""}${
                        minFee !== undefined ? `&minFee=${minFee}` : ""
                      }${maxFee !== undefined ? `&maxFee=${maxFee}` : ""}${
                        startDate
                          ? `&startDate=${encodeURIComponent(startDate)}`
                          : ""
                      }${
                        endDate ? `&endDate=${encodeURIComponent(endDate)}` : ""
                      }${
                        levels.length
                          ? `&levels=${encodeURIComponent(levels.join(","))}`
                          : ""
                      }${
                        categories.length
                          ? `&categories=${encodeURIComponent(
                              categories.join(",")
                            )}`
                          : ""
                      }${
                        participantSize
                          ? `&participantSize=${encodeURIComponent(
                              participantSize
                            )}`
                          : ""
                      }${
                        minRating !== undefined ? `&minRating=${minRating}` : ""
                      }${
                        facilityNames.length
                          ? `&clubNames=${encodeURIComponent(
                              facilityNames.join(",")
                            )}`
                          : ""
                      }${
                        status.length
                          ? `&status=${encodeURIComponent(status.join(","))}`
                          : ""
                      }`}
                    >
                      Sau →
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
