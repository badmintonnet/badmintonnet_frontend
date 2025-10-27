"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GuestType } from "@/schemaValidations/clubs.schema";
import { Button } from "@/components/ui/button";
import ClubInvitationDialog from "./create-club-invitation"; // import dialog

export default function GuestList({
  members,
  clubId,
}: {
  members: GuestType[];
  clubId: string;
}) {
  const [visibleCount, setVisibleCount] = useState(10);

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 10, members.length));
  };

  const handleCollapse = () => {
    setVisibleCount(10);
  };

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="p-4 rounded-full bg-blue-50 dark:bg-gray-800 mb-4">
          <Users className="h-8 w-8 text-blue-400" />
        </div>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
          Chưa có thành viên
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Danh sách thành viên đã duyệt sẽ hiển thị tại đây
        </p>
      </div>
    );
  }

  // Hàm hiển thị badge trạng thái lời mời
  const renderStatusBadge = (status: string | null) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-blue-500 text-white shadow-sm">Đang chờ</Badge>
        );
      case "ACCEPTED":
        return (
          <Badge className="bg-green-500 text-white shadow-sm">
            Đã chấp nhận
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-500 text-white shadow-sm">Từ chối</Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-gray-400 text-white shadow-sm">Đã hủy</Badge>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto space-y-3">
        {members.slice(0, visibleCount).map((member, index) => (
          <div key={member.id} className="space-y-3">
            <div className="group relative p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <Image
                  src={member.avatar || "/user.png"}
                  alt={member.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover border-2 border-blue-100 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${member.slug}`}>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg truncate hover:text-blue-600 transition">
                      {member.name}
                    </h4>
                  </Link>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Đã tham gia:{" "}
                    <span className="text-blue-500 font-medium">
                      {member.joinedCount || 0}
                    </span>{" "}
                    hoạt động
                  </div>
                </div>

                {/* Invitation actions */}
                <div className="flex-shrink-0">
                  {member.invitationStatus === null ? (
                    <ClubInvitationDialog
                      initialValues={{ receiverId: member.id, clubId }}
                    />
                  ) : (
                    renderStatusBadge(member.invitationStatus)
                  )}
                </div>
              </div>
            </div>

            {index < visibleCount - 1 && (
              <hr className="border-t border-gray-200 dark:border-gray-700" />
            )}
          </div>
        ))}
      </div>

      {members.length > 10 && (
        <div className="flex justify-center mt-4">
          {visibleCount < members.length ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleShowMore}
              className="text-sm font-medium border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              Hiển thị thêm
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCollapse}
              className="text-sm font-medium text-green-600 hover:bg-green-50"
            >
              Thu gọn
            </Button>
          )}
        </div>
      )}
    </>
  );
}
