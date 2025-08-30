"use client";

import clubServiceApi from "@/apiRequest/club";
import { clientSessionToken } from "@/lib/http";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
interface JoinClubButtonProps {
  clubId: string;
  clubName: string;
}

export const JoinClubButton = ({ clubId, clubName }: JoinClubButtonProps) => {
  const accessToken = clientSessionToken.value;
  const router = useRouter();
  const handleJoinClub = async () => {
    if (!accessToken) {
      toast.error("Vui lòng đăng nhập để tham gia câu lạc bộ.");
      return;
    }

    try {
      const res = await clubServiceApi.joinClub(clubId, accessToken);
      if (res.status === 200) {
        toast.success(`Bạn đã tham gia câu lạc bộ ${clubName} thành công!`);
        router.refresh();
      } else {
        toast.error(`Tham gia câu lạc bộ ${clubName} thất bại.`);
      }
    } catch (error) {
      toast.error(
        `Tham gia câu lạc bộ ${clubName} thất bại. Vui lòng thử lại.`
      );
      console.error("Error joining club:", error);
    }
  };

  return (
    <>
      <button
        onClick={handleJoinClub}
        className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 dark:bg-green-700 dark:hover:bg-green-600"
      >
        Tham gia
      </button>
    </>
  );
};
