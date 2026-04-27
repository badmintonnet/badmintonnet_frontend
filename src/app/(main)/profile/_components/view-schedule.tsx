"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock,
  Calendar,
  Loader2,
  ArrowRight,
} from "lucide-react";
import accountApiRequest from "@/apiRequest/account";
import { AccountScheduleType } from "@/schemaValidations/account.schema";
import Link from "next/link";

export default function ScheduleDialog() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AccountScheduleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const size = 20;

  const fetchSchedule = async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await accountApiRequest.getSchedule(pageNum, size);
      const data = res.payload?.data?.content ?? [];
      const totalPages = res.payload?.data?.totalPages ?? 1;

      const formatted = data.map((it: AccountScheduleType) => ({
        ...it,
        startTime: new Date(it.startTime),
        endTime: new Date(it.endTime),
        createdAt: new Date(it.createdAt),
      }));

      setItems((prev) => (pageNum === 0 ? formatted : [...prev, ...formatted]));
      setHasMore(pageNum + 1 < totalPages);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setPage(0);
      fetchSchedule(0);
    }
  }, [open]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchSchedule(nextPage);
  };

  const getStatusStyle = (status: AccountScheduleType["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
      case "REJECTED":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
      case "ONGOING":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
      case "COMPLETED":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/20";
      case "CANCELLED":
        return "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20";
      case "ABSENT":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-500/10 dark:text-gray-300 dark:border-gray-500/20";
    }
  };

  const getStatusText = (status: AccountScheduleType["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return "Xác nhận tham gia";
      case "REJECTED":
        return "Từ chối";
      case "PENDING":
        return "Chờ duyệt";
      case "ONGOING":
        return "Đang diễn ra";
      case "COMPLETED":
        return "Đã tham gia";
      case "CANCELLED":
        return "Đã hủy tham gia";
      case "ABSENT":
        return "Vắng mặt";
      default:
        return "Tham gia";
    }
  };

  const groupedItems = items.reduce(
    (acc, item) => {
      const dateKey = item.startTime.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(item);
      return acc;
    },
    {} as Record<string, AccountScheduleType[]>,
  );

  const sortedDates = Object.keys(groupedItems);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium
            bg-gradient-to-r from-white to-gray-50 text-gray-900 border-gray-200 
            hover:from-gray-50 hover:to-gray-100 hover:border-gray-300 
            hover:shadow-md transition-all duration-200
            dark:from-gray-800 dark:to-gray-800/80 dark:text-white 
            dark:border-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-700/80
            dark:hover:border-gray-600 dark:hover:shadow-lg dark:hover:shadow-gray-900/20
            flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Lịch trình của tôi
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-4xl max-h-[85vh] p-0 gap-0 rounded-2xl overflow-hidden
        bg-white border-gray-200 shadow-2xl 
        dark:bg-gray-900 dark:border-gray-800"
      >
        <DialogHeader className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800/50 dark:to-gray-900/50">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            Lịch trình hoạt động
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 overflow-y-auto max-h-[calc(85vh-120px)]">
          {loading && items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-10 h-10 text-blue-500 dark:text-blue-400 animate-spin mb-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Đang tải lịch trình...
              </p>
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <CalendarDays className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-base font-medium text-gray-900 dark:text-white mb-1">
                Chưa có sự kiện nào
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Bạn chưa có lịch trình sự kiện nào
              </p>
            </div>
          )}

          {items.length > 0 && (
            <>
              <div className="space-y-6">
                {sortedDates.map((dateKey) => {
                  const events = groupedItems[dateKey];
                  const date = new Date(dateKey.split("/").reverse().join("-"));
                  const isToday =
                    date.toLocaleDateString("vi-VN") ===
                    new Date().toLocaleDateString("vi-VN");

                  return (
                    <div key={dateKey} className="space-y-3">
                      <div className="flex items-center gap-3 pb-2">
                        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800/30">
                          <CalendarDays className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <div>
                            <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                              {date.toLocaleDateString("vi-VN", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                            {isToday && (
                              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                Hôm nay
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent dark:from-blue-800/30" />
                      </div>

                      <div className="space-y-3 pl-4 border-l-2 border-blue-200 dark:border-blue-800/30 ml-2">
                        {events.map((item) => (
                          <Link
                            key={item.id}
                            href={`/events/${item.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group"
                          >
                            <div className="relative -ml-6">
                              <div className="absolute left-0 top-6 w-4 h-4 rounded-full bg-white dark:bg-gray-900 border-4 border-blue-500 dark:border-blue-600 group-hover:border-blue-600 dark:group-hover:border-blue-400 transition-colors" />

                              <div className="ml-6 p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/30 dark:border-gray-800 dark:bg-gray-800/40 dark:hover:border-blue-500/30 dark:hover:shadow-lg dark:hover:shadow-blue-500/10 transition-all duration-300">
                                <div className="flex flex-col sm:flex-row gap-4">
                                  <div className="flex-shrink-0 w-32">
                                    <div className="flex flex-col gap-1">
                                      <div className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                                        <Clock className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                                        {item.startTime.toLocaleTimeString(
                                          "vi-VN",
                                          {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          },
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 ml-7">
                                        <ArrowRight className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                          {item.endTime.toLocaleTimeString(
                                            "vi-VN",
                                            {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            },
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex-1 min-w-0 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                                    <h3 className="font-semibold text-base text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                      {item.name}
                                    </h3>
                                  </div>

                                  <div className="flex-shrink-0">
                                    <Badge
                                      className={`${getStatusStyle(
                                        item.status,
                                      )} 
                                      font-semibold text-xs px-3 py-1.5 border whitespace-nowrap`}
                                    >
                                      {
                                        (console.log(item.status),
                                        getStatusText(item.status))
                                      }
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <Button
                    onClick={handleLoadMore}
                    disabled={loading}
                    variant="outline"
                    className="px-6 py-2.5 rounded-xl font-medium
                      bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300
                      dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang tải...
                      </>
                    ) : (
                      "Xem thêm sự kiện"
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
