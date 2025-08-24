"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CreateEventBody,
  CreateEventBodyType,
} from "@/schemaValidations/event.schema";
import {
  defaultFootballRules,
  defaultBadmintonRules,
} from "@/lib/defaultRules";
import eventApiRequest from "@/apiRequest/event";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

const CreateEventForm = () => {
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);

  const form = useForm<CreateEventBodyType>({
    resolver: zodResolver(CreateEventBody),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      startTime: new Date().toISOString().slice(0, 16),
      endTime: new Date().toISOString().slice(0, 16),
      capacity: undefined,
      fee: undefined,
      recurring: false,
      recurrenceRule: "",
      eventType: "TOURNAMENT",
      sportType: "FOOTBALL",
      eventFormat: {},
      sportRule: {},
    },
  });

  const { watch, setValue } = form;
  const sportType = watch("sportType");
  const eventType = watch("eventType");

  useEffect(() => {
    const defaults =
      sportType === "FOOTBALL" ? defaultFootballRules : defaultBadmintonRules;
    setValue("eventFormat", defaults[eventType].eventFormat);
    setValue("sportRule", defaults[eventType].sportRule);
  }, [sportType, eventType, setValue]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "coverImage" | "images"
  ) => {
    const files = e.target.files;
    if (!files) return;

    if (type === "coverImage" && files[0]) {
      setCoverImagePreview(URL.createObjectURL(files[0]));
      setCoverImage(files[0]);
      setValue("coverImage", files[0].name);
    } else if (type === "images") {
      const selectedFiles = Array.from(files);
      const newPreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );

      setImages((prev) => [...prev, ...selectedFiles]);
      setImagesPreview((prev) => [...prev, ...newPreviews]);

      setValue("images", [
        ...(form.getValues("images") || []),
        ...selectedFiles.map((file) => file.name),
      ]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagesPreview((prev) => prev.filter((_, i) => i !== index));
    setValue(
      "images",
      form.getValues("images")?.filter((_, i) => i !== index) || []
    );
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
    setValue("coverImage", "");
  };

  const onSubmit = async (data: CreateEventBodyType) => {
    try {
      const formData = new FormData();

      if (coverImage) {
        formData.append("files", coverImage);
      }

      if (images.length > 0) {
        images.forEach((img) => {
          formData.append("files", img);
        });
      }

      const uploadImageResult = await eventApiRequest.uploadImage(formData);
      const uploadedImageUrls = uploadImageResult.payload.data.fileNames;
      console.log("Uploaded image URLs:", uploadedImageUrls);
      await eventApiRequest.createEvent({
        ...data,
        coverImage: uploadedImageUrls[0],
        images: uploadedImageUrls.slice(1),
      });

      toast.success("Tạo sự kiện thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo sự kiện.");
    }
  };

  const renderDynamicFields = () => {
    const format = form.watch("eventFormat") || {};
    const rule = form.watch("sportRule") || {};

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Thể lệ sự kiện
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(format).length > 0 ? (
              Object.entries(format).map(([key, value]) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={`eventFormat.${key}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {typeof value === "boolean" ? (
                          <div className="flex items-center gap-2">
                            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200 capitalize">
                              {key
                                .replace(/_/g, " ")
                                .replace(/^./, (c) => c.toUpperCase())}
                            </FormLabel>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="h-4 w-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600"
                            />
                          </div>
                        ) : (
                          <div>
                            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200 capitalize">
                              {key
                                .replace(/_/g, " ")
                                .replace(/^./, (c) => c.toUpperCase())}
                            </FormLabel>
                            <Input
                              type={
                                typeof value === "number" ? "number" : "text"
                              }
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  typeof value === "number"
                                    ? Number(e.target.value)
                                    : e.target.value
                                )
                              }
                              className="mt-2 rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
                            />
                          </div>
                        )}
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No event format fields available.
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Nội dung & quy tắc
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(rule).length > 0 ? (
              Object.entries(rule).map(([key, value]) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={`sportRule.${key}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {typeof value === "boolean" ? (
                          <div className="flex items-center gap-2">
                            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200 capitalize">
                              {key
                                .replace(/_/g, " ")
                                .replace(/^./, (c) => c.toUpperCase())}
                            </FormLabel>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="h-4 w-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600"
                            />
                          </div>
                        ) : (
                          <div>
                            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200 capitalize">
                              {key
                                .replace(/_/g, " ")
                                .replace(/^./, (c) => c.toUpperCase())}
                            </FormLabel>
                            <Input
                              type={
                                typeof value === "number" ? "number" : "text"
                              }
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  typeof value === "number"
                                    ? Number(e.target.value)
                                    : e.target.value
                                )
                              }
                              className="mt-2 rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
                            />
                          </div>
                        )}
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No sport rule fields available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div>
      <Card className="shadow-xl border-0 bg-white dark:bg-gray-800">
        <CardContent className="p-4 sm:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Tiêu đề
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tiêu đề sự kiện"
                        {...field}
                        className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Mô tả
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả chi tiết về sự kiện"
                        {...field}
                        className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
                        rows={5}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="coverImage"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Ảnh bìa
                    </FormLabel>
                    <FormControl>
                      <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, "coverImage")}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center">
                          <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Kéo và thả ảnh bìa hoặc nhấp để chọn
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            (Hỗ trợ định dạng: JPG, PNG)
                          </p>
                        </div>
                      </div>
                    </FormControl>
                    {coverImagePreview && (
                      <div className="relative mt-4">
                        <img
                          src={coverImagePreview}
                          alt="Cover preview"
                          className="w-full max-w-md h-48 object-cover rounded-md shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={removeCoverImage}
                          className="absolute top-2 right-2 bg-red-500 dark:bg-red-600 text-white rounded-full p-1 hover:bg-red-600 dark:hover:bg-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="images"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Ảnh minh họa
                    </FormLabel>
                    <FormControl>
                      <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleImageChange(e, "images")}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center">
                          <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Kéo và thả ảnh minh họa hoặc nhấp để chọn
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            (Hỗ trợ nhiều ảnh, định dạng: JPG, PNG)
                          </p>
                        </div>
                      </div>
                    </FormControl>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                      {imagesPreview.map((src, index) => (
                        <div key={index} className="relative">
                          <img
                            src={src}
                            alt={`Preview ${index}`}
                            className="w-full h-24 object-cover rounded-md shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 dark:bg-red-600 text-white rounded-full p-1 hover:bg-red-600 dark:hover:bg-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Địa điểm
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập địa điểm"
                        {...field}
                        className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Thời gian bắt đầu
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Thời gian kết thúc
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Số lượng tối đa
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Nhập số lượng"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Lệ phí tham gia
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Nhập lệ phí"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                          className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="recurring"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-4 w-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Định kỳ
                    </FormLabel>
                    <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
                  </FormItem>
                )}
              />
              {form.watch("recurring") && (
                <FormField
                  control={form.control}
                  name="recurrenceRule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Quy tắc định kỳ
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập quy tắc định kỳ (VD: WEEKLY)"
                          {...field}
                          className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sportType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Môn thể thao
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100">
                            <SelectValue placeholder="Chọn môn thể thao" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white dark:bg-gray-700">
                          <SelectItem value="FOOTBALL">Bóng đá</SelectItem>
                          <SelectItem value="BADMINTON">Cầu lông</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Loại sự kiện
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100">
                            <SelectValue placeholder="Chọn loại sự kiện" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white dark:bg-gray-700">
                          <SelectItem value="TOURNAMENT">Giải đấu</SelectItem>
                          <SelectItem value="TRAINING">Lớp học</SelectItem>
                          <SelectItem value="CLUB_ACTIVITY">
                            Giao lưu CLB
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              {renderDynamicFields()}
              <Button
                type="submit"
                className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold py-3 rounded-md transition-colors"
              >
                Tạo Sự Kiện
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEventForm;
