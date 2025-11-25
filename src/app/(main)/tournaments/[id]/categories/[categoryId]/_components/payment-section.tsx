"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import PaymentDialog from "./payment-dialog";

interface PaymentSectionProps {
  categoryId: string;
  tournamentId: string;
  registrationFee: number;
  isApproved: boolean;
  hasPaid: boolean;
}

export default function PaymentSection({
  categoryId,
  tournamentId,
  registrationFee,
  isApproved,
  hasPaid,
}: PaymentSectionProps) {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  if (!isApproved || hasPaid) {
    return null;
  }

  return (
    <>
      <div className="mt-6 p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">
              Thanh toán lệ phí tham gia
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Bạn đã được duyệt tham gia. Vui lòng thanh toán lệ phí để hoàn tất
              đăng ký.
            </p>
            <p className="text-lg font-bold text-primary mt-2">
              Số tiền: {registrationFee.toLocaleString("vi-VN")} VNĐ
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => setPaymentDialogOpen(true)}
            className="gap-2"
          >
            <CreditCard className="h-5 w-5" />
            Thanh toán
          </Button>
        </div>
      </div>

      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        categoryId={categoryId}
        tournamentId={tournamentId}
        amount={registrationFee}
      />
    </>
  );
}
