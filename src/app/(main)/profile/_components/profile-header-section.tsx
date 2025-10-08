"use client";

import { useState } from "react";
import ProfileHeader from "@/app/(main)/profile/_components/profile-header";
import ProfileEditModal from "@/app/(main)/profile/_components/profile-edit-modal";
import { AccountResType } from "@/schemaValidations/account.schema";
import { FriendShipSchemaType } from "@/schemaValidations/friend.schema";
import ScheduleDialog from "@/app/(main)/profile/_components/view-schedule";

type Profile = AccountResType["data"];

export default function ProfileHeaderSection({
  profile,
  canEdit = true,
  relationship,
  currentUserId,
}: {
  profile: Profile;
  canEdit?: boolean;
  relationship?: FriendShipSchemaType | null;
  currentUserId?: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditToggle = () => setIsModalOpen((v) => !v);
  const handleModalClose = () => setIsModalOpen(false);

  return (
    <>
      <ProfileHeader
        profile={profile}
        onEditToggle={handleEditToggle}
        isEditing={isModalOpen}
        canEdit={canEdit}
        relationship={relationship}
        currentUserId={currentUserId}
      />

      {canEdit && (
        <>
          <ProfileEditModal
            profile={profile}
            isOpen={isModalOpen}
            onClose={handleModalClose}
          />
        </>
      )}
    </>
  );
}
