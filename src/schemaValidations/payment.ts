import { z } from "zod";

export const PaymentStatus = z.enum(["PENDING", "SUCCESS", "FAILED"]);

export type PaymentStatus = z.infer<typeof PaymentStatus>;

export const VNPayReturnSchema = z.object({
  status: PaymentStatus,
  tournamentId: z.string(),
  categoryId: z.string(),
});

export type VNPayReturnSchemaType = z.infer<typeof VNPayReturnSchema>;

export const VNPayReturnResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: VNPayReturnSchema,
});

export type VNPayReturnResponseType = z.infer<typeof VNPayReturnResponse>;

export const VNPayCreateSchema = z.object({
  paymentUrl: z.string(),
});

export type VNPayCreateType = z.infer<typeof VNPayCreateSchema>;

export const VNPayCreateResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: VNPayCreateSchema,
});

export type VNPayCreateResponseType = z.infer<typeof VNPayCreateResponse>;
