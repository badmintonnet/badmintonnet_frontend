"use client";

import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
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

  useEffect(() => {
    if (!open || !participant) return;
    setLoading(true);
    setSelected(participant.roster?.map((r) => r.accountId) ?? []);

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

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const handleSubmit = async () => {
    if (!participant) return;
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Cập nhật roster – {participant?.clubName ?? ""}
          </DialogTitle>
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
            {submitting && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
