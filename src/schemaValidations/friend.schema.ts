import z from "zod";

export const FriendStatusEnum = z.enum([
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "BLOCKED",
]);

export const UserSummary = z.object({
  id: z.string(),
  email: z.string(),
  fullName: z.string(),
});

export const FriendShipSchema = z.object({
  id: z.string(),
  status: FriendStatusEnum,
  requester: UserSummary,
  receiver: UserSummary,
  createdAt: z.string().datetime(),
});

export type FriendShipSchemaType = z.TypeOf<typeof FriendShipSchema>;

export const FriendResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: FriendShipSchema,
});

export type FriendResponseType = z.TypeOf<typeof FriendResponse>;

export const AddFriendBody = z.object({
  receiverId: z.string().min(1, { message: "friendId is required" }),
});

export type AddFriendBodyType = z.TypeOf<typeof AddFriendBody>;

export const AccountFriendSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  avatarUrl: z.string(),
  skillLevel: z.string(),
  mutualFriends: z.number(),
  slug: z.string(),
});

export type AccountFriendSchemaType = z.TypeOf<typeof AccountFriendSchema>;

export const FriendListResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(AccountFriendSchema),
});
export type FriendListResponseType = z.TypeOf<typeof FriendListResponse>;
