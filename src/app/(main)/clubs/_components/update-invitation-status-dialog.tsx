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
  const router = useRouter();
  const handleUpdateStatus = async (status: "ACCEPTED" | "REJECTED") => {
    try {
      setLoading(status === "ACCEPTED" ? "accept" : "reject");
      const body: ClubUpdateInvitationStatusType = { id, status };
      await clubInvitationApiRequest.updateInvitationStatus(body);
      toast.success(
        status === "ACCEPTED"
          ? "Bạn đã chấp nhận lời mời tham gia CLB."
          : "Bạn đã từ chối lời mời tham gia CLB."
      );
      setOpen(false);
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái lời mời. Vui lòng thử lại.");
    } finally {
      setLoading(null);
    }
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

        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {message ??
            "Bạn có muốn chấp nhận lời mời tham gia câu lạc bộ này không?"}
        </div>

        <DialogFooter className="flex justify-between gap-3">
          <Button
            variant="outline"
            disabled={loading === "reject"}
            onClick={() => {
              handleUpdateStatus("REJECTED");
              router.refresh();
            }}
            className="flex-1 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            {loading === "reject" ? "Đang xử lý..." : "Từ chối"}
          </Button>
          <Button
            disabled={loading === "accept"}
            onClick={() => {
              handleUpdateStatus("ACCEPTED");
              router.push(`/my-clubs/${slug}`);
            }}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600"
          >
            {loading === "accept" ? "Đang xử lý..." : "Chấp nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
