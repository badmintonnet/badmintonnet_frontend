import { z } from "zod";

export const RegisterBody = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, { message: "Tên phải có ít nhất 2 ký tự" })
      .max(256, { message: "Tên không được quá 256 ký tự" }),

    email: z.string().email({ message: "Email không hợp lệ" }),

    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
      .max(100, { message: "Mật khẩu không được quá 100 ký tự" }),

    confirmPassword: z
      .string()
      .min(6, { message: "Xác nhận mật khẩu phải có ít nhất 6 ký tự" })
      .max(100, { message: "Xác nhận mật khẩu không được quá 100 ký tự" }),

    birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Ngày sinh không hợp lệ",
    }),

    gender: z.enum(["MALE", "FEMALE", "OTHER"], {
      message: "Vui lòng chọn giới tính",
    }),

    address: z
      .string()
      .trim()
      .min(5, { message: "Địa chỉ phải có ít nhất 5 ký tự" })
      .max(500, { message: "Địa chỉ không được quá 500 ký tự" }),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
      });
    }
  });

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>;

export const RegisterRes = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    deviceId: z.string(),
  }),
});

export type RegisterResType = z.TypeOf<typeof RegisterRes>;

export const LoginBody = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
  })
  .strict();

export type LoginBodyType = z.TypeOf<typeof LoginBody>;

export const LoginRes = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    deviceId: z.string(),
  }),
});

export type LoginResType = z.TypeOf<typeof LoginRes>;
export const SlideSessionBody = z.object({}).strict();

export type SlideSessionBodyType = z.TypeOf<typeof SlideSessionBody>;
export const SlideSessionRes = RegisterRes;

export type SlideSessionResType = z.TypeOf<typeof SlideSessionRes>;
