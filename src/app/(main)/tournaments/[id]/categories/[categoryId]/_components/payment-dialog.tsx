"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import paymentApiRequest from "@/apiRequest/payment";
import { CreditCard, Wallet, Building2, Smartphone } from "lucide-react";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string;
  amount: number;
  tournamentId: string;
}

const paymentMethods = [
  {
    id: "vnpay",
    name: "VNPay",
    icon: Wallet,
    description: "Thanh toán qua ví điện tử VNPay",
  },
  {
    id: "momo",
    name: "MoMo",
    icon: Smartphone,
    description: "Thanh toán qua ví MoMo",
    disabled: true, // Chưa tích hợp
  },
  {
    id: "banking",
    name: "Chuyển khoản ngân hàng",
    icon: Building2,
    description: "Chuyển khoản trực tiếp qua ngân hàng",
    disabled: true, // Chưa tích hợp
  },
  {
    id: "card",
    name: "Thẻ ATM/Visa/Mastercard",
    icon: CreditCard,
    description: "Thanh toán bằng thẻ quốc tế",
    disabled: true, // Chưa tích hợp
  },
];

export default function PaymentDialog({
  open,
  onOpenChange,
  categoryId,
  amount,
}: PaymentDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState("vnpay");
  const [isProcessing, setIsProcessing] = useState(false);

  console.log("Amount to pay:", amount);

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    setIsProcessing(true);

    try {
      if (selectedMethod === "vnpay") {
        const response = await paymentApiRequest.createPayment(
          categoryId,
          amount,
        );
        // console.log("Create payment response:", response);

        if (response.payload.data) {
          window.location.href = response.payload.data.paymentUrl;
        }
      } else {
        toast.error("Phương thức thanh toán chưa được hỗ trợ");
      }
    } catch {
      toast.error("Có lỗi xảy ra khi tạo thanh toán");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thanh toán lệ phí tham gia</DialogTitle>
          <DialogDescription>
            Chọn phương thức thanh toán phù hợp với bạn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Thông tin thanh toán */}
          <div className="rounded-lg bg-muted p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Số tiền:</span>
              <span className="text-lg font-bold text-primary">
                {amount.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
          </div>

          {/* Chọn phương thức */}
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <div
                    key={method.id}
                    className={`relative flex items-start space-x-3 rounded-lg border p-4 transition-colors ${
                      method.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:bg-accent"
                    } ${
                      selectedMethod === method.id && !method.disabled
                        ? "border-primary bg-accent"
                        : ""
                    }`}
                  >
                    <RadioGroupItem
                      value={method.id}
                      id={method.id}
                      disabled={method.disabled}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={method.id}
                        className={`flex items-center gap-2 ${
                          method.disabled
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{method.name}</span>
                        {method.disabled && (
                          <span className="text-xs text-muted-foreground">
                            (Sắp ra mắt)
                          </span>
                        )}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {method.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </RadioGroup>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Hủy
            </Button>
            <Button
              className="flex-1"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? "Đang xử lý..." : "Thanh toán"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
