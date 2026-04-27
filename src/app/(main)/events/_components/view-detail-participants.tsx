"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star } from "lucide-react";
import { ParticipantType } from "@/schemaValidations/event.schema";
import eventClubApiRequest from "@/apiRequest/club.event";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

function getLevelGradient(score: number) {
  if (score < 1) return "from-gray-500 to-gray-600";
  if (score < 2) return "from-red-500 to-red-600";
  if (score < 3) return "from-yellow-500 to-orange-500";
  if (score < 4) return "from-blue-500 to-blue-600";
  if (score < 4.5) return "from-indigo-500 to-purple-600";
  return "from-emerald-500 to-teal-600";
}

interface ViewDetailParticipantsProps {
  participant: ParticipantType;
  eventId: string;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  ATTENDED: "Đã tham gia",
  ABSENT: "Vắng mặt",
};

export default function ViewDetailParticipants({
  participant,
  eventId,
}: ViewDetailParticipantsProps) {
  const router = useRouter();

  const [rejectReason, setRejectReason] = useState("");
  const [isRejectDialogOpen, setRejectDialogOpen] = useState(false);

  const mainStats = [
    {
      title: "Kinh nghiệm",
      value: participant.experience,
      color: "text-emerald-600",
    },
    { title: "Thể lực", value: participant.stamina, color: "text-blue-600" },
    {
      title: "Chiến thuật",
      value: participant.tactics,
      color: "text-indigo-600",
    },
    {
      title: "Kỹ thuật",
      value: participant.averageTechnicalScore,
      color: "text-purple-600",
    },
  ];

  const handleApprove = async (approve: boolean) => {
    try {
      if (approve) {
        await eventClubApiRequest.approvedParticipant(participant.id, eventId);
        toast.success("Đã chấp nhận người tham gia");
      }
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái người tham gia");
      console.error("Error updating participant:", error);
    } finally {
      router.refresh();
    }
  };

  const handleReject = async () => {
    try {
      await eventClubApiRequest.rejectParticipant(
        participant.id,
        eventId,
        rejectReason,
      );
      toast.success("Đã từ chối người tham gia");
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái người tham gia");
      console.error("Error rejecting participant:", error);
    } finally {
      setRejectDialogOpen(false);
      setRejectReason("");
      router.refresh();
    }
  };

  return (
    <>
      <Dialog>
        {/* Nút mở dialog */}
        <DialogTrigger asChild>
          <Button variant="outline">Xem chi tiết</Button>
        </DialogTrigger>

        {/* Nội dung dialog */}
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thông tin người tham gia</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Header với avatar và tên */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative">
                <Image
                  src={participant.avatarUrl || "/user.png"}
                  alt={participant.fullName}
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-full object-cover border-4 border-blue-100"
                />
                <Badge
                  variant="secondary"
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-100 text-orange-800"
                >
                  {STATUS_LABELS[participant.status]}
                </Badge>
              </div>
              <div>
                <a
                  href={`/profile/${participant.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {participant.fullName}
                  </h2>
                </a>
                <p className="text-sm text-gray-500">{participant.email}</p>
                <div className="sm:flex-row sm:gap-4 justify-center text-sm text-gray-600 dark:text-gray-300">
                  <p className="font-medium">
                    Uy tín:{" "}
                    <span className="mt-1 text-gray-900 dark:text-gray-100">
                      {participant.reputationScore}
                    </span>
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    Giới tính: {participant.gender == "FEMALE" ? "Nữ" : "Nam"}
                  </span>
                  <span>
                    Tham gia:{" "}
                    {participant.joinedAt
                      ? new Date(participant.joinedAt).toLocaleDateString(
                          "vi-VN",
                        )
                      : "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Đánh giá tổng quan */}
            {participant.skillLevel && (
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
                          (participant.overallScore / 5) * 326.7
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
                          {participant.overallScore.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500">/5.0</div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-white text-sm font-semibold bg-gradient-to-r ${getLevelGradient(
                      participant.overallScore,
                    )}`}
                  >
                    <Trophy className="h-4 w-4" />
                    {participant.skillLevel}
                  </div>
                </div>
                {participant.totalParticipatedEvents > 0 ? (
                  <p className="font-medium text-center">
                    Đã tham gia:{" "}
                    <span className="text-gray-900 dark:text-gray-100">
                      {participant.totalParticipatedEvents}
                    </span>{" "}
                    hoạt động
                  </p>
                ) : (
                  <p className="font-medium text-center">
                    Chưa từng tham gia hoạt động
                  </p>
                )}
              </div>
            )}

            {/* Chi tiết kỹ năng */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Chi tiết kỹ năng
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {mainStats.map((stat) => (
                  <div
                    key={stat.title}
                    className="p-4 bg-white dark:bg-gray-800 rounded-lg border shadow-sm"
                  >
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {stat.title}
                    </div>
                    <div className={`text-xl font-bold ${stat.color}`}>
                      {typeof stat.value === "number"
                        ? stat.value.toFixed(1)
                        : stat.value}
                    </div>
                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-700"
                        style={{
                          width: `${
                            ((typeof stat.value === "number" ? stat.value : 0) /
                              5) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nút duyệt / từ chối */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="destructive"
                onClick={() => setRejectDialogOpen(true)}
              >
                Từ chối
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleApprove(true)}
              >
                Duyệt
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog nhập lý do từ chối */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Lý do từ chối</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Nhập lý do từ chối..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Xác nhận từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
