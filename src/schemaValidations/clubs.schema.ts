import z from "zod";

const ClubVisibilityEnum = z.enum(["PRIVATE", "PUBLIC"]);
const RoleEnum = z.enum(["OWNER", "MEMBER"]);
const MemberStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED", "BANNED"]);
// Schema for the club creation request
export const CreateClubBody = z.object({
  name: z
    .string()
    .min(1, "Tên câu lạc bộ là bắt buộc")
    .max(256, "Tên câu lạc bộ không được vượt quá 256 ký tự"),
  description: z
    .string()
    .max(5000, "Mô tả câu lạc bộ không được vượt quá 5000 ký tự")
    .optional(),
  logoUrl: z.string().optional(),
  location: z
    .string()
    .max(256, "Vị trí câu lạc bộ không được vượt quá 256 ký tự")
    .optional(),
  maxMembers: z
    .number()
    .int()
    .positive("Số thành viên tối đa phải lớn hơn 0")
    .optional(),
  visibility: ClubVisibilityEnum,
  tags: z
    .array(z.string().max(50, "Mỗi tag không được vượt quá 50 ký tự"))
    .max(20, "Không được nhập quá 20 tags")
    .optional(),
});
export type CreateClubBodyType = z.infer<typeof CreateClubBody>;

export const ClubSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  logoUrl: z.string().optional(),
  location: z.string(),
  maxMembers: z.int(),
  visibility: ClubVisibilityEnum,
  tags: z.array(z.string()),
  ownerName: z.string(),
  active: z.boolean(),
  createdAt: z.coerce.date(),
});

export const MyClubSchema = ClubSchema.extend({
  memberStatus: MemberStatusEnum,
  memberCount: z.number().int(),
  owner: z.boolean(),
  dateJoined: z.coerce.date(),
});

export const PagedClubResponse = z.object({
  content: z.array(ClubSchema),
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  last: z.boolean(),
});

export const PagedMyClubResponse = z.object({
  content: z.array(MyClubSchema),
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  last: z.boolean(),
});
export const ClubRes = z.object({
  status: z.number(),
  message: z.string(),
  data: ClubSchema,
});
export const MyClubRes = z.object({
  status: z.number(),
  message: z.string(),
  data: MyClubSchema,
});
export type ClubResType = z.TypeOf<typeof ClubRes>;
export type MyClubResType = z.TypeOf<typeof MyClubRes>;
export const ClubPageRes = z.object({
  status: z.number(),
  message: z.string(),
  data: PagedClubResponse,
});

export type ClubPageResType = z.infer<typeof ClubPageRes>;

export const MyClubPageRes = z.object({
  status: z.number(),
  message: z.string(),
  data: PagedMyClubResponse,
});
export type MyClubPageResType = z.infer<typeof MyClubPageRes>;

export const MemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: RoleEnum,
  status: MemberStatusEnum,
  joinedAt: z.coerce.date(),
});

export type MemberType = z.infer<typeof MemberSchema>;
export const PagedMemberResponse = z.object({
  content: z.array(MemberSchema),
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  last: z.boolean(),
});

export const MemberPageRes = z.object({
  status: z.number(),
  message: z.string(),
  data: PagedMemberResponse,
});
export type MemberPageResType = z.infer<typeof MemberPageRes>;
