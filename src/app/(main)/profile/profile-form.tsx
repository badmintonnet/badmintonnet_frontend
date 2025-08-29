// components/profile/ProfileForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  MapPinIcon,
  DocumentTextIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

interface Profile {
  id: string;
  email: string;
  fullName: string;
  birthDate: string;
  gender: string;
  address: string;
  bio: string;
}

interface ProfileFormProps {
  profile: Profile;
  isEditing: boolean;
  onEditToggle: () => void;
}

export default function ProfileForm({ profile, isEditing, onEditToggle }: ProfileFormProps) {
  const [editForm, setEditForm] = useState<Partial<Profile>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof Profile, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        // Reload page để lấy dữ liệu mới
        window.location.reload();
      } else {
        throw new Error('Không thể cập nhật thông tin');
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật profile:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    if (!isEditing) {
      setEditForm({
        fullName: profile.fullName,
        birthDate: profile.birthDate,
        gender: profile.gender,
        address: profile.address,
        bio: profile.bio,
      });
    }
    onEditToggle();
  };

  return (
    <div className="lg:col-span-2">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
          Thông tin cá nhân
        </h3>

        <div className="space-y-6">
          {/* Họ tên */}
          <div className="flex items-start space-x-4">
            <UserCircleIcon className="h-6 w-6 text-gray-400 mt-1" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Họ và tên
              </label>
              {isEditing ? (
                <Input
                  value={editForm.fullName || ""}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="w-full"
                  placeholder="Nhập họ và tên"
                />
              ) : (
                <p className="text-lg text-gray-900 dark:text-white">{profile.fullName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start space-x-4">
            <EnvelopeIcon className="h-6 w-6 text-gray-400 mt-1" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <p className="text-lg text-gray-500 dark:text-gray-400">{profile.email}</p>
              <p className="text-xs text-gray-400 mt-1">Email không thể thay đổi</p>
            </div>
          </div>

          {/* Ngày sinh */}
          <div className="flex items-start space-x-4">
            <CalendarDaysIcon className="h-6 w-6 text-gray-400 mt-1" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ngày sinh
              </label>
              {isEditing ? (
                <Input
                  type="date"
                  value={editForm.birthDate || ""}
                  onChange={(e) => handleInputChange("birthDate", e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-lg text-gray-900 dark:text-white">
                  {new Date(profile.birthDate).toLocaleDateString("vi-VN")}
                </p>
              )}
            </div>
          </div>

          {/* Giới tính */}
          <div className="flex items-start space-x-4">
            <UserCircleIcon className="h-6 w-6 text-gray-400 mt-1" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Giới tính
              </label>
              {isEditing ? (
                <select
                  value={editForm.gender || ""}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              ) : (
                <p className="text-lg text-gray-900 dark:text-white">{profile.gender}</p>
              )}
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="flex items-start space-x-4">
            <MapPinIcon className="h-6 w-6 text-gray-400 mt-1" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Địa chỉ
              </label>
              {isEditing ? (
                <Input
                  value={editForm.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full"
                  placeholder="Nhập địa chỉ"
                />
              ) : (
                <p className="text-lg text-gray-900 dark:text-white">{profile.address}</p>
              )}
            </div>
          </div>

          {/* Tiểu sử */}
          <div className="flex items-start space-x-4">
            <DocumentTextIcon className="h-6 w-6 text-gray-400 mt-1" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Giới thiệu bản thân
              </label>
              {isEditing ? (
                <Textarea
                  value={editForm.bio || ""}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="w-full"
                  rows={4}
                  placeholder="Viết vài dòng giới thiệu về bản thân..."
                />
              ) : (
                <p className="text-lg text-gray-900 dark:text-white leading-relaxed">
                  {profile.bio || "Chưa có thông tin giới thiệu"}
                </p>
              )}
            </div>
          </div>

          {/* Nút lưu khi đang chỉnh sửa */}
          {isEditing && (
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={handleEdit}
                className="px-6"
                disabled={isSaving}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                className="px-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                ) : (
                  <CheckIcon className="h-4 w-4 mr-2" />
                )}
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}