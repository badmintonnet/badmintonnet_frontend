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
  FileText,
  StickyNote,
  Trophy,
  Star,
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
function getLevelGradient(score: number) {
  if (score < 1) return "from-gray-500 to-gray-600";
  if (score < 2) return "from-red-500 to-red-600";
  if (score < 3) return "from-yellow-500 to-orange-500";
  if (score < 4) return "from-blue-500 to-blue-600";
  if (score < 4.5) return "from-indigo-500 to-purple-600";
  return "from-emerald-500 to-teal-600";
}
export default function PendingMembers({
  id,
  slug,
  accessToken,
  isOwner = false,
}: {
  id: string;
  slug: string;
  accessToken: string;
  isOwner?: boolean;
  onActionDone?: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const [rejectReason, setRejectReason] = useState("");

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
          "PENDING",
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
      const res = await clubServiceApi.getClubMemberDetail(id, memberId);
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
    status: "APPROVED" | "REJECTED",
    rejectReason = "",
  ) => {
    try {
      if (status === "APPROVED") {
        const member = pendingMembers.find((m) => m.id === memberId);
        try {
          await clubServiceApi.postApproveMember(
            id,
            memberId,
            true,
            accessToken,
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
            rejectReason,
            accessToken,
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
  const mainStats = [
    {
      title: "Kinh nghiệm",
      value: detailData?.experience,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Kỹ thuật",
      value: detailData?.averageTechnicalScore,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Thể lực",
      value: detailData?.stamina,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Chiến thuật",
      value: detailData?.tactics,
      color: "text-emerald-600 dark:text-emerald-400",
    },
  ];
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
                  <DialogContent className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
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
                        <div className="flex flex-col items-center text-center space-y-4 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                          <div className="relative">
                            <Image
                              src={selectedMember?.avatar || "/user.png"}
                              alt={detailData.fullName}
                              width={96}
                              height={96}
                              className="h-24 w-24 rounded-full object-cover border-4 border-blue-200 dark:border-blue-800 shadow-md"
                            />
                            <Badge
                              variant="secondary"
                              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-200 text-orange-900 dark:bg-orange-900/30 dark:text-orange-300 text-xs font-medium px-2 py-1 rounded-full"
                            >
                              Chờ duyệt
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <a
                              href={`/profile/${detailData.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {detailData.fullName}
                              </h2>
                            </a>
                            <div className=" sm:flex-row sm:gap-4 justify-center text-sm text-gray-600 dark:text-gray-300">
                              <p className="font-medium">
                                Uy tín:{" "}
                                <span className="mt-1 text-gray-900 dark:text-gray-100">
                                  {detailData.reputationScore}
                                </span>
                              </p>
                              <p className="font-medium mt-1">
                                Số hoạt động tham gia:{" "}
                                <span className=" text-gray-900 dark:text-gray-100">
                                  {detailData.totalParticipatedEvents}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        {detailData.skillLevel && (
                          <div className="p-6 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl">
                            <div className="text-center mb-6">
                              <h3 className="text-lg font-semibold flex items-center justify-center gap-2 mb-4">
                                <Trophy className="h-5 w-5 text-emerald-600" />
                                Đánh giá tổng quan
                              </h3>

                              <div className="relative w-32 h-32 mx-auto mb-4">
                                <svg
                                  className="w-32 h-32 transform -rotate-90"
                                  viewBox="0 0 128 128"
                                >
                                  <circle
                                    cx="64"
                                    cy="64"
                                    r="52"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    className="text-gray-200 dark:text-gray-700"
                                  />
                                  <circle
                                    cx="64"
                                    cy="64"
                                    r="52"
                                    fill="none"
                                    stroke="url(#gradient)"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray={`${
                                      (detailData.overallScore / 5) * 326.7
                                    } 326.7`}
                                    className="transition-all duration-1000 ease-out"
                                  />
                                  <defs>
                                    <linearGradient
                                      id="gradient"
                                      x1="0%"
                                      y1="0%"
                                      x2="100%"
                                      y2="0%"
                                    >
                                      <stop offset="0%" stopColor="#10b981" />
                                      <stop offset="100%" stopColor="#3b82f6" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                                      {detailData.overallScore.toFixed(1)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      /5.0
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div
                                className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-white text-sm font-semibold bg-gradient-to-r ${getLevelGradient(
                                  detailData.overallScore,
                                )}`}
                              >
                                <Trophy className="h-4 w-4" />
                                {detailData.skillLevel}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Chi tiết kỹ năng */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-600" />
                            Chi tiết kỹ năng
                          </h3>

                          <div className="grid grid-cols-2 gap-3">
                            {mainStats.map((stat) => {
                              return (
                                <div
                                  key={stat.title}
                                  className="p-4 bg-white dark:bg-gray-800 rounded-lg border shadow-sm"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                      {stat.title}
                                    </div>
                                  </div>
                                  <div
                                    className={`text-xl font-bold ${stat.color}`}
                                  >
                                    {typeof stat.value === "number"
                                      ? stat.value.toFixed(1)
                                      : stat.value}
                                  </div>
                                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                      className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-700"
                                      style={{
                                        width: `${
                                          ((typeof stat.value === "number"
                                            ? stat.value
                                            : 0) /
                                            5) *
                                          100
                                        }%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
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
                                          detailData.birthDate,
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
                                      detailData.createdAt,
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
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                                size="sm"
                              >
                                Từ chối
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Lý do từ chối</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-3">
                                <textarea
                                  placeholder="Nhập lý do từ chối..."
                                  value={rejectReason}
                                  onChange={(e) =>
                                    setRejectReason(e.target.value)
                                  }
                                  className="w-full border rounded-md p-2 text-sm dark:bg-gray-800 dark:text-gray-100"
                                  rows={4}
                                />
                                <div className="flex justify-end gap-2">
                                  <DialogClose asChild>
                                    <Button variant="outline">Hủy</Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button
                                      className="bg-red-600 text-white hover:bg-red-700"
                                      onClick={() =>
                                        handleUpdateStatus(
                                          detailData.id,
                                          "REJECTED",
                                          rejectReason,
                                        )
                                      }
                                    >
                                      Gửi
                                    </Button>
                                  </DialogClose>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
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
