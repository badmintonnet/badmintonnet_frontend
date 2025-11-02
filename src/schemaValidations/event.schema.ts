import z from "zod";

// Enum schemas for EventTypeEnum and SportTypeEnum
const EventTypeEnum = z.enum(["TOURNAMENT", "TRAINING", "CLUB_ACTIVITY"]);
const SportTypeEnum = z.enum(["BADMINTON", "FOOTBALL"]);

// Badminton Category Enum
const BadmintonCategoryEnum = z.enum([
  "MEN_SINGLE",
  "WOMEN_SINGLE",
  "MEN_DOUBLE",
  "WOMEN_DOUBLE",
  "MIXED_DOUBLE",
]);
export type BadmintonCategory = z.infer<typeof BadmintonCategoryEnum>;

const EventStatusEnum = z.enum([
  "OPEN",
  "CLOSED",
  "ONGOING",
  "FINISHED",
  "CANCELLED",
  "DRAFT",
]);
export type EventStatus = z.infer<typeof EventStatusEnum>;

export const EventParticipantStatusEnum = z.enum([
  "PENDING",
  "APPROVED",
  "ATTENDED",
  "ABSENT",
  "CANCELLED",
]);
export type EventParticipantStatus = z.infer<typeof EventParticipantStatusEnum>;
export const UpdateEventParticipantStatus = z.object({
  status: EventParticipantStatusEnum,
});
export type UpdateEventParticipantStatus = z.infer<
  typeof UpdateEventParticipantStatus
>;
export const ParticipantRoleEnum = z.enum(["OWNER", "MEMBER", "GUEST"]);
// Schema for file uploads (MultipartFile in Java)
const FileSchema = z
  .any()
  .refine((file) => file instanceof File || file === undefined, {
    message: "Must be a valid file or undefined",
  });

// Schema for the event creation request
export const CreateEventBody = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(256, "Title must be 256 characters or less"),
  description: z
    .string()
    .max(10000, "Description must be 10000 characters or less")
    .optional(),
  coverImage: z.string(),
  images: z.string().array().optional(),

  location: z
    .string()
    .max(256, "Location must be 256 characters or less")
    .optional(),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Thời gian bắt đầu không hợp lệ",
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Thời gian kết thúc không hợp lệ",
  }),
  capacity: z
    .number()
    .int()
    .positive("Capacity must be a positive integer")
    .optional(),
  fee: z.number().positive("Fee must be a positive number").optional(),
  recurring: z.boolean().optional(),
  recurrenceRule: z
    .string()
    .max(256, "Recurrence rule must be 256 characters or less")
    .optional(),

  eventType: EventTypeEnum,
  eventFormat: z.record(z.string(), z.any()).optional(),
  sportType: SportTypeEnum,
  sportRule: z.record(z.string(), z.any()).optional(),
});

// Schema for creating event clubs
export const CreateEventClubBody = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề là bắt buộc")
    .max(256, "Tiêu đề không được quá 256 ký tự"),
  description: z
    .string()
    .min(1, "Mô tả là bắt buộc")
    .max(10000, "Mô tả không được quá 10000 ký tự"),
  requirements: z
    .string()
    .max(1000, "Yêu cầu không được quá 1000 ký tự")
    .optional(),
  coverImage: z.string().optional(),
  image: z.string().optional(),
  location: z
    .string()
    .min(1, "Địa điểm là bắt buộc")
    .max(256, "Địa điểm không được quá 256 ký tự"),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Thời gian bắt đầu không hợp lệ",
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Thời gian kết thúc không hợp lệ",
  }),
  totalMember: z.number().int(),
  type: z
    .array(BadmintonCategoryEnum)
    .min(1, "Phải chọn ít nhất một loại hình"),
  fee: z.number().min(0, "Phí không được âm").optional(),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Hạn đăng ký không hợp lệ",
  }),
  openForOutside: z.boolean(),
  maxClubMembers: z
    .number()
    .int()
    .positive("Số thành viên CLB tối đa phải là số nguyên dương"),
  maxOutsideMembers: z
    .number()
    .int()
    .min(0, "Số thành viên ngoài tối đa không được âm"),
  clubSlug: z.string().min(1, "ID CLB là bắt buộc"),
  minLevel: z
    .number()
    .max(5, "Điểm đánh giá trình không được lớn hơn 5")
    .optional(),
  maxLevel: z
    .number()
    .max(5, "Điểm đánh giá trình không được lớn hơn 5")
    .optional(),
});

export const UpdateEventClubBody = z.object({
  id: z.string(),

  title: z.string(),
  description: z.string(),
  requirements: z.string().optional(),
  image: z.string().nullable,
  location: z.string(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  type: z.array(BadmintonCategoryEnum),
  fee: z.number(),
  deadline: z.coerce.date(),
  openForOutside: z.boolean(),
  status: EventStatusEnum,
  minLevel: z.number(),
  maxLevel: z.number(),
});

export type CreateEventBodyType = z.infer<typeof CreateEventBody>;
export type CreateEventClubBodyType = z.infer<typeof CreateEventClubBody>;
export type UpdateEventClubBodyType = z.infer<typeof UpdateEventClubBody>;

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
export type FacilityType = z.infer<typeof FacilitySchema>;

export const EventSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  image: z.string().optional(),
  location: z.string(),
  facility: FacilitySchema,
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  totalMember: z.number().int(),
  joinedMember: z.number().int(),
  maxOutsideMembers: z.number().int(),
  joinedOpenMembers: z.number().int(),
  openForOutside: z.boolean(),
  nameClub: z.string(),
  fee: z.number().optional(),
  minLevel: z.number(),
  maxLevel: z.number(),
  categories: z.array(BadmintonCategoryEnum),
  status: EventStatusEnum,
  participantRole: ParticipantRoleEnum,
});

