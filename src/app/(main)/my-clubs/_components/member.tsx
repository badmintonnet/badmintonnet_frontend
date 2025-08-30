"use client";

import React, { useEffect, useState } from "react";
import {
  Check,
  X,
  UserPlus,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Crown,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import clubServiceApi from "@/apiRequest/club";
import { MemberType } from "@/schemaValidations/clubs.schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// Avatar component
const Avatar = ({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) => (
  <div
    className={`relative flex shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-green-500 ${className}`}
  >
    <div className="flex h-full w-full items-center justify-center text-white font-semibold text-sm">
      {name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  </div>
);

// Loading skeleton
const MemberSkeleton = () => (
  <div className="animate-pulse p-4 border rounded-lg mb-3 bg-gray-100 dark:bg-gray-800">
    <div className="flex items-center gap-3 mb-3">
      <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
    <div className="flex gap-3">
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded flex-1"></div>
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded flex-1"></div>
    </div>
  </div>
);

export default function ClubMembers({
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
  // State pending
  const [pendingMembers, setPendingMembers] = useState<MemberType[]>([]);
  const [pagePending, setPagePending] = useState(0);
  const [totalPagesPending, setTotalPagesPending] = useState(0);
  const [loadingPending, setLoadingPending] = useState(true);

  // State approved
  const [approvedMembers, setApprovedMembers] = useState<MemberType[]>([]);
  const [pageApproved, setPageApproved] = useState(0);
  const [totalPagesApproved, setTotalPagesApproved] = useState(0);
  const [loadingApproved, setLoadingApproved] = useState(true);

  const [processingMembers, setProcessingMembers] = useState<Set<string>>(
    new Set()
  );

  // Fetch pending
  useEffect(() => {
    const fetchPending = async () => {
      try {
        setLoadingPending(true);
        const res = await clubServiceApi.getClubMembers(
          id,
          pagePending,
          10, // pageSize
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
  }, [id, accessToken, pagePending]);

  // Fetch approved
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

  // Update status
  const handleUpdateStatus = async (
    memberId: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      setProcessingMembers((prev) => new Set(prev).add(memberId));

      // TODO: gọi API update status
      // await clubServiceApi.updateMemberStatus(id, memberId, status, accessToken);

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
        } catch (error) {
          toast.error("Duyệt thành viên thất bại. Vui lòng thử lại.");
          console.error("Error approving member:", error);
          return;
        }

        if (member) {
          setPendingMembers((prev) => prev.filter((m) => m.id !== memberId));
          setApprovedMembers((prev) => [...prev, { ...member, status }]);
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

  return (
    <div className="space-y-6">
      {/* Pending */}
      {isOwner && (
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
                    {/* Thông tin */}
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar name={member.name} className="h-12 w-12" />
                      <div>
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-xs text-gray-500">
                          Ngày tham gia:{" "}
                          {new Date(member.joinedAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Nút hành động */}
                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700"
                        disabled={processingMembers.has(member.id)}
                        onClick={() =>
                          handleUpdateStatus(member.id, "APPROVED")
                        }
                      >
                        <Check className="h-4 w-4 mr-1" /> Duyệt
                      </Button>

                      <Button
                        size="sm"
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700"
                        disabled={processingMembers.has(member.id)}
                        onClick={() =>
                          handleUpdateStatus(member.id, "REJECTED")
                        }
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

              {/* Pagination Pending */}
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
      )}

      {/* Approved */}
      <Card>
        <CardHeader className="flex gap-2 items-center">
          <UserCheck className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-bold">Thành viên:</h3>
        </CardHeader>
        <CardContent>
          {loadingApproved ? (
            <MemberSkeleton />
          ) : approvedMembers.length > 0 ? (
            approvedMembers.map((member) => (
              <div
                key={member.id}
                className="p-4 border rounded-lg mb-3 bg-white dark:bg-gray-900 flex items-center gap-3"
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
            <p className="text-sm text-gray-500 text-center py-4">
              Không có thành viên đã duyệt
            </p>
          )}

          {/* Pagination Approved */}
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
    </div>
  );
}
