"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import clubServiceApi from "@/apiRequest/club";
import { MemberType } from "@/schemaValidations/clubs.schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MemberSkeleton } from "./member-shared";
import { Check, X, UserPlus, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

export default function PendingMembers({
  id,
  accessToken,
  isOwner = false,
}: {
  id: string;
  accessToken: string;
  isOwner?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const [pendingMembers, setPendingMembers] = useState<MemberType[]>([]);
  const [pagePending, setPagePending] = useState(0);
  const [totalPagesPending, setTotalPagesPending] = useState(0);
  const [loadingPending, setLoadingPending] = useState(true);
  const [processingMembers, setProcessingMembers] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (!isOwner) return;
    const fetchPending = async () => {
      try {
        setLoadingPending(true);
        const res = await clubServiceApi.getClubMembers(
          id,
          pagePending,
          10,
          accessToken,
          "PENDING"
        );
        const pageData = res?.payload?.data;
        setPendingMembers(pageData?.content || []);
        setTotalPagesPending(pageData?.totalPages || 0);
      } catch (error) {
        console.error("Error fetching pending members:", error);
      } finally {
        setLoadingPending(false);
      }
    };
    fetchPending();
  }, [id, accessToken, pagePending, isOwner]);

  const handleUpdateStatus = async (
    memberId: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      setProcessingMembers((prev) => new Set(prev).add(memberId));

      if (status === "APPROVED") {
        const member = pendingMembers.find((m) => m.id === memberId);
        try {
          await clubServiceApi.postApproveMember(
            id,
            memberId,
            true,
            accessToken
          );
          toast.success("Đã duyệt thành viên.");
          router.refresh();
        } catch (error) {
          toast.error("Duyệt thành viên thất bại. Vui lòng thử lại.");
          console.error("Error approving member:", error);
          return;
        }

        if (member) {
          setPendingMembers((prev) => prev.filter((m) => m.id !== memberId));
        }
        router.refresh();
      } else {
        try {
          await clubServiceApi.postApproveMember(
            id,
            memberId,
            false,
            accessToken
          );
          toast.success("Đã từ chối thành viên.");
        } catch (error) {
          toast.error("Từ chối thành viên thất bại. Vui lòng thử lại.");
          console.error("Error rejecting member:", error);
          return;
        }
        setPendingMembers((prev) => prev.filter((m) => m.id !== memberId));
      }
    } finally {
      setProcessingMembers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(memberId);
        return newSet;
      });
    }
  };

  if (!isOwner) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserPlus className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-bold">
              Chờ duyệt ({pendingMembers.length})
            </h3>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronDown /> : <ChevronUp />}
          </Button>
        </div>
      </CardHeader>
      {!collapsed && (
        <CardContent>
          {loadingPending ? (
            <MemberSkeleton />
          ) : pendingMembers.length > 0 ? (
            pendingMembers.map((member) => (
              <div
                key={member.id}
                className="p-4 border rounded-lg mb-3 bg-white dark:bg-gray-900"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src={member.avatar || "/user.png"}
                    alt={member.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-xs text-gray-500">
                      Ngày tham gia:{" "}
                      {new Date(member.joinedAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    size="sm"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700"
                    disabled={processingMembers.has(member.id)}
                    onClick={() => handleUpdateStatus(member.id, "APPROVED")}
                  >
                    <Check className="h-4 w-4 mr-1" /> Duyệt
                  </Button>

                  <Button
                    size="sm"
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700"
                    disabled={processingMembers.has(member.id)}
                    onClick={() => handleUpdateStatus(member.id, "REJECTED")}
                  >
                    <X className="h-4 w-4 mr-1" /> Từ chối
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Không có thành viên chờ duyệt
            </p>
          )}

          {totalPagesPending > 1 && (
            <div className="flex justify-center mt-3 gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={pagePending === 0}
                onClick={() => setPagePending((p) => p - 1)}
              >
                Trước
              </Button>
              <span className="text-sm">
                Trang {pagePending + 1}/{totalPagesPending}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={pagePending + 1 >= totalPagesPending}
                onClick={() => setPagePending((p) => p + 1)}
              >
                Sau
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
