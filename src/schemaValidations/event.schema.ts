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

const EventStatusEnum = z.enum([
  "OPEN",
  "CLOSED",
  "ONGOING",
  "FINISHED",
  "CANCELLED",
]);

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
  totalMember: z
    .number()
    .int()
    .positive("Tổng số thành viên phải là số nguyên dương"),
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
  clubId: z.string().min(1, "ID CLB là bắt buộc"),
});

export type CreateEventBodyType = z.infer<typeof CreateEventBody>;
export type CreateEventClubBodyType = z.infer<typeof CreateEventClubBody>;

export const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  image: z.string().optional(),
  location: z.string(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  totalMember: z.number().int(),
  joinedMember: z.number().int(),
  openForOutside: z.boolean(),
  nameClub: z.string(),
  fee: z.number().optional(),
  categories: z.array(BadmintonCategoryEnum).optional(),
  status: EventStatusEnum,
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

export const EventDetailSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(), // có thể null
  image: z.string().url().optional(),
  location: z.string(),

  requirements: z.string().nullable(), // người dùng nhập tay có thể null

  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  deadline: z.coerce.date(),

  totalMember: z.number().int(),
  joinedMember: z.number().int(),
  nameClub: z.string(),
  fee: z.number().nullable().default(0),

  categories: z.array(BadmintonCategoryEnum).optional(),
  status: EventStatusEnum,

  clubId: z.string(),

  joined: z.boolean(),
  openForOutside: z.boolean(),
  maxClubMembers: z.number().int(),
  maxOutsideMembers: z.number().int(),

  createdAt: z.coerce.date(),
  createdBy: z.string().nullable(),

  participantRole: ParticipantRoleEnum,
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
});
export const PagedParticipantResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    content: z.array(ParticipantSchema),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    last: z.boolean(),
  }),
});

export type ParticipantType = z.infer<typeof ParticipantSchema>;
export type PagedParticipantResponseType = z.infer<
  typeof PagedParticipantResponse
>;
