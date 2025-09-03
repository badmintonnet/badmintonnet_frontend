"use client";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  MapPinIcon,
  DocumentTextIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import accountApiRequest from "@/apiRequest/account";
import {
  AccountResType,
  UpdateProfileBody,
  UpdateProfileBodyType,
} from "@/schemaValidations/account.schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Profile = AccountResType["data"];

interface ProfileEditModalProps {
  profile: Profile;
  isOpen: boolean;
  onClose: () => void;
}

const viGenderToEnum = (g: string): "MALE" | "FEMALE" | "OTHER" => {
  const s = g?.toLowerCase();
  if (s === "nam" || s === "male") return "MALE";
  if (s === "nữ" || s === "nu" || s === "female") return "FEMALE";
  return "OTHER";
};

export default function ProfileEditModal({
  profile,
  isOpen,
  onClose,
}: ProfileEditModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    profile.avatarUrl ?? ""
  );
  const router = useRouter();

  const defaultValues = useMemo<UpdateProfileBodyType>(
    () => ({
      fullName: profile.fullName ?? "",
      birthDate: profile.birthDate ?? "",
      gender: viGenderToEnum(profile.gender ?? "OTHER"),
      address: profile.address ?? "",
      bio: profile.bio ?? "",
    }),
    [profile]
  );

  const form = useForm<UpdateProfileBodyType>({
    resolver: zodResolver(UpdateProfileBody),
    defaultValues,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: UpdateProfileBodyType) => {
    if (isUploading) return;
    setIsUploading(true);
    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await accountApiRequest.uploadImageAvatar(formData);
        if (uploadRes.status === 200) {
          const uploadedImageUrl = uploadRes.payload.data.fileName;
          values.avatarUrl = uploadedImageUrl || "";
          toast.success("Cập nhật ảnh đại diện thành công");
        } else {
          throw new Error(uploadRes.payload?.message || "Upload thất bại");
        }
      }

      const res = await accountApiRequest.updateProfile(values);
      toast.success(res.payload.message || "Cập nhật hồ sơ thành công");
      router.refresh();
      onClose();
    } catch (error: any) {
      const message = error?.payload?.message || "Cập nhật thất bại";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    form.reset(defaultValues);
    setImageFile(null);
    setImagePreview(profile.avatarUrl ?? "");
    onClose();
  };

  return (
    <Form {...form}>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Chỉnh sửa hồ sơ
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Upload Section */}
            <FormField
              control={form.control}
              name="avatarUrl"
              render={() => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                    Ảnh đại diện
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center flex-col sm:flex-row items-start sm:items-center gap-6">
                      {!imagePreview ? (
                        <label className="w-28 h-28 flex items-center justify-center border-2 border-dashed border-green-500 rounded-xl cursor-pointer hover:bg-green-50 dark:hover:bg-gray-800 transition">
                          <span className="text-sm text-green-600 dark:text-green-300 font-medium">
                            Chọn ảnh
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      ) : (
                        <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600 shadow-md group">
                          <Image
                            src={imagePreview}
                            alt="Avatar Preview"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                            <button
                              type="button"
                              className="px-3 py-1 bg-white dark:bg-gray-900 text-sm font-medium rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-800"
                              onClick={() => {
                                setImageFile(null);
                                setImagePreview(profile.avatarUrl ?? "");
                              }}
                            >
                              Xóa
                            </button>
                            <label className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-lg shadow hover:bg-green-700 cursor-pointer">
                              Đổi
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Form Fields */}
            <div className="space-y-6">
              {/* Họ tên */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-4">
                    <UserCircleIcon className="h-6 w-6 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                        Họ và tên
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập họ và tên"
                          className="h-12 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              {/* Ngày sinh */}
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-4">
                    <CalendarDaysIcon className="h-6 w-6 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                        Ngày sinh
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="h-12 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              {/* Giới tính */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-4">
                    <UserCircleIcon className="h-6 w-6 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                        Giới tính
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full h-12 px-3 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="MALE">Nam</option>
                          <option value="FEMALE">Nữ</option>
                          <option value="OTHER">Khác</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              {/* Địa chỉ */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-4">
                    <MapPinIcon className="h-6 w-6 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                        Địa chỉ
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập địa chỉ"
                          className="h-12 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              {/* Tiểu sử */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-4">
                    <DocumentTextIcon className="h-6 w-6 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                        Giới thiệu bản thân
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Viết vài dòng giới thiệu về bản thân..."
                          rows={4}
                          className="text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            {/* Footer */}
            <DialogFooter className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isUploading}
                className="px-6 h-12 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="px-6 h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-base rounded-lg shadow-md"
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                ) : (
                  <CheckIcon className="h-4 w-4 mr-2" />
                )}
                {isUploading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
