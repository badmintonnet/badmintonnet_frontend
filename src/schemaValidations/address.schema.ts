import z from "zod";

export const ProvinceSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  name_en: z.string(),
  full_name: z.string(),
  full_name_en: z.string(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export const ProvinceResponseSchema = z.object({
  error: z.number(),
  error_text: z.string(),
  data_name: z.string(),
  data: z.array(ProvinceSchema),
});

export const WardSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  name_en: z.string(),
  full_name: z.string(),
  full_name_en: z.string(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export const WardResponseSchema = z.object({
  error: z.number(),
  error_text: z.string(),
  data_id: z.string(), // id của tỉnh/thành cha
  data_code: z.string(), // mã của tỉnh/thành cha
  data_name: z.string(), // tên tỉnh/thành cha
  data: z.array(WardSchema),
});

export type WardType = z.infer<typeof WardSchema>;
export type WardResponseType = z.infer<typeof WardResponseSchema>;
export type ProvinceType = z.infer<typeof ProvinceSchema>;
export type ProvinceResponseType = z.infer<typeof ProvinceResponseSchema>;
