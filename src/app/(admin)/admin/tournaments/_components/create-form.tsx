"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Upload, X, Plus, Trash, MapPin, ChevronDown } from "lucide-react";
import Image from "next/image";

import {
  TournamentCreateRequest,
  BadmintonCategoryEnum,
  CategoryFormatEnum,
  getCategoryLabel,
} from "@/schemaValidations/tournament.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import facilityApiRequest from "@/apiRequest/facility";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import tournamentApiRequest from "@/apiRequest/tournament";
import addressApiRequest from "@/apiRequest/address";
import { useRouter } from "next/navigation";
import { FacilityType } from "@/schemaValidations/event.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TextEditor from "@/components/text-editor";
import RichTextEditor from "@/components/text-editor";
import Tiptap from "@/components/text-editor";

// Interfaces for address data
interface Province {
  id: string;
  full_name: string;
}

interface Ward {
  id: string;
  full_name: string;
}

// `getCategoryLabel` is imported from the shared schema helper

// Helper function to get format labels
export function getFormatLabel(format: string): string {
  const map: Record<string, string> = {
    LOAI_TRUC_TIEP: "Loại trực tiếp",
    VONG_TRON: "Vòng tròn",
    VONG_BANG: "Vòng bảng",
    KET_HOP: "Kết hợp",
  };
  return map[format] ?? format;
}

// Helper function to format date string for backend
function toLocalDateTime(dateString: string) {
  if (!dateString) return null;
  return dateString.includes("T") ? dateString : `${dateString}T00:00:00`;
}

