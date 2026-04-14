"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  RefreshCw,
  XCircle,
  CreditCard,
  Loader2,
} from "lucide-react";
import {
  ClubTournamentParticipant,
  getClubTournamentStatusInfo,
} from "@/schemaValidations/tournament.schema";
import paymentApiRequest from "@/apiRequest/payment";
import ClubRosterModal from "@/app/(main)/tournaments/[id]/categories/[categoryId]/_components/club-roster-modal";
import { toast } from "sonner";

interface ClubTournamentRegistrationCardProps {
  participant: ClubTournamentParticipant;
  onUpdate: (participant: ClubTournamentParticipant) => void;
  onCancel: (participant: ClubTournamentParticipant) => void;
}

export default function ClubTournamentRegistrationCard({
  participant,
  onUpdate,
  onCancel,
}: ClubTournamentRegistrationCardProps) {
  const [paying, setPaying] = useState(false);
  const statusInfo = getClubTournamentStatusInfo(participant.status);

  const canUpdate = ["DRAFT", "PENDING", "PAYMENT_REQUIRED"].includes(
    participant.status,
  );
  const canCancel = !["CANCELLED", "REJECTED", "APPROVED"].includes(
    participant.status,
  );
  const canPay = participant.status === "PENDING";

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

  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* Left: Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="font-semibold text-gray-900 dark:text-white truncate">
                {participant.categoryName ?? "Nội dung thi đấu"}
              </p>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusInfo.badgeClass}`}
              >
                {statusInfo.label}
              </span>
            </div>
            {participant.tournamentName && (
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {participant.tournamentName}
              </p>
            )}
            <div className="flex items-center gap-1 mt-1 text-gray-500 dark:text-gray-400 text-sm">
              <Users className="w-3.5 h-3.5" />
              <span>{participant.rosterSize} thành viên đã chọn</span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-wrap gap-2">
            <ClubRosterModal participant={participant} />

            {canPay && (
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs"
                onClick={handlePayment}
                disabled={paying}
              >
                {paying ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                ) : (
                  <CreditCard className="w-3.5 h-3.5 mr-1" />
                )}
                Thanh toán
              </Button>
            )}

            {canUpdate && (
              <Button
                size="sm"
                variant="outline"
                className="border-teal-300 text-teal-700 hover:bg-teal-50 dark:border-teal-600 dark:text-teal-300 text-xs"
                onClick={() => onUpdate(participant)}
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Cập nhật
              </Button>
            )}

            {canCancel && (
              <Button
                size="sm"
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-300 text-xs"
                onClick={() => onCancel(participant)}
              >
                <XCircle className="w-3.5 h-3.5 mr-1" />
                Hủy
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
