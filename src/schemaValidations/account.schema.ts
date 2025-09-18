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

export const PlayerRatingCreateBody = z
  .object({
    experience: z.number().int().min(0).max(5),
    serve: z.number().int().min(0).max(5),
    smash: z.number().int().min(0).max(5),
    clear: z.number().int().min(0).max(5),
    dropShot: z.number().int().min(0).max(5),
    drive: z.number().int().min(0).max(5),
    netShot: z.number().int().min(0).max(5),
    doubles: z.number().int().min(0).max(5),
    defense: z.number().int().min(0).max(5),
    footwork: z.number().int().min(0).max(5),
    stamina: z.number().int().min(0).max(5),
    tactics: z.number().int().min(0).max(5),
  })
  .strict();

export type PlayerRatingCreateBodyType = z.TypeOf<
  typeof PlayerRatingCreateBody
>;

export const PlayerRating = z.object({
  id: z.string(),
  experience: z.number().int(),
  serve: z.number().int(),
  smash: z.number().int(),
  clear: z.number().int(),
  dropShot: z.number(),
  drive: z.number().int(),
  netShot: z.number().int(),
  doubles: z.number().int(),
  defense: z.number().int(),
  footwork: z.number().int(),
  stamina: z.number().int(),
  tactics: z.number().int(),
  averageTechnicalScore: z.number(),
  overallScore: z.number(),
  skillLevel: z.string(),
});

export type PlayerRatingType = z.TypeOf<typeof PlayerRating>;

export const PlayerRatingResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: PlayerRating,
});

export type PlayerRatingResponseType = z.TypeOf<typeof PlayerRatingResponse>;
