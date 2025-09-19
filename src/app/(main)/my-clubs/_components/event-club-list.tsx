import { EventClubCard } from "./event-club-card";
import { Calendar, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { EventType } from "@/schemaValidations/event.schema";

interface EventClubListProps {
  events: EventType[];
  totalPages: number;
  currentPage: number;
  totalElements: number;
  clubId?: string;
  accessToken: string;
  owner?: boolean;
}

export const EventClubList = ({
  events,
  totalPages,
  currentPage,
  totalElements,
  clubId,
  owner,
}: EventClubListProps) => {
  if (owner) console.log("Owner view enabled");
  return (
    <div className="space-y-6">
      {/* Header với thống kê */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Hoạt động thể thao
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {totalElements} hoạt động được tìm thấy
          </p>
        </div>

        {/* Nút tạo hoạt động mới */}
        {owner && (
          <Link href={`/my-clubs/create-event?club=${clubId}`}>
            <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Tạo hoạt động mới
            </Button>
          </Link>
        )}
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Tìm kiếm */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm hoạt động..."
                className="pl-10 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
          </div>

          {/* Bộ lọc trạng thái */}
          <div className="w-full sm:w-48">
            <Select defaultValue="all">
              <SelectTrigger className="border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="DRAFT">Chưa mở đăng ký</SelectItem>
                <SelectItem value="UPCOMING">Sắp diễn ra</SelectItem>
                <SelectItem value="ONGOING">Đang diễn ra</SelectItem>
                <SelectItem value="COMPLETED">Đã kết thúc</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bộ lọc loại hình */}
          <div className="w-full sm:w-48">
            <Select defaultValue="all">
              <SelectTrigger className="border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                <SelectValue placeholder="Loại hình" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="MEN_SINGLE">Đơn nam</SelectItem>
                <SelectItem value="WOMEN_SINGLE">Đơn nữ</SelectItem>
                <SelectItem value="MEN_DOUBLE">Đôi nam</SelectItem>
                <SelectItem value="WOMEN_DOUBLE">Đôi nữ</SelectItem>
                <SelectItem value="MIXED_DOUBLE">Đôi nam nữ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nút lọc */}
          <Button
            variant="outline"
            className="border-gray-300 dark:border-gray-600"
          >
            <Filter className="w-4 h-4 mr-2" />
            Lọc
          </Button>
        </div>
      </div>

      {/* Danh sách hoạt động */}
      <div className="space-y-4">
        {events.map((event) => (
          <EventClubCard key={event.id} event={event} />
        ))}
      </div>

      {/* Empty state */}
      {events.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Chưa có hoạt động nào
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {clubId
              ? "Hãy tạo hoạt động đầu tiên cho câu lạc bộ của bạn"
              : "Chưa có hoạt động nào được tổ chức"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {events.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <Link
            href={`/my-clubs/${clubId}?page=${currentPage - 1}`}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              currentPage === 0
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed pointer-events-none"
                : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            }`}
          >
            Trang trước
          </Link>

          <span className="text-gray-600 dark:text-gray-300">
            Trang {currentPage + 1} / {totalPages}
          </span>

          <Link
            href={`/my-clubs/${clubId}?page=${currentPage + 1}`}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              currentPage >= totalPages - 1
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed pointer-events-none"
                : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            }`}
          >
            Trang sau
          </Link>
        </div>
      )}
    </div>
  );
};
