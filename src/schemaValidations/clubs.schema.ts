import z from "zod";
const InvitationStatusEnum = z.enum([
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "CANCELLED",
]);
const ClubVisibilityEnum = z.enum(["PRIVATE", "PUBLIC"]);
const RoleEnum = z.enum(["OWNER", "MEMBER"]);
const MemberStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED", "BANNED"]);
const ClubStatusEnum = z.enum(["PENDING", "ACTIVE", "INACTIVE"]);
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

  minLevel: z
    .number()
    .max(5, "Điểm đánh giá trình không được lớn hơn 5")
    .optional(),
  maxLevel: z
    .number()
    .max(5, "Điểm đánh giá trình không được lớn hơn 5")
    .optional(),
  visibility: ClubVisibilityEnum,
  tags: z
    .array(z.string().max(50, "Mỗi tag không được vượt quá 50 ký tự"))
    .max(20, "Không được nhập quá 20 tags")
    .optional(),
  facilityId: z.string().optional(),
});
export type CreateClubBodyType = z.infer<typeof CreateClubBody>;

export const FacilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  district: z.string(),
  location: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  image: z.string(),
});

export const ClubSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  logoUrl: z.string().optional(),
  location: z.string(),
  facility: FacilitySchema,
  memberCount: z.number().int(),
  maxMembers: z.int(),
  minLevel: z.number(),
  maxLevel: z.number(),
  visibility: ClubVisibilityEnum,
  tags: z.array(z.string()),
  ownerName: z.string(),
  owner: z.boolean(),
  joined: z.boolean(),
  status: ClubStatusEnum,
  createdAt: z.coerce.date(),
  invitationId: z.string().nullable(),
  invitationMessage: z.string().nullable(),
});

export const ClubAdminSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  ownerName: z.string(),
  email: z.string(),
  memberCount: z.int(),
  maxMembers: z.int(),
  status: ClubStatusEnum,
  createdAt: z.coerce.date(),
  reputation: z.number(),
});

export type ClubAdminSchemaType = z.infer<typeof ClubAdminSchema>;

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

export const PagedClubAdminResponse = z.object({
  content: z.array(ClubAdminSchema),
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

export const ClubAdminPageRes = z.object({
  status: z.number(),
  message: z.string(),
  data: PagedClubAdminResponse,
});

export type ClubAdminPageResType = z.infer<typeof ClubAdminPageRes>;

export const MyClubPageRes = z.object({
  status: z.number(),
  message: z.string(),
  data: PagedMyClubResponse,
});
export type MyClubPageResType = z.infer<typeof MyClubPageRes>;

export const MemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
  role: RoleEnum,
  status: MemberStatusEnum,
  joinedAt: z.coerce.date(),
  slug: z.string(),
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
export const GuestSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
  joinedCount: z.number().int(),
  invitationStatus: InvitationStatusEnum.nullable(),
  slug: z.string(),
});

export type GuestType = z.infer<typeof GuestSchema>;

export const GuestResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(GuestSchema),
});

export type GuestResponseType = z.infer<typeof GuestResponse>;
export const ClubMemberDetail = z.object({
  id: z.string(),
  email: z.string(),
  fullName: z.string(),
  birthDate: z.string(),
  gender: z.string(),
  address: z.string(),
  bio: z.string(),
  avatarUrl: z.string(),
  phone: z.string(),
  note: z.string(),
  experience: z.number().int(),
  stamina: z.number().int(),
  tactics: z.number().int(),
  averageTechnicalScore: z.number(),
  overallScore: z.number(),
  skillLevel: z.string(),

  createdAt: z.coerce.date(),
  slug: z.string(),
  reputationScore: z.int(),
  totalParticipatedEvents: z.int(),
});
export const ClubMemberDetailRes = z.object({
  status: z.number(),
  message: z.string(),
  data: ClubMemberDetail,
});

export type ClubMemberDetailType = z.infer<typeof ClubMemberDetail>;
export type ClubMemberDetailResType = z.infer<typeof ClubMemberDetailRes>;
