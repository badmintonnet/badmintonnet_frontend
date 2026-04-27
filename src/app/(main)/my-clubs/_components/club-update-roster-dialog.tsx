"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Users, Crown, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ClubTournamentParticipant,
  ClubRosterMember,
} from "@/schemaValidations/tournament.schema";
import clubTournamentApiRequest from "@/apiRequest/club-tournament";
import { toast } from "sonner";

interface UpdateRosterDialogProps {
  participant: ClubTournamentParticipant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

export default function UpdateRosterDialog({
  participant,
  open,
  onOpenChange,
  onUpdated,
}: UpdateRosterDialogProps) {
  const [members, setMembers] = useState<ClubRosterMember[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open || !participant) return;
    setSearch("");
    setLoading(true);
    // Hiển thị ngay lựa chọn hiện tại (tránh flash trống)
    const initialIds = participant.roster?.map((r) => r.accountId) ?? [];
    setSelected(initialIds);
    if (participant.roster?.length) setMembers(participant.roster);

    clubTournamentApiRequest
      .getParticipantDetail(participant.id)
      .then((res) => {
        const roster = res.payload.data?.roster ?? [];
        setMembers(roster);
        setSelected(roster.map((r: ClubRosterMember) => r.accountId));
      })
      .catch(() => toast.error("Không thể tải danh sách thành viên"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, participant?.id]);

  const toggle = (accountId: string) =>
    setSelected((prev) =>
      prev.includes(accountId)
        ? prev.filter((x) => x !== accountId)
        : [...prev, accountId],
    );

  const filteredMembers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.fullName.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q),
    );
  }, [members, search]);

  const handleSelectAll = () => setSelected(members.map((m) => m.accountId));
  const handleClear = () => setSelected([]);

  const handleSubmit = async () => {
    if (!participant) return;
    if (selected.length === 0) {
      toast.error("Vui lòng chọn ít nhất một thành viên");
      return;
    }
    setSubmitting(true);
    try {
      await clubTournamentApiRequest.updateRoster(participant.id, {
        rosterAccountIds: selected,
      });
      toast.success("Cập nhật danh sách thành viên thành công");
      onUpdated();
      onOpenChange(false);
    } catch {
      toast.error("Không thể cập nhật danh sách thành viên");
    } finally {
      setSubmitting(false);
    }
  };

  const initialIds = useMemo(
    () =>
      (participant?.roster ?? [])
        .map((r) => r.accountId)
        .sort()
        .join(","),
    [participant?.roster],
  );
  const currentIds = useMemo(() => [...selected].sort().join(","), [selected]);
  const unchanged = initialIds === currentIds;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="truncate">
                Cập nhật roster – {participant?.clubName ?? ""}
              </DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                Chọn các thành viên sẽ tham gia giải đấu này. Bạn có thể cập
                nhật trước khi CLB được duyệt.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm thành viên theo tên hoặc email…"
              className="pl-8 h-9 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={handleSelectAll}
              disabled={loading || members.length === 0}
              className="px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
            >
              Chọn tất cả
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={loading || selected.length === 0}
              className="px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
            >
              Bỏ chọn
            </button>
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-gray-600 dark:text-gray-300">
            Đã chọn{" "}
            <span className="text-teal-600 dark:text-teal-300">
              {selected.length}
            </span>{" "}
            / {members.length} thành viên
          </span>
          {unchanged && (
            <span className="text-gray-400 dark:text-gray-500 italic">
              Chưa có thay đổi
            </span>
          )}
        </div>

        {/* List */}
        <div className="flex-1 min-h-0 overflow-y-auto -mx-1 px-1">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
            </div>
          ) : filteredMembers.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-8">
              {members.length === 0
                ? "Chưa có thành viên khả dụng."
                : "Không có thành viên khớp với từ khóa."}
            </p>
          ) : (
            <div className="space-y-1.5">
              {filteredMembers.map((m) => {
                const checked = selected.includes(m.accountId);
                return (
                  <label
                    key={m.accountId}
                    htmlFor={`roster-${m.accountId}`}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      checked
                        ? "border-teal-400 bg-teal-50/60 dark:bg-teal-900/20 dark:border-teal-700"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Checkbox
                      id={`roster-${m.accountId}`}
                      checked={checked}
                      onCheckedChange={() => toggle(m.accountId)}
                    />
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={m.avatarUrl ?? undefined} />
                      <AvatarFallback className="bg-teal-100 text-teal-700 text-xs font-semibold">
                        {m.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">
                          {m.fullName}
                        </p>
                        {m.role === "OWNER" && (
                          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 text-[10px] px-1.5 py-0 gap-1">
                            <Crown className="w-3 h-3" />
                            Chủ CLB
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {m.email ?? "—"}
                        {m.skillLevel && (
                          <>
                            <span className="mx-1.5 text-gray-300">•</span>
                            {m.skillLevel}
                          </>
                        )}
                      </p>
                    </div>
                    {checked && (
                      <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" />
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              submitting || loading || unchanged || selected.length === 0
            }
            className="bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
