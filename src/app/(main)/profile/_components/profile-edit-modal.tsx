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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [openCalendar, setOpenCalendar] = useState(false);

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
        <DialogContent className="sm:max-w-[650px] h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <DialogHeader className="pb-1">
            <DialogTitle className="text-2xl font-semibold text-center">
              Chỉnh sửa hồ sơ
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center space-y-4 py-4 border-b border-gray-200 dark:border-gray-700">
              <FormField
                control={form.control}
                name="avatarUrl"
                render={() => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Ảnh đại diện
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-center">
                        {!imagePreview ? (
                          <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-blue-500 rounded-full cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-200 hover:border-blue-600">
                            <div className="text-center">
                              <div className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400">
                                <svg
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                              </div>
                              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                Chọn ảnh
                              </span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                        ) : (
                          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg group">
                            <Image
                              src={imagePreview}
                              alt="Avatar Preview"
                              fill
                              sizes="128px"
                              className="object-cover"
                              priority
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  className="px-3 py-1 bg-white text-gray-800 text-xs font-medium rounded-md shadow hover:bg-gray-100 transition"
                                  onClick={() => {
                                    setImageFile(null);
                                    setImagePreview(profile.avatarUrl ?? "");
                                  }}
                                >
                                  Xóa
                                </button>
                                <label className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-md shadow hover:bg-blue-700 cursor-pointer transition">
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
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Form Fields */}
            <div className="grid gap-6">
              {/* Họ tên */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                      <UserCircleIcon className="h-5 w-5 text-blue-600" />
                      Họ và tên
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập họ và tên"
                        className="h-12 text-base border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Row with Birth Date and Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ngày sinh */}
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                        <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
                        Ngày sinh
                      </FormLabel>
                      <FormControl>
                        <Popover
                          open={openCalendar}
                          onOpenChange={setOpenCalendar}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full h-12 justify-between font-normal text-base border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                              {field.value
                                ? (() => {
                                    // Hiển thị đúng định dạng dd/mm/yyyy
                                    const [y, m, d] = field.value.split("-");
                                    return `${d}/${m}/${y}`;
                                  })()
                                : "Chọn ngày sinh"}
                              <CalendarDaysIcon className="h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              captionLayout="dropdown"
                              selected={
                                field.value
                                  ? new Date(
                                      Number(field.value.split("-")[0]),
                                      Number(field.value.split("-")[1]) - 1,
                                      Number(field.value.split("-")[2])
                                    )
                                  : undefined
                              }
                              onSelect={(date) => {
                                if (date) {
                                  // Lưu lại đúng định dạng yyyy-mm-dd
                                  const yyyy = date.getFullYear();
                                  const mm = String(
                                    date.getMonth() + 1
                                  ).padStart(2, "0");
                                  const dd = String(date.getDate()).padStart(
                                    2,
                                    "0"
                                  );
                                  field.onChange(`${yyyy}-${mm}-${dd}`);
                                } else {
                                  field.onChange("");
                                }
                                setOpenCalendar(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Giới tính */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                        <UserCircleIcon className="h-5 w-5 text-blue-600" />
                        Giới tính
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-12 justify-between font-normal text-base border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:blue-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                            <SelectValue placeholder="Chọn giới tính" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Nam</SelectItem>
                          <SelectItem value="FEMALE">Nữ</SelectItem>
                          <SelectItem value="OTHER">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Địa chỉ */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                      <MapPinIcon className="h-5 w-5 text-blue-600" />
                      Địa chỉ
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập địa chỉ"
                        className="h-12 text-base border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tiểu sử */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                      <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                      Giới thiệu bản thân
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Viết vài dòng giới thiệu về bản thân..."
                        rows={4}
                        className="text-base border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Footer */}
            <DialogFooter className="pt-8 border-t border-gray-200 dark:border-gray-700 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isUploading}
                className="px-8 h-12 text-base border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="px-8 h-12 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all"
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
