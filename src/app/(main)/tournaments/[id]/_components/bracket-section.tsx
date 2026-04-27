"use client";

import { useEffect, useState } from "react";
import { isAdmin } from "@/lib/utils";
import { clientSessionToken } from "@/lib/http";
import ClubBracketView from "./club-tournament/ClubBracketView";

interface BracketSectionProps {
  tournamentId: string;
  participationType: "CLUB" | "INDIVIDUAL";
}

export default function BracketSection({
  tournamentId,
  participationType,
}: BracketSectionProps) {
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const token = clientSessionToken.value;
    if (token) {
      setIsAdminUser(isAdmin(token));
    }
  }, []);

  if (participationType !== "CLUB") {
    return null;
  }

  return (
    <div className="py-4">
      <ClubBracketView tournamentId={tournamentId} isAdmin={isAdminUser} />
    </div>
  );
}
