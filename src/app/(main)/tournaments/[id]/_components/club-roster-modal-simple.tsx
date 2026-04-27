"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Users, Building2, CreditCard } from "lucide-react";
import {
  ClubTournamentParticipant,
  ClubRosterMember,
  getClubTournamentStatusInfo,
} from "@/schemaValidations/tournament.schema";
import clubTournamentApiRequest from "@/apiRequest/club-tournament";
import paymentApiRequest from "@/apiRequest/payment";
import { toast } from "sonner";

interface ClubRosterModalSimpleProps {
  participant: ClubTournamentParticipant;
  trigger?: React.ReactNode;
}

export default function ClubRosterModalSimple({
  participant,
  trigger,
}: ClubRosterModalSimpleProps) {
  const [open, setOpen] = useState(false);
  const [roster, setRoster] = useState<ClubRosterMember[]>(
    participant.roster ?? [],
  );
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);

  const handleOpen = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && roster.length === 0) {
      setLoading(true);
      try {
        const res = await clubTournamentApiRequest.getParticipantDetail(
          participant.id,
        );
        setRoster(res.payload.data.roster ?? []);
      } catch {
        toast.error("Không thể tải danh sách roster");
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePayment = async () => {
    setPaying(true);
    try {
      const response = await paymentApiRequest.createClubPayment(
        participant.id,
      );
      const data = response.payload.data;
      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch {
      toast.error("Không thể tạo thanh toán. Vui lòng thử lại.");
    } finally {
      setPaying(false);
    }
  };

  const canPay = participant.status === "PENDING";

  const statusInfo = getClubTournamentStatusInfo(participant.status);

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <Users className="w-4 h-4 mr-2" />
            Xem roster
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-violet-600" />
            Đăng ký của {participant.clubName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Trạng thái:</span>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusInfo.badgeClass}`}
            >
              {statusInfo.label}
            </span>
          </div>

          {/* Payment Button */}
          {canPay && (
            <Button
              onClick={handlePayment}
              disabled={paying}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              {paying ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4 mr-2" />
              )}
              Thanh toán phí đăng ký
            </Button>
          )}

          {/* Tournament & Category */}
          <div className="text-sm">
            <p className="text-gray-500">Giải đấu:</p>
            <p className="font-medium">{participant.tournamentName}</p>
            <p className="text-gray-500 mt-1">Hạng mục:</p>
            <p className="font-medium">{participant.categoryName}</p>
          </div>

          {/* Roster */}
          <div>
            <p className="text-sm text-gray-500 mb-2">
              Đội hình ({roster.length} người):
            </p>
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-violet-600" />
              </div>
            ) : roster.length === 0 ? (
              <p className="text-center text-gray-400 py-4">
                Chưa có thành viên
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {roster.map((member) => (
                  <div
                    key={member.rosterEntryId}
                    className="flex items-center gap-3 p-2 rounded-lg border border-gray-100 dark:border-gray-700"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={member.avatarUrl || ""} />
                      <AvatarFallback className="text-xs bg-teal-100 text-teal-700">
                        {member.fullName?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                        {member.fullName}
                      </p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
