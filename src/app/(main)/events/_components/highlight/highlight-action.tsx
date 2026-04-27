"use client";

import { Heart, MessageCircle, Trash2, MoreVertical, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import UpdateHighlightDialog from "@/app/(main)/events/_components/highlight/update-highlight";
import { useRouter } from "next/navigation";
import highlightApiRequest from "@/apiRequest/highlight";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AccountResType } from "@/schemaValidations/account.schema";
import { PostFriendSchemaType } from "@/schemaValidations/highlight.schema";

interface MediaItem {
  fileName: string;
  mediaUrl: string;
  mediaType: "image" | "video";
}

interface HighlightActionsProps {
  highlightId: string;
  userId: string;
  currentUserId?: string;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  onLike?: (highlightId: string) => Promise<void>;
}

interface HighlightMenuProps {
  highlightId: string;
  userId: string;
  currentUserId?: string;
  highlight?: {
    id: string;
    content: string;
    mediaList: MediaItem[];
    taggedList: PostFriendSchemaType[];
    authorName: string;
    authorAvatar?: string;
  };
  accessToken?: string;
  user: AccountResType["data"];
}

export default function HighlightActions({
  likeCount,
  commentCount,
  isLiked = false,
}: HighlightActionsProps) {
  const isLiking = false;
  const liked = isLiked;
  const currentLikeCount = likeCount;

  const handleLike = async () => {
    // if (isLiking || !onLike) return;
    // setIsLiking(true);
    // try {
    //   // Optimistic update
    //   setLiked(!liked);
    //   setCurrentLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    // //   await onLike(highlightId);
    // } catch (error) {
    //   // Revert on error
    //   setLiked(liked);
    //   setCurrentLikeCount(likeCount);
    //   console.error("Failed to like/unlike:", error);
    // } finally {
    //   setIsLiking(false);
    // }
  };

  return (
    <div className="flex items-center justify-between w-full border-t border-gray-200 dark:border-gray-700 pt-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={isLiking}
        className={`
          px-4 py-2 h-9 font-medium transition-colors duration-200
          ${
            liked
              ? "text-red-500 dark:text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              : "text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          }
          ${isLiking ? "opacity-70 cursor-not-allowed" : ""}
        `}
      >
        <Heart
          className={`mr-2 h-4 w-4 transition-transform duration-200 ${
            liked ? "fill-current scale-110" : ""
          }`}
        />
        <span>{currentLikeCount}</span>
      </Button>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 h-9 font-medium"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          <span>{commentCount}</span>
        </Button>
      </div>
    </div>
  );
}

export function HighlightMenu({
  highlightId,
  highlight,
  accessToken,
  user,
}: HighlightMenuProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await highlightApiRequest.deleteHighlight(highlightId, accessToken || "");
      setIsDeleteDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete:", error);
      toast("Không thể xóa bài viết. Vui lòng thử lại.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            disabled={isDeleting}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={handleEdit}
            className="text-blue-600 dark:text-blue-400 focus:text-blue-700 focus:bg-blue-50 dark:focus:bg-blue-900/20 cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="text-red-600 dark:text-red-400 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? "Đang xóa..." : "Xóa bài viết"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa bài viết</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không
              thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Dialog */}
      {highlight && (
        <UpdateHighlightDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          highlight={highlight}
          user={user}
        />
      )}
    </>
  );
}
