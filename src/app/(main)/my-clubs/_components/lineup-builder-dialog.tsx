"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import clubTournamentBracketApiRequest from "@/apiRequest/club-tournament-bracket";
import clubTournamentApiRequest from "@/apiRequest/club-tournament";
import type {
  ClubLineupDataType,
  ClubLineupSlot,
} from "@/schemaValidations/club-lineup.schema";
import type {
  ClubRosterMember,
  ClubTournamentParticipant,
} from "@/schemaValidations/tournament.schema";

function lineTypeVi(t: string) {
  switch (t) {
    case "SINGLES":
      return "Đơn";
    case "MEN_DOUBLES":
      return "Đôi nam";
    case "WOMEN_DOUBLES":
      return "Đôi nữ";
    case "MIXED_DOUBLES":
      return "Đôi hỗn hợp";
    default:
      return t;
  }
}

function slotHeading(slot: ClubLineupSlot) {
  let s = `${lineTypeVi(slot.lineType)}`;
  if (slot.lineIndex != null) s += ` #${slot.lineIndex}`;
  if (slot.playerSlot != null)
    s += slot.playerSlot === 1 ? " — VĐV 1" : " — VĐV 2";
  return `${s} (${slot.position})`;
}

/** Chỉ giữ rosterEntryId nếu còn trong danh sách đăng ký — tránh Radix Select lỗi giá trị lạ. */
function selectValueForSlot(
  chosen: string | undefined,
  roster: ClubRosterMember[],
): string {
  if (!chosen) return "__empty__";
  return roster.some((m) => m.rosterEntryId === chosen) ? chosen : "__empty__";
}

interface LineupBuilderDialogProps {
  participant: ClubTournamentParticipant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

export default function LineupBuilderDialog({
  participant,
  open,
  onOpenChange,
  onSaved,
}: LineupBuilderDialogProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lineup, setLineup] = useState<ClubLineupDataType | null>(null);
  const [local, setLocal] = useState<Record<string, string>>({});
  /** Roster đầy đủ — luôn lấy từ GET participant detail; tab My Club chỉ trả rosterSize, không trả list. */
  const [rosterMembers, setRosterMembers] = useState<ClubRosterMember[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [lineupSettled, detailSettled] = await Promise.allSettled([
        clubTournamentBracketApiRequest.getLineup(participant.id),
        clubTournamentApiRequest.getParticipantDetail(participant.id),
      ]);

      if (
        lineupSettled.status !== "fulfilled" ||
        !lineupSettled.value.payload?.data
      ) {
        toast.error("Không tải được lineup.");
        setLineup(null);
        setRosterMembers([]);
        return;
      }

      const data = lineupSettled.value.payload.data;
      setLineup(data);
      const initial: Record<string, string> = {};
      for (const s of data.slots ?? []) {
        initial[s.position] = s.rosterEntryId ?? "";
      }
      setLocal(initial);

      if (detailSettled.status === "fulfilled") {
        const roster =
          detailSettled.value.payload?.data?.roster ?? participant.roster ?? [];
        setRosterMembers(roster);
      } else {
        toast.error(
          "Không tải được danh sách thành viên đăng ký — thử Cập nhật roster rồi mở lại.",
        );
        setRosterMembers(participant.roster ?? []);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Không tải được dữ liệu lineup."));
      setLineup(null);
      setRosterMembers(participant.roster ?? []);
    } finally {
      setLoading(false);
    }
  }, [participant.id, participant.roster]);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  const handleSave = async () => {
    if (!lineup || lineup.locked) {
      toast.error("Lineup đã khóa.");
      return;
    }
    const patch: Record<string, string> = {};
    for (const slot of lineup.slots) {
      const next = local[slot.position] ?? "";
      const prev = slot.rosterEntryId ?? "";
      if (next !== prev) patch[slot.position] = next;
    }
    if (Object.keys(patch).length === 0) {
      toast.info("Không có thay đổi để lưu.");
      return;
    }
    setSaving(true);
    try {
      const res = await clubTournamentBracketApiRequest.setLineup(
        participant.id,
        { lineup: patch },
      );
      setLineup(res.payload.data);
      const nextLocal: Record<string, string> = {};
      for (const s of res.payload.data.slots ?? []) {
        nextLocal[s.position] = s.rosterEntryId ?? "";
      }
      setLocal(nextLocal);
      toast.success("Đã lưu lineup");
      onSaved?.();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lưu lineup thất bại"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Xếp lineup giải đấu</DialogTitle>
          <DialogDescription>
            Chọn VĐV cho từng vị trí theo format giải. Có thể lưu từng phần; có
            thể gỡ chọn (trống) để xóa ô đó.
            {lineup?.locked ? (
              <span className="block mt-2 font-semibold text-amber-600">
                Lineup đã khóa (giải đã bắt đầu).
              </span>
            ) : null}
          </DialogDescription>
        </DialogHeader>

        {loading || !lineup ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          </div>
        ) : lineup.slots.length === 0 ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
            <p className="font-semibold">Chưa có vị trí xếp lineup</p>
            <p className="mt-1 text-amber-800/90 dark:text-amber-200/90">
              Format giải (team match) đang trống hoặc tất cả số ván = 0 trong
              DB. Ví dụ chỉ đôi nam = 1 thì JSON cần có{" "}
              <code className="select-all">menDoubles: 1</code> (hoặc{" "}
              <code className="select-all">men_doubles</code>). Yêu cầu ban tổ
              chức lưu lại format giải hoặc kiểm tra dữ liệu tournament.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Đã chọn{" "}
              <span className="font-bold text-violet-600">
                {lineup.filledCount}
              </span>
              /{lineup.totalSlots} vị trí
              {lineup.complete ? (
                <span className="ml-2 text-emerald-600 font-semibold">
                  (đủ)
                </span>
              ) : null}
            </p>
            {rosterMembers.length === 0 ? (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/25">
                Chưa có thành viên trong roster đăng ký giải. Hãy dùng{" "}
                <strong>Cập nhật roster</strong> trên trang CLB để thêm người,
                rồi mở lại dialog này.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {rosterMembers.length} thành viên có thể xếp vào các ô.
              </p>
            )}
            <div className="space-y-3">
              {lineup.slots.map((slot) => (
                <div
                  key={slot.position}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 space-y-1.5"
                >
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                    {slotHeading(slot)}
                  </p>
                  <Select
                    value={selectValueForSlot(
                      local[slot.position],
                      rosterMembers,
                    )}
                    disabled={lineup.locked}
                    onValueChange={(v) =>
                      setLocal((prev) => ({
                        ...prev,
                        [slot.position]: v === "__empty__" ? "" : v,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="— Chưa chọn —" />
                    </SelectTrigger>
                    <SelectContent className="z-[300] max-h-[min(60vh,320px)]">
                      <SelectItem value="__empty__">— Trống —</SelectItem>
                      {rosterMembers.map((m) => (
                        <SelectItem
                          key={m.rosterEntryId}
                          value={m.rosterEntryId}
                        >
                          {m.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button
            onClick={() => void handleSave()}
            disabled={
              saving ||
              loading ||
              !lineup ||
              lineup.locked ||
              lineup.slots.length === 0
            }
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
