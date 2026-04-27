"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Sparkles, Calendar } from "lucide-react";
import MatchScoreModal from "./MatchScoreModal";
import {
  ClubBracketMatch,
  ClubBracketResponse,
} from "@/schemaValidations/club-match.schema";
import clubTournamentBracketApiRequest from "@/apiRequest/club-tournament-bracket";
import { toast } from "sonner";

interface ClubBracketViewProps {
  tournamentId: string;
  isAdmin?: boolean;
}

const getMatchStatusText = (status: string) => {
  switch (status) {
    case "NOT_STARTED":
      return "Chưa bắt đầu";
    case "IN_PROGRESS":
      return "Đang diễn ra";
    case "FINISHED":
      return "Đã kết thúc";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status;
  }
};

const getMatchStatusColor = (status: string) => {
  switch (status) {
    case "NOT_STARTED":
      return "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
    case "IN_PROGRESS":
      return "bg-green-50 text-green-700 border border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
    case "FINISHED":
      return "bg-gray-50 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    case "CANCELLED":
      return "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
    default:
      return "";
  }
};

const getRoundName = (round: number, totalRounds: number) => {
  const roundFromEnd = totalRounds - round + 1;
  if (roundFromEnd === 1) return "Chung kết";
  if (roundFromEnd === 2) return "Bán kết";
  if (roundFromEnd === 3) return "Tứ kết";
  return `Vòng ${round}`;
};

function PlayerRow({
  player,
  scores,
  isWinner,
}: {
  player: ClubBracketMatch["player1"] | null;
  scores?: (number | null)[];
  isWinner: boolean;
}) {
  if (!player) {
    return (
      <div className="flex items-center gap-2 py-2">
        <div className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-400">
          —
        </div>
        <span className="text-gray-400 italic text-sm">
          Chưa có đối thủ (BYE)
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 py-1.5">
      <Avatar className="w-8 h-8">
        <AvatarImage src={player.clubLogoUrl ?? undefined} />
        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
          {player.clubName.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div
          className={`font-semibold truncate ${
            isWinner
              ? "text-green-600 dark:text-green-400"
              : "text-gray-900 dark:text-white"
          }`}
          title={player.clubName}
        >
          {player.clubName}
        </div>
        <div
          className="text-xs text-gray-400 truncate"
          title={player.memberName}
        >
          {player.memberName}
        </div>
      </div>

      {scores && scores.length > 0 && (
        <div className="flex items-center gap-1 flex-shrink-0">
          {scores.map((s, i) => {
            if (s === null || s === undefined) return null;
            const wonSet = isWinner; // just highlight all if winner
            return (
              <div
                key={i}
                className={`w-8 h-8 flex items-center justify-center rounded text-sm font-bold ${
                  wonSet
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                {s}
              </div>
            );
          })}
          {isWinner && <Trophy className="w-4 h-4 text-amber-500 ml-0.5" />}
        </div>
      )}
    </div>
  );
}

function ClubMatchCard({
  match,
  isAdmin,
  onUpdate,
}: {
  match: ClubBracketMatch;
  isAdmin: boolean;
  onUpdate: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Card
        className={`min-w-[220px] transition-all ${
          match.status === "IN_PROGRESS"
            ? "border-2 border-blue-400 dark:border-blue-500"
            : match.status === "FINISHED"
              ? "bg-green-50/30 dark:bg-green-950/10"
              : ""
        } hover:shadow-md cursor-pointer`}
        onClick={() =>
          match.status !== "FINISHED" &&
          match.player1 !== null &&
          match.player2 !== null &&
          isAdmin &&
          setModalOpen(true)
        }
      >
        <CardHeader className="pb-2 pt-3 px-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Trận {match.matchIndex}
            </span>
            <Badge
              className={`text-xs font-normal ${getMatchStatusColor(match.status)}`}
            >
              {getMatchStatusText(match.status)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-3 space-y-0">
          <PlayerRow
            player={match.player1}
            scores={match.setScoreP1 ?? undefined}
            isWinner={match.winnerId === match.player1?.participantId}
          />

          <div className="h-px bg-gray-200 dark:bg-gray-700 my-1.5" />

          <PlayerRow
            player={match.player2}
            scores={match.setScoreP2 ?? undefined}
            isWinner={match.winnerId === match.player2?.participantId}
          />

          {match.status === "FINISHED" && match.winnerName && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center gap-1 text-xs">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-semibold text-green-700 dark:text-green-400">
                {match.winnerName}
              </span>
              <span className="text-gray-500">thắng</span>
            </div>
          )}
        </CardContent>
      </Card>

      <MatchScoreModal
        open={modalOpen}
        match={match}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          onUpdate();
        }}
      />
    </>
  );
}

export default function ClubBracketView({
  tournamentId,
  isAdmin = false,
}: ClubBracketViewProps) {
  const router = useRouter();

  const [bracket, setBracket] = useState<ClubBracketResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tournamentId) return;
    setLoading(true);
    clubTournamentBracketApiRequest
      .getClubBracket(tournamentId)
      .then((res) => setBracket(res.payload.data as ClubBracketResponse))
      .catch(() => setBracket(null))
      .finally(() => setLoading(false));
  }, [tournamentId]);

  console.log("Bracket data:", bracket);

  const generateBracket = async () => {
    if (!tournamentId) return;
    try {
      await clubTournamentBracketApiRequest.generateBracket(tournamentId);
      toast.success("Đã tạo bảng đấu");
      router.refresh();
    } catch {
      toast.error("Lỗi khi tạo bảng đấu");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto" />
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Đang tải bảng đấu...
        </p>
      </div>
    );
  }

  if (!bracket?.rounds || bracket.rounds.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-600" />
        </div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Chưa có bảng đấu
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {isAdmin
            ? "Nhấn nút bên dưới để tạo bảng đấu cho giải đấu."
            : "Bảng đấu sẽ được cập nhật sớm."}
        </p>
        {isAdmin && (
          <Button
            onClick={generateBracket}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Tạo Bảng Đấu
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {bracket.categoryName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {bracket.totalRounds} vòng đấu
          </p>
        </div>
        {isAdmin && (
          <Button
            size="sm"
            onClick={generateBracket}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            Tạo lại bảng đấu
          </Button>
        )}
      </div>

      {/* Bracket - horizontal scroll */}
      <div className="overflow-x-auto pb-4">
        <div
          style={{
            display: "flex",
            gap: 24,
            minWidth: "max-content",
            alignItems: "flex-start",
          }}
        >
          {bracket.rounds.map((round) => (
            <div key={round.round}>
              {/* Round header */}
              <div className="text-center mb-4 min-w-[220px]">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {getRoundName(round.round, bracket.totalRounds)}
                  </span>
                  <Badge variant="outline" className="text-xs font-normal">
                    {round.matches.length} trận
                  </Badge>
                </div>
              </div>

              {/* Matches */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {round.matches.map((match) => (
                  <ClubMatchCard
                    key={match.matchId}
                    match={match}
                    isAdmin={isAdmin}
                    onUpdate={() => router.refresh()}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
