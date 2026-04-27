"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import clubServiceApi from "@/apiRequest/club";
import facilityServiceApi from "@/apiRequest/facility";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Loader2 } from "lucide-react";
import { ClubResType } from "@/schemaValidations/clubs.schema";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FacilityType } from "@/schemaValidations/event.schema";
import RichTextEditor from "@/components/text-editor";

interface EditClubFormProps {
  clubDetail: ClubResType["data"];
  token: string;
  onClose: () => void;
}

const EditClubForm: React.FC<EditClubFormProps> = ({
  clubDetail,
  token,
  onClose,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: clubDetail.name || "",
    description: clubDetail.description || "",
    location: clubDetail.location || "",
    facilityId: clubDetail.facility?.id || "",
    maxMembers: clubDetail.maxMembers || 0,
    minLevel: clubDetail.minLevel || 0,
    maxLevel: clubDetail.maxLevel || 0,
    visibility: clubDetail.visibility || "PUBLIC",
    tags: clubDetail.tags || [],
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    clubDetail.logoUrl || null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [facilities, setFacilities] = useState<FacilityType[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  const [useCustomLocation, setUseCustomLocation] = useState(
    !clubDetail.facility && !!clubDetail.location,
  );
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    const fetchFacilities = async () => {
      setLoadingFacilities(true);
      try {
        const response = await facilityServiceApi.getAllFacilitiesFilter();
        setFacilities(response.payload.data || []);
      } catch (error) {
        console.error("Error fetching facilities:", error);
        toast.error("Không thể tải danh sách cơ sở");
      } finally {
        setLoadingFacilities(false);
      }
    };

    fetchFacilities();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước file không được vượt quá 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file hình ảnh");
        return;
      }

      setLogoFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setLogoFile(null);
    setLogoPreview(clubDetail.logoUrl || null);
  };

  const handleFacilityChange = (value: string) => {
    if (value === "custom") {
      setUseCustomLocation(true);
      setFormData((prev) => ({ ...prev, facilityId: "" }));
    } else {
      setUseCustomLocation(false);
      setFormData((prev) => ({ ...prev, facilityId: value, location: "" }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Number(formData.minLevel) > Number(formData.maxLevel)) {
      toast.error("Trình độ tối thiểu không được lớn hơn trình độ tối đa");
      return;
    }

    if (Number(formData.maxMembers) < 1) {
      toast.error("Số thành viên tối đa phải lớn hơn 0");
      return;
    }

    if (!useCustomLocation && !formData.facilityId) {
      toast.error("Vui lòng chọn cơ sở hoặc nhập địa điểm tùy chỉnh");
      return;
    }

    if (useCustomLocation && !formData.location.trim()) {
      toast.error("Vui lòng nhập địa điểm tùy chỉnh");
      return;
    }

    setIsLoading(true);

    try {
      let logoUrl = null;

      if (logoFile) {
        setUploadProgress(30);

        const formDataUpload = new FormData();
        formDataUpload.append("file", logoFile);

        const uploadResponse = await clubServiceApi.uploadImage(formDataUpload);
        logoUrl = uploadResponse.payload.data.fileName;
        setUploadProgress(60);
      }

      const updatedClub = {
        ...formData,
        logoUrl: logoUrl || undefined,
        maxMembers: Number(formData.maxMembers),
        minLevel: Number(formData.minLevel),
        maxLevel: Number(formData.maxLevel),
        facilityId: useCustomLocation
          ? undefined
          : formData.facilityId || undefined,
        location: useCustomLocation ? formData.location : undefined,
      };

      setUploadProgress(80);
      await clubServiceApi.updateClub(clubDetail.id, updatedClub, token);
      setUploadProgress(100);

      toast.success("Cập nhật câu lạc bộ thành công!", {
        description: "Thông tin của câu lạc bộ đã được cập nhật.",
      });

      setTimeout(() => {
        onClose();
        router.refresh();
      }, 500);
    } catch {
      toast.error("Đã xảy ra lỗi khi cập nhật câu lạc bộ");
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 w-full max-w-3xl mx-auto"
    >
      {/* Logo Upload */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Logo câu lạc bộ
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Tùy chọn
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            {logoPreview ? (
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
                    fill
                    className="object-cover"
                  />
                </div>
                {logoFile && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                <span className="text-gray-400 text-xs">Logo</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <Label
              htmlFor="logo-upload"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              {logoFile ? "Thay đổi ảnh" : "Tải ảnh lên"}
            </Label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              PNG, JPG hoặc GIF (Tối đa 5MB)
            </p>
            <Input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Basic Info */}
      <div className="space-y-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Thông tin cơ bản
        </h3>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Tên câu lạc bộ <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="VD: CLB Cầu lông Hà Nội"
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Mô tả câu lạc bộ
          </Label>
          <RichTextEditor
            value={formData.description}
            onChange={(html: string) =>
              setFormData((prev) => ({ ...prev, description: html }))
            }
          />
        </div>
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Location */}
      <div className="space-y-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Địa điểm
        </h3>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Chọn cơ sở</Label>
          <Select
            value={
              useCustomLocation
                ? "custom"
                : formData.facilityId || "placeholder"
            }
            onValueChange={handleFacilityChange}
            disabled={loadingFacilities}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Chọn cơ sở hoặc nhập địa điểm tùy chỉnh" />
            </SelectTrigger>
            <SelectContent>
              {loadingFacilities ? (
                <SelectItem value="loading" disabled>
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tải...
                  </div>
                </SelectItem>
              ) : (
                <>
                  <SelectItem value="custom">
                    Nhập địa điểm tùy chỉnh
                  </SelectItem>
                  {facilities.map((facility) => (
                    <SelectItem key={facility.id} value={facility.id}>
                      {facility.name}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {useCustomLocation && (
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Địa điểm tùy chỉnh <span className="text-red-500">*</span>
            </Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM"
              required={useCustomLocation}
              className="h-11"
            />
          </div>
        )}

        {!useCustomLocation &&
          formData.facilityId &&
          formData.facilityId !== "placeholder" && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Địa điểm:{" "}
                <span className="font-medium">
                  {facilities.find((f) => f.id === formData.facilityId)
                    ?.location || ""}
                </span>
              </p>
            </div>
          )}
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Settings */}
      <div className="space-y-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Cài đặt
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <div className="space-y-2">
            <Label htmlFor="maxMembers" className="text-sm font-medium">
              Số thành viên tối đa <span className="text-red-500">*</span>
            </Label>
            <Input
              id="maxMembers"
              name="maxMembers"
              type="number"
              min="1"
              value={formData.maxMembers}
              onChange={handleInputChange}
              placeholder="VD: 50"
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility" className="text-sm font-medium">
              Quyền riêng tư
            </Label>
            <select
              id="visibility"
              name="visibility"
              value={formData.visibility}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) => handleInputChange(e)}
              className="w-full h-11 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="PUBLIC">Công khai</option>
              <option value="PRIVATE">Riêng tư</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minLevel" className="text-sm font-medium">
              Trình độ tối thiểu
            </Label>
            <Input
              id="minLevel"
              name="minLevel"
              type="number"
              step="0.5"
              min="0"
              max="5"
              value={formData.minLevel}
              onChange={handleInputChange}
              placeholder="0.0"
              className="h-11"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Từ 0.0 đến 5.0
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxLevel" className="text-sm font-medium">
              Trình độ tối đa
            </Label>
            <Input
              id="maxLevel"
              name="maxLevel"
              type="number"
              step="0.5"
              min="0"
              max="5"
              value={formData.maxLevel}
              onChange={handleInputChange}
              placeholder="10.0"
              className="h-11"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Từ 0.0 đến 5.0
            </p>
          </div>
        </div>
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Tags */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Thẻ (Tags)
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Tùy chọn
          </span>
        </div>

        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="Nhập thẻ (VD: Cầu lông, Sài Gòn, ...)"
            className="h-11 flex-1"
          />
          <Button
            type="button"
            onClick={handleAddTag}
            variant="outline"
            className="h-11 px-6"
          >
            Thêm
          </Button>
        </div>

        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-3 py-1.5 text-sm"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 hover:text-red-600 dark:hover:text-red-400"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Progress */}
      {isLoading && uploadProgress > 0 && (
        <div className="space-y-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-blue-700 dark:text-blue-300 font-medium">
              Đang cập nhật...
            </span>
            <span className="text-blue-600 dark:text-blue-400">
              {uploadProgress}%
            </span>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          className="h-11 px-6"
        >
          Hủy bỏ
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 px-8 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang cập nhật...
            </>
          ) : (
            "Cập nhật câu lạc bộ"
          )}
        </Button>
      </div>
    </form>
  );
};

export default EditClubForm;
