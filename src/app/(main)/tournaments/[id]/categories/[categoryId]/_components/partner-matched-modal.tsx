"use client";

import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { AccountFriendSchemaType } from "@/schemaValidations/friend.schema";
import tournamentApiRequest from "@/apiRequest/tournament";

export default function PartnerMatchedModal({
  partner,
  categoryId,
}: {
  partner: AccountFriendSchemaType;
  categoryId: string;
}) {
  const [open, setOpen] = useState(false);
  const handleSignUp = () => {
    tournamentApiRequest.joinDoubleTournament(categoryId);
    setOpen(false); // Đóng modal sau khi đăng ký
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white shadow-md">
          Đăng ký với đối tác đã ghép cặp
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] overflow-y-auto rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl text-green-700 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            Ghép cặp thành công
          </DialogTitle>
        </DialogHeader>

        <Card className="p-6 mt-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
          <div className="flex flex-col items-center text-center gap-4">
            {/* Avatar */}
            <Image
              src={partner?.avatarUrl || "/default-avatar.png"}
              alt="avatar"
              width={90}
              height={90}
              className="rounded-2xl object-cover shadow-md"
              unoptimized
            />

            {/* Tên + badge */}
            <div className="flex flex-col items-center gap-2">
              <a
                href={`/profile/${partner?.slug}`}
                className="text-lg font-semibold hover:text-green-600 dark:hover:text-green-300 transition-colors"
              >
                {partner?.fullName}
              </a>

              <Badge
                variant="outline"
                className="px-3 py-1 flex items-center gap-1 text-xs font-medium border bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 rounded-full"
              >
                <CheckCircle2 className="w-3 h-3" />
                Đã ghép cặp
              </Badge>
            </div>

            {/* Mô tả */}
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
              Bạn đã ghép cặp thành công với{" "}
              <span className="font-semibold">{partner?.fullName}</span>. Hãy
              tiếp tục đăng ký giải đấu ngay bây giờ để thi đấu cùng người chơi
              này!
            </p>

            {/* Nút đăng ký */}
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-3 py-2 rounded-xl text-sm font-medium shadow-md"
              onClick={handleSignUp}
            >
              Đăng ký giải đấu
            </Button>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
