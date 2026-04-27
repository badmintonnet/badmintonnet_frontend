"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import clubInvitationApiRequest from "@/apiRequest/club-invitation";
import { ClubUpdateInvitationStatusType } from "@/schemaValidations/club-invitation";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  message?: string;
  slug?: string;
}

export default function UpdateInvitationStatusDialog({
  id,
  message,
  slug,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<"accept" | "reject" | null>(null);
  const [showRejectArea, setShowRejectArea] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectOption, setRejectOption] = useState<string | null>(null);

  const router = useRouter();

  const rejectOptions = [
    "Tôi chưa sẵn sàng tham gia CLB",
    "Lịch cá nhân không phù hợp",
    "Đã là thành viên của CLB khác",
    "Không phù hợp với định hướng CLB",
    "Tôi muốn tìm hiểu thêm trước khi tham gia",
    "Lý do khác",
  ];

  const handleUpdateStatus = async (
    status: "ACCEPTED" | "REJECTED",
    reason?: string,
  ) => {
    try {
      setLoading(status === "ACCEPTED" ? "accept" : "reject");
      const body: ClubUpdateInvitationStatusType = { id, status };
      // call API: include reason only when rejecting and reason provided
      if (status === "REJECTED" && reason && reason.trim().length > 0) {
        await clubInvitationApiRequest.updateInvitationStatus(
          body,
          reason.trim(),
        );
      } else {
        await clubInvitationApiRequest.updateInvitationStatus(body);
      }
      toast.success(
        status === "ACCEPTED"
          ? "Bạn đã chấp nhận lời mời tham gia CLB."
          : "Bạn đã từ chối lời mời tham gia CLB.",
      );
      setOpen(false);
      setShowRejectArea(false);
      setRejectReason("");
      setRejectOption(null);
      router.refresh();
    } catch {
      toast.error("Không thể cập nhật trạng thái lời mời. Vui lòng thử lại.");
    } finally {
      setLoading(null);
    }
  };

  const handleRejectClick = () => {
    setShowRejectArea(true);
  };

  const handleConfirmReject = async () => {
    // combine option + free text if both present
    const parts = [];
    if (rejectOption) parts.push(rejectOption);
    if (rejectReason?.trim()) parts.push(rejectReason.trim());
    const fullReason = parts.length ? parts.join(" - ") : undefined;
    await handleUpdateStatus("REJECTED", fullReason);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-blue-600 dark:text-blue-400">
          Lời mời tham gia CLB
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Xác nhận lời mời
          </DialogTitle>
        </DialogHeader>

        <div className="text-sm text-gray-600 dark:text-gray-300 ">
          {message ??
            "Bạn có muốn chấp nhận lời mời tham gia câu lạc bộ này không?"}
        </div>

        {/* Reject area (shown after pressing 'Từ chối') */}
        {showRejectArea && (
          <div className="space-y-3 mb-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Lý do từ chối (có thể bỏ qua)
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {rejectOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() =>
                    setRejectOption((prev) => (prev === opt ? null : opt))
                  }
                  className={`px-3 py-1.5 text-sm rounded-md border transition ${
                    rejectOption === opt
                      ? "bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-600/20"
                      : "bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập chi tiết lý do (tuỳ chọn)"
              className="w-full mt-2 p-2 rounded-md border bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white"
              rows={3}
            />
          </div>
        )}

        <DialogFooter className="flex justify-between gap-3">
          <div className="flex-1">
            {!showRejectArea ? (
              <Button
                variant="outline"
                disabled={loading === "reject"}
                onClick={handleRejectClick}
                className="w-full border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                {loading === "reject" ? "Đang xử lý..." : "Từ chối"}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  disabled={loading === "reject"}
                  onClick={() => {
                    setShowRejectArea(false);
                    setRejectReason("");
                    setRejectOption(null);
                  }}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmReject}
                  disabled={loading === "reject"}
                  className="flex-1"
                >
                  {loading === "reject" ? "Đang xử lý..." : "Xác nhận từ chối"}
                </Button>
              </div>
            )}
          </div>

          <div className="flex-1">
            <Button
              disabled={loading === "accept"}
              onClick={() => {
                handleUpdateStatus("ACCEPTED");
                router.push(`/my-clubs/${slug}`);
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600"
            >
              {loading === "accept" ? "Đang xử lý..." : "Chấp nhận"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
