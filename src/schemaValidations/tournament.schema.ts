import { isAdmin } from "@/lib/utils";
import { Tour } from "antd";
import { email, z } from "zod";
import { InvitationStatusEnum } from "./club-invitation";
import { AccountFriendSchema } from "@/schemaValidations/friend.schema";

// Enum giống backend (nên đồng bộ với BadmintonCategoryEnum)
export const BadmintonCategoryEnum = z.enum([
  "MEN_SINGLE",
  "WOMEN_SINGLE",
  "MEN_DOUBLE",
  "WOMEN_DOUBLE",
  "MIXED_DOUBLE",
]);
export type BadmintonCategory = z.infer<typeof BadmintonCategoryEnum>;

export const CategoryFormatEnum = z.enum([
  "LOAI_TRUC_TIEP",
  "VONG_TRON",
  "VONG_BANG",
  "KET_HOP",
]);
export type CategoryFormatEnum = z.infer<typeof CategoryFormatEnum>;

export const TournamentParticipantEnum = z.enum([
  "DRAFT",
  "PENDING",
  "PAYMENT_REQUIRED",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
  "ELIMINATED",
]);
export type TournamentParticipantEnum = z.infer<
  typeof TournamentParticipantEnum
>;

// Enum trạng thái giải đấu (giống backend TournamentStatus)
export const TournamentStatusEnum = z.enum([
  "UPCOMING",
  "REGISTRATION_OPEN",
  "REGISTRATION_CLOSED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);
export function getTournamentStatusInfo(status: TournamentStatusEnum) {
  switch (status) {
    case "UPCOMING":
      return {
        label: "Sắp diễn ra",
        color: "text-yellow-500 dark:text-yellow-400",
        buttonClass:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
      };
    case "REGISTRATION_OPEN":
      return {
        label: "Đang mở đăng ký",
        color: "text-green-500 dark:text-green-400",
        buttonClass:
          "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
      };
    case "REGISTRATION_CLOSED":
      return {
        label: "Đã đóng đăng ký",
        color: "text-orange-500 dark:text-orange-400",
        buttonClass:
          "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
      };
    case "IN_PROGRESS":
      return {
        label: "Đang diễn ra",
        color: "text-sky-500 dark:text-sky-400",
        buttonClass:
          "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
      };
    case "COMPLETED":
      return {
        label: "Hoàn thành",
        color: "text-gray-500 dark:text-gray-400",
        buttonClass:
          "bg-gray-200 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300",
      };
    case "CANCELLED":
      return {
        label: "Đã hủy",
        color: "text-red-500 dark:text-red-400",
        buttonClass:
          "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
      };
    default:
      return {
        label: "Không xác định",
        color: "text-gray-500 dark:text-gray-400",
        buttonClass:
          "bg-gray-100 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300",
      };
  }
}

export function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    MEN_SINGLE: "Đơn nam",
    WOMEN_SINGLE: "Đơn nữ",
    MEN_DOUBLE: "Đôi nam",
    WOMEN_DOUBLE: "Đôi nữ",
    MIXED_DOUBLE: "Đôi nam nữ",
  };
  return map[category] ?? category;
}
export type TournamentStatusEnum = z.infer<typeof TournamentStatusEnum>;
// Schema cho từng hạng mục thi đấu (TournamentCategoryRequest)
export const TournamentCategoryRequest = z.object({
  categoryType: BadmintonCategoryEnum,
  minLevel: z
    .number()
    .min(0, "Trình độ tối thiểu phải >= 0")
    .max(5, "Trình độ tối thiểu không được vượt quá 5"),
  maxLevel: z
    .number()
    .min(0, "Trình độ tối đa phải >= 0")
    .max(5, "Trình độ tối đa không được vượt quá 5"),
  maxParticipants: z
    .number()
    .int()
    .positive("Số lượng người tham gia phải là số dương"),

  registrationFee: z.number().nonnegative("Lệ phí phải >= 0").optional(),

  description: z
    .string()
    .max(2000, "Mô tả không được quá 2000 ký tự")
    .optional(),

  rules: z.string().optional(),

  firstPrize: z.string().optional(),
  secondPrize: z.string().optional(),
  thirdPrize: z.string().optional(),

  format: CategoryFormatEnum.optional(),
  registrationDeadline: z.string().optional(),
});

export type TournamentCategoryRequest = z.infer<
  typeof TournamentCategoryRequest
>;
export const PlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  avatarUrl: z.string().nullable().optional(),
});
export type PlayerSchema = z.infer<typeof PlayerSchema>;

