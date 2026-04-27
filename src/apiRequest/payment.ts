import http from "@/lib/http";
import {
  VNPayCreateResponseType,
  VNPayReturnResponseType,
} from "@/schemaValidations/payment";

const paymentApiRequest = {
  // Thanh toán INDIVIDUAL tournament (cũ)
  createPayment: (categoryId: string, amount: number) =>
    http.post<VNPayCreateResponseType>(
      `/payment/create?categoryId=${categoryId}&amount=${amount}`,
    ),

  // Thanh toán CLUB tournament
  createClubPayment: (participantId: string, amount?: number) => {
    const params = new URLSearchParams();
    params.append("participantId", participantId);
    if (amount !== undefined && amount !== null) {
      params.append("amount", amount.toString());
    }
    return http.post<VNPayCreateResponseType>(
      `/payment/club/create?${params.toString()}`,
    );
  },

  // Xử lý VNPay return callback
  handleVNPayReturn: (params: URLSearchParams) =>
    http.get<VNPayReturnResponseType>(
      `/payment/vnpay-return?${params.toString()}`,
    ),
};

export default paymentApiRequest;
