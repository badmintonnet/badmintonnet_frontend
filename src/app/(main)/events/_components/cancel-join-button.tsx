"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { UserMinus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import eventClubApiRequest from "@/apiRequest/club.event";
import { toast } from "sonner";

interface CancelJoinEventButtonProps {
  eventId: string;
  token: string;
}

const CANCEL_REASONS = [
  "Bận việc đột xuất",
  "Vấn đề sức khỏe",
  "Trùng lịch với hoạt động khác",
  "Lý do cá nhân",
  "Khác",
];

export function CancelJoinEventButton({
  eventId,
  token,
}: CancelJoinEventButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const router = useRouter();

  const handleCancelJoinEvent = async () => {
    try {
      setIsLoading(true);

      // Nếu chọn "Khác", sử dụng customReason, ngược lại dùng selectedReason
      const finalReason =
        selectedReason === "Khác" ? customReason.trim() : selectedReason;

      await eventClubApiRequest.cancelJoinEventClub(
        eventId,
        finalReason,
        token,
      );
      toast.success("Hủy tham gia hoạt động thành công!");

      router.refresh();
      setIsOpen(false);
      setSelectedReason("");
      setCustomReason("");
    } catch {
      toast.error("Có lỗi xảy ra khi hủy sự kiện");
    } finally {
      setIsLoading(false);
    }
  };

  const isCustomReason = selectedReason === "Khác";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="destructive"
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <UserMinus className="w-4 h-4 mr-2" />
          Hủy tham gia
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="p-4">
          <h4 className="font-semibold text-lg mb-2">
            Xác nhận hủy tham gia hoạt động
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Bạn có chắc chắn muốn hủy tham gia hoạt động này? Hành động này
            không thể hoàn tác.
          </p>

          {/* Chọn lý do */}
          <label className="text-sm font-medium mb-2 block">
            Lý do hủy <span className="text-gray-500">(tùy chọn)</span>
          </label>
          <div className="space-y-2 mb-4">
            {CANCEL_REASONS.map((reason) => (
              <label
                key={reason}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedReason === reason
                    ? "border-red-500 bg-red-50 dark:bg-red-950"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input
                  type="radio"
                  name="cancelReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => {
                    setSelectedReason(e.target.value);
                    if (e.target.value !== "Khác") {
                      setCustomReason("");
                    }
                  }}
                  disabled={isLoading}
                  className="mr-3 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm">{reason}</span>
              </label>
            ))}
          </div>

          {/* Input tùy chỉnh khi chọn "Khác" */}
          {isCustomReason && (
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">
                Nhập lý do của bạn
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full p-2 border rounded-md text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={3}
                placeholder="Nhập lý do cụ thể..."
                disabled={isLoading}
              />
            </div>
          )}

          <div className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsOpen(false);
                setSelectedReason("");
                setCustomReason("");
              }}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleCancelJoinEvent}
              disabled={isLoading || (isCustomReason && !customReason.trim())}
            >
              {isLoading ? "Đang hủy..." : "Xác nhận"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
