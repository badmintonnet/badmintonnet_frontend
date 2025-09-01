"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import clubServiceApi from "@/apiRequest/club";
import { MemberType } from "@/schemaValidations/clubs.schema";
import { Avatar, MemberSkeleton } from "./member-shared";
import { Users, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="h-5 w-5" />
            Danh sách thành viên
          </h3>
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
          >
            {approvedMembers.length ? approvedMembers.length : 0} thành viên
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {loadingApproved ? (
            <MemberSkeleton />
          ) : approvedMembers.length > 0 ? (
            approvedMembers.map((member) => (
              <div
                key={member.id}
                className="p-4 border w-full rounded-lg mb-3 bg-white dark:bg-gray-900 flex items-center gap-3"
              >
                <Avatar name={member.name} className="h-10 w-10" />
                <div className="flex-1">
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-gray-500">
                    Ngày tham gia:{" "}
                    {new Date(member.joinedAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                {member.role === "OWNER" && (
                  <Crown className="h-5 w-5 text-yellow-500" />
                )}
              </div>
            ))
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-gray-500">
                Không có thành viên đã duyệt
              </p>
            </div>
          )}
        </div>
        {totalPagesApproved > 1 && (
          <div className="flex justify-center mt-3 gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={pageApproved === 0}
              onClick={() => setPageApproved((p) => p - 1)}
            >
              Trước
            </Button>
            <span className="text-sm">
              Trang {pageApproved + 1}/{totalPagesApproved}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={pageApproved + 1 >= totalPagesApproved}
              onClick={() => setPageApproved((p) => p + 1)}
            >
              Sau
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
