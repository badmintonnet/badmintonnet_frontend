"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { clientSessionToken } from "@/lib/http";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  UpdateHighlightSchema,
  UpdateHighlightType,
} from "@/schemaValidations/highlight.schema";
import highlightApiRequest from "@/apiRequest/highlight";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface MediaItem {
  fileName: string;
  mediaUrl: string;
  mediaType: "image" | "video";
}

interface UpdateHighlightDialogProps {
  isOpen: boolean;
  onClose: () => void;
  highlight: {
    id: string;
    content: string;
    mediaList: MediaItem[];
    authorName: string;
    authorAvatar?: string;
  };
}

export default function UpdateHighlightDialog({
  isOpen,
  onClose,
  highlight,
}: UpdateHighlightDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedNewFiles, setSelectedNewFiles] = useState<File[]>([]);
  const [newFilePreviewUrls, setNewFilePreviewUrls] = useState<string[]>([]);
  const [keptMedia, setKeptMedia] = useState<MediaItem[]>(highlight.mediaList);
  const [mediaChanged, setMediaChanged] = useState(false);
  const router = useRouter();
  const previewUrlsRef = useRef<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateHighlightType>({
    resolver: zodResolver(UpdateHighlightSchema),
    defaultValues: {
      id: highlight.id,
      content: highlight.content,
      keepFileNames: undefined,
      newFileNames: [],
    },
  });

  // Reset state when dialog opens or highlight changes
  useEffect(() => {
    if (isOpen) {
      setKeptMedia(highlight.mediaList);
      setSelectedNewFiles([]);
      setNewFilePreviewUrls([]);
      setMediaChanged(false);
      reset({
        id: highlight.id,
        content: highlight.content,
        keepFileNames: undefined,
        newFileNames: [],
      });
    }
  }, [isOpen, highlight, reset]);

  // Update ref when preview URLs change
  useEffect(() => {
    previewUrlsRef.current = newFilePreviewUrls;
  }, [newFilePreviewUrls]);

  // Cleanup preview URLs when dialog closes
  useEffect(() => {
    if (!isOpen) {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      setNewFilePreviewUrls([]);
      setSelectedNewFiles([]);
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleNewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        const totalMedia = keptMedia.length + selectedNewFiles.length;
        const remainingSlots = 6 - totalMedia;
        const newFiles = [...selectedNewFiles, ...files].slice(
          0,
          remainingSlots + selectedNewFiles.length
        );

        setSelectedNewFiles(newFiles);
        setMediaChanged(true);

        // Cleanup old preview URLs
        newFilePreviewUrls.forEach((url) => URL.revokeObjectURL(url));

        // Create new preview URLs
        const newPreviewUrls = newFiles.map((file) =>
          URL.createObjectURL(file)
        );
        setNewFilePreviewUrls(newPreviewUrls);
      }
    }
  };

  const removeKeptMedia = (index: number) => {
    const newKeptMedia = [...keptMedia];
    newKeptMedia.splice(index, 1);
    setKeptMedia(newKeptMedia);
    setMediaChanged(true);
  };

  const removeNewFile = (index: number) => {
    const newFiles = [...selectedNewFiles];
    const newPreviewUrls = [...newFilePreviewUrls];

    // Cleanup URL object
    URL.revokeObjectURL(newPreviewUrls[index]);

    newFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);

    setSelectedNewFiles(newFiles);
    setNewFilePreviewUrls(newPreviewUrls);
    setMediaChanged(true);
  };

  const uploadNewFiles = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await highlightApiRequest.uploadFileHightLight(formData);

      if (response.payload.message === "Success") {
        if ("fileName" in response.payload.data) {
          return [response.payload.data.fileName];
        } else if ("fileNames" in response.payload.data) {
          return response.payload.data.fileNames;
        }
      }

      throw new Error("Upload failed");
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Không thể upload file");
    }
  };

  const onSubmit = async (data: UpdateHighlightType) => {
    if (!clientSessionToken.value) {
      toast.error("Bạn cần đăng nhập để thực hiện chức năng này");
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare update data
      const updateData: UpdateHighlightType = {
        id: highlight.id,
        content: data.content,
      };

      // Handle media changes
      if (mediaChanged) {
        // Set keepFileNames based on kept media
        updateData.keepFileNames = keptMedia.map((media) => media.fileName);

        // Upload new files if any
        if (selectedNewFiles.length > 0) {
          toast.loading("Đang upload file mới...");
          const uploadedFileNames = await uploadNewFiles(selectedNewFiles);
          updateData.newFileNames = uploadedFileNames;
          toast.dismiss();
        } else {
          updateData.newFileNames = [];
        }
      }
      // If mediaChanged is false, keepFileNames remains undefined (no media changes)

      const response = await highlightApiRequest.updateHighlight(
        updateData,
        clientSessionToken.value
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Đã cập nhật highlight thành công!");
        onClose();
        router.refresh();
      } else {
        toast.error("Không thể cập nhật highlight");
      }
    } catch (err: any) {
      console.error("Lỗi khi cập nhật highlight:", err);
      toast.error(err.message || "Đã xảy ra lỗi khi cập nhật highlight");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const totalMediaCount = keptMedia.length + selectedNewFiles.length;
  const canAddMoreFiles = totalMediaCount < 6;

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={highlight.authorAvatar}
                alt={highlight.authorName}
              />
              <AvatarFallback>{highlight.authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">Chỉnh sửa highlight</h3>
              <DialogDescription className="text-sm text-gray-500">
                Cập nhật nội dung và hình ảnh của bạn
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Textarea
              placeholder="Chia sẻ cảm nghĩ, thành tích hoặc khoảnh khắc đáng nhớ của bạn..."
              className="min-h-[120px] resize-none"
              {...register("content")}
            />
            {errors.content && (
              <p className="text-sm text-red-500 mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Media Preview Section */}
          {(keptMedia.length > 0 || selectedNewFiles.length > 0) && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hình ảnh & Video ({totalMediaCount}/6)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {/* Existing/Kept Media */}
                {keptMedia.map((media, index) => (
                  <div
                    key={`kept-${media.fileName}`}
                    className="relative group rounded-lg overflow-hidden h-24 border-2 border-blue-200 dark:border-blue-700"
                  >
                    {media.mediaType === "video" ? (
                      <video
                        src={media.mediaUrl}
                        className="w-full h-full object-cover"
                        controls={false}
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <Image
                          src={media.mediaUrl}
                          alt={`Media ${index}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeKeptMedia(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {/* New Files Preview */}
                {selectedNewFiles.map((file, index) => (
                  <div
                    key={`new-${index}`}
                    className="relative group rounded-lg overflow-hidden h-24 border-2 border-green-200 dark:border-green-700"
                  >
                    {file.type.startsWith("video/") ? (
                      <video
                        src={newFilePreviewUrls[index]}
                        className="w-full h-full object-cover"
                        controls={false}
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <Image
                          src={newFilePreviewUrls[index]}
                          alt={`New preview ${index}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeNewFile(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="absolute bottom-1 left-1 bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                      Mới
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Media Button */}
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={() =>
                document.getElementById("file-upload-update-dialog")?.click()
              }
              disabled={!canAddMoreFiles}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Thêm ảnh/video
            </Button>
            <input
              id="file-upload-update-dialog"
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handleNewFileChange}
              disabled={!canAddMoreFiles}
            />
            {!canAddMoreFiles && (
              <span className="text-sm text-gray-500">
                Đã đạt giới hạn 6 file
              </span>
            )}
          </div>

          {/* Media Change Info */}
          {mediaChanged && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <span className="font-medium">Thay đổi media:</span>
                <span className="ml-2">
                  Giữ lại: {keptMedia.length} | Thêm mới:{" "}
                  {selectedNewFiles.length}
                </span>
              </p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleDialogClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật highlight"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
