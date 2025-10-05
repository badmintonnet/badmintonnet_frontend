/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  ImageIcon,
  FileText,
  Save,
  X,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import {
  EventDetailResponseType,
  EventType,
} from "@/schemaValidations/event.schema";
import eventClubApiRequest from "@/apiRequest/club.event";
import addressApiRequest from "@/apiRequest/address";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Interfaces for address data
interface Province {
  id: string;
  full_name: string;
}

interface Ward {
  id: string;
  full_name: string;
}

// Types
type EventData = EventDetailResponseType["data"];
type Category =
  | "MEN_SINGLE"
  | "WOMEN_SINGLE"
  | "MEN_DOUBLE"
  | "WOMEN_DOUBLE"
  | "MIXED_DOUBLE";

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: EventData;
}

// Category options
const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: "MEN_SINGLE", label: "Đơn nam" },
  { value: "WOMEN_SINGLE", label: "Đơn nữ" },
  { value: "MEN_DOUBLE", label: "Đôi nam" },
  { value: "WOMEN_DOUBLE", label: "Đôi nữ" },
  { value: "MIXED_DOUBLE", label: "Đôi nam nữ" },
];

const STATUS_OPTIONS = [
  {
    value: "OPEN",
    label: "Mở đăng ký",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    value: "CLOSED",
    label: "Đã đóng",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    value: "ONGOING",
    label: "Đang diễn ra",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    value: "FINISHED",
    label: "Đã kết thúc",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    value: "CANCELLED",
    label: "Đã hủy",
    color: "bg-red-50 text-red-700 border-red-200",
  },
  {
    value: "DRAFT",
    label: "Chưa mở đăng ký",
    color: "bg-gray-50 text-gray-700 border-gray-200",
  },
];

