"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Sparkles, Calendar, PencilLine, Swords } from "lucide-react";
import MatchScoreModal from "./MatchScoreModal";
import type { ClubMatchParticipant } from "@/schemaValidations/club-match.schema";
import {
  ClubBracketMatch,
  ClubBracketResponse,
  ClubBracketTie,
  ClubBracketRubber,
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
      return "Chưa đấu";
    case "IN_PROGRESS":
      return "Đang đấu";
    case "FINISHED":
      return "Hoàn thành";
    case "CANCELLED":
      return "Đã hủy";
    case "SKIPPED":
      return "Không đấu";
    default:
      return status || "—";
  }
};

const getMatchStatusColor = (status: string) => {
  switch (status) {
    case "NOT_STARTED":
      return "bg-sky-50 text-sky-800 border-sky-200/80 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/60";
    case "IN_PROGRESS":
      return "bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/45 dark:text-emerald-300 dark:border-emerald-800/60";
    case "FINISHED":
      return "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800/70 dark:text-zinc-300 dark:border-zinc-600/60";
    case "CANCELLED":
      return "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/35 dark:text-rose-300 dark:border-rose-800/55";
    case "SKIPPED":
      return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/55 dark:text-slate-400 dark:border-slate-600/55";
    default:
      return "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-600";
  }
};

function getRoundName(round: number, totalRounds: number) {
  const roundFromEnd = totalRounds - round + 1;
  if (roundFromEnd === 1) return "Chung kết";
  if (roundFromEnd === 2) return "Bán kết";
  if (roundFromEnd === 3) return "Tứ kết";
  return `Vòng ${round}`;
}

function ClubAvatarBadge({
  club,
  emphasized,
}: {
  club: ClubMatchParticipant | null | undefined;
  emphasized?: boolean;
}) {
  if (!club?.clubName) {
    return (
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dashed border-muted-foreground/35 bg-muted/30 text-xs text-muted-foreground">
          ?
        </div>
        <span className="truncate text-xs font-medium text-muted-foreground">
          Chưa xếp đội hình
        </span>
      </div>
    );
  }

  const initial = club.clubName.trim().charAt(0).toUpperCase();

  return (
    <div
      className={`flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border px-2 py-1.5 transition-colors ${
        emphasized
          ? "border-teal-500/50 bg-teal-50/80 dark:bg-teal-950/35 dark:border-teal-700/55"
          : "border-transparent bg-muted/25 dark:bg-muted/15"
      }`}
    >
      <Avatar className="h-10 w-10 shrink-0 rounded-xl border border-border shadow-sm">
        <AvatarImage
          src={club.clubLogoUrl ?? undefined}
          className="object-cover"
        />
        <AvatarFallback className="rounded-xl bg-muted text-sm font-bold text-teal-600 dark:text-teal-400">
          {initial}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p
          className="truncate font-semibold text-sm text-foreground"
          title={club.clubName}
        >
          {club.clubName}
        </p>
      </div>
    </div>
  );
}

function RubberRowStatusDot({ status }: { status?: string }) {
  switch (status) {
    case "FINISHED":
      return (
        <span className="h-2 w-2 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-500" />
      );
    case "IN_PROGRESS":
      return (
        <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_theme(colors.emerald.500)]" />
      );
    case "SKIPPED":
    case "CANCELLED":
      return <span className="h-2 w-2 shrink-0 rounded-full bg-slate-400" />;
    default:
      return (
        <span className="h-2 w-2 shrink-0 rounded-full bg-sky-400/70 dark:bg-sky-500/60" />
      );
  }
}

