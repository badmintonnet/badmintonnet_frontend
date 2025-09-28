import ratingApiRequest from "@/apiRequest/rating";
import LoadMoreRatings from "@/app/(main)/my-clubs/_components/load-more-rating";
import RatingInfoTooltip from "@/components/rating_info_tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RatingType } from "@/schemaValidations/rating.schema";
import { Flag, MessageCircle, Plus, Star, ThumbsUp } from "lucide-react";
import Image from "next/image";

export default async function RatingView({ id }: { id: string }) {
  const response = await ratingApiRequest.getRatingByClubId(id);
  const summary = response.payload.data;

  const {
    totalReviews,
    averageRating,
    oneStar,
    twoStars,
    threeStars,
    fourStars,
    fiveStars,
    clubEventRatingResponses,
  } = summary;
  if (totalReviews === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        Chưa có đánh giá nào cho CLB này.
      </div>
    );
  }
  const ratingCounts = [
    { stars: 5, count: fiveStars },
    { stars: 4, count: fourStars },
    { stars: 3, count: threeStars },
    { stars: 2, count: twoStars },
    { stars: 1, count: oneStar },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Reviews Section */}
      <div className="lg:col-span-2 space-y-6">
        {/* Reviews Overview */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Đánh giá từ các hoạt động của CLB
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-500 font-semibold text-lg">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                    /5 ({totalReviews} đánh giá)
                    <div className="mt-2">
                      <RatingInfoTooltip />
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Individual Reviews */}
        <div className="space-y-4">
          {clubEventRatingResponses.map((r: RatingType) => (
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
                  <div className="flex items-center justify-between mb-1 font-thin">
                    <span> Hoạt động: {r.eventName}</span>
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
                    {r.replyComment && (
                      <div className="text-sm text-gray-800 dark:text-gray-200">
                        <span className="font-semibold text-yellow-600">
                          Chủ CLB:
                        </span>{" "}
                        {r.replyComment}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {clubEventRatingResponses.length < totalReviews && (
          <LoadMoreRatings clubId={id} />
        )}
      </div>

      {/* Sidebar - Rating Summary */}
      <div className="lg:col-span-1 space-y-4">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white">
              Phân bố đánh giá
            </h4>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {averageRating.toFixed(1)}
                <RatingInfoTooltip />
              </div>
              <div className="flex justify-center items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {totalReviews} đánh giá
              </div>
            </div>

            {/* Rating bars */}
            {ratingCounts.map((r) => {
              const percentage =
                totalReviews > 0 ? (r.count / totalReviews) * 100 : 0;
              return (
                <div key={r.stars} className="flex items-center gap-2 text-sm">
                  <span className="w-8">{r.stars}★</span>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                    <div
                      className="h-2 bg-yellow-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-gray-500 dark:text-gray-400 text-right">
                    {r.count}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