export default function TournamentCreateForm({
  onCreated,
}: {
  onCreated?: () => void;
}) {
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
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

  const router = useRouter();
  const form = useForm<TournamentCreateRequest>({
    resolver: zodResolver(TournamentCreateRequest),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      bannerUrl: "",
      logoUrl: "",
      startDate: "",
      endDate: "",
      rules: "",
      registrationStartDate: "",
      registrationEndDate: "",
      fee: 0,
      categories: [
        {
          categoryType: "MEN_SINGLE",
          minLevel: 1,
          maxLevel: 5,
          maxParticipants: 16,
          format: "LOAI_TRUC_TIEP",
          registrationFee: 0,
          description: "",
          rules: "",
          firstPrize: "",
          secondPrize: "",
          thirdPrize: "",
        },
      ],
    },
  });

  const { control, register, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories",
  });

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        const response = await facilityApiRequest.getAllFacilitiesFilter();
        setFacilities(response.payload.data || []);
      } catch (error) {
        console.error("Error loading facilities:", error);
        toast.error("Lỗi", {
          description: "Không thể tải danh sách sân.",
        });
      } finally {
        setLoadingFacilities(false);
      }
    };
    loadFacilities();
  }, []);

  useEffect(() => {
    if (!selectedFacility) {
      const loadProvinces = async () => {
        try {
          const response = await addressApiRequest.getProvinces();
          setProvinces(response.payload.data.data || []);
        } catch (error) {
          console.error("Error loading provinces:", error);
          toast.error("Lỗi", {
            description: "Không thể tải danh sách tỉnh thành.",
          });
        } finally {
          setIsLoadingProvinces(false);
        }
      };
      loadProvinces();
    } else {
      setProvinces([]);
      setIsLoadingProvinces(false);
    }
  }, [selectedFacility]);

  useEffect(() => {
    if (!selectedProvinceId || selectedFacility) {
      setWards([]);
      setSelectedWardId("");
      return;
    }
    const loadWards = async () => {
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
  }, [selectedProvinceId, selectedFacility]);

  useEffect(() => {
    const updateLocation = () => {
      if (selectedFacility) return;
      const selectedProvince = provinces.find(
        (p) => p.id === selectedProvinceId
      );
      const selectedWard = wards.find((w) => w.id === selectedWardId);
      const locationParts: string[] = [];
      if (additionalAddress) locationParts.push(additionalAddress);
      if (selectedWard) locationParts.push(selectedWard.full_name);
      if (selectedProvince) locationParts.push(selectedProvince.full_name);
      const fullLocation = locationParts.join(", ");
      setValue("location", fullLocation, { shouldValidate: true });
    };
    updateLocation();
  }, [
    selectedProvinceId,
    selectedWardId,
    additionalAddress,
    provinces,
    wards,
    setValue,
    selectedFacility,
  ]);

  useEffect(() => {
    if (selectedFacility) {
      const facility = facilities.find((f) => f.id === selectedFacility);
      if (facility) {
        const location = facility.location || facility.address;
        setValue("location", location, {
          shouldValidate: true,
        });
        setSelectedProvinceId("");
        setSelectedWardId("");
        setAdditionalAddress("");
      }
    }
  }, [selectedFacility, facilities, setValue]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvinceId(e.target.value);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWardId(e.target.value);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "banner" | "logo"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === "banner") {
      setBannerPreview(url);
      setBannerImage(file);
      form.setValue("bannerUrl", file.name, { shouldValidate: true });
    } else {
      setLogoPreview(url);
      setLogoImage(file);
      form.setValue("logoUrl", file.name, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: TournamentCreateRequest) => {
    try {
      let uploadedBannerUrl = "";
      if (bannerImage) {
        const formData = new FormData();
        formData.append("files", bannerImage);
        const uploadRes = await tournamentApiRequest.uploadImageTournament(
          formData
        );
        uploadedBannerUrl = uploadRes.payload.data.fileName;
      }

      let uploadedLogoUrl = "";
      if (logoImage) {
        const formData = new FormData();
        formData.append("files", logoImage);
        const uploadRes = await tournamentApiRequest.uploadImageTournament(
          formData
        );
        uploadedLogoUrl = uploadRes.payload.data.fileName;
      }

      await tournamentApiRequest.createTournament({
        ...data,
        logoUrl: uploadedLogoUrl,
        bannerUrl: uploadedBannerUrl,
        startDate: toLocalDateTime(data.startDate) || "",
        endDate: toLocalDateTime(data.endDate) || "",
        registrationStartDate:
          toLocalDateTime(data.registrationStartDate) || "",
        registrationEndDate: toLocalDateTime(data.registrationEndDate) || "",
        rules: data.rules || undefined,
        categories: data.categories.map((cat) => {
          // Convert category rules from textarea string to array
          const rules = cat.rules || "";

          return {
            ...cat,
            // Category rules as array
            rules: rules,
            registrationDeadline: cat.registrationDeadline
              ? toLocalDateTime(cat.registrationDeadline) || undefined
              : undefined,
          };
        }),
        ...(selectedFacility && { facilityId: selectedFacility }),
      });

      toast.success("Tạo giải đấu thành công!");
      form.reset();
      setBannerPreview(null);
      setLogoPreview(null);
      setBannerImage(null);
      setLogoImage(null);
      setSelectedProvinceId("");
      setAdditionalAddress("");
      setSelectedFacility(null);
      router.refresh();
      onCreated?.();
    } catch (error) {
      toast.error("Tạo giải đấu thất bại!", {
        description: "Có lỗi xảy ra, vui lòng kiểm tra lại thông tin.",
      });
    }
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-lg dark:bg-gray-800 max-w-4xl mx-auto">
      <CardContent className="overflow-visible">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* General Information */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên giải đấu <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Giải Cầu Lông Mùa Xuân 2025"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mb-12">
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rules"
              render={({ field }) => (
                <FormItem className="mb-12">
                  <FormLabel>Điều lệ giải đấu</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address Selection */}
            <div className="space-y-4 rounded-lg border p-4 ">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <FormLabel className="text-base font-semibold">
                  Địa điểm <span className="text-red-500">*</span>
                </FormLabel>
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-medium mb-2">
                        Tỉnh thành <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedProvinceId}
                        onChange={handleProvinceChange}
                        disabled={isLoadingProvinces}
                        className="appearance-none block w-full px-3 py-3 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all disabled:opacity-50"
                      >
                        <option value="">
                          {isLoadingProvinces
                            ? "Đang tải..."
                            : "Chọn tỉnh thành"}
                        </option>
                        {provinces.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.full_name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    {selectedProvinceId && (
                      <div className="relative animate-in slide-in-from-top-2 duration-300">
                        <label className="block text-sm font-medium mb-2">
                          Phường/Xã
                        </label>
                        <select
                          value={selectedWardId}
                          onChange={handleWardChange}
                          disabled={isLoadingWards}
                          className="appearance-none block w-full px-3 py-3 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all disabled:opacity-50"
                        >
                          <option value="">
                            {isLoadingWards
                              ? "Đang tải..."
                              : "Chọn phường xã (tùy chọn)"}
                          </option>
                          {wards.map((w) => (
                            <option key={w.id} value={w.id}>
                              {w.full_name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Địa chỉ chi tiết (tùy chọn)
                    </label>
                    <Input
                      placeholder="Ví dụ: Sân cầu lông ABC, Số 123, đường DEF..."
                      value={additionalAddress}
                      onChange={(e) => setAdditionalAddress(e.target.value)}
                    />
                  </div>
                </>
              )}

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Địa chỉ đầy đủ
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Địa chỉ sẽ được tạo tự động..."
                        className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                        {...field}
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image Uploads */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <FormLabel>Ảnh banner</FormLabel>
                <div className="relative border-2 border-dashed rounded-md p-4 mt-2 text-center hover:border-green-500 transition">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleImageUpload(e, "banner")}
                  />
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500 mt-2">Nhấp để chọn ảnh</p>
                </div>
                {bannerPreview && (
                  <div className="mt-3 relative">
                    <Image
                      src={bannerPreview}
                      alt="banner"
                      className="rounded-md w-full h-48 object-cover"
                      width={600}
                      height={300}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setBannerPreview(null);
                        setBannerImage(null);
                        form.setValue("bannerUrl", "");
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="bannerUrl"
                  render={() => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormLabel>Logo giải đấu</FormLabel>
                <div className="relative border-2 border-dashed rounded-md p-4 mt-2 text-center hover:border-green-500 transition">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleImageUpload(e, "logo")}
                  />
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500 mt-2">
                    Nhấp để chọn logo
                  </p>
                </div>
                {logoPreview && (
                  <div className="mt-3 relative w-32 h-32">
                    <Image
                      src={logoPreview}
                      alt="logo"
                      className="rounded-full w-32 h-32 object-cover"
                      width={128}
                      height={128}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setLogoPreview(null);
                        setLogoImage(null);
                        form.setValue("logoUrl", "");
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={() => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Date Fields */}
            <div className="grid sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="registrationStartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Bắt đầu đăng ký <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registrationEndDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Kết thúc đăng ký <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ngày bắt đầu giải <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ngày kết thúc giải <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dynamic Categories */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel className="text-base font-medium">
                  Hạng mục thi đấu
                </FormLabel>
                <Button
                  type="button"
                  onClick={() =>
                    append({
                      categoryType: "MEN_SINGLE",
                      minLevel: 1,
                      maxLevel: 5,
                      maxParticipants: 16,
                      format: "LOAI_TRUC_TIEP",
                      registrationFee: 0,
                      description: "",
                      rules: "",
                      firstPrize: "",
                      secondPrize: "",
                      thirdPrize: "",
                      registrationDeadline: "",
                    })
                  }
                >
                  <Plus size={16} className="mr-1" /> Thêm hạng mục
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id} className="border-2 p-6 space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      Hạng mục {index + 1}
                    </h3>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash size={16} className="mr-1" /> Xóa
                    </Button>
                  </div>

                  {/* Basic Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Category Type */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Loại hạng mục <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register(
                          `categories.${index}.categoryType` as const
                        )}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500"
                      >
                        {BadmintonCategoryEnum.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {getCategoryLabel(opt)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Min Level */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Trình độ tối thiểu{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        step="0.5"
                        min={0}
                        max={5}
                        {...register(`categories.${index}.minLevel`, {
                          valueAsNumber: true,
                        })}
                      />
                    </div>

                    {/* Max Level */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Trình độ tối đa <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        step="0.5"
                        min={0}
                        max={5}
                        {...register(`categories.${index}.maxLevel`, {
                          valueAsNumber: true,
                        })}
                      />
                    </div>

                    {/* Max Participants */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Số người tham gia tối đa{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        {...register(`categories.${index}.maxParticipants`, {
                          valueAsNumber: true,
                        })}
                      />
                    </div>

                    {/* Registration Fee */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Lệ phí đăng ký (VNĐ)
                      </label>
                      <Input
                        type="number"
                        placeholder="0"
                        {...register(`categories.${index}.registrationFee`, {
                          valueAsNumber: true,
                        })}
                      />
                    </div>

                    {/* Registration Deadline */}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mô tả hạng mục
                    </label>
                    <FormField
                      control={form.control}
                      name={`categories.${index}.description`}
                      render={({ field }) => (
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      )}
                    />
                  </div>

                  {/* Rules */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Điều lệ hạng mục
                    </label>
                    <FormField
                      control={form.control}
                      name={`categories.${index}.rules`}
                      render={({ field }) => (
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      )}
                    />
                  </div>

                  {/* Prizes */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Giải nhất
                      </label>
                      <Input
                        placeholder="VD: Cúp vàng + 5.000.000 VNĐ"
                        {...register(`categories.${index}.firstPrize` as const)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Giải nhì
                      </label>
                      <Input
                        placeholder="VD: Cúp bạc + 3.000.000 VNĐ"
                        {...register(
                          `categories.${index}.secondPrize` as const
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Giải ba
                      </label>
                      <Input
                        placeholder="VD: Cúp đồng + 2.000.000 VNĐ"
                        {...register(`categories.${index}.thirdPrize` as const)}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full h-12 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
            >
              {form.formState.isSubmitting ? "Đang tạo..." : "Tạo Giải Đấu"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
