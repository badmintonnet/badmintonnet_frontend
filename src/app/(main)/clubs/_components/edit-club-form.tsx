"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import clubServiceApi from "@/apiRequest/club";
import facilityServiceApi from "@/apiRequest/facility";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Upload,
  X,
  ImageIcon,
  Users,
  MapPin,
  TrendingUp,
  Eye,
  Lock,
  Loader2,
  CheckCircle2,
  Building2,
  Info,
  Hash,
} from "lucide-react";
import { ClubResType } from "@/schemaValidations/clubs.schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FacilityType } from "@/schemaValidations/event.schema";

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
  console.log("clubDetail", clubDetail);
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
    clubDetail.logoUrl || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [facilities, setFacilities] = useState<FacilityType[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  const [useCustomLocation, setUseCustomLocation] = useState(
    !clubDetail.facility && !!clubDetail.location
  );
  const [tagInput, setTagInput] = useState("");

  // Fetch facilities
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước file không được vượt quá 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file hình ảnh");
        return;
      }

      setLogoFile(file);

      // Tạo preview
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

    // Validation
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

      // Upload logo nếu có file mới được chọn
      if (logoFile) {
        setUploadProgress(30);

        // Tạo FormData để gửi file
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
        facilityId: useCustomLocation ? null : formData.facilityId || null,
        location: useCustomLocation ? formData.location : null,
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
    } catch (error: unknown) {
      toast.error("Đã xảy ra lỗi khi cập nhật câu lạc bộ");
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      {/* Logo Upload Section */}
      <Card className="w-full border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <Label className="text-base font-semibold">Logo câu lạc bộ</Label>
              <Badge variant="secondary" className="ml-auto">
                Tùy chọn
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {logoPreview ? (
                <div className="relative group">
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
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
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg transition-all hover:scale-110"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <Label
                      htmlFor="logo-upload"
                      className="cursor-pointer text-white font-medium"
                    >
                      Thay đổi
                    </Label>
                  </div>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}

              <div className="flex-1 space-y-3">
                <Label
                  htmlFor="logo-upload"
                  className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-500 dark:border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all font-medium"
                >
                  <Upload className="h-5 w-5" />
                  {logoFile ? "Thay đổi ảnh" : "Tải ảnh lên"}
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  PNG, JPG hoặc GIF (Tối đa 5MB)
                </p>
              </div>

              <Input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card className="w-full border-gray-200 dark:border-gray-700">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
          </div>

          {/* Tên CLB */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium flex items-center gap-2"
            >
              Tên câu lạc bộ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="VD: CLB Cầu lông Hà Nội"
              required
              className="h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500"
            />
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Mô tả câu lạc bộ
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Giới thiệu về câu lạc bộ của bạn..."
              rows={4}
              maxLength={500}
              className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formData.description.length}/500 ký tự
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Location Settings */}
      <Card className="w-full border-gray-200 dark:border-gray-700">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
            <h3 className="text-lg font-semibold">Địa điểm</h3>
          </div>

          {/* Facility or Custom Location */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                Chọn cơ sở
              </Label>
              <Select
                value={
                  useCustomLocation
                    ? "custom"
                    : formData.facilityId || "placeholder"
                }
                onValueChange={handleFacilityChange}
                disabled={loadingFacilities}
              >
                <SelectTrigger className="h-11 border-gray-300 dark:border-gray-600">
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
                        📍 Nhập địa điểm tùy chỉnh
                      </SelectItem>
                      {facilities.map((facility) => (
                        <SelectItem key={facility.id} value={facility.id}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            {facility.name}
                          </div>
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {useCustomLocation && (
              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4 text-green-600" />
                  Địa điểm tùy chỉnh <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM"
                  required={useCustomLocation}
                  className="h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500"
                />
              </div>
            )}

            {!useCustomLocation &&
              formData.facilityId &&
              formData.facilityId !== "placeholder" && (
                <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-sm text-blue-800 dark:text-blue-300">
                    Địa điểm sẽ được lấy từ cơ sở:{" "}
                    <strong>
                      {facilities.find((f) => f.id === formData.facilityId)
                        ?.location || ""}
                    </strong>
                  </AlertDescription>
                </Alert>
              )}
          </div>
        </CardContent>
      </Card>

      {/* Settings & Levels */}
      <Card className="w-full border-gray-200 dark:border-gray-700">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold">Cài đặt & Trình độ</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Số thành viên tối đa */}
            <div className="space-y-2">
              <Label
                htmlFor="maxMembers"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Users className="h-4 w-4 text-blue-600" />
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
                className="h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500"
              />
            </div>

            {/* Visibility */}
            <div className="space-y-2">
              <Label
                htmlFor="visibility"
                className="text-sm font-medium flex items-center gap-2"
              >
                {formData.visibility === "PUBLIC" ? (
                  <Eye className="h-4 w-4 text-green-600" />
                ) : (
                  <Lock className="h-4 w-4 text-orange-600" />
                )}
                Quyền riêng tư
              </Label>
              <select
                id="visibility"
                name="visibility"
                value={formData.visibility}
                onChange={(e: any) => handleInputChange(e)}
                className="w-full h-11 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="PUBLIC">🌐 Công khai</option>
                <option value="PRIVATE">🔒 Riêng tư</option>
              </select>
            </div>

            {/* Trình độ tối thiểu */}
            <div className="space-y-2">
              <Label
                htmlFor="minLevel"
                className="text-sm font-medium flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4 text-yellow-600" />
                Trình độ tối thiểu
              </Label>
              <Input
                id="minLevel"
                name="minLevel"
                type="number"
                step="0.5"
                min="0"
                max="10"
                value={formData.minLevel}
                onChange={handleInputChange}
                placeholder="0.0"
                className="h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Từ 0.0 đến 10.0
              </p>
            </div>

            {/* Trình độ tối đa */}
            <div className="space-y-2">
              <Label
                htmlFor="maxLevel"
                className="text-sm font-medium flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4 text-green-600" />
                Trình độ tối đa
              </Label>
              <Input
                id="maxLevel"
                name="maxLevel"
                type="number"
                step="0.5"
                min="0"
                max="10"
                value={formData.maxLevel}
                onChange={handleInputChange}
                placeholder="10.0"
                className="h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Từ 0.0 đến 10.0
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card className="w-full border-gray-200 dark:border-gray-700">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold">Thẻ (Tags)</h3>
            <Badge variant="secondary" className="ml-auto">
              Tùy chọn
            </Badge>
          </div>

          <div className="space-y-3">
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
                className="h-11 flex-1 border-gray-300 dark:border-gray-600"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                className="h-11 px-4"
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
                    className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50"
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
        </CardContent>
      </Card>

      {/* Progress Bar */}
      {isLoading && uploadProgress > 0 && (
        <Card className="w-full border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="pt-6">
            <div className="space-y-2">
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
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          className="h-11 px-6 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Hủy bỏ
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 px-8 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang cập nhật...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Cập nhật câu lạc bộ
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default EditClubForm;
