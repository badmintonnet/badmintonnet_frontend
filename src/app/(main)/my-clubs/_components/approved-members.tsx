"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import clubServiceApi from "@/apiRequest/club";
import { MemberType } from "@/schemaValidations/clubs.schema";
import { MemberSkeleton } from "./member-shared";
import { Users, Crown, MoreHorizontal, User, Ban, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export default function ApprovedMembers({
  id,
  accessToken,
}: {
  id: string;
  accessToken: string;
}) {
  const [approvedMembers, setApprovedMembers] = useState<MemberType[]>([]);
  const [pageApproved, setPageApproved] = useState(0);
  const [totalPagesApproved, setTotalPagesApproved] = useState(0);
  const [loadingApproved, setLoadingApproved] = useState(true);

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        setLoadingApproved(true);
        const res = await clubServiceApi.getClubMembers(
          id,
          pageApproved,
          10,
          accessToken,
          "APPROVED"
        );
        const pageData = res?.payload?.data;
        setApprovedMembers(pageData?.content || []);
        setTotalPagesApproved(pageData?.totalPages || 0);
      } catch (error) {
        console.error("Error fetching approved members:", error);
      } finally {
        setLoadingApproved(false);
      }
    };
    fetchApproved();
  }, [id, accessToken, pageApproved]);

  const handleViewProfile = (memberId: string) => {
    console.log("View profile for member:", memberId);
  };

  const handleRemoveFromGroup = (memberId: string, memberName: string) => {
    console.log("Remove from group:", memberId, memberName);
  };

  const handleBanMember = (memberId: string, memberName: string) => {
    console.log("Ban member:", memberId, memberName);
  };

  return (
    <Card className="h-full gap-0 flex flex-col shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Danh sách thành viên
            </h3>
          </div>
          <Badge
            variant="secondary"
            className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-md"
          >
            {approvedMembers.length} thành viên
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col overflow-hidden px-6">
        <div className="flex-1 overflow-y-auto space-y-3">
          {loadingApproved ? (
            <MemberSkeleton />
          ) : approvedMembers.length > 0 ? (
            approvedMembers.map((member, index) => (
              <div key={member.id} className="space-y-3">
                <div
                  key={member.id}
                  className={`group relative p-4 dark:bg-gray-800`}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar with online indicator */}
                    <div className="relative">
                      <Image
                        src={member.avatar || "/user.png"}
                        alt={member.name}
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-full object-cover border-3 border-white dark:border-gray-700 shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    </div>

                    {/* Member Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg truncate">
                          {member.name}
                        </h4>
                        {member.role === "OWNER" && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-blue-500 rounded-full">
                            <Crown className="h-3 w-3 text-white" />
                            <span className="text-xs font-medium text-white">
                              Quản trị viên
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                          Tham gia:{" "}
                          {new Date(member.joinedAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                        {member.role !== "OWNER" && (
                          <Badge variant="outline" className="text-xs">
                            Thành viên
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action Dropdown */}
                    {member.role !== "OWNER" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => handleViewProfile(member.id)}
                            className="cursor-pointer"
                          >
                            <User className="h-4 w-4 mr-2" />
                            Xem trang cá nhân
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleRemoveFromGroup(member.id, member.name)
                            }
                            className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa khỏi nhóm
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleBanMember(member.id, member.name)
                            }
                            className="cursor-pointer text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Banned
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
                {index < approvedMembers.length - 1 && (
                  <hr className="border-t border-gray-200 dark:border-gray-700" />
                )}
              </div>
            ))
          ) : (
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
          )}
        </div>

        {/* Pagination */}
        {totalPagesApproved > 1 && (
          <div className="flex items-center justify-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={pageApproved === 0}
                onClick={() => setPageApproved((p) => p - 1)}
                className="hover:bg-blue-50 hover:border-blue-300"
              >
                ← Trước
              </Button>
              <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {pageApproved + 1}
                </span>
                <span className="text-sm text-gray-500">/</span>
                <span className="text-sm text-gray-500">
                  {totalPagesApproved}
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={pageApproved + 1 >= totalPagesApproved}
                onClick={() => setPageApproved((p) => p + 1)}
                className="hover:bg-blue-50 hover:border-blue-300"
              >
                Sau →
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
