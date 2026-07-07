import { z } from "zod";

export const PaymentStatus = z.enum([
  "PENDING",
  "SUCCESS",
  "FAILED",
  "EXPIRED",
]);

export type PaymentStatus = z.infer<typeof PaymentStatus>;

export const SePayCreateSchema = z.object({
  txnRef: z.string(),
  amount: z.number(),
  qrUrl: z.string(),
  bankAccount: z.string(),
  bankName: z.string(),
  expiresAt: z.string(),
});

export type SePayCreateType = z.infer<typeof SePayCreateSchema>;

export const SePayCreateResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: SePayCreateSchema,
});

export type SePayCreateResponseType = z.infer<typeof SePayCreateResponse>;

export const PaymentStatusSchema = z.object({
  status: PaymentStatus,
});

export type PaymentStatusSchemaType = z.infer<typeof PaymentStatusSchema>;

export const PaymentStatusApiResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: PaymentStatusSchema,
});

export type PaymentStatusApiResponseType = z.infer<
  typeof PaymentStatusApiResponse
>;
