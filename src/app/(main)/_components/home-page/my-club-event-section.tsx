import eventClubApiRequest from "@/apiRequest/club.event";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Clock,
  CircleStar,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type HomePageProps = {
  accessToken: string;
};

// Helper functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Map loại hoạt động sang tiếng Việt
const categoryMapVN: Record<string, string> = {
  MEN_SINGLE: "Đơn Nam",
  WOMEN_SINGLE: "Đơn Nữ",
  MEN_DOUBLE: "Đôi Nam",
  WOMEN_DOUBLE: "Đôi Nữ",
  MIXED_DOUBLE: "Đôi Nam Nữ",
};

// Màu sắc badge cho từng loại - sử dụng gradient xanh lá và xanh dương
const getCategoryGradient = (category: string) => {
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
};

const InfoItem = ({
  icon: Icon,
  label,
  value,
  className = "",
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  label: string;
  value: string;
  className?: string;
}) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
    <div className="flex flex-col min-w-0">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
        {value}
      </span>
    </div>
  </div>
);

export default async function MyClubEventSection({
  accessToken,
}: HomePageProps) {
  let clubEventResponse;
  let clubevents;

  try {
    clubEventResponse = await eventClubApiRequest.getAllJoinedClubEvents(
      accessToken
    );
    clubevents = clubEventResponse.payload.data.content;
  } catch (error) {
    console.log("Error fetching clubs:", error);
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 rounded-2xl p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-200 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-2">
            Oops! Đã có lỗi xảy ra
          </h3>
          <p className="text-red-700 dark:text-red-300">
            Không thể tải danh sách sự kiện của bạn. Vui lòng thử lại sau.
          </p>
        </div>
      </div>
    );
  }

  if (!clubevents || clubevents.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-900/20 rounded-2xl p-8">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-emerald-400 dark:text-emerald-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Chưa có sự kiện nào
          </h3>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Hoạt động đã đăng ký
            </h2>
          </div>

          <Link
            href="events/my-joined-events"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg group"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Events Grid - 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {clubevents.map((event) => {
            const isFull = event.joinedMember >= event.totalMember;
            const fillPercentage =
              (event.joinedMember / event.totalMember) * 100;

            return (
              <Card
                key={event.id}
                className="group py-0 gap-2 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl border border-emerald-100 dark:border-emerald-900 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1"
              >
                {/* Event Image */}
                <div className="relative h-40 w-full -m-0">
                  <Image
                    src={event.image || "/api/placeholder/400/160"}
                    alt={event.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover transition-transform duration-500 rounded-t-xl group-hover:scale-105"
                  />

                  {/* Categories */}
                  <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5 z-10">
                    {event.categories?.map((cat: string) => (
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
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200/50 dark:bg-gray-700/50 z-10">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Card Content */}
                <CardContent className="p-4 flex flex-col flex-1">
                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {event.title}
                  </h3>

                  {/* Date and Time */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-3 mb-3">
                    <InfoItem
                      icon={Calendar}
                      label="Ngày"
                      value={formatDate(event.startTime.toString())}
                      className="mb-2"
                    />
                    <InfoItem
                      icon={Clock}
                      label="Giờ"
                      value={`${formatTime(
                        event.startTime.toString()
                      )} - ${formatTime(event.endTime.toString())}`}
                    />
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-md flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" />
                    </div>

                    {event.facility ? (
                      <div className="flex flex-col min-w-0">
                        <a
                          href={`https://www.google.com/maps?q=${event.facility.latitude},${event.facility.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-emerald-600 dark:text-emerald-400 font-medium line-clamp-1 hover:underline"
                        >
                          {event.facility.name}
                        </a>
                      </div>
                    ) : (
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 line-clamp-1 font-medium">
                        {event.location}
                      </p>
                    )}
                  </div>

                  {/* Club Name */}
                  {event.nameClub && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-md flex items-center justify-center flex-shrink-0">
                        <CircleStar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" />
                      </div>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 line-clamp-1 font-medium">
                        {event.nameClub}
                      </p>
                    </div>
                  )}

                  {/* CTA Button */}
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
      </div>
    </section>
  );
}
