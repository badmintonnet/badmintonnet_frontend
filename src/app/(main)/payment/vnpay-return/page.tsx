"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import paymentApiRequest from "@/apiRequest/payment";
import { PaymentStatus } from "@/schemaValidations/payment";

export default function VNPayReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  const [tournamentId, setTournamentId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    const handlePaymentReturn = async () => {
      try {
        const response = await paymentApiRequest.handleVNPayReturn(
          searchParams
        );

        setTournamentId(response.payload.data.tournamentId);
        setCategoryId(response.payload.data.categoryId);

        const paymentStatus: PaymentStatus = response.payload.data.status;

        if (paymentStatus === "SUCCESS") {
          setStatus("success");
          setMessage("Thanh toán thành công!");
        } else if (paymentStatus === "FAILED") {
          setStatus("error");
          setMessage("Thanh toán thất bại");
        } else {
          setStatus("error");
          setMessage("Thanh toán đang được xử lý");
        }
      } catch (error: unknown) {
        setStatus("error");
        setMessage("Có lỗi xảy ra");
      }
    };

    handlePaymentReturn();
  }, [searchParams]);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-16 px-4 bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto">
          {/* Loading State */}
          {status === "loading" && (
            <div className="bg-white rounded-2xl shadow-xl p-10 text-center border border-slate-200">
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-5 shadow-lg">
                  <Loader2 className="h-10 w-10 text-white animate-spin" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Đang xử lý thanh toán
              </h2>
              <p className="text-slate-500">Vui lòng đợi trong giây lát...</p>
              <div className="mt-6 flex justify-center gap-1.5">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.15s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                ></div>
              </div>
            </div>
          )}

          {/* Success State */}
          {status === "success" && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
              {/* Icon Section */}
              <div className="pt-10 pb-6 px-10 text-center bg-gradient-to-b from-green-50 to-white">
                <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                  <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-6 shadow-lg">
                    <CheckCircle
                      className="h-12 w-12 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                  Thanh toán thành công!
                </h2>
                <p className="text-slate-600">{message}</p>
              </div>

              {/* Content Section */}
              <div className="px-10 pb-10">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 text-green-700">
                    <Trophy className="h-5 w-5" />
                    <p className="text-sm font-medium">
                      Bạn đã đăng ký giải đấu thành công
                    </p>
                  </div>
                  <p className="text-xs text-green-600 mt-1 ml-7">
                    Chúc bạn thi đấu thành công! 🎉
                  </p>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() =>
                    router.push(
                      `/tournaments/${tournamentId}/categories/${categoryId}`
                    )
                  }
                >
                  Quay về trang giải đấu
                </Button>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
              {/* Icon Section */}
              <div className="pt-10 pb-6 px-10 text-center bg-gradient-to-b from-red-50 to-white">
                <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                  <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-red-500 to-red-600 rounded-full p-6 shadow-lg">
                    <XCircle
                      className="h-12 w-12 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                  Thanh toán thất bại
                </h2>
                <p className="text-slate-600">{message}</p>
              </div>

              {/* Content Section */}
              <div className="px-10 pb-10">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-red-700">
                    Vui lòng kiểm tra lại thông tin thanh toán và thử lại. Nếu
                    vấn đề vẫn tiếp diễn, hãy liên hệ với chúng tôi.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={() => router.back()}
                  >
                    Thử lại
                  </Button>
                  <Button
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-6 rounded-xl transition-all duration-200 border border-slate-300"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại
                  </Button>
                </div>

                <p className="text-xs text-slate-400 text-center mt-6">
                  Cần hỗ trợ? Email: support@badmintonnet.vn
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
