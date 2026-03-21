"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Building2, Eye } from "lucide-react";
import {
  ClubTournamentParticipant,
  getClubTournamentStatusInfo,
} from "@/schemaValidations/tournament.schema";
import clubTournamentApiRequest from "@/apiRequest/club-tournament";
import clubServiceApi from "@/apiRequest/club";
import { clientSessionToken } from "@/lib/http";
import ClubRegisterModalSimple from "./club-register-modal-simple";
import ClubRosterModalSimple from "./club-roster-modal-simple";

interface ClubRegisterButtonSimpleProps {
  tournamentId: string;
  tournamentName: string;
  minRoster: number;
  maxRoster: number;
  registrationFee: number;
  isFull: boolean;
  registrationDeadline: Date;
}

export default function ClubRegisterButtonSimple({
  tournamentId,
  tournamentName,
  minRoster,
  maxRoster,
  registrationFee,
  isFull,
  registrationDeadline,
}: ClubRegisterButtonSimpleProps) {
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
      const clubsRes = await clubServiceApi.getMyClubs(0, 50);
      const ownedClubs = (clubsRes.payload.data.content ?? []).filter(
        (c) => c.owner,
      );
      if (ownedClubs.length === 0) {
        setLoading(false);
        return;
      }
      for (const club of ownedClubs) {
        try {
          const res = await clubTournamentApiRequest.getMyParticipation(
            tournamentId,
            club.id,
          );
          if (res.payload.data) {
            setMyParticipation(res.payload.data as ClubTournamentParticipant);
            break;
          }
        } catch {
          // Not registered
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
  }, [tournamentId, accessToken]);

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

  if (!accessToken) {
    return (
      <Button
        variant="outline"
        className="border-violet-300 text-violet-700 dark:border-violet-600 dark:text-violet-300"
        disabled
      >
        <Building2 className="w-4 h-4 mr-2" />
        Đăng nhập để đăng ký CLB
      </Button>
    );
  }

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
        <ClubRosterModalSimple
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

  if (isFull) {
    return (
      <Button disabled className="bg-gray-400 cursor-not-allowed">
        <Building2 className="w-4 h-4 mr-2" />
        Đã đầy
      </Button>
    );
  }

  // Check deadline
  if (new Date() > registrationDeadline) {
    return (
      <Button disabled className="bg-gray-400 cursor-not-allowed">
        <Building2 className="w-4 h-4 mr-2" />
        Hết hạn đăng ký
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        className="bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-md"
      >
        <Building2 className="w-4 h-4 mr-2" />
        Đăng ký CLB
      </Button>
      <ClubRegisterModalSimple
        open={modalOpen}
        onOpenChange={setModalOpen}
        tournamentId={tournamentId}
        tournamentName={tournamentName}
        minRoster={minRoster}
        maxRoster={maxRoster}
        registrationFee={registrationFee}
        onRegistered={handleRegistered}
      />
    </>
  );
}
