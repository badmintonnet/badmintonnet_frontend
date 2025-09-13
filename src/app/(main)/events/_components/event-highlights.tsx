import Image from "next/image";
import { Heart, MessageCircle, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HighlightType } from "@/schemaValidations/highlight.schema";
import highlightApiRequest from "@/apiRequest/highlight";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockHighlights } from "./mock-highlights";
import { cookies } from "next/headers";

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

  const highlights = mockHighlights;

  // const highlights = await highlightApiRequest.getHighlightsByEventId(
  //   eventId,
  //   accessToken?.value || ""
  // );

  if (!isFinished) {
    return null;
  }

  // if (loading) {
  //   return (
  //     <div className="space-y-4 mt-8">
  //       <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
  //         <div className="w-2 h-8 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full mr-4"></div>
  //         Highlights của sự kiện
  //       </h2>
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //         {[1, 2].map((i) => (
  //           <Card key={i} className="bg-white dark:bg-gray-800 shadow-md">
  //             <CardHeader className="pb-2">
  //               <div className="flex items-center space-x-4">
  //                 <Skeleton className="h-12 w-12 rounded-full" />
  //                 <div className="space-y-2">
  //                   <Skeleton className="h-4 w-[150px]" />
  //                   <Skeleton className="h-3 w-[100px]" />
  //                 </div>
  //               </div>
  //             </CardHeader>
  //             <CardContent className="pb-2">
  //               <Skeleton className="h-4 w-full mb-2" />
  //               <Skeleton className="h-4 w-3/4" />
  //               <Skeleton className="h-[200px] w-full mt-4" />
  //             </CardContent>
  //             <CardFooter>
  //               <div className="flex justify-between w-full">
  //                 <Skeleton className="h-8 w-20" />
  //                 <Skeleton className="h-8 w-20" />
  //               </div>
  //             </CardFooter>
  //           </Card>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {highlights.map((highlight) => (
          <Card
            key={highlight.id}
            className="bg-white dark:bg-gray-800 shadow-md overflow-hidden"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={highlight.userAvatar}
                      alt={highlight.userName}
                    />
                    <AvatarFallback>
                      {highlight.userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {highlight.userName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(highlight.createdAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                </div>
                {/* {accessToken?.id === highlight.userId && ( */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      // onClick={() => handleDelete(highlight.id)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* )} */}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {highlight.content}
              </p>

              {highlight.mediaUrls && highlight.mediaUrls.length > 0 && (
                <div className="mt-4">
                  {highlight.mediaUrls.length === 1 ? (
                    <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
                      {highlight.mediaType === "VIDEO" ? (
                        <video
                          src={highlight.mediaUrls[0]}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={highlight.mediaUrls[0]}
                          alt="Highlight"
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                  ) : (
                    <Carousel className="w-full">
                      <CarouselContent>
                        {highlight.mediaUrls.map((media, index) => (
                          <CarouselItem key={index}>
                            <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
                              {highlight.mediaType === "VIDEO" ? (
                                <video
                                  src={media}
                                  controls
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Image
                                  src={media}
                                  alt={`Highlight ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="-left-4" />
                      <CarouselNext className="-right-4" />
                    </Carousel>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="flex justify-between w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  // onClick={() => handleLike(highlight.id)}
                  className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  {highlight.likes} thích
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 dark:text-gray-400"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {highlight.comments} bình luận
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
