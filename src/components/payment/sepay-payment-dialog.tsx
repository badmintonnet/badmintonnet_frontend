"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import paymentApiRequest from "@/apiRequest/payment";
import { PaymentStatus, SePayCreateType } from "@/schemaValidations/payment";

interface SePayPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: SePayCreateType;
  onSuccess: () => void;
  onRetry: () => Promise<void>;
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function SePayPaymentDialog({
  open,
  onOpenChange,
  data,
  onSuccess,
  onRetry,
}: SePayPaymentDialogProps) {
  const [phase, setPhase] = useState<"pending" | "success" | "expired">(
    "pending",
  );
  const [remainingMs, setRemainingMs] = useState(0);
  const [retrying, setRetrying] = useState(false);

  // Giao dịch mới (txnRef đổi khi retry) -> reset trạng thái
  useEffect(() => {
    if (!open) return;
    setPhase("pending");
    setRemainingMs(Math.max(0, new Date(data.expiresAt).getTime() - Date.now()));
  }, [open, data.txnRef, data.expiresAt]);

  // Đếm ngược
  useEffect(() => {
    if (!open || phase !== "pending") return;
    const expiresAt = new Date(data.expiresAt).getTime();
    const tick = () => setRemainingMs(Math.max(0, expiresAt - Date.now()));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [open, phase, data.expiresAt]);

  // Hết giờ ở phía client (backend cũng tự expire qua scheduled job)
  useEffect(() => {
    if (phase === "pending" && remainingMs <= 0) {
      setPhase("expired");
    }
  }, [phase, remainingMs]);

  // Polling trạng thái mỗi 3 giây
  useEffect(() => {
    if (!open || phase !== "pending") return;
    const interval = setInterval(async () => {
      try {
        const res = await paymentApiRequest.getStatus(data.txnRef);
        const status: PaymentStatus = res.payload.data.status;
        if (status === "SUCCESS") {
          setPhase("success");
        } else if (status === "FAILED" || status === "EXPIRED") {
          setPhase("expired");
        }
      } catch {
        // lỗi tạm thời, tiếp tục polling
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [open, phase, data.txnRef]);

  const handleCopy = useCallback((value: string, label: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`Đã copy ${label}`);
  }, []);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setRetrying(false);
    }
  };

  const handleSuccessContinue = () => {
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        {phase === "pending" && (
          <>
            <DialogHeader>
              <DialogTitle>Quét mã để thanh toán</DialogTitle>
              <DialogDescription>
                Mở app ngân hàng bất kỳ và quét mã QR bên dưới để chuyển khoản.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.qrUrl}
                alt="Mã QR thanh toán VietQR"
                className="w-56 h-56 rounded-lg border object-contain"
              />

              <div className="w-full space-y-2 rounded-lg bg-muted p-3 text-sm">
                <InfoRow
                  label="Số tiền"
                  value={`${data.amount.toLocaleString("vi-VN")} VNĐ`}
                  onCopy={() => handleCopy(String(data.amount), "số tiền")}
                />
                <InfoRow
                  label="Ngân hàng"
                  value={data.bankName}
                  onCopy={() => handleCopy(data.bankName, "tên ngân hàng")}
                />
                <InfoRow
                  label="Số tài khoản"
                  value={data.bankAccount}
                  onCopy={() => handleCopy(data.bankAccount, "số tài khoản")}
                />
                <InfoRow
                  label="Nội dung CK"
                  value={data.txnRef}
                  onCopy={() =>
                    handleCopy(data.txnRef, "nội dung chuyển khoản")
                  }
                  highlight
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>
                  Đang chờ xác nhận... còn lại{" "}
                  <span className="font-semibold text-foreground">
                    {formatCountdown(remainingMs)}
                  </span>
                </span>
              </div>
            </div>
          </>
        )}

        {phase === "success" && (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Thanh toán thành công!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Bạn đã đăng ký giải đấu thành công.
              </p>
            </div>
            <Button className="w-full" onClick={handleSuccessContinue}>
              Tiếp tục
            </Button>
          </div>
        )}

        {phase === "expired" && (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="rounded-full bg-red-100 p-4">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Giao dịch đã hết hạn</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Mã QR đã hết hạn hoặc thanh toán không thành công. Vui lòng
                tạo giao dịch mới.
              </p>
            </div>
            <Button className="w-full" onClick={handleRetry} disabled={retrying}>
              {retrying ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Tạo lại giao dịch
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({
  label,
  value,
  onCopy,
  highlight,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}:</span>
      <div className="flex items-center gap-1.5">
        <span
          className={highlight ? "font-bold text-primary" : "font-medium"}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label={`Copy ${label}`}
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
