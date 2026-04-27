"use client";

import clubServiceApi from "@/apiRequest/club";
import { clientSessionToken } from "@/lib/http";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface JoinClubButtonProps {
  clubId: string;
  clubName: string;
  isRefresh?: boolean;
}

export const JoinClubButton = ({
  clubId,
  clubName,
  isRefresh = true,
}: JoinClubButtonProps) => {
  const accessToken = clientSessionToken.value;
  const router = useRouter();
  const [joined, setJoined] = useState(false);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState<string>("");

  const handleOpenForm = () => {
    if (!accessToken) {
      toast.error("Vui lòng đăng nhập để tham gia câu lạc bộ.");
      return;
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const res = await clubServiceApi.joinClub(
        clubId,
        description, // gửi kèm mô tả
      );
      if (res.status === 200) {
        toast.success(
          `Bạn đã gửi yêu cầu tham gia câu lạc bộ ${clubName}. Vui lòng chờ phê duyệt.`,
        );
        setOpen(false);
        if (isRefresh) {
          router.refresh();
        } else {
          setJoined(true);
        }
      } else {
        toast.error(`Tham gia câu lạc bộ ${clubName} thất bại.`);
      }
    } catch (error) {
      toast.error(
        `Tham gia câu lạc bộ ${clubName} thất bại. Vui lòng thử lại.`,
      );
      console.error("Error joining club:", error);
    }
  };

  return (
    <>
      {/* Nút giữ nguyên design cũ */}
      <button
        onClick={handleOpenForm}
        disabled={joined}
        className={`w-full py-2 px-4 text-white font-semibold rounded-lg shadow-md transform hover:scale-105 transition-all duration-200 ${
          joined
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
        }`}
      >
        {joined ? "Vui lòng chờ phê duyệt" : "Tham gia"}
      </button>

      {/* Dialog từ shadcn/ui */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Giới thiệu ngắn gọn về bản thân</DialogTitle>
          </DialogHeader>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ví dụ: Tôi chơi cầu lông 2 năm, muốn tham gia giao lưu..."
            className="mt-2"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
              onClick={handleSubmit}
            >
              Gửi yêu cầu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
