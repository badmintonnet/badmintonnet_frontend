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
import HighlightActions, {
  HighlightMenu,
} from "@/app/(main)/events/_components/highlight/highlight-action";
import {
  MediaSchemaType,
  PostFriendSchemaType,
} from "@/schemaValidations/highlight.schema";
import Link from "next/link";
import { AccountResType } from "@/schemaValidations/account.schema";

interface ProfileActivityProps {
  userId: string;
  user: AccountResType["data"];
}

export default async function ProfileActivity({
  userId,
  user,
}: ProfileActivityProps) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  const res = await highlightApiRequest.getHighlightsByUserId(
    userId,
    accessToken?.value || "",
  );

  const highlights = res.payload.data || [];

  if (highlights.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <div className="w-2 h-8 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full mr-4"></div>
          Hoạt động
        </h2>
        <div className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Chưa có hoạt động nào.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Hãy tham gia sự kiện và chia sẻ khoảnh khắc của bạn!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <div className="w-2 h-8 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full mr-4"></div>
        Hoạt động
      </h2>

      {/* Grid layout with responsive columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {highlights.map((highlight) => {
          // Prepare highlight data for the edit dialog
          const highlightForEdit = {
            id: highlight.id,
            content: highlight.content,
            mediaList: (highlight.mediaList || []).map(
              (media: MediaSchemaType) => ({
                fileName: media.fileName,
                mediaUrl: media.url,
                mediaType: media.type.toLowerCase() as "image" | "video",
              }),
            ),
            taggedList: highlight.taggedList || [],
            authorName: highlight.authorName,
            authorAvatar: highlight.authorAvatar,
          };

          return (
            <Card
              key={highlight.id}
              className="bg-white gap-0 dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Header - More compact */}
              <CardHeader className="pb-3 px-5 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Link
                      href={`/profile/${highlight.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 hover:no-underline"
                    >
                      <Avatar className="w-9 h-9">
                        <AvatarImage
                          src={highlight.authorAvatar}
                          alt={highlight.authorName}
                        />
                        <AvatarFallback className="bg-blue-500 text-white text-sm">
                          {highlight.authorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="min-w-0 flex-1">
                      {/* Display name and tagged friends */}
                      <div className="font-semibold text-gray-900 dark:text-white text-sm truncate flex items-center flex-wrap gap-1">
                        <Link
                          href={`/profile/${highlight.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {highlight.authorName}
                        </Link>
                        {highlight.taggedList &&
                          highlight.taggedList.length > 0 && (
                            <span className="font-normal text-gray-600 dark:text-gray-400 flex items-center flex-wrap gap-1">
                              cùng với
                              {highlight.taggedList.map(
                                (
                                  friend: PostFriendSchemaType,
                                  index: number,
                                ) => (
                                  <span
                                    key={friend.id}
                                    className="flex items-center"
                                  >
                                    <Link
                                      href={`/profile/${friend.slug}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-semibold text-gray-900 dark:text-white text-sm hover:underline"
                                    >
                                      {friend.fullName}
                                    </Link>
                                    {index <
                                      highlight.taggedList!.length - 1 && (
                                      <span className="text-gray-600 dark:text-gray-400">
                                        ,
                                      </span>
                                    )}
                                  </span>
                                ),
                              )}
                            </span>
                          )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(highlight.createdAt).toLocaleDateString(
                          "vi-VN",
                          {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                  <HighlightMenu
                    highlightId={highlight.id}
                    userId={highlight.userId}
                    currentUserId={highlight.currentUserId}
                    highlight={highlightForEdit}
                    accessToken={accessToken?.value}
                    user={user}
                  />
                </div>
              </CardHeader>

              {/* Content */}
              <CardContent className="px-5 py-0">
                {highlight.content && (
                  <div className="mb-3">
                    <p className="text-gray-900 dark:text-gray-100 text-sm leading-relaxed whitespace-pre-line line-clamp-4">
                      {highlight.content}
                    </p>
                    {/* Show more/less for long content */}
                    {highlight.content.length > 200 && (
                      <button className="text-blue-500 hover:text-blue-600 text-xs mt-1 font-medium">
                        Xem thêm
                      </button>
                    )}
                  </div>
                )}

                {/* Media Gallery - Optimized for smaller cards */}
                <div className="mb-3">
                  <MediaGallery mediaList={highlight.mediaList || []} />
                </div>
              </CardContent>

              {/* Footer - More compact */}
              <CardFooter className="px-5 pt-2 pb-4">
                <HighlightActions
                  highlightId={highlight.id}
                  userId={highlight.userId}
                  currentUserId={highlight.currentUserId}
                  likeCount={highlight.likeCount}
                  commentCount={highlight.commentCount}
                  isLiked={false}
                />
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Load more button if needed */}
      {highlights.length >= 10 && (
        <div className="flex justify-center mt-8">
          <button className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
            Xem thêm hoạt động
          </button>
        </div>
      )}
    </div>
  );
}
