import { z } from "zod";
import { InvitationStatusEnum } from "./club-invitation";
import { AccountFriendSchema } from "@/schemaValidations/friend.schema";

// Enum loại hình tham gia tournament
export const TournamentParticipationTypeEnum = z.enum(["INDIVIDUAL", "CLUB"]);
export type TournamentParticipationType = z.infer<
  typeof TournamentParticipationTypeEnum
>;

export function getParticipationTypeInfo(
  type?: TournamentParticipationType | null,
) {
  if (type === "CLUB") {
    return {
      label: "Theo CLB",
      badgeClass:
        "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border border-violet-200 dark:border-violet-700",
    };
  }
  return {
    label: "Cá nhân",
    badgeClass:
      "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 border border-sky-200 dark:border-sky-700",
  };
}

// Enum trạng thái participant CLB
export const ClubTournamentParticipantStatusEnum = z.enum([
  "DRAFT",
  "PENDING",
  "PAYMENT_REQUIRED",
  "PAID",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
  "ELIMINATED",
]);
export type ClubTournamentParticipantStatus = z.infer<
  typeof ClubTournamentParticipantStatusEnum
>;

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

// Schema cho Club Tournament Category (mới - CLUB type)
export const ClubTournamentCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  clubRegistrationFee: z.number(),
  minClubRosterSize: z.number(),
  maxClubRosterSize: z.number(),
  teamMatchFormat: z.string(), // JSON: {"singles": 3, "menDoubles": 2, "mixedDoubles": 1}
  maxClubs: z.number(),
  currentClubCount: z.number(),
  rules: z.string(),
  firstPrize: z.string(),
  secondPrize: z.string(),
  thirdPrize: z.string(),
  slug: z.string(),
});
export type ClubTournamentCategory = z.infer<
  typeof ClubTournamentCategorySchema
>;

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

  // Fields cho CLB tournament (optional, chỉ gửi khi participationType = CLUB)
  clubRegistrationFee: z
    .number()
    .nonnegative("Phí CLB phải >= 0")
    .nullable()
    .optional(),
  minClubRosterSize: z.number().int().positive().nullable().optional(),
  maxClubRosterSize: z.number().int().positive().nullable().optional(),
  teamMatchFormat: z.string().nullable().optional(),

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

// Schema cho Club Category Request (CLUB tournament)
export const ClubCategoryRequest = z.object({
  name: z.string().min(1, "Tên hạng mục CLB là bắt buộc"),
  description: z.string().optional(),
  clubRegistrationFee: z.number().min(0, "Phí đăng ký CLB phải >= 0"),
  minClubRosterSize: z.number().int().min(1, "Tối thiểu phải >= 1"),
  maxClubRosterSize: z.number().int().min(1, "Tối đa phải >= 1"),
  teamMatchFormat: z.string(), // JSON string
  maxClubs: z.number().int().min(2, "Tối thiểu 2 CLB"),
  rules: z.string().optional(),
  firstPrize: z.string().optional(),
  secondPrize: z.string().optional(),
  thirdPrize: z.string().optional(),
});
export type ClubCategoryRequestType = z.infer<typeof ClubCategoryRequest>;

// Schema cho TournamentCreateRequest
export const TournamentCreateRequest = z
  .object({
    name: z
      .string()
      .min(1, "Tên giải đấu là bắt buộc")
      .max(255, "Tên giải đấu không được quá 255 ký tự"),
    description: z
      .string()
      .max(2000, "Mô tả không được vượt quá 2000 ký tự")
      .optional(),
    location: z
      .string()
      .max(255, "Địa điểm không được quá 255 ký tự")
      .optional(),
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

    // Loại hình tham gia
    participationType: TournamentParticipationTypeEnum.optional(),

    // INDIVIDUAL: categories array
    categories: z.array(TournamentCategoryRequest).optional(),

    // CLUB: các fields trực tiếp trên Tournament
    teamMatchFormat: z.string().optional(), // JSON: {"singles": 3, "menDoubles": 2}
    clubRegistrationFee: z.number().min(0).optional(), // Phí đăng ký CLB
    minClubRosterSize: z.number().int().min(1).optional(), // Số thành viên tối thiểu
    maxClubRosterSize: z.number().int().min(1).optional(), // Số thành viên tối đa
    maxClubs: z.number().int().min(2).optional(), // Số CLB tối đa
  })
  .refine(
    (data) => {
      if (data.participationType === "CLUB") {
        return (
          data.clubRegistrationFee != null &&
          data.minClubRosterSize != null &&
          data.minClubRosterSize >= 1 &&
          data.maxClubRosterSize != null &&
          data.maxClubRosterSize >= 1 &&
          data.maxClubs != null &&
          data.maxClubs >= 2
        );
      }
      // INDIVIDUAL: phải có ít nhất một hạng mục
      return data.categories != null && data.categories.length > 0;
    },
    {
      message:
        "Giải đấu phải có ít nhất một hạng mục thi đấu (INDIVIDUAL) hoặc thông tin CLB hợp lệ (CLUB)",
    },
  );

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
  // Thêm mới theo backend update
  registrationFee: z.number().nullable().optional(),
  registrationStartDate: z.string().nullable().optional(),
  registrationEndDate: z.string().nullable().optional(),
});

