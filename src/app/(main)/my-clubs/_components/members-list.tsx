"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Users, Crown, CalendarDays, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MemberType } from "@/schemaValidations/clubs.schema";
import { Button } from "@/components/ui/button";
import MemberScheduleDialog from "@/app/(main)/my-clubs/_components/member-schedule";
import CreateClubWarningDialog from "@/app/(main)/my-clubs/_components/create-club-warning-dialog";
import CreateClubMemberNoteDialog from "@/app/(main)/my-clubs/_components/create-club-member-note-dialog";

export default function MembersList({
  members,
  id,
  isOwner = false,
}: {
  members: MemberType[];
  id: string;
  isOwner?: boolean;
}) {
  const [visibleCount, setVisibleCount] = useState(10);
  const MAX_MEMBERS = 100;

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 10, members.length));
  };

  const handleCollapse = () => {
    setVisibleCount(10);
  };

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <Users className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
          Chưa có thành viên
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Danh sách thành viên đã duyệt sẽ hiển thị tại đây
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto space-y-3">
        {members.slice(0, visibleCount).map((member, index) => (
          <div key={member.id} className="space-y-3">
            <div className="group relative p-4 dark:bg-gray-800 rounded-lg">
              {/* Row: left = avatar + info, right = activity count */}
              <div className="flex items-center gap-4 justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Image
                    src={member.avatar || "/user.png"}
                    alt={member.name}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full object-cover border-3 border-white dark:border-gray-700 shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link href={`/profile/${member.slug}`}>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg truncate">
                          {member.name}
                        </h4>
                      </Link>

                      {member.role === "OWNER" && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-500 rounded-full">
                          <Crown className="h-3 w-3 text-white" />
                          <span className="text-xs font-medium text-white">
                            Quản trị viên
                          </span>
                        </div>
                      )}

                      {/* Create warning dialog placed next to name (recommended) */}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                        Tham gia:{" "}
                        {new Date(member.joinedAt).toLocaleDateString("vi-VN")}
                      </span>
                      {member.role !== "OWNER" && (
                        <Badge variant="outline" className="text-xs">
                          Thành viên
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* activity count + schedule button (right-aligned) */}
                {member.role !== "OWNER" && isOwner && (
                  <div className="text-sm text-gray-600 dark:text-gray-300 text-right min-w-[130px] flex flex-col items-end gap-1">
                    <div className=" flex items-end ">
                      {/* actions: warning + schedule */}
                      <div className="flex items-center">
                        <MemberScheduleDialog id={id} memberId={member.id} />
                        <CreateClubWarningDialog
                          clubId={id}
                          memberId={member.id}
                        />
                        <CreateClubMemberNoteDialog
                          clubId={id}
                          memberId={member.id}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {member.joinedCount && member.joinedCount > 0
                        ? "Đã tham gia"
                        : "Chưa tham gia"}
                    </div>

                    <div className="mt-0 font-semibold text-gray-900 dark:text-white text-base">
                      {member.joinedCount ?? 0} hoạt động
                    </div>
                  </div>
                )}
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
              className="text-sm font-medium"
            >
              Hiển thị thêm
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCollapse}
              className="text-sm font-medium text-blue-500"
            >
              Thu gọn
            </Button>
          )}
        </div>
      )}
    </>
  );
}
