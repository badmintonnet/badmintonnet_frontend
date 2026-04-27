import http from "@/lib/http";
import {
  VNPayCreateResponseType,
  VNPayReturnResponseType,
} from "@/schemaValidations/payment";

const paymentApiRequest = {
  createPayment: (categoryId: string, amount: number) =>
    http.post<VNPayCreateResponseType>(
      `/payment/create?categoryId=${categoryId}&amount=${amount}`
    ),

  handleVNPayReturn: (params: URLSearchParams) =>
    http.get<VNPayReturnResponseType>(
      `/payment/vnpay-return?${params.toString()}`
    ),
};

export default paymentApiRequest;
