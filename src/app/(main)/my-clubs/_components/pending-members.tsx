"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import clubServiceApi from "@/apiRequest/club";
import {
  ClubMemberDetailType,
  MemberType,
} from "@/schemaValidations/clubs.schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MemberSkeleton } from "./member-shared";
import {
  UserPlus,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  StickyNote,
  Clock,
} from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function PendingMembers({
  id,
  slug,
  accessToken,
  isOwner = false,
  onActionDone,
}: {
  id: string;
  slug: string;
  accessToken: string;
  isOwner?: boolean;
  onActionDone?: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const [pendingMembers, setPendingMembers] = useState<MemberType[]>([]);
  const [pagePending, setPagePending] = useState(0);
  const [totalPagesPending, setTotalPagesPending] = useState(0);
  const [loadingPending, setLoadingPending] = useState(true);

  const [selectedMember, setSelectedMember] = useState<MemberType | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState<ClubMemberDetailType>();

  useEffect(() => {
    if (!isOwner) return;
    const fetchPending = async () => {
      try {
        setLoadingPending(true);
        const res = await clubServiceApi.getClubMembers(
          id,
          pagePending,
          100,
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

  const openMemberDetail = async (memberId: string) => {
    setSelectedMember(pendingMembers.find((m) => m.id === memberId) || null);
    setDetailLoading(true);
    try {
      const res = await clubServiceApi.getClubMemberDetail(memberId);
      setDetailData(res.payload.data);
    } catch (error) {
      toast.error("Không thể tải thông tin thành viên.");
      console.error(error);
    } finally {
      setDetailLoading(false);
    }
  };

  if (!isOwner) return null;
  const handleUpdateStatus = async (
    memberId: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
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
        }
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
      router.push(`/my-clubs/${slug}?tab=members`);
    }
  };
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

                {/* Modal xem chi tiết được thiết kế lại */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => openMemberDetail(member.id)}
                    >
                      Xem chi tiết
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="pb-4">
                      <DialogTitle className="text-xl font-bold text-center">
                        Thông tin thành viên
                      </DialogTitle>
                    </DialogHeader>

                    {detailLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">
                          Đang tải thông tin...
                        </span>
                      </div>
                    ) : detailData ? (
                      <div className="space-y-6">
                        {/* Header với avatar và tên */}
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div className="relative">
                            <Image
                              src={selectedMember?.avatar || "/user.png"}
                              alt={detailData.fullName}
                              width={80}
                              height={80}
                              className="h-20 w-20 rounded-full object-cover border-4 border-blue-100"
                            />
                            <Badge
                              variant="secondary"
                              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-100 text-orange-800"
                            >
                              Chờ duyệt
                            </Badge>
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                              {detailData.fullName}
                            </h2>
                            <p className="text-sm text-gray-500">
                              Thành viên mới
                            </p>
                          </div>
                        </div>

                        <Separator />
                        {detailData.note && (
                          <div className="grid gap-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                              <StickyNote className="h-5 w-5 text-yellow-600" />
                              Lời nhắn
                            </h3>
                            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                              <div className="flex items-start gap-2">
                                <div className="flex-1">
                                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {detailData.note}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* Thông tin cơ bản */}
                        <div className="grid gap-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            Thông tin cơ bản
                          </h3>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div>
                                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Email
                                  </p>
                                  <p className="text-sm font-medium">
                                    {detailData.email}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div>
                                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Số điện thoại
                                  </p>
                                  <p className="text-sm font-medium">
                                    {detailData.phone || "Chưa cập nhật"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div>
                                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Ngày sinh
                                  </p>
                                  <p className="text-sm font-medium">
                                    {detailData.birthDate
                                      ? new Date(
                                          detailData.birthDate
                                        ).toLocaleDateString("vi-VN")
                                      : "Chưa cập nhật"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div>
                                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Giới tính
                                  </p>
                                  <p className="text-sm font-medium">
                                    {detailData.gender === "MALE"
                                      ? "Nam"
                                      : detailData.gender === "FEMALE"
                                      ? "Nữ"
                                      : "Chưa cập nhật"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div>
                                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Địa chỉ
                                  </p>
                                  <p className="text-sm font-medium">
                                    {detailData.address || "Chưa cập nhật"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div>
                                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Ngày đăng ký
                                  </p>
                                  <p className="text-sm font-medium">
                                    {new Date(
                                      detailData.createdAt
                                    ).toLocaleDateString("vi-VN")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Thông tin bổ sung */}
                        {(detailData.bio || detailData.note) && (
                          <>
                            <Separator />
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold flex items-center gap-2">
                                <FileText className="h-5 w-5 text-indigo-600" />
                                Thông tin bổ sung
                              </h3>

                              {detailData.bio && (
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                                  <div className="flex items-start gap-2">
                                    <FileText className="h-4 w-4 text-blue-600 mt-1" />
                                    <div className="flex-1">
                                      <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
                                        Tiểu sử
                                      </p>
                                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {detailData.bio}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        )}

                        {/* Actions */}
                        <Separator />
                        <div className="flex gap-3 pt-2">
                          <Button
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            size="sm"
                            onClick={() =>
                              handleUpdateStatus(detailData.id, "APPROVED")
                            }
                          >
                            Chấp nhận
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                            size="sm"
                            onClick={() =>
                              handleUpdateStatus(detailData.id, "REJECTED")
                            }
                          >
                            Từ chối
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          Không có dữ liệu thành viên.
                        </p>
                      </div>
                    )}

                    <DialogClose asChild>
                      <Button
                        variant="ghost"
                        className="absolute top-4 right-4 p-2 h-auto"
                        size="sm"
                      ></Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
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
