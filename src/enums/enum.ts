// enums.ts
export const EventTypeEnum = {
  TOURNAMENT: "TOURNAMENT",
  TRAINING: "TRAINING",
  CLUB_ACTIVITY: "CLUB_ACTIVITY",
} as const;

export type EventTypeEnumType =
  | keyof typeof EventTypeEnum
  | (typeof EventTypeEnum)[keyof typeof EventTypeEnum];

export const SportTypeEnum = {
  BADMINTON: "BADMINTON",
  FOOTBALL: "FOOTBALL",
} as const;

export type SportTypeEnumType =
  | keyof typeof SportTypeEnum
  | (typeof SportTypeEnum)[keyof typeof SportTypeEnum];