export const TeamSchema = z.object({
  id: z.string(),
  teamName: z.string(),
  avatarUrl1: z.string().nullable().optional(),
  avatarUrl2: z.string().nullable().optional(),
  slug1: z.string().nullable().optional(),
  slug2: z.string().nullable().optional(),
});
export type TeamSchema = z.infer<typeof TeamSchema>;

export const TournamentPlayer = z.object({
  id: z.string(),
  players: PlayerSchema.array().nullable().optional(),
  teams: TeamSchema.array().nullable().optional(),
  category: BadmintonCategoryEnum,
});

export type TournamentPlayer = z.infer<typeof TournamentPlayer>;

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

// Schema cho TournamentCreateRequest
export const TournamentCreateRequest = z.object({
  name: z
    .string()
    .min(1, "Tên giải đấu là bắt buộc")
    .max(255, "Tên giải đấu không được quá 255 ký tự"),
  description: z
    .string()
    .max(2000, "Mô tả không được vượt quá 2000 ký tự")
    .optional(),
  location: z.string().max(255, "Địa điểm không được quá 255 ký tự").optional(),
  facilityId: z.string().optional(),
  bannerUrl: z.string().optional(),
  logoUrl: z.string().optional(),
  rules: z.string().optional(),
  fee: z.number().optional(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Ngày bắt đầu không hợp lệ",
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Ngày kết thúc không hợp lệ",
  }),
  registrationStartDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Ngày bắt đầu đăng ký không hợp lệ",
  }),
  registrationEndDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Ngày kết thúc đăng ký không hợp lệ",
  }),

  // Danh sách category (phải có ít nhất 1)
  categories: z
    .array(TournamentCategoryRequest)
    .min(1, "Giải đấu phải có ít nhất một hạng mục thi đấu"),
});

export type TournamentCreateRequest = z.infer<typeof TournamentCreateRequest>;

export const TournamentCategoryResponse = z.object({
  id: z.string(),
  category: BadmintonCategoryEnum,
  maxParticipants: z.number().nullable().optional(),
  currentParticipantCount: z.number(),
});

export type TournamentCategoryResponse = z.infer<
  typeof TournamentCategoryResponse
>;

export const TournamentCategoryDetailResponse = z.object({
  id: z.string(),
  category: BadmintonCategoryEnum,
  maxParticipants: z.number(),
  currentParticipantCount: z.number(),
  minLevel: z.number(),
  maxLevel: z.number(),
  participantStatus: TournamentParticipantEnum.nullable().optional(),
});

export type TournamentCategoryDetailResponse = z.infer<
  typeof TournamentCategoryDetailResponse
>;
export const TournamentResponse = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  location: z.string().nullable().optional(),
  facility: FacilitySchema,
  slug: z.string().nullable(),
  fee: z.number(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  registrationStartDate: z.coerce.date(),
  registrationEndDate: z.coerce.date(),

  logoUrl: z.string().nullable().optional(),
  bannerUrl: z.string().nullable().optional(),

  createdAt: z.coerce.date(),

  status: TournamentStatusEnum,
  createdBy: z.string().nullable().optional(),

  categories: z.array(TournamentCategoryResponse),
});

export type TournamentResponse = z.infer<typeof TournamentResponse>;

export const PagedTournamentResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    content: z.array(TournamentResponse),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    last: z.boolean(),
  }),
});
export type PagedTournamentResponse = z.infer<typeof PagedTournamentResponse>;

export const TournamentDetail = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  location: z.string().nullable().optional(),
  facility: FacilitySchema,
  slug: z.string().nullable(),
  fee: z.number(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  registrationStartDate: z.coerce.date(),
  registrationEndDate: z.coerce.date(),
  rules: z.string(),
  logoUrl: z.string().nullable().optional(),
  bannerUrl: z.string().nullable().optional(),

  createdAt: z.coerce.date(),

  status: TournamentStatusEnum,
  createdBy: z.string().nullable().optional(),

  categories: z.array(TournamentCategoryDetailResponse),
  players: z.array(TournamentPlayer),
});

export type TournamentDetail = z.infer<typeof TournamentDetail>;
export const TournamentDetailResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: TournamentDetail,
});
export type TournamentDetailResponse = z.infer<typeof TournamentDetailResponse>;