export type TournamentCategoryDetailResponse = z.infer<
  typeof TournamentCategoryDetailResponse
>;
export const TournamentResponse = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  facility: FacilitySchema.nullable().optional(),
  slug: z.string().nullable(),
  fee: z.number().nullable().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  registrationStartDate: z.coerce.date(),
  registrationEndDate: z.coerce.date(),

  logoUrl: z.string().nullable().optional(),
  bannerUrl: z.string().nullable().optional(),

  createdAt: z.coerce.date(),

  status: TournamentStatusEnum,
  participationType: TournamentParticipationTypeEnum.nullable().optional(),
  createdBy: z.string().nullable().optional(),

  categories: z.array(TournamentCategoryResponse).optional(),

  // CLUB tournament fields
  teamMatchFormat: z.string().nullable().optional(),
  clubRegistrationFee: z.number().nullable().optional(),
  minClubRosterSize: z.number().nullable().optional(),
  maxClubRosterSize: z.number().nullable().optional(),
  maxClubs: z.number().nullable().optional(),
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
  description: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  facility: FacilitySchema.nullable().optional(),
  slug: z.string().nullable(),
  fee: z.number().nullable().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  registrationStartDate: z.coerce.date(),
  registrationEndDate: z.coerce.date(),
  rules: z.string().nullable().optional(),
  logoUrl: z.string().nullable().optional(),
  bannerUrl: z.string().nullable().optional(),

  createdAt: z.coerce.date(),

  status: TournamentStatusEnum,
  participationType: TournamentParticipationTypeEnum.nullable().optional(),
  createdBy: z.string().nullable().optional(),

  // INDIVIDUAL tournament
  categories: z.array(TournamentCategoryDetailResponse).optional(),
  players: z.array(TournamentPlayer).optional(),

  // CLUB tournament - các fields trực tiếp trên Tournament
  // Sử dụng chung registrationStartDate và registrationEndDate từ tournament
  teamMatchFormat: z.string().nullable().optional(), // JSON: {"singles": 3, "menDoubles": 2}
  clubRegistrationFee: z.number().nullable().optional(), // Phí đăng ký CLB
  minClubRosterSize: z.number().nullable().optional(), // Số thành viên tối thiểu
  maxClubRosterSize: z.number().nullable().optional(), // Số thành viên tối đa
  maxClubs: z.number().nullable().optional(), // Số CLB tối đa
  currentClubCount: z.number().nullable().optional(), // Số CLB đã đăng ký

  // Legacy: still keep for backward compatibility
  clubCategories: z.array(ClubTournamentCategorySchema).optional(),
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
  registrationStartDate: z.string().nullable().optional(),
  registrationEndDate: z.string().nullable().optional(),
  admin: z.boolean(),
  double: z.boolean(),
  paid: z.boolean(),
  scheduled: z.boolean(),
  participantStatus: TournamentParticipantEnum.nullable().optional(),
  requests: z.array(TournamentPartnerInvitationResponse),
  response: TournamentPartnerInvitationResponse.nullable().optional(),
  partner: AccountFriendSchema.nullable().optional(),

  // Club tournament fields (only present when participationType = CLUB)
  clubRegistrationFee: z.number().nullable().optional(),
  minClubRosterSize: z.number().nullable().optional(),
  maxClubRosterSize: z.number().nullable().optional(),
  teamMatchFormat: z.string().nullable().optional(),
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

