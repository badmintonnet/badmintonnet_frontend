"use client";

import { clientSessionToken } from "@/lib/http";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserMinus } from "lucide-react";
import eventClubApiRequest from "@/apiRequest/club.event";

interface LeaveEventButtonProps {
  eventId: string;
}

export const LeaveEventButton = ({ eventId }: LeaveEventButtonProps) => {
  const accessToken = clientSessionToken.value;
  const router = useRouter();

  const handleLeaveEvent = async () => {
    if (!accessToken) {
      toast.error("Vui lòng đăng nhập để rời sự kiện.");
      return;
    }

    // try {
    //   const res = await eventClubApiRequest.leaveEvent(eventId, accessToken);
    //   if (res.status === 200) {
    //     toast.success("Bạn đã rời sự kiện thành công!");
    //     router.refresh();
    //   } else {
    //     toast.error("Rời sự kiện thất bại.");
    //   }
    // } catch (error) {
    //   toast.error("Rời sự kiện thất bại. Vui lòng thử lại.");
    //   console.error("Error leaving event:", error);
    // }
  };

  return (
    <Button
      variant="destructive"
      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
      onClick={handleLeaveEvent}
    >
      <UserMinus className="w-4 h-4 mr-2" />
      Rời sự kiện
    </Button>
  );
};
