"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Users } from "lucide-react";
import Image from "next/image";
import {
  ClubTournamentParticipant,
  ClubRosterMember,
  getClubTournamentStatusInfo,
} from "@/schemaValidations/tournament.schema";
import clubTournamentApiRequest from "@/apiRequest/club-tournament";
import { toast } from "sonner";

interface ClubRosterModalProps {
  participant: ClubTournamentParticipant;
  trigger?: React.ReactNode;
}

export default function ClubRosterModal({
  participant,
  trigger,
}: ClubRosterModalProps) {
  const [open, setOpen] = useState(false);
  const [roster, setRoster] = useState<ClubRosterMember[]>(
    participant.roster ?? [],
  );
  const [loading, setLoading] = useState(false);

  const handleOpen = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && roster.length === 0) {
      setLoading(true);
      try {
        const res = await clubTournamentApiRequest.getParticipantDetail(
          participant.id,
        );
        setRoster(res.payload.data.roster ?? []);
      } catch {
        toast.error("Không thể tải danh sách roster");
      } finally {
        setLoading(false);
      }
    }
  };

  const statusInfo = getClubTournamentStatusInfo(participant.status);

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <button className="text-sm text-teal-600 dark:text-teal-400 hover:underline font-medium">
            Xem roster
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              {participant.clubLogoUrl ? (
                <Image
                  src={participant.clubLogoUrl}
                  alt={participant.clubName}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-bold">
                  {participant.clubName.charAt(0)}
                </div>
              )}
            </div>
            <span>{participant.clubName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status + stats */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusInfo.badgeClass}`}
            >
              {statusInfo.label}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Users className="w-4 h-4" />
              {participant.rosterSize} thành viên
            </span>
          </div>

          {/* Roster list */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
            </div>
          ) : roster.length === 0 ? (
            <p className="text-center text-gray-500 py-6 text-sm">
              Chưa có thành viên trong roster
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Danh sách roster ({roster.length} người):
              </p>
              {roster.map((member) => (
                <div
                  key={member.rosterEntryId}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800/50"
                >
                  <Avatar className="w-9 h-9 flex-shrink-0">
                    <AvatarImage src={member.avatarUrl ?? ""} />
                    <AvatarFallback className="text-xs font-semibold bg-teal-100 text-teal-700">
                      {member.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {member.fullName}
                    </p>
                    {member.skillLevel && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Trình độ: {member.skillLevel}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {member.role === "OWNER" && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium">
                        Chủ CLB
                      </span>
                    )}
                    {member.position && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {member.position}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
