"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Trophy, Users, X } from "lucide-react";
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

  const isPaid =
    participant?.paid ||
    ["PAID", "APPROVED"].includes(participant?.status ?? "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Warning header */}
        <div className="relative bg-gradient-to-br from-red-500 via-rose-500 to-pink-500 px-6 pt-8 pb-6 text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/40 blur-2xl" />
            <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full bg-white/30 blur-2xl" />
          </div>
          <div className="relative flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-3 ring-4 ring-white/20">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <DialogTitle className="text-lg font-bold text-white">
              Xác nhận hủy đăng ký
            </DialogTitle>
            <DialogDescription className="text-sm text-white/90 mt-1 max-w-xs">
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Summary */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 space-y-2 bg-gray-50/60 dark:bg-gray-900/40">
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="w-4 h-4 text-violet-500 flex-shrink-0" />
              <span className="font-semibold text-gray-900 dark:text-white truncate">
                {participant?.tournamentName ?? "Giải đấu"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <Users className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              CLB <strong>{participant?.clubName ?? ""}</strong>
              <span className="mx-1 text-gray-300">•</span>
              {participant?.rosterSize ?? 0} thành viên
            </div>
          </div>

          {/* Warnings */}
          <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
              Toàn bộ thông tin đăng ký và roster sẽ bị loại khỏi giải đấu.
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
              Bạn sẽ phải đăng ký lại từ đầu nếu muốn tham gia trở lại.
            </li>
            {isPaid && (
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <span className="text-amber-700 dark:text-amber-300">
                  Khoản phí đã thanh toán có thể{" "}
                  <strong>không được hoàn lại</strong> tùy theo chính sách của
                  ban tổ chức.
                </span>
              </li>
            )}
          </ul>
        </div>

        <DialogFooter className="px-6 pb-6 pt-0 gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1"
          >
            Giữ đăng ký
          </Button>
          <Button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <X className="w-4 h-4 mr-2" />
            )}
            Xác nhận hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