function PlayerRowLegacy({
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
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 bg-muted/20 text-xs text-muted-foreground">
          —
        </div>
        <span className="text-muted-foreground text-sm italic">BYE</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 py-1.5">
      <Avatar className="h-9 w-9 rounded-lg border border-border">
        <AvatarImage src={player.clubLogoUrl ?? undefined} />
        <AvatarFallback className="rounded-lg bg-muted text-xs font-semibold">
          {player.clubName.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div
          className={`truncate font-semibold text-sm ${
            isWinner
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-foreground"
          }`}
          title={player.clubName}
        >
          {player.clubName}
        </div>
        <div className="truncate text-xs text-muted-foreground">
          {player.memberName ?? " "}
        </div>
      </div>

      {scores && scores.length > 0 && (
        <div className="flex shrink-0 items-center gap-1">
          {scores.map((s, i) => {
            if (s === null || s === undefined) return null;
            return (
              <div
                key={i}
                className={`flex h-7 w-8 items-center justify-center rounded-md text-xs font-bold ${
                  isWinner
                    ? "bg-emerald-600 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </div>
            );
          })}
          {isWinner && <Trophy className="ml-0.5 h-3.5 w-3.5 text-amber-500" />}
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

  const canScore =
    isAdmin &&
    match.status !== "FINISHED" &&
    match.status !== "SKIPPED" &&
    match.status !== "CANCELLED" &&
    match.player1 !== null &&
    match.player2 !== null;

  const p1Winner = match.winnerId === match.player1?.participantId;
  const p2Winner = match.winnerId === match.player2?.participantId;

  return (
    <>
      <Card
        className={`w-full overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md ${
          match.status === "IN_PROGRESS"
            ? "ring-2 ring-emerald-500/35 border-emerald-500/35"
            : match.status === "FINISHED"
              ? "border-border/90"
              : "border-border/80"
        }`}
      >
        <CardHeader className="space-y-0 border-b bg-muted/20 px-3 py-3 sm:px-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-[11px] font-bold tabular-nums">
                #{match.matchIndex}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wide">
                Đơn · 1 ván
              </span>
            </div>
            <Badge
              className={`shrink-0 text-[11px] font-medium ${getMatchStatusColor(match.status)}`}
            >
              {getMatchStatusText(match.status)}
            </Badge>
          </div>
          <div className="pointer-events-none mt-3 grid grid-cols-[1fr,auto,1fr] items-center gap-1.5 sm:gap-2">
            <ClubAvatarBadge
              club={match.player1}
              emphasized={Boolean(match.status === "FINISHED" && p1Winner)}
            />
            <div className="flex shrink-0 flex-col items-center gap-1 px-0.5">
              <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                VS
              </span>
              {match.status === "FINISHED" &&
                match.winnerName !== null &&
                match.winnerName !== "" && (
                  <span className="flex max-w-[5rem] items-center gap-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <Trophy className="h-3 w-3 shrink-0 text-amber-500" />
                    <span className="truncate">{match.winnerName}</span>
                  </span>
                )}
            </div>
            <ClubAvatarBadge
              club={match.player2}
              emphasized={Boolean(match.status === "FINISHED" && p2Winner)}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-3 px-3 pb-3 pt-2 sm:px-4">
          <div className="rounded-xl border border-border/60 bg-muted/10 px-2 py-1">
            <PlayerRowLegacy
              player={match.player1}
              scores={match.setScoreP1 ?? undefined}
              isWinner={Boolean(p1Winner)}
            />

            <div className="my-2 h-px bg-border/80" />

            <PlayerRowLegacy
              player={match.player2}
              scores={match.setScoreP2 ?? undefined}
              isWinner={Boolean(p2Winner)}
            />
          </div>

          {canScore && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 w-full rounded-xl border-teal-500/40 bg-teal-50/70 text-teal-800 hover:bg-teal-50 dark:bg-teal-950/35 dark:text-teal-200 dark:border-teal-800/55"
              onClick={() => setModalOpen(true)}
            >
              <PencilLine className="mr-2 h-3.5 w-3.5" />
              Nhập / cập nhật điểm
            </Button>
          )}
          {isAdmin && !canScore && match.player1 && match.player2 && (
            <p className="text-center text-[11px] text-muted-foreground">
              Không chỉnh sửa được trận đã kết thúc hoặc đã huỷ.
            </p>
          )}
        </CardContent>
      </Card>

      <MatchScoreModal
        open={modalOpen}
        target={modalOpen ? { kind: "match", payload: match } : null}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          onUpdate();
        }}
      />
    </>
  );
}

function ClubTieCard({
  tie,
  isAdmin,
  onUpdate,
}: {
  tie: ClubBracketTie;
  isAdmin: boolean;
  onUpdate: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [rubberTarget, setRubberTarget] = useState<ClubBracketRubber | null>(
    null,
  );

  const rubbers = tie.rubbers ?? [];

  const canEditRubber = (r: ClubBracketRubber) =>
    isAdmin &&
    r.status !== "FINISHED" &&
    r.status !== "SKIPPED" &&
    r.status !== "CANCELLED";

  const decidedRubbersCount = rubbers.filter(
    (r) =>
      r.status === "FINISHED" ||
      r.status === "SKIPPED" ||
      r.status === "CANCELLED",
  ).length;

  const p1WinnerTie =
    tie.status === "FINISHED" &&
    tie.winnerClubParticipantId === tie.club1?.participantId;
  const p2WinnerTie =
    tie.status === "FINISHED" &&
    tie.winnerClubParticipantId === tie.club2?.participantId;

  const editableCount = rubbers.filter((r) => canEditRubber(r)).length;

  return (
    <>
      <Card
        className={`w-full overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md ${
          tie.status === "IN_PROGRESS"
            ? "ring-2 ring-violet-500/35 border-violet-500/30"
            : tie.status === "FINISHED"
              ? "border-border/90"
              : "border-border/80"
        }`}
      >
        <CardHeader className="space-y-3 border-b bg-gradient-to-br from-muted/40 via-muted/15 to-transparent px-3 py-3 sm:px-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-7 items-center rounded-lg bg-violet-500/15 px-2 text-[11px] font-bold text-violet-800 dark:bg-violet-950/55 dark:text-violet-300">
                <Swords className="mr-1.5 h-3.5 w-3.5" />
                Tie #{tie.matchIndex}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {rubbers.length} ván trong cặp đấu
              </span>
            </div>
            <Badge
              className={`text-[11px] font-medium ${getMatchStatusColor(tie.status)}`}
            >
              {getMatchStatusText(tie.status)}
            </Badge>
          </div>

          {/* Scoreboard */}
          <div className="grid grid-cols-[1fr,auto,1fr] items-stretch gap-2 sm:gap-3">
            <ClubAvatarBadge
              club={tie.club1}
              emphasized={Boolean(p1WinnerTie)}
            />
            <div className="flex min-w-[4.75rem] flex-col items-center justify-center gap-1 rounded-xl border border-border/70 bg-background/80 px-2 py-2 shadow-inner">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Tỷ số
              </span>
              <p className="text-xl font-black tabular-nums tracking-tight text-violet-700 dark:text-violet-300 sm:text-2xl">
                {tie.club1RubberWins}
                <span className="mx-1 text-muted-foreground/60">:</span>
                {tie.club2RubberWins}
              </p>
              {rubbers.length > 0 && (
                <div className="mt-0.5 h-1 w-full max-w-[5rem] overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-violet-500/80 transition-all"
                    style={{
                      width: `${Math.min(100, (decidedRubbersCount / rubbers.length) * 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>
            <ClubAvatarBadge
              club={tie.club2}
              emphasized={Boolean(p2WinnerTie)}
            />
          </div>

          {tie.status === "FINISHED" && tie.winnerClubParticipantId && (
            <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                CLB thắng tie
              </span>
              {tie.club1SetsWon + tie.club2SetsWon > 0 && (
                <>
                  {" "}
                  · Tổng set đã đấu:{" "}
                  <span className="tabular-nums font-medium text-foreground">
                    {tie.club1SetsWon} – {tie.club2SetsWon}
                  </span>
                </>
              )}
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-2 px-3 pb-3 pt-3 sm:px-4">
          <div className="flex items-center justify-between px-0.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Lịch ván
            </p>
            {isAdmin && editableCount > 0 && (
              <span className="text-[10px] text-teal-700 dark:text-teal-400">
                Chạm ván để nhập điểm
              </span>
            )}
          </div>

          <ul className="space-y-1.5">
            {rubbers.map((r, i) => {
              const open = canEditRubber(r);
              return (
                <li key={r.matchId}>
                  <button
                    type="button"
                    disabled={!open}
                    onClick={() => {
                      if (!open) return;
                      setRubberTarget(r);
                      setModalOpen(true);
                    }}
                    className={`flex w-full items-start gap-2 rounded-xl border px-2.5 py-2 text-left text-xs transition-colors ${
                      open
                        ? "border-border/80 bg-background hover:border-violet-400/50 hover:bg-violet-50/60 dark:hover:bg-violet-950/25"
                        : "cursor-default border-transparent bg-muted/15 opacity-80"
                    }`}
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-bold tabular-nums text-muted-foreground">
                      {i + 1}
                    </span>
                    <RubberRowStatusDot status={r.status ?? ""} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-semibold text-foreground">
                          {r.label ?? `Ván ${i + 1}`}
                        </span>
                        <Badge
                          className={`h-5 px-1.5 text-[10px] font-normal ${getMatchStatusColor(r.status ?? "")}`}
                        >
                          {getMatchStatusText(r.status ?? "")}
                        </Badge>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-[10px] text-muted-foreground">
                        {(r.club1Players ?? [])
                          .map((p) => p.memberName)
                          .filter(Boolean)
                          .join(" / ") || "—"}
                        <span className="mx-1 font-medium text-border">vs</span>
                        {(r.club2Players ?? [])
                          .map((p) => p.memberName)
                          .filter(Boolean)
                          .join(" / ") || "—"}
                      </p>
                    </div>
                    {open && (
                      <PencilLine className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {!isAdmin && (
            <p className="pt-1 text-center text-[10px] text-muted-foreground">
              Chế độ xem · Chỉ quản trị viên được nhập điểm
            </p>
          )}
        </CardContent>
      </Card>

      <MatchScoreModal
        open={modalOpen}
        target={rubberTarget ? { kind: "rubber", payload: rubberTarget } : null}
        onClose={() => {
          setModalOpen(false);
          setRubberTarget(null);
        }}
        onSuccess={() => {
          setModalOpen(false);
          setRubberTarget(null);
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

  const loadBracket = useCallback(() => {
    if (!tournamentId) return;
    setLoading(true);
    clubTournamentBracketApiRequest
      .getClubBracket(tournamentId)
      .then((res) => setBracket(res.payload.data as ClubBracketResponse))
      .catch(() => setBracket(null))
      .finally(() => setLoading(false));
  }, [tournamentId]);

  useEffect(() => {
    loadBracket();
  }, [loadBracket]);

  const generateBracket = async () => {
    if (!tournamentId) return;
    try {
      await clubTournamentBracketApiRequest.generateBracket(tournamentId);
      toast.success("Đã tạo bảng đấu");
      router.refresh();
      loadBracket();
    } catch {
      toast.error("Lỗi khi tạo bảng đấu");
    }
  };

  if (loading) {
    return (
      <div className="py-14 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">
          Đang tải bảng đấu...
        </p>
      </div>
    );
  }

  if (!bracket?.rounds || bracket.rounds.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/20 py-14 text-center">
        <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/55" />
        <h4 className="mb-2 text-lg font-semibold">Chưa có bảng đấu</h4>
        <p className="mx-auto mb-6 max-w-sm text-sm text-muted-foreground">
          {isAdmin
            ? "Tạo bảng đấu để các cặp / tie được xếp vào các vòng loại và loại trực tiếp."
            : "Bảng đấu sẽ hiển thị khi ban tổ chức tạo và phê duyệt lineup."}
        </p>
        {isAdmin && (
          <Button
            onClick={generateBracket}
            className="rounded-xl bg-teal-600 text-white hover:bg-teal-700"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Tạo bảng đấu
          </Button>
        )}
      </div>
    );
  }

  const totalRounds = bracket.totalRounds;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            {bracket.categoryName}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalRounds} vòng · Kéo ngang để xem toàn bracket
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <Button
              size="sm"
              variant="outline"
              onClick={generateBracket}
              className="rounded-xl border-teal-500/35 text-teal-800 hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-950/40"
            >
              <Sparkles className="mr-1.5 h-4 w-4" />
              Tạo lại bracket
            </Button>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 rounded-xl border border-border/70 bg-muted/15 px-3 py-2.5 text-[11px] text-muted-foreground">
        <span className="font-semibold text-foreground">Chú thích:</span>
        <span className="inline-flex items-center gap-1">
          <RubberRowStatusDot status="NOT_STARTED" /> Chưa đấu
        </span>
        <span className="inline-flex items-center gap-1">
          <RubberRowStatusDot status="IN_PROGRESS" /> Đang đấu
        </span>
        <span className="inline-flex items-center gap-1">
          <RubberRowStatusDot status="FINISHED" /> Xong ván / tie
        </span>
      </div>

      <div className="relative -mx-1 overflow-x-auto px-1 pb-2">
        <div className="flex min-w-max items-start gap-0 pb-6 pt-1">
          {bracket.rounds.map((round, roundIdx) => {
            const ties = round.ties ?? [];
            const matches = round.matches ?? [];
            const isTieMode = ties.length > 0;
            const slots = isTieMode ? ties : matches;
            const unitLabel = isTieMode
              ? `${ties.length} tie`
              : `${matches.length} trận`;

            return (
              <div
                key={round.round}
                className={`flex shrink-0 items-start ${
                  roundIdx > 0
                    ? "border-l border-dashed border-border/70 pl-5 sm:pl-7"
                    : ""
                }`}
              >
                <div className="w-[min(calc(100vw-4rem),20rem)] min-w-[16.5rem] max-w-[20rem] sm:min-w-[18rem]">
                  <header className="mb-4 text-center">
                    <div className="mx-auto inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 shadow-sm">
                      <Trophy className="h-4 w-4 shrink-0 text-amber-500" />
                      <span className="font-semibold text-sm">
                        {getRoundName(round.round, totalRounds)}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-normal"
                      >
                        Vòng {round.round}/{totalRounds}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-normal"
                      >
                        {unitLabel}
                      </Badge>
                    </div>
                  </header>

                  <div className="flex flex-col gap-4">
                    {isTieMode
                      ? ties.map((tie, idx) => (
                          <ClubTieCard
                            key={
                              tie.tieId ??
                              `tie-${tie.round}-${tie.matchIndex}-${idx}`
                            }
                            tie={tie}
                            isAdmin={isAdmin}
                            onUpdate={loadBracket}
                          />
                        ))
                      : matches.map((match) => (
                          <ClubMatchCard
                            key={match.matchId}
                            match={match}
                            isAdmin={isAdmin}
                            onUpdate={loadBracket}
                          />
                        ))}
                    {/* Placeholder căn chỉnh khi ít ô */}
                    {slots.length === 0 && (
                      <p className="rounded-xl border border-dashed px-4 py-8 text-center text-xs text-muted-foreground">
                        Không có cặp đấu trong vòng này.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
