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
import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  CreateEventClubBody,
  CreateEventClubBodyType,
  FacilityType,
} from "@/schemaValidations/event.schema";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import eventClubApiRequest from "@/apiRequest/club.event";
import addressApiRequest from "@/apiRequest/address";
import { MapPin, ChevronDown } from "lucide-react";
import facilityApiRequest from "@/apiRequest/facility";
import { Select } from "antd";
import RichTextEditor from "@/components/text-editor";

// Interfaces for address data
interface Province {
  id: string;
  full_name: string;
}

interface Ward {
  id: string;
  full_name: string;
}

const CreateEventClubForm = ({ clubSlug }: { clubSlug: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [duration, setDuration] = useState<number>(60);
  // Address related states
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedWardId, setSelectedWardId] = useState("");
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [isLoadingWards, setIsLoadingWards] = useState(false);
  const [additionalAddress, setAdditionalAddress] = useState("");

  const [facilities, setFacilities] = useState<FacilityType[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [loadingFacilities, setLoadingFacilities] = useState(true);

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

  // Load provinces when component mounts
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const response = await addressApiRequest.getProvinces();
        console.log("Provinces response:", response);
        setProvinces(response.payload.data.data || []);
      } catch (error) {
        console.error("Error loading provinces:", error);
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, []);

  // Load wards when province changes
  useEffect(() => {
    const loadWards = async () => {
      if (!selectedProvinceId) {
        setWards([]);
        setSelectedWardId("");
        return;
      }

      setIsLoadingWards(true);
      try {
        const response =
          await addressApiRequest.getWardsByProvinceId(selectedProvinceId);
        setWards(response.payload.data.data || []);
        setSelectedWardId("");
      } catch (error) {
        console.error("Error loading wards:", error);
        setWards([]);
      } finally {
        setIsLoadingWards(false);
      }
    };

    loadWards();
  }, [selectedProvinceId]);

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        const response = await facilityApiRequest.getAllFacilitiesFilter();
        setFacilities(response.payload.data || []);
      } catch (error) {
        console.error("Error loading facilities:", error);
      } finally {
        setLoadingFacilities(false);
      }
    };

    loadFacilities();
  }, []);

  useEffect(() => {
    if (selectedFacility) {
      const facility = facilities.find((f) => f.id === selectedFacility);
      if (facility) {
        setValue("location", facility.location || facility.address);
      }
    }
  }, [selectedFacility, facilities, setValue]);

  // Update location field when province/ward changes
  useEffect(() => {
    const updateLocation = () => {
      const selectedProvince = provinces.find(
        (p) => p.id === selectedProvinceId,
      );
      const selectedWard = wards.find((w) => w.id === selectedWardId);

      const locationParts: string[] = [];

      if (selectedWard) {
        locationParts.push(selectedWard.full_name);
      }
      if (selectedProvince) {
        locationParts.push(selectedProvince.full_name);
      }

      const baseLocation = locationParts.join(", ");
      const fullLocation = additionalAddress
        ? `${additionalAddress}, ${baseLocation}`
        : baseLocation;

      setValue("location", fullLocation);
    };

    updateLocation();
  }, [
    selectedProvinceId,
    selectedWardId,
    additionalAddress,
    provinces,
    wards,
    setValue,
  ]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvinceId(e.target.value);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWardId(e.target.value);
  };

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
        const uploadRes =
          await eventClubApiRequest.uploadImageClubEvent(formData);
        const uploadedImageUrl = uploadRes.payload.data.fileName;
        values.image = uploadedImageUrl || "";
      }

      const payload = {
        ...values,
        ...(selectedFacility && { facilityId: selectedFacility }),
      };

      const eventClub = await eventClubApiRequest.createEventClub(payload);
      toast.success("Tạo hoạt động thành công");

      // Reset form and address states
      form.reset();
      setImageFile(null);
      setImagePreview("");
      setSelectedProvinceId("");
      setSelectedWardId("");
      setAdditionalAddress("");
      setSelectedFacility(null);

      router.push(`/events/${eventClub.payload.data.slug}`);
    } catch {
      toast.error("Tạo thất bại", {
        description: "Có lỗi xảy ra, vui lòng thử lại",
      });
    } finally {
      setLoading(false);
    }
  }
  // Hàm cập nhật endTime khi start hoặc duration đổi
  const updateEndTime = (start: string, dur: number) => {
    if (!start) return;
    const startDate = new Date(start);
    console.log("Start Date:", startDate);
    const endDate = new Date(startDate.getTime() + dur * 60 * 1000);
    const local = new Date(
      endDate.getTime() - endDate.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, 16);

    form.setValue("endTime", local);
  };

  const handleStartChange = (value: string) => {
    form.setValue("startTime", value);
    updateEndTime(value, duration);
  };

  const handleDurationChange = (delta: number) => {
    const newDuration = Math.max(0, duration + delta);
    setDuration(newDuration);
    const startTime = form.getValues("startTime");
    updateEndTime(startTime, newDuration);
  };
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
                Tiêu đề hoạt động <span className="text-red-500">*</span>
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
            <FormItem className="mb-12">
              <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Mô tả <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                {/* <Textarea
                  placeholder="Mô tả chi tiết về hoạt động..."
                  rows={4}
                  className="text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  {...field}
                /> */}
                <RichTextEditor value={field.value} onChange={field.onChange} />
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

        {/* Địa điểm - Enhanced with Province/Ward Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-500" />
            <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
              Địa điểm <span className="text-red-500">*</span>
            </span>
          </div>

          {/* Facility Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chọn sân <span className="text-gray-500">(Ưu tiên)</span>
            </label>
            <Select
              showSearch
              allowClear
              loading={loadingFacilities}
              placeholder="Tìm và chọn sân"
              value={selectedFacility}
              onChange={(value) => setSelectedFacility(value)}
              style={{ width: "100%" }}
              className="dark:bg-gray-800"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              optionRender={(option) => {
                const facility = facilities.find((f) => f.id === option.value);
                return (
                  <div className="flex items-center gap-2">
                    {facility?.image && (
                      <div className="w-10 h-10 relative overflow-hidden rounded-lg shadow-md">
                        <Image
                          src={facility.image}
                          alt={facility.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span>{facility?.name}</span>
                  </div>
                );
              }}
              options={facilities.map((facility) => ({
                value: facility.id,
                label: facility.name,
              }))}
            />
          </div>

          {/* Location Input - Show only if no facility selected */}
          {!selectedFacility && (
            <>
              {/* Province and Ward Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Province Select */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tỉnh thành <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedProvinceId}
                    onChange={handleProvinceChange}
                    disabled={isLoadingProvinces}
                    className="appearance-none block w-full px-3 py-3 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {isLoadingProvinces ? "Đang tải..." : "Chọn tỉnh thành"}
                    </option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.full_name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Ward Select */}
                {selectedProvinceId && (
                  <div className="relative animate-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phường/Xã
                    </label>
                    <select
                      value={selectedWardId}
                      onChange={handleWardChange}
                      disabled={isLoadingWards}
                      className="appearance-none block w-full px-3 py-3 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {isLoadingWards
                          ? "Đang tải..."
                          : "Chọn phường xã (tùy chọn)"}
                      </option>
                      {wards.map((ward) => (
                        <option key={ward.id} value={ward.id}>
                          {ward.full_name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Address Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Địa chỉ chi tiết (tùy chọn)
                </label>
                <Input
                  placeholder="Ví dụ: Sân cầu lông ABC, Số 123, đường DEF..."
                  value={additionalAddress}
                  onChange={(e) => setAdditionalAddress(e.target.value)}
                  className="h-12 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </>
          )}

          {/* Final Location Display */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Địa chỉ đầy đủ
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Địa chỉ sẽ được tạo tự động"
                    className="h-12 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700"
                    {...field}
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                      if (value < 0 || value > 5 || value > maxLevel) return;
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
            <FormItem className="mb-12">
              <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Yêu cầu tham gia <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                {/* <Textarea
                  placeholder="Ví dụ: Người tham gia cần mang vợt riêng, có kinh nghiệm thi đấu..."
                  rows={4}
                  className="text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  {...field}
                /> */}
                <RichTextEditor value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Thời gian bắt đầu và kết thúc */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Thời gian bắt đầu */}
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  Thời gian bắt đầu <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    className="h-12 text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    {...field}
                    onChange={(e) => handleStartChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Thời lượng (riêng) */}
          <div>
            <label className="text-base font-semibold text-gray-700 dark:text-gray-300">
              Thời lượng (phút) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleDurationChange(-30)}
                className="
      w-9 h-9 flex items-center justify-center
      rounded-md border border-gray-300 dark:border-gray-600
      bg-gray-50 dark:bg-gray-800
      text-gray-700 dark:text-gray-200
      text-lg font-medium
      hover:bg-gray-100 dark:hover:bg-gray-700
      transition-colors duration-150
    "
              >
                –
              </button>
              <Input
                type="number"
                min={0}
                step={30}
                readOnly
                value={duration}
                className="w-24 text-center border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={() => handleDurationChange(30)}
                className="
      w-9 h-9 flex items-center justify-center
      rounded-md border border-gray-300 dark:border-gray-600
      bg-gray-50 dark:bg-gray-800
      text-gray-700 dark:text-gray-200
      text-lg font-medium
      hover:bg-gray-100 dark:hover:bg-gray-700
      transition-colors duration-150
    "
              >
                +
              </button>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {Math.floor(duration / 60)} giờ{" "}
                {duration % 60 > 0 && `${duration % 60} phút`}
              </span>
            </div>
          </div>
          {/* Thời gian kết thúc (readonly) */}
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
                    readOnly
                    className="h-12 text-base border border-gray-300 dark:border-gray-600  dark:text-gray-100 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                    {...field}
                  />
                </FormControl>
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
                Mở cho thành viên ngoài CLB{" "}
                <span className="text-red-500">*</span>
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
                Số thành viên CLB tối đa <span className="text-red-500">*</span>
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
                Loại hình cầu lông <span className="text-red-500">*</span>
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
                                        (value) => value !== type,
                                      ),
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
                Hạn đăng ký <span className="text-red-500">*</span>
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
