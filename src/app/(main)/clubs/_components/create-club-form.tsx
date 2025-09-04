"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, ChangeEvent } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  CreateClubBody,
  CreateClubBodyType,
} from "@/schemaValidations/clubs.schema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import clubServiceApi from "@/apiRequest/club";
import authApiRequest from "@/apiRequest/auth";
import { useRouter } from "next/navigation";
import { clientSessionToken } from "@/lib/http";
const CreateClubForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const form = useForm<CreateClubBodyType>({
    resolver: zodResolver(CreateClubBody),
    defaultValues: {
      name: "",
      description: "",
      logoUrl: "",
      location: "",
      maxMembers: 50,
      visibility: "PUBLIC",
      tags: [],
    },
  });

  // Xử lý Tags
  const handleAddTag = () => {
    if (
      currentTag.trim() &&
      !(form.getValues("tags") ?? []).includes(currentTag.trim())
    ) {
      form.setValue("tags", [
        ...(form.getValues("tags") ?? []),
        currentTag.trim(),
      ]);
      setCurrentTag("");
    }
  };
  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue(
      "tags",
      (form.getValues("tags") ?? []).filter((tag) => tag !== tagToRemove)
    );
  };
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Upload Logo
  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file)); // preview local
      form.setValue("logoUrl", file.name); // giữ tên để submit
    }
  };

  async function onSubmit(values: CreateClubBodyType) {
    if (loading) return;
    setLoading(true);
    try {
      const formData = new FormData();
      if (logoFile) {
        formData.append("file", logoFile);
        // Gọi API upload ảnh
      }
      const uploadRes = await clubServiceApi.uploadImage(formData);
      const uploadedImageUrl = uploadRes.payload.data.fileName;
      const club = await clubServiceApi.createClub({
        ...values,
        logoUrl: uploadedImageUrl || "",
      });
      toast.success("Tạo câu lạc bộ thành công");
      const token = await authApiRequest.refreshSession();
      if (token.payload.data.accessToken) {
        clientSessionToken.value = token.payload.data.accessToken;
        clientSessionToken.refreshValue = token.payload.data.refreshToken;
        clientSessionToken.deviceIdValue = token.payload.data.deviceId;
      }
      form.reset();
      setLogoFile(null);
      setLogoPreview("");
      router.push(`/my-clubs/${club.payload.data.id}`);
    } catch (error) {
      toast.error("Tạo thất bại", {
        description: "Có lỗi xảy ra, vui lòng thử lại",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full max-w-3xl mx-auto bg-white dark:bg-gray-900 p-10 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300"
        noValidate
      >
        {/* Tên CLB */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Tên Câu Lạc Bộ
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập tên câu lạc bộ"
                  className="h-12 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        {/* Mô tả */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Mô tả
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mô tả ngắn về CLB..."
                  rows={4}
                  className="text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Logo */}
        <FormField
          control={form.control}
          name="logoUrl"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Logo
              </FormLabel>
              <FormControl>
                <div className="flex items-center flex-col sm:flex-row items-start sm:items-center gap-6">
                  {!logoPreview ? (
                    <label className="w-28 h-28 flex items-center justify-center border-2 border-dashed border-green-500 rounded-xl cursor-pointer hover:bg-green-50 dark:hover:bg-gray-800 transition">
                      <span className="text-sm text-green-600 dark:text-green-300 font-medium">
                        Chọn ảnh
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600 shadow-md group">
                      <Image
                        src={logoPreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                        <button
                          type="button"
                          className="px-3 py-1 bg-white dark:bg-gray-900 text-sm font-medium rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => {
                            setLogoFile(null);
                            setLogoPreview("");
                            form.setValue("logoUrl", "");
                          }}
                        >
                          Xóa
                        </button>
                        <label className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-lg shadow hover:bg-green-700 cursor-pointer">
                          Đổi
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
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

        {/* Địa điểm */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Địa điểm
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: TP. Hồ Chí Minh"
                  className="h-12 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Số lượng thành viên */}
        <FormField
          control={form.control}
          name="maxMembers"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Số thành viên tối đa
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ví dụ: 100"
                  className="h-12 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Chế độ hiển thị
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value || "PUBLIC"}
                  className="flex gap-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="PUBLIC" />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Công khai
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="PRIVATE" />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Riêng tư
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Tags
              </FormLabel>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Nhập tag và nhấn Enter..."
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleTagKeyPress}
                  className="h-12 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTag}
                  className="rounded-lg border-green-500 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-300"
                >
                  Thêm
                </Button>
              </div>
              <div className="flex gap-2 flex-wrap mt-3">
                {(form.getValues("tags") ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-200 rounded-full text-sm font-medium shadow-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold text-lg rounded-xl hover:from-green-700 hover:to-blue-700 transition-transform duration-300 shadow-md active:scale-95"
        >
          {loading ? "Đang xử lý..." : "Tạo Câu Lạc Bộ"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateClubForm;
