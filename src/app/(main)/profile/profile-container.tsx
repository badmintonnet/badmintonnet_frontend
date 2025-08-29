// components/profile/ProfileContainer.tsx
"use client";

import ProfileForm from "@/app/(main)/profile/profile-form";
import ProfileHeader from "@/app/(main)/profile/profile-header";
import { useState } from "react";


interface Profile {
  id: string;
  email: string;
  fullName: string;
  birthDate: string;
  gender: string;
  address: string;
  bio: string;
  avatarUrl: string;
  rating: number;
  rank: string;
  totalMatches: number;
  winRate: number;
  joinDate: string;
}

interface ProfileContainerProps {
  profile: Profile;
  showHeaderOnly?: boolean;
  showFormOnly?: boolean;
}

export default function ProfileContainer({ 
  profile, 
}: ProfileContainerProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div>
      <ProfileHeader 
        profile={profile} 
        onEditToggle={handleEditToggle}
        isEditing={isEditing}
      />
      
      <div className="mt-8">
        <ProfileForm 
          profile={profile}
          isEditing={isEditing}
          onEditToggle={handleEditToggle}
        />
      </div>
    </div>
  );
}