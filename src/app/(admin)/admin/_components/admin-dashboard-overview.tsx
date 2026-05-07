"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AdminDashboardOverviewType,
  DashboardPeriodType,
  StatusCountType,
  TopClubMetricType,
} from "@/schemaValidations/dashboard.schema";
import {
  Activity,
  CalendarDays,
  CircleDollarSign,
  Club,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DashboardFilters = {
  from?: string;
  to?: string;
  period?: DashboardPeriodType;
};

const statusLabels: Record<string, string> = {
  ACTIVE: "Hoạt động",
  PENDING: "Chờ duyệt",
  INACTIVE: "Tạm dừng",
  DRAFT: "Nháp",
  OPEN: "Mở đăng ký",
  CLOSED: "Đã đóng",
  ONGOING: "Đang diễn ra",
  FINISHED: "Hoàn tất",
  CANCELLED: "Đã hủy",
  UPCOMING: "Sắp diễn ra",
  REGISTRATION_OPEN: "Đang đăng ký",
  REGISTRATION_CLOSED: "Đóng đăng ký",
  IN_PROGRESS: "Đang thi đấu",
  COMPLETED: "Hoàn thành",
};

const formatNumber = (value: number) => value.toLocaleString("vi-VN");
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

export default function AdminDashboardOverview({
  dashboard,
  filters,
}: {
  dashboard: AdminDashboardOverviewType;
  filters: DashboardFilters;
}) {
  const router = useRouter();
  const [period, setPeriod] = useState<DashboardPeriodType>(
    filters.period ?? dashboard.period,
  );

  const eventStatusData = toStatusChartData(
    dashboard.eventActivity.statusCounts,
  );
  const clubStatusData = toStatusChartData(dashboard.clubStatistics.statusCounts);
  const tournamentStatusData = toStatusChartData(
    dashboard.tournamentStatistics.statusCounts,
  );

  function submitFilters(formData: FormData) {
    const params = new URLSearchParams();
    const from = formData.get("from")?.toString();
    const to = formData.get("to")?.toString();

    if (from) params.set("from", from);
    if (to) params.set("to", to);
    params.set("period", period);

    router.push(`/admin?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Dashboard quản trị
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tổng quan tăng trưởng, doanh thu, hoạt động CLB và giải đấu.
          </p>
        </div>

        <form
          action={submitFilters}
          className="grid gap-3 rounded-lg border bg-white p-3 dark:border-gray-800 dark:bg-gray-900 sm:grid-cols-[1fr_1fr_160px_auto]"
        >
          <div className="space-y-1">
            <Label htmlFor="from">Từ ngày</Label>
            <Input
              id="from"
              name="from"
              type="date"
              defaultValue={filters.from ?? dashboard.fromDate}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="to">Đến ngày</Label>
            <Input
              id="to"
              name="to"
              type="date"
              defaultValue={filters.to ?? dashboard.toDate}
            />
          </div>
          <div className="space-y-1">
            <Label>Nhóm theo</Label>
            <Select
              value={period}
              onValueChange={(value) => setPeriod(value as DashboardPeriodType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAY">Ngày</SelectItem>
                <SelectItem value="WEEK">Tuần</SelectItem>
                <SelectItem value="MONTH">Tháng</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="self-end gap-2">
            <CalendarDays className="h-4 w-4" />
            Lọc
          </Button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Users}
          title="Tổng người dùng"
          value={formatNumber(dashboard.userGrowth.totalUsers)}
          note={`+${formatNumber(dashboard.userGrowth.newUsersToday)} hôm nay`}
          color="text-sky-600"
        />
        <MetricCard
          icon={Activity}
          title="Người dùng active"
          value={formatNumber(dashboard.userGrowth.activeUsers)}
          note={`${formatNumber(dashboard.userGrowth.newUsersThisMonth)} người mới tháng này`}
          color="text-emerald-600"
        />
        <MetricCard
          icon={CircleDollarSign}
          title="Doanh thu"
          value={formatCurrency(dashboard.revenue.totalRevenue)}
          note={`${formatNumber(dashboard.revenue.successfulTransactions)} giao dịch thành công`}
          color="text-amber-600"
        />
        <MetricCard
          icon={Club}
          title="Câu lạc bộ"
          value={formatNumber(dashboard.clubStatistics.totalClubs)}
          note="Theo trạng thái duyệt và hoạt động"
          color="text-indigo-600"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={CalendarDays}
          title="Sự kiện"
          value={formatNumber(dashboard.eventActivity.totalEvents)}
          note={`${formatNumber(dashboard.eventActivity.totalParticipations)} lượt tham gia`}
          color="text-rose-600"
        />
        <MetricCard
          icon={Trophy}
          title="Giải đấu"
          value={formatNumber(dashboard.tournamentStatistics.totalTournaments)}
          note={`${formatNumber(dashboard.tournamentStatistics.totalRegistrations)} lượt đăng ký`}
          color="text-violet-600"
        />
        <MetricCard
          icon={ShieldCheck}
          title="Thanh toán giải đấu"
          value={formatNumber(
            dashboard.tournamentStatistics.totalSuccessfulPayments,
          )}
          note={`${formatNumber(dashboard.revenue.failedTransactions)} giao dịch thất bại`}
          color="text-teal-600"
        />
        <MetricCard
          icon={Users}
          title="Người dùng mới tuần này"
          value={formatNumber(dashboard.userGrowth.newUsersThisWeek)}
          note={`${formatNumber(dashboard.userGrowth.newUsersThisMonth)} trong tháng`}
          color="text-cyan-700"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Tăng trưởng người dùng"
          description="Số tài khoản mới theo khoảng thời gian đã chọn"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dashboard.userGrowth.growth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value) => formatNumber(Number(value))} />
              <Line
                type="monotone"
                dataKey="value"
                name="Người dùng mới"
                stroke="#0284c7"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Doanh thu"
          description="Doanh thu từ giao dịch giải đấu thành công"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboard.revenue.revenueByPeriod}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis tickFormatter={(value) => compactCurrency(Number(value))} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="value" name="Doanh thu" fill="#d97706" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Trạng thái sự kiện" description="Hoạt động CLB theo trạng thái">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={eventStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value) => formatNumber(Number(value))} />
              <Bar dataKey="count" name="Số sự kiện" fill="#e11d48" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Trạng thái giải đấu" description="Giải đấu trong khoảng lọc">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tournamentStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value) => formatNumber(Number(value))} />
              <Bar dataKey="count" name="Số giải đấu" fill="#7c3aed" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <TopClubTable
          title="CLB tổ chức nhiều sự kiện"
          data={dashboard.eventActivity.topClubsByEvents}
          suffix="sự kiện"
        />
        <TopClubTable
          title="CLB nhiều thành viên"
          data={dashboard.clubStatistics.topClubsByMembers}
          suffix="thành viên"
        />
        <TopClubTable
          title="CLB uy tín cao"
          data={dashboard.clubStatistics.topClubsByReputation}
          suffix="điểm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trạng thái câu lạc bộ</CardTitle>
          <CardDescription>Tổng hợp toàn hệ thống theo trạng thái CLB</CardDescription>
        </CardHeader>
        <CardContent className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={clubStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value) => formatNumber(Number(value))} />
              <Bar dataKey="count" name="Số CLB" fill="#4f46e5" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  title,
  value,
  note,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  note: string;
  color: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{note}</p>
      </CardContent>
    </Card>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-[320px]">{children}</CardContent>
    </Card>
  );
}

function TopClubTable({
  title,
  data,
  suffix,
}: {
  title: string;
  data: TopClubMetricType[];
  suffix: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có dữ liệu.</p>
        ) : (
          <div className="space-y-3">
            {data.map((club, index) => (
              <div
                key={club.id}
                className="flex items-center justify-between gap-3 rounded-md border p-3 dark:border-gray-800"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {index + 1}. {club.name}
                  </p>
                  <p className="text-xs text-gray-500">{club.slug}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold">
                  {formatNumber(club.value)} {suffix}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function toStatusChartData(statusCounts: StatusCountType[]) {
  return statusCounts.map((item) => ({
    name: statusLabels[item.status] ?? item.status,
    count: item.count,
  }));
}

function compactCurrency(value: number) {
  if (value >= 1_000_000) return `${Math.round(value / 1_000_000)}tr`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}k`;
  return value.toString();
}
