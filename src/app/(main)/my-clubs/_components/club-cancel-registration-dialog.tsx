"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ClubTournamentParticipant } from "@/schemaValidations/tournament.schema";
import clubTournamentApiRequest from "@/apiRequest/club-tournament";
import { toast } from "sonner";

interface CancelRegistrationDialogProps {
  participant: ClubTournamentParticipant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancelled: () => void;
}

export default function CancelRegistrationDialog({
  participant,
  open,
  onOpenChange,
  onCancelled,
}: CancelRegistrationDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!participant) return;
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
            <strong>{participant?.clubName ?? ""}</strong>? Hành động này không
            thể hoàn tác.
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
