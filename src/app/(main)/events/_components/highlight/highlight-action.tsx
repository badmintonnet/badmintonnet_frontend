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
  onDelete?: (highlightId: string) => Promise<void>;
}

interface HighlightMenuProps {
  highlightId: string;
  userId: string;
  currentUserId?: string;
  highlight?: {
    id: string;
    content: string;
    mediaList: MediaItem[];
    authorName: string;
    authorAvatar?: string;
  };
  onDelete?: (highlightId: string) => Promise<void>;
}

export default function HighlightActions({
  highlightId,
  userId,
  currentUserId,
  likeCount,
  commentCount,
  isLiked = false,
  onLike,
  onDelete,
}: HighlightActionsProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [liked, setLiked] = useState(isLiked);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);

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

  const handleDelete = async () => {
    // if (isDeleting || !onDelete) return;
    // const confirmed = confirm("Bạn có chắc chắn muốn xóa bài viết này không?");
    // if (!confirmed) return;
    // setIsDeleting(true);
    // try {
    //   await onDelete(highlightId);
    // } catch (error) {
    //   console.error("Failed to delete:", error);
    //   alert("Không thể xóa bài viết. Vui lòng thử lại.");
    // } finally {
    //   setIsDeleting(false);
    // }
  };

  const canDelete = currentUserId === userId;

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
  userId,
  currentUserId,
  highlight,
  onDelete,
}: HighlightMenuProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const canDelete = currentUserId === userId;

  const handleDelete = async () => {
    if (isDeleting || !onDelete) return;
    const confirmed = confirm("Bạn có chắc chắn muốn xóa bài viết này không?");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await onDelete(highlightId);
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Không thể xóa bài viết. Vui lòng thử lại.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  if (!canDelete) return null;

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
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 dark:text-red-400 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? "Đang xóa..." : "Xóa bài viết"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Update Dialog */}
      {highlight && (
        <UpdateHighlightDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          highlight={highlight}
        />
      )}
    </>
  );
}