export default function EditEventModal({
  isOpen,
  onClose,
  eventData,
}: EditEventModalProps) {
  const [formData, setFormData] = useState<EventData>(eventData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    eventData.image || ""
  );

  // Address related states
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedWardId, setSelectedWardId] = useState("");
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [isLoadingWards, setIsLoadingWards] = useState(false);
  const [additionalAddress, setAdditionalAddress] = useState("");

  const router = useRouter();

  // Parse existing location to extract address parts
  const parseExistingLocation = (location: string) => {
    if (!location) return { additional: "", province: "", ward: "" };

    // Simple parsing - this might need adjustment based on your location format
    const parts = location.split(", ");
    if (parts.length >= 2) {
      const province = parts[parts.length - 1]; // Last part is usually province
      const ward = parts.length >= 3 ? parts[parts.length - 2] : ""; // Second to last is ward
      const additional = parts.slice(0, -2).join(", "); // Everything else is additional

      return { additional, province, ward };
    }

    return { additional: location, province: "", ward: "" };
  };

  // Load provinces when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadProvinces = async () => {
        try {
          const response = await addressApiRequest.getProvinces();
          setProvinces(response.payload.data.data || []);

          // Parse existing location and find matching province
          const { additional, province } = parseExistingLocation(
            eventData.location
          );
          setAdditionalAddress(additional);

          // Find province by name
          const matchedProvince = (response.payload.data.data || []).find(
            (p: Province) => p.full_name === province
          );

          if (matchedProvince) {
            setSelectedProvinceId(matchedProvince.id);
          }
        } catch (error) {
          console.error("Error loading provinces:", error);
        } finally {
          setIsLoadingProvinces(false);
        }
      };

      loadProvinces();
    }
  }, [isOpen, eventData.location]);

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
        const wardList = response.payload.data.data || [];
        setWards(wardList);

        // Find matching ward from existing location
        const { ward } = parseExistingLocation(eventData.location);
        const matchedWard = wardList.find((w: Ward) => w.full_name === ward);

        if (matchedWard) {
          setSelectedWardId(matchedWard.id);
        } else {
          setSelectedWardId("");
        }
      } catch (error) {
        console.error("Error loading wards:", error);
        setWards([]);
      } finally {
        setIsLoadingWards(false);
      }
    };

    if (selectedProvinceId) {
      loadWards();
    }
  }, [selectedProvinceId, eventData.location]);

  // Update location field when address components change
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

      setFormData((prev) => ({ ...prev, location: fullLocation }));
    };

    if (provinces.length > 0) {
      updateLocation();
    }
  }, [selectedProvinceId, selectedWardId, additionalAddress, provinces, wards]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvinceId(e.target.value);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWardId(e.target.value);
  };

  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData(eventData);
      setImagePreview(eventData.image || "");
      setErrors({});
      setImageFile(null);
    } else {
      // Reset address states when modal closes
      setSelectedProvinceId("");
      setSelectedWardId("");
      setAdditionalAddress("");
      setProvinces([]);
      setWards([]);
      setIsLoadingProvinces(true);
    }
  }, [eventData, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Địa điểm là bắt buộc";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Thời gian bắt đầu là bắt buộc";
    }

    if (!formData.endTime) {
      newErrors.endTime = "Thời gian kết thúc là bắt buộc";
    }

    if (
      formData.startTime &&
      formData.endTime &&
      new Date(formData.startTime) >= new Date(formData.endTime)
    ) {
      newErrors.endTime = "Thời gian kết thúc phải sau thời gian bắt đầu";
    }

    if (
      formData.deadline &&
      formData.startTime &&
      new Date(formData.deadline) >= new Date(formData.startTime)
    ) {
      newErrors.deadline = "Hạn đăng ký phải trước thời gian bắt đầu";
    }

    if (formData.fee !== null && formData.fee < 0) {
      newErrors.fee = "Phí tham gia không được âm";
    }

    if (!formData.categories || formData.categories.length === 0) {
      newErrors.categories = "Phải chọn ít nhất một nội dung thi đấu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      let imageUrl = formData.image;
      let imageChanged = false;

      if (imageFile) {
        // Nếu có file mới, upload và lấy fileName
        const uploadForm = new FormData();
        uploadForm.append("files", imageFile);
        const uploadRes = await eventClubApiRequest.uploadImageClubEvent(
          uploadForm
        );
        if (uploadRes.status === 200) {
          imageUrl = uploadRes.payload.data.fileName;
          imageChanged = true;
        } else {
          throw new Error(uploadRes.payload?.message || "Upload ảnh thất bại");
        }
      } else if (imagePreview === "" && formData.image) {
        // Nếu đã xóa ảnh
        imageUrl = "";
        imageChanged = true;
      } else if (!imageFile && imagePreview === eventData.image) {
        // Không đổi ảnh
        imageUrl = null;
        imageChanged = true;
      }

      const res = await eventClubApiRequest.updateEventClub({
        ...formData,
        image: imageUrl,
      });
      if (res.status === 200) {
        toast.success("Cập nhật sự kiện thành công");
        onClose();
        router.refresh();
      } else {
        toast.error("Cập nhật sự kiện thất bại");
      }
    } catch (error: any) {
      toast.error(error?.payload?.message || "Cập nhật thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof EventData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const toggleCategory = (category: Category) => {
    setFormData((prev) => {
      const categories = prev.categories ?? [];
      return {
        ...prev,
        categories: categories.includes(category)
          ? categories.filter((c) => c !== category)
          : [...categories, category],
      };
    });

    if (errors.categories) {
      setErrors((prev) => ({ ...prev, categories: "" }));
    }
  };

  const formatDateTimeLocal = (value: Date | string) => {
    if (!value) return "";
    const date = typeof value === "string" ? new Date(value) : value;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Lưu: datetime-local string -> ISO string
  const parseLocalDateTime = (dateTimeLocal: string) => {
    if (!dateTimeLocal) return "";
    const date = new Date(dateTimeLocal);

    // Chỉnh offset cho đúng giờ địa phương (nếu cần)
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    const localDate = new Date(date.getTime() - offsetMs);

    // Trả về đúng định dạng ISO LocalDateTime Java hiểu
    return localDate.toISOString().slice(0, 19); // => "YYYY-MM-DDTHH:mm:ss"
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg sm:max-w-2xl lg:max-w-4xl max-h-[85vh] overflow-hidden rounded-lg p-4 sm:p-6">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
            <div className="w-2 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3 sm:mr-4"></div>
            Chỉnh sửa sự kiện
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            Cập nhật thông tin chi tiết về sự kiện của bạn
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="overflow-y-auto w-full max-h-[calc(85vh-180px)] px-2 sm:px-4">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Left Column */}
              <div className="space-y-5">
                {/* Title */}
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Tiêu đề sự kiện <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className={`${
                      errors.title ? "border-red-500" : ""
                    } h-10 sm:h-11 rounded-md`}
                    placeholder="Nhập tiêu đề sự kiện..."
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Mô tả sự kiện <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className={`${
                      errors.description ? "border-red-500" : ""
                    } min-h-28 sm:min-h-32 rounded-md resize-none`}
                    placeholder="Mô tả chi tiết về sự kiện..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <Label
                    htmlFor="requirements"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Yêu cầu tham gia
                  </Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) =>
                      handleInputChange("requirements", e.target.value)
                    }
                    className="min-h-20 sm:min-h-24 rounded-md resize-none"
                    placeholder="Các yêu cầu đối với người tham gia..."
                  />
                </div>

                {/* Enhanced Location Section with Province/Ward Selection */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Địa điểm <span className="text-red-500">*</span>
                    </span>
                  </div>

                  {/* Province and Ward Selection */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {/* Province Select */}
                    <div className="relative">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tỉnh thành
                      </label>
                      <select
                        value={selectedProvinceId}
                        onChange={handleProvinceChange}
                        disabled={isLoadingProvinces}
                        className="appearance-none block w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        <option value="">
                          {isLoadingProvinces
                            ? "Đang tải..."
                            : "Chọn tỉnh thành"}
                        </option>
                        {provinces.map((province) => (
                          <option key={province.id} value={province.id}>
                            {province.full_name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 top-6 pr-2 flex items-center pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Ward Select */}
                    {selectedProvinceId && (
                      <div className="relative animate-in slide-in-from-top-2 duration-300">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Phường/Xã
                        </label>
                        <select
                          value={selectedWardId}
                          onChange={handleWardChange}
                          disabled={isLoadingWards}
                          className="appearance-none block w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
                        <div className="absolute inset-y-0 right-0 top-6 pr-2 flex items-center pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Address Details */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Địa chỉ chi tiết (tùy chọn)
                    </label>
                    <Input
                      placeholder="Ví dụ: Sân cầu lông ABC, Số 123, đường DEF..."
                      value={additionalAddress}
                      onChange={(e) => setAdditionalAddress(e.target.value)}
                      className="h-10 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Final Location Display */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Địa chỉ đầy đủ
                    </label>
                    <Input
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      className={`${
                        errors.location ? "border-red-500" : ""
                      } h-10 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700`}
                      placeholder="Địa chỉ sẽ được tạo tự động từ lựa chọn trên"
                      readOnly={selectedProvinceId !== ""}
                    />
                    {errors.location && (
                      <p className="text-red-500 text-xs sm:text-sm flex items-center mt-1">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Ảnh sự kiện
                  </Label>
                  <div className="flex items-center justify-center">
                    {!imagePreview ? (
                      <label className="w-48 h-32 flex flex-col items-center justify-center border-2 border-dashed border-blue-500 rounded-md cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-200 hover:border-blue-600">
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
                      <div className="relative w-full h-32 rounded-md overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg group">
                        <Image
                          src={imagePreview}
                          alt="Event Preview"
                          fill
                          sizes="192px"
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
                                setImagePreview("");
                                setFormData((prev) => ({ ...prev, image: "" }));
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
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {/* Time Section */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="startTime"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Thời gian bắt đầu <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={formatDateTimeLocal(formData.startTime)}
                      onChange={(e) =>
                        handleInputChange(
                          "startTime",
                          parseLocalDateTime(e.target.value)
                        )
                      }
                      className={`${
                        errors.startTime ? "border-red-500" : ""
                      } h-10 sm:h-11 rounded-md`}
                    />
                    {errors.startTime && (
                      <p className="text-red-500 text-xs sm:text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.startTime}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="endTime"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Thời gian kết thúc <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      value={formatDateTimeLocal(formData.endTime)}
                      onChange={(e) =>
                        handleInputChange(
                          "endTime",
                          parseLocalDateTime(e.target.value)
                        )
                      }
                      className={`${
                        errors.endTime ? "border-red-500" : ""
                      } h-10 sm:h-11 rounded-md`}
                    />
                    {errors.endTime && (
                      <p className="text-red-500 text-xs sm:text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.endTime}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="deadline"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Hạn đăng ký
                    </Label>
                    <Input
                      id="deadline"
                      type="datetime-local"
                      value={formatDateTimeLocal(formData.deadline)}
                      onChange={(e) =>
                        handleInputChange(
                          "deadline",
                          parseLocalDateTime(e.target.value)
                        )
                      }
                      className={`${
                        errors.deadline ? "border-red-500" : ""
                      } h-10 sm:h-11 rounded-md`}
                    />
                    {errors.deadline && (
                      <p className="text-red-500 text-xs sm:text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.deadline}
                      </p>
                    )}
                  </div>
                </div>

                {/* Fee */}
                <div className="space-y-2">
                  <Label
                    htmlFor="fee"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Phí tham gia (VNĐ)
                  </Label>
                  <Input
                    id="fee"
                    type="number"
                    min="0"
                    value={formData.fee}
                    onChange={(e) =>
                      handleInputChange("fee", parseFloat(e.target.value) || 0)
                    }
                    className={`${
                      errors.fee ? "border-red-500" : ""
                    } h-10 sm:h-11 rounded-md`}
                    placeholder="0"
                  />
                  {errors.fee && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.fee}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Trạng thái sự kiện
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {STATUS_OPTIONS.map((status) => {
                      const colorPrefix =
                        status.color.match(/bg-(\w+)-50/)?.[1];
                      const hoverBgColor = colorPrefix
                        ? `hover:bg-${colorPrefix}-100`
                        : "hover:brightness-90";
                      return (
                        <Button
                          key={status.value}
                          type="button"
                          variant={
                            formData.status === status.value
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            handleInputChange("status", status.value)
                          }
                          className={`h-10 sm:h-11 justify-start text-xs sm:text-sm ${
                            formData.status === status.value
                              ? `${status.color} ${hoverBgColor}`
                              : "hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {status.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Open for Outside */}
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mở cho người ngoài
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Cho phép người không phải thành viên câu lạc bộ tham gia
                    </p>
                  </div>
                  <Switch
                    checked={formData.openForOutside}
                    onCheckedChange={(checked) =>
                      handleInputChange("openForOutside", checked)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Nội dung thi đấu <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {CATEGORY_OPTIONS.map((category) => (
                  <Button
                    key={category.value}
                    type="button"
                    variant={
                      formData.categories.includes(category.value)
                        ? "default"
                        : "outline"
                    }
                    onClick={() => toggleCategory(category.value)}
                    className={`h-10 sm:h-11 justify-center text-xs sm:text-sm ${
                      formData.categories.includes(category.value)
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    }`}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
              {errors.categories && (
                <p className="text-red-500 text-xs sm:text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.categories}
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-end gap-2 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-4 sm:px-6 h-10 sm:h-11"
            disabled={isLoading}
          >
            <X className="w-4 h-4 mr-2" />
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 sm:px-6 h-10 sm:h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
