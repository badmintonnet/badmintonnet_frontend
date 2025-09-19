"use client";

import { clientSessionToken } from "@/lib/http";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import eventClubApiRequest from "@/apiRequest/club.event";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface JoinEventButtonProps {
  eventId: string;
  isMember: boolean;
}

export const JoinEventButton = ({
  eventId,
  isMember,
}: JoinEventButtonProps) => {
  const accessToken = clientSessionToken.value;
  const router = useRouter();

  const handleJoinEvent = async () => {
    if (!accessToken) {
      toast.error("Vui lòng đăng nhập để tham gia câu lạc bộ.");
      return;
    }

    try {
      const res = await eventClubApiRequest.joinEvent(eventId, accessToken);
      if (res.status === 200) {
        toast.success("Bạn đã tham gia hoạt động thành công!");
        router.refresh();
      } else {
        toast.error("Tham gia thất bại.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.error("Error joining club:", error.message);
      } else {
        toast.error("Tham gia thất bại. Vui lòng thử lại.");
        console.error("Error joining club:", error);
      }
      router.refresh();
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
          <UserPlus className="w-4 h-4 mr-2" />
          Đăng ký tham gia
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận tham gia</AlertDialogTitle>
          {isMember ? (
            <AlertDialogDescription>
              Bạn có chắc chắn muốn tham gia hoạt động này không? Sau khi tham
              gia bạn sẽ không được hủy trước khi hoạt động diễn ra 2 tiếng.
            </AlertDialogDescription>
          ) : (
            <AlertDialogDescription>
              Bạn có chắc chắn muốn tham gia hoạt động này không? Sau khi tham
              gia bạn sẽ không được hủy trước khi hoạt động diễn ra 2 tiếng. Vui
              lòng chờ sự phê duyệt của Chủ CLB
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleJoinEvent}>
            Đồng ý
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
