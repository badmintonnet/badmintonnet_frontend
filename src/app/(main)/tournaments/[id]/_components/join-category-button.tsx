"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import tournamentApiRequest from "@/apiRequest/tournament";
import { clientSessionToken } from "@/lib/http";

interface JoinCategoryButtonProps {
  categoryId: string;
  isDisabled?: boolean;
  buttonText?: string;
  className?: string;
}

export default function JoinCategoryButton({
  categoryId,
  isDisabled = false,
  buttonText = "Tham gia",
  className = "bg-white text-teal-600 hover:bg-teal-50 font-semibold shadow-md",
}: JoinCategoryButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = clientSessionToken.value;
  const router = useRouter();

  const handleJoin = async () => {
    if (!accessToken) {
      toast.error("Vui lòng đăng nhập để tham gia giải đấu.");
      return;
    }

    setIsLoading(true);
    try {
      await tournamentApiRequest.joinSingleTournament(categoryId, accessToken);
      toast.success("Đăng ký tham gia thành công!");
      router.refresh();
    } catch {
      toast.error("Có lỗi xảy ra khi đăng ký tham gia.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleJoin}
      disabled={isDisabled || isLoading}
      className={className}
    >
      {isLoading ? "Đang xử lý..." : buttonText}
    </Button>
  );
}
