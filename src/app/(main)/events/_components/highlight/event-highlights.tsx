import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import highlightApiRequest from "@/apiRequest/highlight";
import { cookies } from "next/headers";
import MediaGallery from "@/app/(main)/events/_components/highlight/media-gallery";
import HighlightActions, { HighlightMenu } from "@/app/(main)/events/_components/highlight/highlight-action";

interface EventHighlightsProps {
  eventId: string;
  isFinished: boolean;
}

export default async function EventHighlights({
  eventId,
  isFinished,
}: EventHighlightsProps) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  const res = await highlightApiRequest.getHighlightsByEventId(
    eventId,
    accessToken?.value || ""
  );

  const highlights = res.payload.data || [];

  if (!isFinished) {
    return null;
  }

  if (highlights.length === 0) {
    return (
      <div className="space-y-4 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <div className="w-2 h-8 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full mr-4"></div>
          Highlights của sự kiện
        </h2>
        <div className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Chưa có highlights nào cho sự kiện này.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Hãy là người đầu tiên chia sẻ khoảnh khắc của bạn!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <div className="w-2 h-8 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full mr-4"></div>
        Highlights của sự kiện
      </h2>

      <div className="space-y-6">
        {highlights.map((highlight) => (
          <Card
            key={highlight.id}
            className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
          >
            {/* Header */}
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={highlight.authorAvatar}
                      alt={highlight.authorName}
                    />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {highlight.authorName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-[15px]">
                      {highlight.authorName}
                    </p>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400">
                      {new Date(highlight.createdAt).toLocaleDateString(
                        "vi-VN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
                <HighlightMenu
                  highlightId={highlight.id}
                  userId={highlight.userId}
                  currentUserId={highlight.currentUserId}
                />
              </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="px-4 py-0">
              {highlight.content && (
                <p className="text-gray-900 dark:text-gray-100 text-[15px] leading-5 whitespace-pre-line mb-3">
                  {highlight.content}
                </p>
              )}

              {/* Media Gallery - Client Component */}
              <MediaGallery mediaList={highlight.mediaList || []} />
            </CardContent>

            {/* Footer - Client Component */}
            <CardFooter className="px-4 pt-3 pb-2">
              <HighlightActions
                highlightId={highlight.id}
                userId={highlight.userId}
                currentUserId={highlight.currentUserId}
                likeCount={highlight.likeCount}
                commentCount={highlight.commentCount}
                isLiked={false}
                // onLike={handleLike}
                // onDelete={handleDelete}
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
