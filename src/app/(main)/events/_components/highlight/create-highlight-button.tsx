"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { clientSessionToken } from "@/lib/http";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, X, UserPlus, Search, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
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
import friendApiRequest from "@/apiRequest/friend";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AccountFriendSchemaType } from "@/schemaValidations/friend.schema";
import { AccountResType } from "@/schemaValidations/account.schema";
import Link from "next/link";

interface CreateHighlightButtonProps {
  eventId: string;
  user: AccountResType["data"];
}

type Friend = AccountFriendSchemaType;

export default function CreateHighlightButton({
  eventId,
  user,
}: CreateHighlightButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [taggedFriends, setTaggedFriends] = useState<Friend[]>([]);
  const [showFriendList, setShowFriendList] = useState(false);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]); // Friends selected in the list
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateHighlightType>({
    resolver: zodResolver(CreateHighlightSchema),
    defaultValues: {
      eventId,
      content: "",
      fileNames: [],
      taggedFriendIds: [],
    },
  });

  const loadFriends = useCallback(async () => {
    if (!clientSessionToken.value) return;

    try {
      setIsLoadingFriends(true);

      const res = await friendApiRequest.getFriendList(
        user.id,
        clientSessionToken.value,
      );

      if (res.payload.data) {
        setFriends(res.payload.data);
        setFilteredFriends(res.payload.data);
      }
    } catch (error) {
      console.error("Error loading friends:", error);
      toast.error("Không thể tải danh sách bạn bè");
    } finally {
      setIsLoadingFriends(false);
    }
  }, [user.id]);

  // Load danh sách bạn bè khi mở dialog
  useEffect(() => {
    if (isDialogOpen && clientSessionToken.value) {
      loadFriends();
    }
  }, [isDialogOpen, loadFriends]);

  // Filter friends based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter((friend) =>
        friend.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredFriends(filtered);
    }
  }, [searchTerm, friends]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        const newFiles = [...selectedFiles, ...files].slice(0, 6);
        setSelectedFiles(newFiles);

        const newPreviewUrls = newFiles.map((file) =>
          URL.createObjectURL(file),
        );
        setPreviewUrls(newPreviewUrls);
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    const newPreviewUrls = [...previewUrls];

    URL.revokeObjectURL(newPreviewUrls[index]);

    newFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);

    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
  };

  const toggleFriendSelection = (friend: Friend) => {
    setSelectedFriends((prev) => {
      const isSelected = prev.find((f) => f.id === friend.id);
      if (isSelected) {
        return prev.filter((f) => f.id !== friend.id);
      } else {
        return [...prev, friend];
      }
    });
  };

  const addSelectedFriends = () => {
    const newTaggedFriends = [
      ...taggedFriends,
      ...selectedFriends.filter(
        (friend) => !taggedFriends.find((f) => f.id === friend.id),
      ),
    ];
    setTaggedFriends(newTaggedFriends);
    setSelectedFriends([]);
    setShowFriendList(false);
    setSearchTerm("");

    // Update form value
    setValue(
      "taggedFriendIds",
      newTaggedFriends.map((f) => f.id),
    );
  };

  const removeTaggedFriend = (friendId: string) => {
    const newTaggedFriends = taggedFriends.filter((f) => f.id !== friendId);
    setTaggedFriends(newTaggedFriends);

    // Update form value
    setValue(
      "taggedFriendIds",
      newTaggedFriends.map((f) => f.id),
    );
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

      let uploadedFileNames: string[] = [];
      if (selectedFiles.length > 0) {
        toast.loading("Đang upload file...");
        uploadedFileNames = await uploadFiles(selectedFiles);
        console.log("Uploaded file names:", uploadedFileNames);
        toast.dismiss();
      }

      const highlightData = {
        ...data,
        fileNames: uploadedFileNames,
        taggedFriendIds: taggedFriends.map((f) => f.id),
      };

      const response = await highlightApiRequest.createHighlight(
        highlightData,
        clientSessionToken.value,
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Đã đăng highlight thành công!");
        setIsDialogOpen(false);
        reset();
        setSelectedFiles([]);
        setPreviewUrls([]);
        setTaggedFriends([]);
        setSelectedFriends([]);
        setShowFriendList(false);
        setSearchTerm("");
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
      reset();
      setSelectedFiles([]);
      setPreviewUrls([]);
      setTaggedFriends([]);
      setSelectedFriends([]);
      setShowFriendList(false);
      setSearchTerm("");
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
            <AvatarImage src={user.avatarUrl || ""} alt="User" />
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
                <AvatarImage src={user.avatarUrl || ""} alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-gray-900 dark:text-white text-base flex items-center flex-wrap gap-1">
                  <span>{user.fullName}</span>
                  {taggedFriends.length > 0 && (
                    <span className="font-normal text-gray-600 dark:text-gray-400 flex items-center flex-wrap gap-1">
                      cùng với
                      {taggedFriends.map((friend, index) => (
                        <span key={friend.id} className="flex items-center">
                          <Link
                            href={`/profile/${friend.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-gray-900 dark:text-white text-base hover:underline"
                          >
                            {friend.fullName}
                          </Link>
                          {index < taggedFriends.length - 1 && (
                            <span className="text-gray-600 dark:text-gray-400">
                              ,
                            </span>
                          )}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
                <DialogDescription className="text-sm text-gray-500 hidden"></DialogDescription>
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

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={() => setShowFriendList(!showFriendList)}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Gắn thẻ bạn bè
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

            {/* Giao diện tìm kiếm và danh sách bạn bè */}
            {showFriendList && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Tìm kiếm bạn bè..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  {selectedFriends.length > 0 && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={addSelectedFriends}
                      className="ml-2"
                    >
                      Thêm ({selectedFriends.length})
                    </Button>
                  )}
                </div>

                {/* Hiển thị tagged friends trong danh sách */}
                {taggedFriends.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Đã gắn thẻ
                      </span>
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        {taggedFriends.length} người
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {taggedFriends.map((friend) => (
                        <div
                          key={friend.id}
                          className="flex items-center bg-white dark:bg-gray-700 rounded-full pl-2 pr-1 py-1 border border-blue-200 dark:border-blue-600"
                        >
                          <span className="text-sm text-blue-700 dark:text-blue-300 mr-1">
                            {friend.fullName}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeTaggedFriend(friend.id)}
                            className="ml-1 rounded-full p-1 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                          >
                            <X className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isLoadingFriends ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">
                      Đang tải danh sách bạn bè...
                    </p>
                  </div>
                ) : filteredFriends.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">
                      Không tìm thấy bạn bè
                    </p>
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {filteredFriends.map((friend) => {
                      const isTagged = taggedFriends.find(
                        (f) => f.id === friend.id,
                      );
                      const isSelected = selectedFriends.find(
                        (f) => f.id === friend.id,
                      );

                      return (
                        <div
                          key={friend.id}
                          className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                            isTagged
                              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-600"
                              : isSelected
                                ? "bg-blue-50 dark:bg-blue-900/20"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                          onClick={() =>
                            !isTagged && toggleFriendSelection(friend)
                          }
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={friend.avatarUrl}
                              alt={friend.fullName}
                            />
                            <AvatarFallback className="bg-blue-500 text-white text-xs">
                              {friend.fullName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium truncate ${
                                isTagged
                                  ? "text-green-700 dark:text-green-300"
                                  : "text-gray-900 dark:text-white"
                              }`}
                            >
                              {friend.fullName}
                            </p>
                            <p
                              className={`text-xs ${
                                isTagged
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {friend.skillLevel}
                            </p>
                          </div>
                          {isTagged ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : isSelected ? (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded-full" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

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
