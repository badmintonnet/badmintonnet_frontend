import z from "zod";

export const DashboardPeriod = z.enum(["DAY", "WEEK", "MONTH"]);

export const DashboardPoint = z.object({
  label: z.string(),
  value: z.number(),
});

export const StatusCount = z.object({
  status: z.string(),
  count: z.number(),
});

export const TopClubMetric = z.object({
  id: z.string(),
  slug: z.string().nullable().optional(),
  name: z.string(),
  value: z.number(),
});

export const TopMemberMetric = z.object({
  id: z.string(),
  slug: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  value: z.number(),
});

export const TopEventMetric = z.object({
  id: z.string(),
  slug: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  value: z.number(),
});

export const AdminDashboardOverview = z.object({
  fromDate: z.string(),
  toDate: z.string(),
  period: DashboardPeriod,
  userGrowth: z.object({
    totalUsers: z.number(),
    newUsersToday: z.number(),
    newUsersThisWeek: z.number(),
    newUsersThisMonth: z.number(),
    activeUsers: z.number(),
    growth: z.array(DashboardPoint),
  }),
  revenue: z.object({
    totalRevenue: z.number(),
    successfulTransactions: z.number(),
    failedTransactions: z.number(),
    revenueByPeriod: z.array(DashboardPoint),
  }),
  eventActivity: z.object({
    totalEvents: z.number(),
    statusCounts: z.array(StatusCount),
    totalParticipations: z.number(),
    topClubsByEvents: z.array(TopClubMetric),
  }),
  clubStatistics: z.object({
    totalClubs: z.number(),
    statusCounts: z.array(StatusCount),
    topClubsByReputation: z.array(TopClubMetric),
    topClubsByMembers: z.array(TopClubMetric),
    topClubsByEvents: z.array(TopClubMetric),
  }),
  tournamentStatistics: z.object({
    totalTournaments: z.number(),
    statusCounts: z.array(StatusCount),
    totalRegistrations: z.number(),
    totalSuccessfulPayments: z.number(),
  }),
});

export const AdminDashboardOverviewRes = z.object({
  status: z.union([z.string(), z.number()]),
  message: z.string(),
  data: AdminDashboardOverview,
});

export const ClubDashboard = z.object({
  clubId: z.string(),
  clubSlug: z.string().nullable().optional(),
  clubName: z.string(),
  fromDate: z.string(),
  toDate: z.string(),
  period: DashboardPeriod,
  memberGrowth: z.object({
    totalMembers: z.number(),
    newMembers: z.number(),
    pendingMembers: z.number(),
    bannedMembers: z.number(),
    growth: z.array(DashboardPoint),
  }),
  attendanceRate: z.object({
    totalRegistrations: z.number(),
    approved: z.number(),
    attended: z.number(),
    absent: z.number(),
    cancelled: z.number(),
    attendanceRate: z.number(),
  }),
  engagement: z.object({
    eventCount: z.number(),
    eventsThisMonth: z.number(),
    averageParticipantsPerEvent: z.number(),
    averageRating: z.number(),
    totalRating: z.number(),
    topActiveMembers: z.array(TopMemberMetric),
    topEvents: z.array(TopEventMetric),
  }),
});

export const ClubDashboardRes = z.object({
  status: z.union([z.string(), z.number()]),
  message: z.string(),
  data: ClubDashboard,
});

export type DashboardPeriodType = z.TypeOf<typeof DashboardPeriod>;
export type DashboardPointType = z.TypeOf<typeof DashboardPoint>;
export type StatusCountType = z.TypeOf<typeof StatusCount>;
export type TopClubMetricType = z.TypeOf<typeof TopClubMetric>;
export type TopMemberMetricType = z.TypeOf<typeof TopMemberMetric>;
export type TopEventMetricType = z.TypeOf<typeof TopEventMetric>;
export type AdminDashboardOverviewType = z.TypeOf<
  typeof AdminDashboardOverview
>;
export type AdminDashboardOverviewResType = z.TypeOf<
  typeof AdminDashboardOverviewRes
>;
export type ClubDashboardType = z.TypeOf<typeof ClubDashboard>;
export type ClubDashboardResType = z.TypeOf<typeof ClubDashboardRes>;

