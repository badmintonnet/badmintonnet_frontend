"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Trophy,
  ArrowRight,
  Sparkles,
  ArrowDownAZ,
  ArrowUpAZ,
} from "lucide-react";
import { ClubTournamentParticipant } from "@/schemaValidations/tournament.schema";
import ClubTournamentRegistrationCard from "./club-tournament-registration-card";
import UpdateRosterDialog from "./club-update-roster-dialog";
import CancelRegistrationDialog from "./club-cancel-registration-dialog";

interface ClubTournamentRegistrationsProps {
  participations: ClubTournamentParticipant[];
}

type FilterKey = "all" | "pending" | "approved" | "done" | "cancelled";

const FILTER_CONFIG: Record<
  FilterKey,
  { label: string; statuses: ClubTournamentParticipant["status"][] | null }
> = {
  all: { label: "Tất cả", statuses: null },
  pending: {
    label: "Đang chờ",
    statuses: ["DRAFT", "PENDING", "PAYMENT_REQUIRED", "PAID"],
  },
  approved: { label: "Đã duyệt", statuses: ["APPROVED"] },
  done: { label: "Đã kết thúc", statuses: ["ELIMINATED"] },
  cancelled: { label: "Đã hủy / Từ chối", statuses: ["CANCELLED", "REJECTED"] },
};

export default function ClubTournamentRegistrations({
  participations: initialParticipations,
}: ClubTournamentRegistrationsProps) {
  const [participations, setParticipations] = useState(initialParticipations);
  const [updateTarget, setUpdateTarget] =
    useState<ClubTournamentParticipant | null>(null);
  const [cancelTarget, setCancelTarget] =
    useState<ClubTournamentParticipant | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sortDesc, setSortDesc] = useState(true);

  const handleUpdated = useCallback(() => {
    // Parent sẽ revalidate qua router.refresh() nếu cần
  }, []);

  const handleCancelled = useCallback(() => {
    if (!cancelTarget) return;
    setParticipations((prev) =>
      prev.map((p) =>
        p.id === cancelTarget.id
          ? ({ ...p, status: "CANCELLED" } as ClubTournamentParticipant)
          : p,
      ),
    );
  }, [cancelTarget]);

  // Thống kê nhanh cho từng nhóm
  const stats = useMemo(() => {
    const base = {
      all: participations.length,
      pending: 0,
      approved: 0,
      done: 0,
      cancelled: 0,
    };
    for (const p of participations) {
      if (["DRAFT", "PENDING", "PAYMENT_REQUIRED", "PAID"].includes(p.status))
        base.pending += 1;
      else if (p.status === "APPROVED") base.approved += 1;
      else if (p.status === "ELIMINATED") base.done += 1;
      else if (["CANCELLED", "REJECTED"].includes(p.status))
        base.cancelled += 1;
    }
    return base;
  }, [participations]);

  const filteredSorted = useMemo(() => {
    const cfg = FILTER_CONFIG[filter];
    const list = cfg.statuses
      ? participations.filter((p) => cfg.statuses!.includes(p.status))
      : [...participations];
    return list.sort((a, b) => {
      const ta = a.registeredAt ? new Date(a.registeredAt).getTime() : 0;
      const tb = b.registeredAt ? new Date(b.registeredAt).getTime() : 0;
      return sortDesc ? tb - ta : ta - tb;
    });
  }, [participations, filter, sortDesc]);

  // ----- Empty state (chưa đăng ký giải nào) -----
  if (participations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-violet-200 dark:border-violet-900/50 bg-gradient-to-br from-violet-50/60 via-white to-indigo-50/40 dark:from-violet-950/30 dark:via-gray-900 dark:to-indigo-950/20 p-8 md:p-12">
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1">
            CLB chưa đăng ký giải đấu nào
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Hãy khám phá các giải đấu đang mở đăng ký và đưa CLB của bạn tranh
            tài cùng các đội khác.
          </p>
          <Link
            href="/tournaments"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Khám phá giải đấu
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ===== Section header ===== */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                Giải đấu đã đăng ký
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Quản lý các giải đấu mà CLB của bạn đang tham gia
              </p>
            </div>
          </div>

          <Link
            href="/tournaments"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:hover:bg-violet-900/50 dark:text-violet-300 text-sm font-semibold transition-colors self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            Khám phá giải đấu
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ===== Stats chips ===== */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
          <StatChip label="Tổng" value={stats.all} tone="violet" />
          <StatChip label="Đang chờ" value={stats.pending} tone="amber" />
          <StatChip label="Đã duyệt" value={stats.approved} tone="emerald" />
          <StatChip label="Kết thúc" value={stats.done} tone="blue" />
          <StatChip label="Hủy / Từ chối" value={stats.cancelled} tone="rose" />
        </div>
      </div>

      {/* ===== Filter + sort ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(FILTER_CONFIG) as FilterKey[]).map((key) => {
            const active = key === filter;
            const count =
              key === "all"
                ? stats.all
                : stats[key as Exclude<FilterKey, "all">];
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  active
                    ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-300"
                }`}
              >
                {FILTER_CONFIG[key].label}
                <span
                  className={`inline-flex items-center justify-center min-w-[1.25rem] h-5 rounded-full px-1.5 text-[10px] font-bold ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setSortDesc((v) => !v)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-300 transition-colors self-start md:self-auto"
          title="Đổi thứ tự theo ngày đăng ký"
        >
          {sortDesc ? (
            <ArrowDownAZ className="w-3.5 h-3.5" />
          ) : (
            <ArrowUpAZ className="w-3.5 h-3.5" />
          )}
          {sortDesc ? "Mới nhất" : "Cũ nhất"}
        </button>
      </div>

      {/* ===== List ===== */}
      {filteredSorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white/40 dark:bg-gray-800/30 py-10 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Không có đăng ký nào ở trạng thái này.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSorted.map((p) => (
            <ClubTournamentRegistrationCard
              key={p.id}
              participant={p}
              onUpdate={setUpdateTarget}
              onCancel={setCancelTarget}
              onRepresentativeChanged={handleUpdated}
            />
          ))}
        </div>
      )}

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
    </div>
  );
}

// ---- Helpers ----

function StatChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "violet" | "amber" | "emerald" | "blue" | "rose";
}) {
  const toneMap: Record<typeof tone, string> = {
    violet:
      "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800/50",
    amber:
      "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50",
    emerald:
      "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/50",
    blue: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50",
    rose: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800/50",
  };
  return (
    <div
      className={`rounded-xl border px-3 py-2 flex items-center justify-between ${toneMap[tone]}`}
    >
      <span className="text-[11px] font-semibold uppercase tracking-wide">
        {label}
      </span>
      <span className="text-lg font-extrabold leading-none">{value}</span>
    </div>
  );
}
