/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { z } from "zod";
import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  CreateEventClubBody,
  CreateEventClubBodyType,
} from "@/schemaValidations/event.schema";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import authApiRequest from "@/apiRequest/auth";
import { useRouter } from "next/navigation";
import eventClubApiRequest from "@/apiRequest/club.event";

const CreateEventClubForm = ({ clubSlug }: { clubSlug: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const form = useForm<CreateEventClubBodyType>({
    resolver: zodResolver(CreateEventClubBody),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      location: "",
      requirements: "",
      startTime: "",
      endTime: "",
      totalMember: 0,
      type: [],
      fee: 0,
      deadline: "",
      openForOutside: false,
      maxClubMembers: 0,
      maxOutsideMembers: 0,
      clubSlug: clubSlug,
      minLevel: 0,
      maxLevel: 5,
    },
  });

  const { watch, setValue } = form;
  const maxClubMembers = watch("maxClubMembers");
  const maxOutsideMembers = watch("maxOutsideMembers");
  const openForOutside = watch("openForOutside");

  useEffect(() => {
    if (!openForOutside) {
      setValue("maxOutsideMembers", 0, { shouldValidate: true });
    }
    const total =
      (maxClubMembers || 0) + (openForOutside ? maxOutsideMembers || 0 : 0);
    setValue("totalMember", total, { shouldValidate: true });
  }, [maxClubMembers, maxOutsideMembers, openForOutside, setValue]);

  // Upload Image
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      form.setValue("image", file.name);
    }
  };

  async function onSubmit(values: CreateEventClubBodyType) {
    if (loading) return;
    setLoading(true);
    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append("files", imageFile);
        const uploadRes = await eventClubApiRequest.uploadImageClubEvent(
          formData
        );
        const uploadedImageUrl = uploadRes.payload.data.fileName;
        values.image = uploadedImageUrl || "";
      }

      const eventClub = await eventClubApiRequest.createEventClub(values);
      toast.success("Tạo hoạt động thành công");
      form.reset();
      setImageFile(null);
      setImagePreview("");
      router.push(`/events/${eventClub.payload.data.slug}`);
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
        {/* Tiêu đề */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Tiêu đề hoạt động
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập tiêu đề hoạt động"
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
                  placeholder="Mô tả chi tiết về hoạt động..."
                  rows={4}
                  className="text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hình ảnh */}
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Hình ảnh
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
                        alt="Preview"
                        fill
                        priority
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                        <button
                          type="button"
                          className="px-3 py-1 bg-white dark:bg-gray-900 text-sm font-medium rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview("");
                            form.setValue("image", "");
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
                  placeholder="Ví dụ: Sân cầu lông ABC, Quận 1, TP.HCM"
                  className="h-12 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="minLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  Trình độ tối thiểu
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.5"
                    min={0}
                    max={5}
                    placeholder="0 - 5"
                    className="h-12 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    {...field}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      const maxLevel = form.getValues("maxLevel") ?? 5;
                      if (value < 0 || value > 5 || value > maxLevel) return; // chặn nhập ngoài range
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  Trình độ tối đa
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.5"
                    min={0}
                    max={5}
                    placeholder="0 - 5"
                    className="h-12 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    {...field}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      const minLevel = form.getValues("minLevel") ?? 5;
                      if (value < 0 || value > 5 || value < minLevel) return;
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Yêu cầu tham gia */}
        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Yêu cầu tham gia
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ví dụ: Người tham gia cần mang vợt riêng, có kinh nghiệm thi đấu..."
                  rows={4}
                  className="text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Thời gian bắt đầu và kết thúc */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  Thời gian bắt đầu
                </FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    className="h-12 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  Thời gian kết thúc
                </FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    className="h-12 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Mở cho thành viên ngoài */}
        <FormField
          control={form.control}
          name="openForOutside"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Mở cho thành viên ngoài CLB
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === "true")}
                  defaultValue={field.value ? "true" : "false"}
                  className="flex gap-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="true" />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">Có</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="false" />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">Không</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Số thành viên CLB tối đa */}
        <FormField
          control={form.control}
          name="maxClubMembers"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Số thành viên CLB tối đa
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder="Ví dụ: 2"
                  className="h-12 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Số thành viên ngoài tối đa - Conditionally rendered */}
        {openForOutside && (
          <FormField
            control={form.control}
            name="maxOutsideMembers"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  Số thành viên ngoài tối đa
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Ví dụ: 2"
                    className="h-12 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Tổng số thành viên */}
        <FormField
          control={form.control}
          name="totalMember"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Tổng số thành viên
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value}
                  readOnly
                  className="h-12 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Loại hình cầu lông */}
        <FormField
          control={form.control}
          name="type"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Loại hình cầu lông
              </FormLabel>
              <div className="space-y-3">
                {[
                  "MEN_SINGLE",
                  "WOMEN_SINGLE",
                  "MEN_DOUBLE",
                  "WOMEN_DOUBLE",
                  "MIXED_DOUBLE",
                ].map((type) => (
                  <FormField
                    key={type}
                    control={form.control}
                    name="type"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={type}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(type as any)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, type])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== type
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {type === "MEN_SINGLE" && "Đơn nam"}
                            {type === "WOMEN_SINGLE" && "Đơn nữ"}
                            {type === "MEN_DOUBLE" && "Đôi nam"}
                            {type === "WOMEN_DOUBLE" && "Đôi nữ"}
                            {type === "MIXED_DOUBLE" && "Đôi nam nữ"}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phí tham gia */}
        <FormField
          control={form.control}
          name="fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Phí tham gia (VNĐ)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ví dụ: 50000"
                  className="h-12 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hạn đăng ký */}
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Hạn đăng ký
              </FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  className="h-12 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  {...field}
                />
              </FormControl>
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
          {loading ? "Đang xử lý..." : "Tạo Hoạt Động"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateEventClubForm;