// ============================================================
// CLB TOURNAMENT SCHEMAS
// ============================================================

export const ClubTournamentStatusEnum = z.enum([
  "DRAFT",
  "PENDING",
  "PAYMENT_REQUIRED",
  "PAID",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
  "ELIMINATED",
]);
export type ClubTournamentStatus = z.infer<typeof ClubTournamentStatusEnum>;

export function getClubTournamentStatusInfo(status: ClubTournamentStatus) {
  switch (status) {
    case "DRAFT":
      return {
        label: "Bản nháp",
        badgeClass:
          "bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400 border border-gray-200 dark:border-gray-700",
      };
    case "PENDING":
      return {
        label: "Chờ thanh toán",
        badgeClass:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-700",
      };
    case "PAYMENT_REQUIRED":
      return {
        label: "Đang xử lý thanh toán",
        badgeClass:
          "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border border-orange-200 dark:border-orange-700",
      };
    case "PAID":
      return {
        label: "Đã thanh toán",
        badgeClass:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-700",
      };
    case "APPROVED":
      return {
        label: "Đã được duyệt",
        badgeClass:
          "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-700",
      };
    case "REJECTED":
      return {
        label: "Bị từ chối",
        badgeClass:
          "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-700",
      };
    case "CANCELLED":
      return {
        label: "Đã hủy",
        badgeClass:
          "bg-gray-100 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300 border border-gray-200 dark:border-gray-600",
      };
    case "ELIMINATED":
      return {
        label: "Đã bị loại",
        badgeClass:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-700",
      };
  }
}

export const ClubRosterMemberSchema = z.object({
  rosterEntryId: z.string(),
  clubMemberId: z.string(),
  accountId: z.string(),
  fullName: z.string(),
  email: z.string(),
  avatarUrl: z.string().nullable().optional(),
  slug: z.string(),
  skillLevel: z.string().nullable().optional(),
  role: z.enum(["OWNER", "MEMBER"]),
  position: z.string().nullable().optional(),
  canModify: z.boolean(),
});
export type ClubRosterMember = z.infer<typeof ClubRosterMemberSchema>;

export const ClubTournamentParticipantSchema = z.object({
  id: z.string(),
  clubId: z.string(),
  clubName: z.string(),
  clubLogoUrl: z.string().nullable().optional(),
  clubSlug: z.string(),
  clubLocation: z.string().nullable().optional(),
  ownerName: z.string(),
  ownerEmail: z.string().nullable().optional(),
  categoryId: z.string(),
  categoryName: z.string().nullable().optional(),
  tournamentId: z.string(),
  tournamentName: z.string().nullable().optional(),
  tournamentSlug: z.string().nullable().optional(),
  status: ClubTournamentStatusEnum,
  registeredAt: z.coerce.date().nullable().optional(),
  paid: z.boolean(),
  rosterSize: z.number(),
  roster: z.array(ClubRosterMemberSchema),
});
export type ClubTournamentParticipant = z.infer<
  typeof ClubTournamentParticipantSchema
>;

export const ClubTournamentParticipantResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: ClubTournamentParticipantSchema,
});
export type ClubTournamentParticipantResponseType = z.infer<
  typeof ClubTournamentParticipantResponse
>;

export const PagedClubTournamentParticipantsResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    content: z.array(ClubTournamentParticipantSchema),
    pageNumber: z.number(),
    pageSize: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    last: z.boolean(),
  }),
});
export type PagedClubTournamentParticipantsResponseType = z.infer<
  typeof PagedClubTournamentParticipantsResponse
>;

// Response type for /my-tournaments endpoint (returns array directly)
export const ClubTournamentMyListResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(ClubTournamentParticipantSchema),
});
export type ClubTournamentMyListResponseType = z.infer<
  typeof ClubTournamentMyListResponse
>;

export const ClubTournamentRegisterRequest = z.object({
  clubId: z.string().min(1),
  rosterAccountIds: z.array(z.string()).min(1),
});
export type ClubTournamentRegisterRequestType = z.infer<
  typeof ClubTournamentRegisterRequest
>;

export const ClubTournamentUpdateRosterRequest = z.object({
  rosterAccountIds: z.array(z.string()).min(1),
});
export type ClubTournamentUpdateRosterRequestType = z.infer<
  typeof ClubTournamentUpdateRosterRequest
>;
