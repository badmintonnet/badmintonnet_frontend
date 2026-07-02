import http from "@/lib/http";
import {
  PaymentStatusApiResponseType,
  SePayCreateResponseType,
} from "@/schemaValidations/payment";

const paymentApiRequest = {
  // Thanh toán INDIVIDUAL tournament
  createPayment: (categoryId: string, amount: number) =>
    http.post<SePayCreateResponseType>(
      `/payment/create?categoryId=${categoryId}&amount=${amount}`,
    ),

  // Thanh toán CLUB tournament
  createClubPayment: (participantId: string, amount?: number) => {
    const params = new URLSearchParams();
    params.append("participantId", participantId);
    if (amount !== undefined && amount !== null) {
      params.append("amount", amount.toString());
    }
    return http.post<SePayCreateResponseType>(
      `/payment/club/create?${params.toString()}`,
    );
  },

  // Polling trạng thái giao dịch SePay
  getStatus: (txnRef: string) =>
    http.get<PaymentStatusApiResponseType>(`/payment/${txnRef}/status`),
};

export default paymentApiRequest;
