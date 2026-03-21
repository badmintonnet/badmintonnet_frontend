"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Loader2, XCircle, Users, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  ClubTournamentParticipant,
  ClubRosterMember,
  getClubTournamentStatusInfo,
} from "@/schemaValidations/tournament.schema";
import clubTournamentApiRequest from "@/apiRequest/club-tournament";
import ClubRosterModal from "@/app/(main)/tournaments/[id]/categories/[categoryId]/_components/club-roster-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ClubTournamentRegistrationsProps {
  participations: ClubTournamentParticipant[];
}

/** Update roster dialog */
function UpdateRosterDialog({
  participant,
  open,
  onOpenChange,
  onUpdated,
}: {
  participant: ClubTournamentParticipant;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onUpdated: () => void;
}) {
  const [members, setMembers] = useState<ClubRosterMember[]>([]);
  const [selected, setSelected] = useState<string[]>(
    participant.roster?.map((r) => r.accountId) ?? [],
  );
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    clubTournamentApiRequest
      .getParticipantDetail(participant.id)
      .then((res) => {
        setMembers(res.payload.data?.roster ?? []);
        setSelected(res.payload.data?.roster?.map((r) => r.accountId) ?? []);
      })
      .catch(() => toast.error("Không thể tải danh sách thành viên"))
      .finally(() => setLoading(false));
  }, [open, participant.id]);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await clubTournamentApiRequest.updateRoster(participant.id, {
        rosterAccountIds: selected, // Gửi account IDs
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật roster – {participant.clubName}</DialogTitle>
          <DialogDescription>
            Chọn thành viên tham gia. Đã chọn: {selected.length} người.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
          </div>
        ) : (
          <div className="space-y-2">
            {members.map((m) => (
              <div
                key={m.clubMemberId}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Checkbox
                  checked={selected.includes(m.clubMemberId)}
                  onCheckedChange={() => toggle(m.clubMemberId)}
                />
                <Avatar className="w-8 h-8">
                  <AvatarImage src={m.avatarUrl ?? undefined} />
                  <AvatarFallback>{m.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{m.fullName}</p>
                  {m.skillLevel && (
                    <p className="text-xs text-gray-400">{m.skillLevel}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || loading}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Cancel registration confirmation dialog */
function CancelDialog({
  participant,
  open,
  onOpenChange,
  onCancelled,
}: {
  participant: ClubTournamentParticipant;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCancelled: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    try {
      await clubTournamentApiRequest.cancelRegistration(participant.id);
      toast.success("Đã hủy đăng ký giải đấu");
      onCancelled();
      onOpenChange(false);
    } catch {
      toast.error("Không thể hủy đăng ký");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Xác nhận hủy đăng ký</DialogTitle>
          <DialogDescription>
            Bạn có chắc muốn hủy đăng ký giải đấu cho CLB{" "}
            <strong>{participant.clubName}</strong>? Hành động này không thể
            hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Quay lại
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Hủy đăng ký
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Main component */
export default function ClubTournamentRegistrations({
  participations: initialParticipations,
}: ClubTournamentRegistrationsProps) {
  const [participations, setParticipations] = useState(initialParticipations);
  const [updateTarget, setUpdateTarget] =
    useState<ClubTournamentParticipant | null>(null);
  const [cancelTarget, setCancelTarget] =
    useState<ClubTournamentParticipant | null>(null);

  // Refresh: refetch detail for each participant is complex;
  // The parent server component should revalidate.
  // Here we just remove cancelled items from local state optimistically.
  const handleCancelled = useCallback(() => {
    if (!cancelTarget) return;
    setParticipations((prev) => prev.filter((p) => p.id !== cancelTarget.id));
  }, [cancelTarget]);

  if (participations.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          CLB chưa đăng ký giải đấu nào
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Truy cập trang Giải đấu để tìm và đăng ký cho CLB của bạn.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {participations.map((p) => {
          const statusInfo = getClubTournamentStatusInfo(p.status);
          const canUpdate = ["DRAFT", "PENDING", "PAYMENT_REQUIRED"].includes(
            p.status,
          );
          const canCancel = !["CANCELLED", "REJECTED", "APPROVED"].includes(
            p.status,
          );
          return (
            <Card
              key={p.id}
              className="border border-gray-200 dark:border-gray-700"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {p.categoryName ?? "Nội dung thi đấu"}
                      </p>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusInfo.badgeClass}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                    {p.tournamentName && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        🏆 {p.tournamentName}
                      </p>
                    )}
                    <div className="flex items-center gap-1 mt-1 text-gray-500 dark:text-gray-400 text-sm">
                      <Users className="w-3.5 h-3.5" />
                      <span>{p.rosterSize} thành viên đã chọn</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <ClubRosterModal participant={p} />
                    {canUpdate && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-teal-300 text-teal-700 hover:bg-teal-50 dark:border-teal-600 dark:text-teal-300 text-xs"
                        onClick={() => setUpdateTarget(p)}
                      >
                        <RefreshCw className="w-3.5 h-3.5 mr-1" />
                        Cập nhật roster
                      </Button>
                    )}
                    {canCancel && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-300 text-xs"
                        onClick={() => setCancelTarget(p)}
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Hủy đăng ký
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {updateTarget && (
        <UpdateRosterDialog
          participant={updateTarget}
          open={!!updateTarget}
          onOpenChange={(v) => !v && setUpdateTarget(null)}
          onUpdated={() => setUpdateTarget(null)}
        />
      )}
      {cancelTarget && (
        <CancelDialog
          participant={cancelTarget}
          open={!!cancelTarget}
          onOpenChange={(v) => !v && setCancelTarget(null)}
          onCancelled={handleCancelled}
        />
      )}
    </>
  );
}
