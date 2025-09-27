import { cookies } from "next/headers";
import ratingApiRequest from "@/apiRequest/rating";
import { Star } from "lucide-react";
import { RatingType } from "@/schemaValidations/rating.schema";
import Image from "next/image";
import AddRatingButton from "@/app/(main)/events/_components/add-rating-button";
import ReplyForm from "@/app/(main)/events/_components/reply-form"; // import file mới
import RatingInfoTooltip from "@/components/rating_info_tooltip";

interface ViewRatingProps {
  eventId: string;
  isJoined: boolean;
  isOwner: boolean;
}

export default async function ViewRating({
  eventId,
  isJoined,
  isOwner,
}: ViewRatingProps) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  const response = await ratingApiRequest.getRatingByClub(
    eventId,
    accessToken?.value || ""
  );
  const ratings = response.payload.data || [];
  const avgRating =
    ratings.length > 0
      ? (() => {
          const internal = ratings.filter((r) => r.clubMember);
          const external = ratings.filter((r) => !r.clubMember);

          const internalAvg =
            internal.length > 0
              ? internal.reduce((sum, r) => sum + r.rating, 0) / internal.length
              : 0;

          const externalAvg =
            external.length > 0
              ? external.reduce((sum, r) => sum + r.rating, 0) / external.length
              : 0;

          const weighted = 0.3 * internalAvg + 0.7 * externalAvg;
          return weighted.toFixed(1);
        })()
      : "0.0";
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <div className="w-2 h-8 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full mr-4"></div>
          Đánh giá sự kiện
        </h2>

        {/* Nút thêm đánh giá */}
        {isJoined && <AddRatingButton eventId={eventId} />}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-yellow-500 font-semibold text-lg">
          {avgRating}
        </span>
        <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
          /5 ({ratings.length} đánh giá)
          <div className="mt-2">
            <RatingInfoTooltip />
          </div>
        </span>
      </div>
      {ratings.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Star className="w-10 h-10 mx-auto mb-3 text-gray-400" />
          <p>Chưa có đánh giá nào cho sự kiện này.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {ratings.map((r: RatingType) => (
            <div
              key={r.id}
              className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
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
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {r.nameSender}
                      </h4>
                      {r.clubMember && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300">
                          Thành viên CLB
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  {/* Stars */}
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

                  {/* Comment */}
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {r.comment}
                  </p>

                  {/* Reply section */}
                  <div className="mt-3 pl-4 border-l-2 border-yellow-400">
                    {r.replyComment ? (
                      <div className="text-sm text-gray-800 dark:text-gray-200">
                        <span className="font-semibold text-yellow-600">
                          Chủ CLB:
                        </span>{" "}
                        {r.replyComment}
                      </div>
                    ) : (
                      isOwner && <ReplyForm ratingId={r.id} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
