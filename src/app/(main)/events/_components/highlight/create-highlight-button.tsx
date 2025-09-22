"use client";

import { useState } from "react";
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
  CreateHighlightSchema,
  CreateHighlightType,
} from "@/schemaValidations/highlight.schema";
import highlightApiRequest from "@/apiRequest/highlight";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CreateHighlightButtonProps {
  eventId: string;
}

export default function CreateHighlightButton({
  eventId,
}: CreateHighlightButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateHighlightType>({
    resolver: zodResolver(CreateHighlightSchema),
    defaultValues: {
      eventId,
      content: "",
      fileNames: [],
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        // Giới hạn số lượng file (tối đa 6 file)
        const newFiles = [...selectedFiles, ...files].slice(0, 6);
        setSelectedFiles(newFiles);

        // Tạo URL preview cho các file
        const newPreviewUrls = newFiles.map((file) =>
          URL.createObjectURL(file)
        );
        setPreviewUrls(newPreviewUrls);
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    const newPreviewUrls = [...previewUrls];

    // Giải phóng URL object để tránh memory leak
    URL.revokeObjectURL(newPreviewUrls[index]);

    newFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);

    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await highlightApiRequest.uploadFileHightLight(formData);

      if (response.payload.message === "Success") {
        // Xử lý cả hai trường hợp single file và multiple files
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

  const onSubmit = async (data: CreateHighlightType) => {
    if (!clientSessionToken.value) {
      toast.error("Bạn cần đăng nhập để thực hiện chức năng này");
      return;
    }

    try {
      setIsSubmitting(true);

      // Bước 1: Upload files trước
      let uploadedFileNames: string[] = [];
      if (selectedFiles.length > 0) {
        toast.loading("Đang upload file...");
        uploadedFileNames = await uploadFiles(selectedFiles);
        console.log("Uploaded file names:", uploadedFileNames);
        toast.dismiss();
      }

      // Bước 2: Tạo highlight với các fileNames đã upload
      const highlightData = {
        ...data,
        fileNames: uploadedFileNames,
      };

      const response = await highlightApiRequest.createHighlight(
        highlightData,
        clientSessionToken.value
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Đã đăng highlight thành công!");
        setIsDialogOpen(false);
        reset();
        setSelectedFiles([]);
        setPreviewUrls([]);
        router.refresh();
      } else {
        toast.error("Không thể đăng highlight");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Đã xảy ra lỗi khi đăng highlight");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open && !isSubmitting) {
      // Reset form when dialog is closed
      reset();
      setSelectedFiles([]);
      setPreviewUrls([]);
    }
    setIsDialogOpen(open);
  };

  return (
    <>
      {/* Giao diện mới thay thế button */}
      <div
        onClick={() => setIsDialogOpen(true)}
        className="group relative flex items-center space-x-4 p-4 bg-white dark:bg-gray-900 rounded-xl cursor-pointer 
                   shadow-sm hover:shadow-md active:shadow-lg active:scale-[0.98]
                   border border-gray-100 dark:border-gray-700
                   transition-all duration-300 ease-out
                   hover:border-blue-200 dark:hover:border-blue-700
                   hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 
                   dark:hover:from-blue-900/20 dark:hover:to-purple-900/20
                   backdrop-blur-sm"
      >
        {/* Gradient overlay khi hover */}
        <div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Avatar với ring effect */}
        <div className="relative">
          <Avatar
            className="w-12 h-12 ring-2 ring-gray-100 dark:ring-gray-700 
                           group-hover:ring-blue-200 dark:group-hover:ring-blue-600
                           transition-all duration-300"
          >
            <AvatarImage src={undefined} alt="User" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              U
            </AvatarFallback>
          </Avatar>
          {/* Status indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
        </div>

        {/* Text content với animation */}
        <div className="flex-1 relative">
          <div className="text-gray-600 dark:text-gray-300 font-medium group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-200">
            Chia sẻ khoảnh khắc của bạn...
          </div>
          <div
            className="text-xs text-gray-400 dark:text-gray-500 mt-1 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            Nhấp để bắt đầu viết
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={undefined} alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">
                  Chia sẻ khoảnh khắc của bạn
                </h3>
                <DialogDescription className="text-sm text-gray-500">
                  Chia sẻ cảm nghĩ, thành tích hoặc khoảnh khắc đáng nhớ
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

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative group rounded-lg overflow-hidden h-24"
                  >
                    {selectedFiles[index]?.type.includes("video") ? (
                      <video
                        src={url}
                        className="w-full h-full object-cover"
                        controls={false}
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <Image
                          src={url}
                          alt={`Preview ${index}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={() =>
                  document.getElementById("file-upload-dialog")?.click()
                }
                disabled={selectedFiles.length >= 5}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Thêm ảnh/video
              </Button>
              <input
                id="file-upload-dialog"
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={selectedFiles.length >= 5}
              />
              {selectedFiles.length >= 5 && (
                <span className="text-sm text-gray-500">
                  Đã đạt giới hạn 5 file
                </span>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogClose(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang đăng..." : "Đăng highlight"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
