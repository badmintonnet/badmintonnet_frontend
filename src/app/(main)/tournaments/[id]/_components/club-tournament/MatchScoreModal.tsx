"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, X } from "lucide-react";
import {
  ClubBracketMatch,
  UpdateClubMatchResultBodyType,
  ClubBracketRubber,
} from "@/schemaValidations/club-match.schema";
import clubTournamentBracketApiRequest from "@/apiRequest/club-tournament-bracket";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

type ScoreTarget =
  | { kind: "match"; payload: ClubBracketMatch }
  | { kind: "rubber"; payload: ClubBracketRubber };

interface MatchScoreModalProps {
  open: boolean;
  target: ScoreTarget | null;
  onClose: () => void;
  onSuccess: () => void;
}

const defaultSets = () => [
  { p1: null, p2: null },
  { p1: null, p2: null },
  { p1: null, p2: null },
];

export default function MatchScoreModal({
  open,
  target,
  onClose,
  onSuccess,
}: MatchScoreModalProps) {
  const [sets, setSets] =
    useState<Array<{ p1: number | null; p2: number | null }>>(defaultSets);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && target) {
      setSets(defaultSets());
    }
  }, [open, target?.kind, target]);

  const matchId =
    target?.kind === "match"
      ? target.payload.matchId
      : target?.kind === "rubber"
        ? target.payload.matchId
        : "";

  const side1Club =
    target?.kind === "match"
      ? (target.payload.player1?.clubName ?? "—")
      : target?.kind === "rubber"
        ? (target.payload.club1Players?.[0]?.clubName ?? "—")
        : "—";
  const side2Club =
    target?.kind === "match"
      ? (target.payload.player2?.clubName ?? "—")
      : target?.kind === "rubber"
        ? (target.payload.club2Players?.[0]?.clubName ?? "—")
        : "—";

  const rubberSubtitle =
    target?.kind === "rubber" && target.payload.label
      ? target.payload.label
      : undefined;

  const side1Labels =
    target?.kind === "match"
      ? (target.payload.player1?.memberName ?? "Đấu thủ 1")
      : target?.kind === "rubber"
        ? (target.payload.club1Players ?? [])
            .map((p) => p.memberName ?? "—")
            .join(" / ")
        : "—";

  const side2Labels =
    target?.kind === "match"
      ? (target.payload.player2?.memberName ?? "Đấu thủ 2")
      : target?.kind === "rubber"
        ? (target.payload.club2Players ?? [])
            .map((p) => p.memberName ?? "—")
            .join(" / ")
        : "—";

  const handleSetChange = (
    setIndex: number,
    player: "p1" | "p2",
    value: string,
  ) => {
    const numValue = value === "" ? null : parseInt(value, 10);
    if (numValue !== null && (numValue < 0 || numValue > 30)) return;

    setSets((prev) => {
      const next = [...prev];
      next[setIndex] = { ...next[setIndex], [player]: numValue };
      return next;
    });
  };

  const handleAddSet = () => {
    if (sets.length < 3) {
      setSets((prev) => [...prev, { p1: null, p2: null }]);
    }
  };

  const handleRemoveSet = (setIndex: number) => {
    if (sets.length > 1) {
      setSets((prev) => prev.filter((_, i) => i !== setIndex));
    }
  };

  const handleSubmit = async () => {
    const validSets = sets.filter((s) => s.p1 !== null && s.p2 !== null);
    if (validSets.length === 0) {
      toast.error("Cần nhập ít nhất 1 ván");
      return;
    }
    if (!matchId) return;

    setSubmitting(true);
    try {
      const body: UpdateClubMatchResultBodyType = { sets: validSets };
      await clubTournamentBracketApiRequest.updateMatchResult(matchId, body);
      toast.success("Đã cập nhật tỉ số");
      onSuccess();
    } catch {
      toast.error("Lỗi khi cập nhật tỉ số");
    } finally {
      setSubmitting(false);
    }
  };

  const detailLine1 =
    target?.kind === "match"
      ? (target.payload.player1?.memberName ?? "—")
      : side1Labels;
  const detailLine2 =
    target?.kind === "match"
      ? (target.payload.player2?.memberName ?? "—")
      : side2Labels;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật tỉ số</DialogTitle>
          <DialogDescription>
            {rubberSubtitle ? (
              <span className="font-medium text-foreground">
                {rubberSubtitle}
              </span>
            ) : null}
            {rubberSubtitle ? " · " : null}
            Nhập kết quả từng set. Điểm hợp lệ: 21 (cách biệt ≥ 2) hoặc deuce
            đến 30.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                CLB 1
              </Badge>
              <span className="font-semibold text-gray-900 dark:text-white">
                {side1Club}
              </span>
            </div>
            <span className="text-gray-600 dark:text-gray-400 text-xs ml-14">
              {detailLine1}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                CLB 2
              </Badge>
              <span className="font-semibold text-gray-900 dark:text-white">
                {side2Club}
              </span>
            </div>
            <span className="text-gray-600 dark:text-gray-400 text-xs ml-14">
              {detailLine2}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {sets.map((set, setIndex) => (
            <div key={setIndex} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Set {setIndex + 1}
                </span>
                {sets.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSet(setIndex)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                    {side1Labels}
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={30}
                    value={set.p1 ?? ""}
                    onChange={(e) =>
                      handleSetChange(setIndex, "p1", e.target.value)
                    }
                    placeholder="0"
                    className="h-10 text-center text-lg font-bold"
                  />
                </div>
                <div className="text-gray-400 font-bold text-xl pt-5">:</div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                    {side2Labels}
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={30}
                    value={set.p2 ?? ""}
                    onChange={(e) =>
                      handleSetChange(setIndex, "p2", e.target.value)
                    }
                    placeholder="0"
                    className="h-10 text-center text-lg font-bold"
                  />
                </div>
              </div>
            </div>
          ))}

          {sets.length < 3 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddSet}
              className="w-full text-xs"
            >
              + Thêm set
            </Button>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !target}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Lưu kết quả
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
