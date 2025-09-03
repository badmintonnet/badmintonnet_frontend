import z from "zod";

const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);

export const AccountRes = z
  .object({
    data: z.object({
      id: z.string(),
      email: z.string(),
      fullName: z.string(),
      birthDate: z.string(),
      gender: GenderEnum,
      address: z.string(),
      bio: z.string().nullable(),
      avatarUrl: z.string().nullable(),
      phone: z.string().nullable(),

      enabled: z.boolean(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
      createdBy: z.string(),
      updatedBy: z.string(),
    }),
    message: z.string(),
  })
  .strict();

export type AccountResType = z.TypeOf<typeof AccountRes>;

export const UpdateProfileBody = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Tên phải có ít nhất 2 ký tự" })
    .max(256, { message: "Tên không được quá 256 ký tự" }),

  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Ngày sinh không hợp lệ",
  }),

  gender: GenderEnum,

  address: z.string(),

  phone: z
    .string()
    .regex(/^(0[35789][0-9]{8})$/, {
      message: "Số điện thoại không hợp lệ",
    })
    .optional(),

  avatarUrl: z.string().optional(),

  bio: z
    .string()
    .max(1000, { message: "Tiểu sử không được quá 1000 ký tự" })
    .optional(),
});

export type UpdateProfileBodyType = z.TypeOf<typeof UpdateProfileBody>;
