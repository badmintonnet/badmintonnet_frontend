"use client";

import Image from "next/image";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { TournamentPartnerInvitationResponse } from "@/schemaValidations/tournament.schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SentPartnerInvitationModal({
  invitation,
}: {
  invitation: TournamentPartnerInvitationResponse;
}) {
  const user = invitation.send ? invitation.invitee : invitation.inviter;

  if (!user) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          color: "yellow",
          icon: <Clock className="w-4 h-4" />,
          label: "Đang chờ",
        };
      case "ACCEPTED":
        return {
          color: "green",
          icon: <CheckCircle2 className="w-4 h-4" />,
          label: "Đã chấp nhận",
        };
      case "REJECTED":
        return {
          color: "red",
          icon: <XCircle className="w-4 h-4" />,
          label: "Đã từ chối",
        };
      default:
        return {
          color: "gray",
          icon: null,
          label: status,
        };
    }
  };

  const statusConfig = getStatusConfig(invitation.status);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
          Đã mời
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        {/* close button top-right */}
        <DialogClose asChild></DialogClose>

        <DialogHeader className="flex items-center justify-between bg-yellow-50 px-5 py-4 border-b border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-800">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Lời mời ghép đôi
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-5 flex flex-col gap-4 text-gray-800 dark:text-gray-100">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Image
                src={user.avatarUrl || "/default-avatar.png"}
                alt="avatar"
                width={60}
                height={60}
                className="rounded-xl object-cover ring-2 ring-yellow-200 dark:ring-yellow-800"
                unoptimized
              />
            </div>

            <div className="flex-1 min-w-0">
              <a
                href={`/profile/${user.slug}`}
                className="text-base font-semibold text-gray-900 hover:text-yellow-600 dark:text-gray-100 dark:hover:text-yellow-400 transition-colors"
              >
                {user.fullName}
              </a>

              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="default"
                  className={`flex items-center gap-1 ${
                    invitation.status === "PENDING"
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800"
                      : invitation.status === "ACCEPTED"
                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                        : invitation.status === "REJECTED"
                          ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
                          : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  }`}
                >
                  {statusConfig.icon}
                  <span className="text-sm">{statusConfig.label}</span>
                </Badge>

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(invitation.createdAt).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {invitation.message && (
                <p className="text-sm italic mt-2 border-l-2 pl-2 border-yellow-200 dark:border-yellow-800 text-gray-700 dark:text-gray-200">
                  &quot;{invitation.message}&quot;
                </p>
              )}
            </div>
          </div>

          {invitation.status === "PENDING" && (
            <div className="flex justify-end mt-2">
              <Button variant="destructive" size="sm">
                Hủy lời mời
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
