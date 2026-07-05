"use client";

import { cn } from "@/lib/utils";
import type { TournamentMatchSchemaType } from "@/schemaValidations/match";
import { PencilLine } from "lucide-react";

const STATUS_BG: Record<string, string> = {
  NOT_STARTED:
    "border-sky-200 dark:border-sky-800 bg-sky-50/60 dark:bg-sky-950/30",
  IN_PROGRESS:
    "border-emerald-300 dark:border-emerald-700 bg-emerald-50/60 dark:bg-emerald-950/30",
  FINISHED: "border-border bg-card",
  CANCELLED:
    "border-rose-200 dark:border-rose-800 bg-rose-50/60 dark:bg-rose-950/30",
};

const STATUS_PILL: Record<string, string> = {
  NOT_STARTED:
    "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
  IN_PROGRESS:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 animate-pulse",
  FINISHED:
    "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  CANCELLED:
    "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
};

const STATUS_LABEL: Record<string, string> = {
  NOT_STARTED: "Chưa đấu",
  IN_PROGRESS: "Đang đấu",
  FINISHED: "KT",
  CANCELLED: "Hủy",
};

function PlayerRow({
  name,
  scores,
  isWinner,
  hasResult,
}: {
  name: string | null;
  scores: number[] | null;
  isWinner: boolean;
  hasResult: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded px-1.5 py-0.5",
        isWinner && "bg-emerald-50 dark:bg-emerald-950/40",
      )}
    >
      <span
        className={cn(
          "flex-1 truncate text-xs font-medium",
          isWinner
            ? "font-semibold text-emerald-700 dark:text-emerald-400"
            : hasResult
              ? "text-muted-foreground line-through"
              : "text-foreground",
          !name && "italic text-muted-foreground",
        )}
      >
        {name ?? "TBD"}
      </span>
      {scores && scores.length > 0 && (
        <div className="flex gap-0.5 shrink-0">
          {scores.map((s, i) => (
            <span
              key={i}
              className={cn(
                "flex h-5 w-6 items-center justify-center rounded text-[10px] font-bold",
                isWinner
                  ? "bg-emerald-600 text-white"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

interface Props {
  match: TournamentMatchSchemaType;
  isFinal?: boolean;
  isAdmin?: boolean;
  onEditMatch?: (match: TournamentMatchSchemaType) => void;
}

export default function BracketMatchCard({
  match,
  isFinal,
  isAdmin,
  onEditMatch,
}: Props) {
  const p1Wins = !!match.winnerId && match.winnerId === match.player1Id;
  const p2Wins = !!match.winnerId && match.winnerId === match.player2Id;
  const hasResult = match.status === "FINISHED";

  // Chỉ admin mới nhập được điểm, và chỉ khi cặp đấu đã đủ 2 VĐV
  // và trận chưa kết thúc / chưa bị hủy (tránh sửa lại kết quả đã chốt).
  const canScore =
    !!isAdmin &&
    !!onEditMatch &&
    !!match.player1Id &&
    !!match.player2Id &&
    match.status !== "FINISHED" &&
    match.status !== "CANCELLED";

  return (
    <div
      className={cn(
        "w-52 min-h-[88px] rounded-lg border shadow-sm flex flex-col gap-1 p-2",
        STATUS_BG[match.status] ?? STATUS_BG.NOT_STARTED,
        isFinal &&
          "ring-2 ring-amber-400/40 border-amber-300/60 dark:border-amber-700/60",
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between px-0.5">
        <span className="text-[10px] font-medium text-muted-foreground">
          M{match.matchIndex}
        </span>
        <span
          className={cn(
            "rounded px-1.5 py-0.5 text-[10px] font-medium",
            STATUS_PILL[match.status] ?? STATUS_PILL.NOT_STARTED,
          )}
        >
          {STATUS_LABEL[match.status] ?? match.status}
        </span>
      </div>

      {/* Player rows */}
      <PlayerRow
        name={match.player1Name}
        scores={match.setScoreP1}
        isWinner={p1Wins}
        hasResult={hasResult}
      />
      <PlayerRow
        name={match.player2Name}
        scores={match.setScoreP2}
        isWinner={p2Wins}
        hasResult={hasResult}
      />

      {canScore && (
        <button
          type="button"
          onClick={() => onEditMatch?.(match)}
          className="mt-0.5 flex items-center justify-center gap-1 rounded-md border border-teal-500/40 bg-teal-50/70 px-1.5 py-1 text-[10px] font-medium text-teal-700 transition-colors hover:bg-teal-100 dark:border-teal-800/55 dark:bg-teal-950/35 dark:text-teal-300 dark:hover:bg-teal-900/50"
        >
          <PencilLine className="h-3 w-3" />
          Nhập điểm
        </button>
      )}
    </div>
  );
}
