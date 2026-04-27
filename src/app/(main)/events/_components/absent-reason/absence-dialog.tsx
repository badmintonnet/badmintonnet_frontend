"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import absentReasonRequest from "@/apiRequest/absent-reason";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AbsenceDialogProps {
  eventId: string;
}

export default function AbsenceDialog({ eventId }: AbsenceDialogProps) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    try {
      if (reason.trim() !== "") {
        await absentReasonRequest.createAbsentReason({
          idEvent: eventId,
          reason,
        });
        setReason("");
        setIsOpen(false);
        toast.success(
          "Đã gửi lý do, vui lòng chờ phê duyệt để khôi phục uy tín",
        );
      } else {
        toast.error("Vui lòng điền lý do");
      }
    } catch {
      toast.error("Lỗi khi gửi lý do, vui lòng thử lại");
    } finally {
      router.refresh();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border-red-300 rounded-lg shadow-sm hover:bg-red-50 hover:text-red-400 dark:text-red-300 dark:bg-red-950 dark:border-red-800 dark:hover:bg-red-900 transition-colors duration-200"
        >
          Gửi lý do
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-6 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Lý do vắng mặt
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            Vui lòng cung cấp lý do vắng mặt. Nếu được phê duyệt, điểm uy tín
            của bạn sẽ được khôi phục.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Nhập lý do của bạn..."
          className="w-full h-32 p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-red-400 transition-all duration-200 resize-none"
        />

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setReason("");
              setIsOpen(false);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 border-gray-300 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors duration-200"
          >
            Gửi lý do
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