export const TournamentAdminResponse = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string().nullable().optional(),
  facility: FacilitySchema,
  slug: z.string().nullable().optional(),
  fee: z.number(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  registrationStartDate: z.coerce.date(),
  registrationEndDate: z.coerce.date(),
  createdAt: z.coerce.date(),

  status: TournamentStatusEnum,
  categories: z.array(TournamentCategoryResponse).optional(),
});
export type TournamentAdminResponse = z.infer<typeof TournamentAdminResponse>;
export const PagedTournamentAdminResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    content: z.array(TournamentAdminResponse),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    last: z.boolean(),
  }),
});
export type PagedTournamentAdminResponse = z.infer<
  typeof PagedTournamentAdminResponse
>;

export const TournamentPartnerInvitationResponse = z.object({
  id: z.string(),
  inviter: AccountFriendSchema.nullable().optional(),
  invitee: AccountFriendSchema.nullable().optional(),
  status: InvitationStatusEnum,
  message: z.string().nullable().optional(),
  send: z.boolean(),
  createdAt: z.coerce.date(),
});

export type TournamentPartnerInvitationResponse = z.infer<
  typeof TournamentPartnerInvitationResponse
>;

export const CategoryDetail = z.object({
  id: z.string(),
  tournamentName: z.string(),
  facility: FacilitySchema,
  startDate: z.string(),
  endDate: z.string(),
  category: BadmintonCategoryEnum,
  minLevel: z.number(),
  maxLevel: z.number(),
  maxParticipants: z.number(),
  currentParticipantCount: z.number(),

  registrationFee: z.number(),
  description: z.string(),

  rules: z.string(),

  firstPrize: z.string(),
  secondPrize: z.string(),
  thirdPrize: z.string(),

  format: CategoryFormatEnum,
  registrationDeadline: z.string(), // nhận ISO string từ BE
  admin: z.boolean(),
  double: z.boolean(),
  paid: z.boolean(),
  scheduled: z.boolean(),
  participantStatus: TournamentParticipantEnum.nullable().optional(),
  requests: z.array(TournamentPartnerInvitationResponse),
  response: TournamentPartnerInvitationResponse.nullable().optional(),
  partner: AccountFriendSchema.nullable().optional(),
});

export type CategoryDetail = z.infer<typeof CategoryDetail>;

export const CategoryDetailResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: CategoryDetail,
});
export type CategoryDetailResponse = z.infer<typeof CategoryDetailResponse>;

export const TournamentCategoryParticipantSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  slug: z.string(),
  avatarUrl: z.string().nullable().optional(),
  email: z.string(),
  gender: z.string(),
  status: TournamentParticipantEnum,
  createdAt: z.coerce.date(),
  paid: z.boolean(),
});

export type TournamentCategoryParticipant = z.infer<
  typeof TournamentCategoryParticipantSchema
>;

export const TournamentCategoryTeamParticipantSchema = z.object({
  id: z.string(),
  teamName: z.string(),
  player1FullName: z.string(),
  player2FullName: z.string(),
  player1Slug: z.string(),
  player2Slug: z.string(),
  player1AvatarUrl: z.string().nullable().optional(),
  player2AvatarUrl: z.string().nullable().optional(),
  player1Email: z.string(),
  player2Email: z.string(),
  player1Gender: z.string(),
  player2Gender: z.string(),
  status: TournamentParticipantEnum,
  createdAt: z.coerce.date(),
  paid: z.boolean(),
});

export type TournamentCategoryTeamParticipant = z.infer<
  typeof TournamentCategoryTeamParticipantSchema
>;

export const PagedTournamentCategoryParticipantsResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    content: z.array(TournamentCategoryParticipantSchema),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    last: z.boolean(),
  }),
});

export type PagedTournamentCategoryParticipantsResponse = z.infer<
  typeof PagedTournamentCategoryParticipantsResponse
>;

export const PagedTournamentCategoryTeamParticipantsResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    content: z.array(TournamentCategoryTeamParticipantSchema),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    last: z.boolean(),
  }),
});

export type PagedTournamentCategoryTeamParticipantsResponse = z.infer<
  typeof PagedTournamentCategoryTeamParticipantsResponse
>;
export const TournamentPartnerInvitationRequest = z.object({
  categoryId: z.string().min(1, { message: "categoryId is required" }),
  inviteeId: z.string().min(1, { message: "inviteeId is required" }),
  message: z.string().optional(),
});

export type TournamentPartnerInvitationRequestType = z.TypeOf<
  typeof TournamentPartnerInvitationRequest
>;

export const TournamentPartnerInvitationUpdate = z.object({
  id: z.string().min(1, { message: "invitationId is required" }),
  status: InvitationStatusEnum,
});

export type TournamentPartnerInvitationUpdateType = z.TypeOf<
  typeof TournamentPartnerInvitationUpdate
>;
