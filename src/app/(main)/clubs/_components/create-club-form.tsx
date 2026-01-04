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
import { useState, ChangeEvent, useEffect } from "react";
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
import addressApiRequest from "@/apiRequest/address";
import { MapPin, ChevronDown } from "lucide-react";
import facilityApiRequest from "@/apiRequest/facility";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FacilityType } from "@/schemaValidations/event.schema";
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

const CreateClubForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

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

  const form = useForm<CreateClubBodyType>({
    resolver: zodResolver(CreateClubBody),
    defaultValues: {
      name: "",
      description: "",
      logoUrl: "",
      location: "",
      maxMembers: 50,
      minLevel: 0,
      maxLevel: 5,
      visibility: "PUBLIC",
      tags: [],
    },
  });

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
        form.setValue("location", facility.location || facility.address);
      }
    }
  }, [selectedFacility, facilities, form]);

  // Load provinces when component mounts
  useEffect(() => {
    const loadProvinces = async () => {
      if (!selectedFacility) {
        try {
          const response = await addressApiRequest.getProvinces();
          setProvinces(response.payload.data.data || []);
        } catch (error) {
          console.error("Error loading provinces:", error);
        } finally {
          setIsLoadingProvinces(false);
        }
      }
    };

    loadProvinces();
  }, [selectedFacility]);

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
        const response = await addressApiRequest.getWardsByProvinceId(
          selectedProvinceId
        );
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

  // Update location field when province/ward changes
  useEffect(() => {
    const updateLocation = () => {
      const selectedProvince = provinces.find(
        (p) => p.id === selectedProvinceId
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

      form.setValue("location", fullLocation);
    };

    updateLocation();
  }, [
    selectedProvinceId,
    selectedWardId,
    additionalAddress,
    provinces,
    wards,
    form,
  ]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvinceId(e.target.value);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWardId(e.target.value);
  };

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
      setLogoPreview(URL.createObjectURL(file));
      form.setValue("logoUrl", file.name);
    }
  };

  async function onSubmit(values: CreateClubBodyType) {
    if (loading) return;
    setLoading(true);
    try {
      const formData = new FormData();
      if (logoFile) {
        formData.append("file", logoFile);
      }
      const uploadRes = await clubServiceApi.uploadImage(formData);
      const uploadedImageUrl = uploadRes.payload.data.fileName;
      const club = await clubServiceApi.createClub({
        ...values,
        logoUrl: uploadedImageUrl || "",
        ...(selectedFacility && { facilityId: selectedFacility }),
      });
      toast.success(
        "Tạo câu lạc bộ thành công, Vui lòng chờ quản trị viên phê duyệt."
      );
      const token = await authApiRequest.refreshSession();
      if (token.payload.data.accessToken) {
        clientSessionToken.value = token.payload.data.accessToken;
        clientSessionToken.refreshValue = token.payload.data.refreshToken;
        clientSessionToken.deviceIdValue = token.payload.data.deviceId;
      }
      form.reset();
      setLogoFile(null);
      setLogoPreview("");
      setSelectedProvinceId("");
      setSelectedWardId("");
      setAdditionalAddress("");
      router.push(`/my-clubs/${club.payload.data.slug}`);
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
                Tên Câu Lạc Bộ <span className="text-red-500">*</span>
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
            <FormItem className="mb-12">
              <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Mô tả <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <RichTextEditor value={field.value} onChange={field.onChange} />
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
            <div className="flex gap-2">
              <Select
                value={selectedFacility || ""}
                onValueChange={setSelectedFacility}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tìm và chọn sân" />
                </SelectTrigger>
                <SelectContent className="z-[10000]">
                  {loadingFacilities ? (
                    <div className="p-2 text-center text-sm text-gray-500">
                      Đang tải...
                    </div>
                  ) : facilities.length === 0 ? (
                    <div className="p-2 text-center text-sm text-gray-500">
                      Không có sân nào
                    </div>
                  ) : (
                    facilities.map((facility) => (
                      <SelectItem key={facility.id} value={facility.id}>
                        <span>{facility.name}</span>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedFacility && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFacility(null)}
                  className="px-3"
                >
                  Xóa
                </Button>
              )}
            </div>
          </div>

          {/* Location Input - Show only if no facility selected */}
          {!selectedFacility && (
            <>
              {/* Province and Ward Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Province Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tỉnh thành <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
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
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-3 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
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
                  placeholder="Ví dụ: Số 123, đường ABC..."
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

        {/* Số lượng thành viên */}
        <FormField
          control={form.control}
          name="maxMembers"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Số thành viên tối đa <span className="text-red-500">*</span>
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
              <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                Chế độ hiển thị <span className="text-red-500">*</span>
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
