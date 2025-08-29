"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  PencilIcon,
  CameraIcon,
  XMarkIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

interface ProfileHeaderProps {
  profile: {
    fullName: string;
    email: string;
    rank: string;
    avatarUrl: string;
  };
  onEditToggle: () => void;
  isEditing: boolean;
}

export default function ProfileHeader({ profile, onEditToggle, isEditing }: ProfileHeaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const { avatarUrl } = await response.json();
        // Reload page hoặc update state parent component
        window.location.reload();
      }
    } catch (error) {
      console.error("Lỗi khi upload avatar:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 mb-8 text-white">
      <div className="absolute inset-0 bg-black opacity-20 rounded-2xl"></div>
      <div className="relative flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
        {/* Avatar */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
            <Image
              src={profile.avatarUrl}
              alt="Avatar"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute bottom-2 right-2 bg-white text-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          >
            {isUploading ? (
              <div className="animate-spin w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full"></div>
            ) : (
              <CameraIcon className="h-4 w-4" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>

        {/* Thông tin cơ bản */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{profile.fullName}</h1>
              <p className="text-green-200 text-lg mb-1">{profile.rank}</p>
              <p className="text-white/80 flex items-center justify-center sm:justify-start">
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                {profile.email}
              </p>
            </div>
            <Button
              onClick={onEditToggle}
              variant={isEditing ? "secondary" : "outline"}
              className="mt-4 sm:mt-0 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {isEditing ? (
                <>
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Hủy
                </>
              ) : (
                <>
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}