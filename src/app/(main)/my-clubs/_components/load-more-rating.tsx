"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import ratingApiRequest from "@/apiRequest/rating";
import { RatingType } from "@/schemaValidations/rating.schema";
import Image from "next/image";
import { Star } from "lucide-react";

interface LoadMoreRatingsProps {
  clubId: string;
}

export default function LoadMoreRatings({ clubId }: LoadMoreRatingsProps) {
  const [ratings, setRatings] = useState<RatingType[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState(false);

  const [started, setStarted] = useState(false); // 👈 check đã bấm nút lần đầu chưa

  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (last || loading) return;
    setLoading(true);
    try {
      const res = await ratingApiRequest.getMoreRatings(clubId, page + 1, 5);
      const data = res.payload.data;

      setRatings((prev) => [...prev, ...data.content]);
      setPage(data.page);
      setLast(data.last);
      setStarted(true); // sau lần load đầu tiên thì bật scroll
    } finally {
      setLoading(false);
    }
  }, [clubId, page, last, loading]);

  // Auto load khi scroll chạm sentinel (chỉ chạy sau khi đã load lần đầu)
  useEffect(() => {
    if (!observerRef.current || !started) return;
    const target = observerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !last) {
          loadMore();
        }
      },
      { threshold: 1.0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [started, loading, last, loadMore]);

  return (
    <div className="space-y-4">
      {/* Hiển thị danh sách đánh giá */}
      {ratings.map((r) => (
        <div
          key={r.id}
          className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40"
        >
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <Image
                  src={r.avatarUrl ? r.avatarUrl : "/user.png"}
                  alt="Avatar"
                  priority
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {r.nameSender}
                </h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex items-center justify-between mb-1 font-thin">
                <span> Hoạt động: {r.eventName}</span>
              </div>

              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < r.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {r.comment}
              </p>

              {r.replyComment && (
                <div className="mt-3 pl-4 border-l-2 border-yellow-400">
                  <div className="text-sm text-gray-800 dark:text-gray-200">
                    <span className="font-semibold text-yellow-600">
                      Chủ CLB:
                    </span>{" "}
                    {r.replyComment}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Nút đầu tiên hoặc nút load thêm */}
      {!last && (
        <div className="text-center">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? "Đang tải..." : "Xen thêm đánh giá"}
          </Button>

          {/* sentinel chỉ hoạt động sau lần đầu */}
          {started && <div ref={observerRef} className="h-4"></div>}
        </div>
      )}
    </div>
  );
}
