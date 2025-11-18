"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  PencilIcon,
  XMarkIcon,
  EnvelopeIcon,
  EllipsisVerticalIcon,
  UserMinusIcon,
  ShieldExclamationIcon,
  UserPlusIcon,
  CheckIcon,
  ClockIcon,
  CameraIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { AccountResType } from "@/schemaValidations/account.schema";
import friendApiRequest from "@/apiRequest/friend";
import { FriendShipSchemaType } from "@/schemaValidations/friend.schema";
import { clientSessionToken } from "@/lib/http";
import ReputationHistoryDialog from "@/app/(main)/profile/_components/view-reputation-history";
import ScheduleDialog from "@/app/(main)/profile/_components/view-schedule";
import ProtectProfileButton from "@/app/(main)/profile/_components/protect-profile-button";

type Profile = AccountResType["data"];

interface ProfileHeaderProps {
  profile: Profile;
  onEditToggle: () => void;
  isEditing: boolean;
  canEdit: boolean;
  relationship?: FriendShipSchemaType | null;
  currentUserId?: string;
}

export default function ProfileHeader({
  profile,
  onEditToggle,
  isEditing,
  canEdit = true,
  relationship,
  currentUserId,
}: ProfileHeaderProps) {
  const router = useRouter();
  const accessToken = clientSessionToken.value;

  const isMe = canEdit;
  const isRequester =
    relationship && currentUserId
      ? relationship.requester.id === currentUserId
      : false;
  const isFriend = relationship?.status === "ACCEPTED";
  const isPending = relationship?.status === "PENDING";

  const handleSendRequest = async () => {
    if (!accessToken) {
      toast.error("Vui lòng đăng nhập để kết bạn.");
      return;
    }
    try {
      const res = await friendApiRequest.sendFriendRequest(
        { receiverId: profile.id },
        accessToken
      );
      if (res.status === 200 || res.status === 201) {
        toast.success("Đã gửi lời mời kết bạn");
        router.refresh();
      } else {
        toast.error("Gửi lời mời thất bại");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  };

  const handleAccept = async () => {
    if (!accessToken || !relationship) return;
    try {
      const requesterId = relationship.requester.id;
      const res = await friendApiRequest.acceptFriendRequest(
        requesterId,
        accessToken
      );
      if (res.status === 200) {
        toast.success("Đã chấp nhận kết bạn");
        router.refresh();
      } else {
        toast.error("Chấp nhận thất bại");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  };

  const handleReject = async () => {
    if (!accessToken || !relationship) return;
    try {
      const requesterId = relationship.requester.id;
      const res = await friendApiRequest.rejectFriendRequest(
        requesterId,
        accessToken
      );
      if (res.status === 200) {
        toast.success("Đã từ chối lời mời");
        router.refresh();
      } else {
        toast.error("Từ chối thất bại");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  };

  const handleUnfriend = async () => {
    if (!accessToken || !relationship) return;
    try {
      console.log("Hủy kết bạn với:", profile.id);
      await friendApiRequest.unfriend(profile.id);
      toast.success("Đã hủy kết bạn");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Cover Photo */}
      <div className="relative h-72 sm:h-80 bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <Image
          src={"/cover.jpg"}
          alt="Cover photo"
          fill
          className="object-cover"
          priority
        />

        {/* Cover Photo Edit Button (for own profile) */}
        {isMe && (
          <div className="absolute bottom-4 right-4">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-gray-900 shadow-sm backdrop-blur-sm"
            >
              <CameraIcon className="h-4 w-4 mr-2" />
              Chỉnh sửa ảnh bìa
            </Button>
          </div>
        )}
      </div>

      {/* Profile Info Container */}
      <div className="relative px-6 pb-6">
        {/* Avatar positioned over cover */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-5 relative z-10">
          {/* Left side - Avatar and Name */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6">
            {/* Avatar */}
            <div className="relative mb-4 sm:mb-0">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-900 shadow-lg bg-white dark:bg-gray-900">
                <Image
                  src={profile.avatarUrl || "/user.png"}
                  alt={profile.fullName}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>

              {/* Avatar Edit Button (for own profile) */}
              {isMe && (
                <div className="absolute bottom-2 right-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <CameraIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Name and Info */}
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {profile.fullName}
              </h1>

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                <EnvelopeIcon className="h-4 w-4" />
                <span className="text-sm">{profile.email}</span>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {profile.reputationScore ?? 0}
                  </span>
                  <span>điểm uy tín</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {profile.totalParticipatedEvents ?? 0}
                  </span>
                  <span>sự kiện tham gia</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Action Buttons */}
          <div className="flex gap-2 mt-4 sm:mt-0 sm:pb-2">
            {isMe ? (
              // Own Profile Actions
              <>
                <Button
                  onClick={onEditToggle}
                  variant={isEditing ? "outline" : "default"}
                  className={
                    isEditing
                      ? "flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                      : "flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                  }
                >
                  {isEditing ? (
                    <>
                      <XMarkIcon className="h-4 w-4" />
                      Hủy
                    </>
                  ) : (
                    <>
                      <PencilIcon className="h-4 w-4" />
                      Chỉnh sửa trang cá nhân
                    </>
                  )}
                </Button>
                <ReputationHistoryDialog />
                <ScheduleDialog />
                <ProtectProfileButton defaultValue={profile.profileProtected} />
              </>
            ) : (
              // Other User Actions
              <>
                {/* Pending Request - Received */}
                {isPending && !isRequester && (
                  <>
                    <Button
                      onClick={handleAccept}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                    >
                      <CheckIcon className="h-4 w-4" />
                      Chấp nhận
                    </Button>
                    <Button
                      onClick={handleReject}
                      variant="outline"
                      className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Từ chối
                    </Button>
                  </>
                )}

                {/* Already Friends */}
                {isFriend && (
                  <>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/20"
                    >
                      <UsersIcon className="h-4 w-4" />
                      Bạn bè
                    </Button>
                    <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                      Nhắn tin
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          <EllipsisVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={handleUnfriend}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <UserMinusIcon className="h-4 w-4 mr-2" />
                          Hủy kết bạn
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}

                {/* No Relationship or Rejected */}
                {!isFriend && !isPending && (
                  <>
                    <Button
                      onClick={handleSendRequest}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                    >
                      <UserPlusIcon className="h-4 w-4" />
                      Thêm bạn bè
                    </Button>
                    <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                      Nhắn tin
                    </Button>
                  </>
                )}

                {/* Pending Request - Sent */}
                {isPending && isRequester && (
                  <>
                    <Button
                      disabled
                      variant="outline"
                      className="flex items-center gap-2 border-blue-200 text-blue-600 cursor-not-allowed bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:bg-blue-900/20"
                    >
                      <ClockIcon className="h-4 w-4" />
                      Đã gửi lời mời
                    </Button>
                    <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                      Nhắn tin
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
