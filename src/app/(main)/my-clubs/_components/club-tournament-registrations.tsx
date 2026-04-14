"use client";

import { useState, useCallback } from "react";
import { Trophy } from "lucide-react";
import { ClubTournamentParticipant } from "@/schemaValidations/tournament.schema";
import ClubTournamentRegistrationCard from "./club-tournament-registration-card";
import UpdateRosterDialog from "./club-update-roster-dialog";
import CancelRegistrationDialog from "./club-cancel-registration-dialog";

interface ClubTournamentRegistrationsProps {
  participations: ClubTournamentParticipant[];
}

export default function ClubTournamentRegistrations({
  participations: initialParticipations,
}: ClubTournamentRegistrationsProps) {
  const [participations, setParticipations] = useState(initialParticipations);
  const [updateTarget, setUpdateTarget] =
    useState<ClubTournamentParticipant | null>(null);
  const [cancelTarget, setCancelTarget] =
    useState<ClubTournamentParticipant | null>(null);

  const handleUpdated = useCallback(() => {
    // Parent will revalidate via router.refresh()
  }, []);

  const handleCancelled = useCallback(() => {
    if (!cancelTarget) return;
    setParticipations((prev) => prev.filter((p) => p.id !== cancelTarget.id));
  }, [cancelTarget]);

  if (participations.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          CLB chưa đăng ký giải đấu nào
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Truy cập trang Giải đấu để tìm và đăng ký cho CLB của bạn.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {participations.map((p) => (
          <ClubTournamentRegistrationCard
            key={p.id}
            participant={p}
            onUpdate={setUpdateTarget}
            onCancel={setCancelTarget}
          />
        ))}
      </div>

      <UpdateRosterDialog
        participant={updateTarget}
        open={!!updateTarget}
        onOpenChange={(open) => !open && setUpdateTarget(null)}
        onUpdated={handleUpdated}
      />

      <CancelRegistrationDialog
        participant={cancelTarget}
        open={!!cancelTarget}
        onOpenChange={(open) => !open && setCancelTarget(null)}
        onCancelled={handleCancelled}
      />
    </>
  );
}