export const PagedEventResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    content: z.array(EventSchema),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    last: z.boolean(),
  }),
});

export type EventType = z.infer<typeof EventSchema>;
export type PagedEventResponseType = z.infer<typeof PagedEventResponse>;

export const EventAdminSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  location: z.string(),
  facility: FacilitySchema,
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  totalMember: z.number().int(),
  joinedMember: z.number().int(),
  openForOutside: z.boolean(),
  nameClub: z.string(),
  fee: z.number().optional(),
  minLevel: z.number(),
  maxLevel: z.number(),
  status: EventStatusEnum,
});

export const PagedEventAdminResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    content: z.array(EventSchema),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    last: z.boolean(),
  }),
});

export type EventAdminType = z.infer<typeof EventAdminSchema>;
export type PagedEventAdminResponseType = z.infer<
  typeof PagedEventAdminResponse
>;

export const EventDetailSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(), // có thể null
  image: z.string().url().optional().nullable(),
  location: z.string(),
  facility: FacilitySchema,

  requirements: z.string(), // người dùng nhập tay có thể null

  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  deadline: z.coerce.date(),

  totalMember: z.number().int(),
  joinedMember: z.number().int(),
  nameClub: z.string(),
  fee: z.number().default(0),

  categories: z.array(BadmintonCategoryEnum).min(1),
  status: EventStatusEnum,

  clubId: z.string(),
  clubSlug: z.string(),

  joined: z.boolean(),
  openForOutside: z.boolean(),
  maxClubMembers: z.number().int(),
  maxOutsideMembers: z.number().int(),
  joinedOpenMembers: z.number().int(),
  createdAt: z.coerce.date(),
  createdBy: z.string().nullable(),
  minLevel: z.number(),
  maxLevel: z.number(),
  participantRole: ParticipantRoleEnum,
  participantStatus: EventParticipantStatusEnum,
  sendReason: z.boolean(),
});

export const EventDetailResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: EventDetailSchema,
});

export type EventDetailType = z.infer<typeof EventDetailSchema>;
export type EventDetailResponseType = z.infer<typeof EventDetailResponse>;

export const ParticipantSchema = z.object({
  id: z.string(),
  joinedAt: z.coerce.date(),
  email: z.string(),
  fullName: z.string(),
  gender: z.string(),
  avatarUrl: z.string(),
  clubMember: z.boolean(),
  status: EventParticipantStatusEnum,
  experience: z.number().int(),
  stamina: z.number().int(),
  tactics: z.number().int(),
  averageTechnicalScore: z.number(),
  overallScore: z.number(),
  skillLevel: z.string(),
  slug: z.string(),
  reputationScore: z.int(),
  totalParticipatedEvents: z.int(),
  sendReason: z.boolean(),
});
export const PagedParticipantResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(ParticipantSchema),
});

export type ParticipantType = z.infer<typeof ParticipantSchema>;
export type PagedParticipantResponseType = z.infer<
  typeof PagedParticipantResponse
>;

export const EventFilterSchema = z.object({
  levels: z.string().array().optional(),
  categories: z.array(BadmintonCategoryEnum).optional(),
  participantSize: z.string().optional(),
  minRating: z.number().min(0).max(5).optional(),
  facilityNames: z.string().array().optional(),
  status: z.array(EventStatusEnum).optional(),
});
export type EventFilterType = z.infer<typeof EventFilterSchema>;

export const CanJoinSchema = z.object({
  canJoin: z.boolean(),
  message: z.string(),
});
export const CanJoinSchemaResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: CanJoinSchema,
});

export type CanJoinSchemaType = z.infer<typeof CanJoinSchema>;
export type CanJoinSchemaResponseType = z.infer<typeof CanJoinSchemaResponse>;

export const FacilitiesResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(FacilitySchema),
});
export type FacilitiesResponseType = z.infer<typeof FacilitiesResponse>;

export const PagedFacilityResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    content: z.array(FacilitySchema),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    last: z.boolean(),
  }),
});
export type PagedFacilityResponseType = z.infer<typeof PagedFacilityResponse>;

export const CreateFacilityBody = z.object({
  name: z.string(),
  address: z.string(),
  city: z.string().min(1, "Tỉnh/Thành phố là bắt buộc"),
  district: z.string().min(1, "Quận/Huyện là bắt buộc"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  image: z.string().optional(),
  facilityId: z.string().optional(),
});

export type CreateFacilityBodyType = z.infer<typeof CreateFacilityBody>;
