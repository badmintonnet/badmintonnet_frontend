"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Building2, Eye } from "lucide-react";
import {
  CategoryDetail,
  ClubTournamentParticipant,
  getClubTournamentStatusInfo,
} from "@/schemaValidations/tournament.schema";
import clubTournamentApiRequest from "@/apiRequest/club-tournament";
import clubServiceApi from "@/apiRequest/club";
import ClubRegisterModal from "./club-register-modal";
import ClubRosterModal from "./club-roster-modal";
import { clientSessionToken } from "@/lib/http";

interface ClubRegisterButtonProps {
  categoryId: string;
  category: CategoryDetail;
}

export default function ClubRegisterButton({
  categoryId,
  category,
}: ClubRegisterButtonProps) {
  const [loading, setLoading] = useState(true);
  const [myParticipation, setMyParticipation] =
    useState<ClubTournamentParticipant | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const accessToken = clientSessionToken.value;

  const checkParticipation = async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    try {
      // Get user's owned clubs to find which one is theirs
      const clubsRes = await clubServiceApi.getMyClubs(0, 50);
      const ownedClubs = (clubsRes.payload.data.content ?? []).filter(
        (c) => c.owner,
      );
      if (ownedClubs.length === 0) {
        setLoading(false);
        return;
      }
      // Check each owned club until we find one registered
      for (const club of ownedClubs) {
        try {
          const res = await clubTournamentApiRequest.getMyParticipation(
            categoryId,
            club.id,
          );
          if (res.payload.data) {
            // Found a registration - parse it
            setMyParticipation(res.payload.data as ClubTournamentParticipant);
            break;
          }
        } catch {
          // Not registered for this club, continue
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkParticipation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const handleRegistered = () => {
    setLoading(true);
    checkParticipation();
  };

  if (loading) {
    return (
      <Button disabled variant="outline" size="sm">
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

  // Not logged in
  if (!accessToken) {
    return (
      <Button
        variant="outline"
        className="border-violet-300 text-violet-700 dark:border-violet-600 dark:text-violet-300"
        onClick={() => {}}
        disabled
      >
        <Building2 className="w-4 h-4 mr-2" />
        Đăng nhập để đăng ký CLB
      </Button>
    );
  }

  // Already registered
  if (myParticipation) {
    const statusInfo = getClubTournamentStatusInfo(myParticipation.status);
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusInfo.badgeClass}`}
          >
            {myParticipation.clubName}: {statusInfo.label}
          </span>
        </div>
        <ClubRosterModal
          participant={myParticipation}
          trigger={
            <Button
              variant="outline"
              size="sm"
              className="border-violet-300 text-violet-700 dark:border-violet-600 dark:text-violet-300"
            >
              <Eye className="w-4 h-4 mr-2" />
              Xem đăng ký của tôi
            </Button>
          }
        />
      </div>
    );
  }

  // Not yet registered
  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        className="bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-md"
      >
        <Building2 className="w-4 h-4 mr-2" />
        Đăng ký CLB
      </Button>
      <ClubRegisterModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        category={category}
        categoryId={categoryId}
        onRegistered={handleRegistered}
      />
    </>
  );
}
