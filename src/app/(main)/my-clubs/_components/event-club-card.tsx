import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Users, Clock, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EventType } from "@/schemaValidations/event.schema";

interface EventClubCardProps {
  event: EventType;
}

export const EventClubCard = ({ event }: EventClubCardProps) => {
  const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString("vi-VN", {
      weekday: "short", // Rút gọn ngày trong tuần trên mobile
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatTime = (date: string | Date) =>
    new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      MEN_SINGLE: "Đơn nam",
      WOMEN_SINGLE: "Đơn nữ",
      MEN_DOUBLE: "Đôi nam",
      WOMEN_DOUBLE: "Đôi nữ",
      MIXED_DOUBLE: "Đôi nam nữ",
    };
    return labels[category] || category;
  };

  const getStatusBadge = (status: EventType["status"]) => {
    const config: Record<
      EventType["status"],
      { label: string; color: string }
    > = {
      OPEN: {
        label: "Mở đăng ký",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      },
      CLOSED: {
        label: "Đã đóng",
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      },
      ONGOING: {
        label: "Đang diễn ra",
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      },
      FINISHED: {
        label: "Đã kết thúc",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      },
      CANCELLED: {
        label: "Đã hủy",
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      },
    };

    return (
      <Badge className={`${config[status].color} text-xs border-0 px-2 py-1`}>
        {config[status].label}
      </Badge>
    );
  };

  return (
    <div className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
        {/* Ảnh */}
        <div className="flex-shrink-0 mb-4 sm:mb-0">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
            {event.image && (
              <Image
                src={event.image}
                alt={event.title}
                fill
                priority
                sizes="(max-width: 640px) 80px, 96px" // Tối ưu hóa kích thước ảnh
                className="object-cover"
              />
            )}
          </div>
        </div>

        {/* Nội dung */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
              {event.title}
            </h3>
            <div className="hidden sm:block">
              {getStatusBadge(event.status)}
            </div>
          </div>

          {/* Status badge trên mobile */}
          <div className="sm:hidden mb-2">{getStatusBadge(event.status)}</div>

          {/* Thông tin chi tiết */}
          <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>{formatDate(event.startTime)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <span>
                {formatTime(event.startTime)} - {formatTime(event.endTime)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span>
                {event.joinedMember}/{event.totalMember} người tham gia
              </span>
            </div>

            {event.fee && event.fee > 0 && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>{event.fee.toLocaleString("vi-VN")} VNĐ</span>
              </div>
            )}
          </div>

          {/* Loại hình */}
          {event.categories && event.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.categories.map((c, i) => (
                <Badge
                  key={i}
                  className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-xs px-2 py-1"
                >
                  {getCategoryLabel(c)}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Nút chi tiết */}
        <div className="mt-4 sm:mt-0 sm:flex-shrink-0">
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white text-sm font-medium rounded-lg transition-all active:scale-95"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};
