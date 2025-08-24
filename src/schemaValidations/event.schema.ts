import z from "zod";

// Enum schemas for EventTypeEnum and SportTypeEnum
const EventTypeEnum = z.enum(["TOURNAMENT", "TRAINING", "CLUB_ACTIVITY"]);
const SportTypeEnum = z.enum(["BADMINTON", "FOOTBALL"]);

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

export type CreateEventBodyType = z.infer<typeof CreateEventBody>;
