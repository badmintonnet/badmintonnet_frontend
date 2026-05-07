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
  ClubDashboardType,
  DashboardPeriodType,
  TopEventMetricType,
  TopMemberMetricType,
} from "@/schemaValidations/dashboard.schema";
import {
  CalendarDays,
  CheckCircle2,
  Star,
  TrendingUp,
  Trophy,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
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

const attendanceColors = ["#059669", "#dc2626", "#f59e0b", "#64748b"];

const formatNumber = (value: number) => value.toLocaleString("vi-VN");

export default function ClubDashboardOverview({
  dashboard,
  filters,
}: {
  dashboard: ClubDashboardType;
  filters: DashboardFilters;
}) {
  const router = useRouter();
  const [period, setPeriod] = useState<DashboardPeriodType>(
    filters.period ?? dashboard.period,
  );
  const clubPathId = dashboard.clubSlug ?? dashboard.clubId;
  const attendanceData = [
    { name: "Đã tham dự", value: dashboard.attendanceRate.attended },
    { name: "Vắng mặt", value: dashboard.attendanceRate.absent },
    { name: "Đã hủy", value: dashboard.attendanceRate.cancelled },
    {
      name: "Đã duyệt",
      value: Math.max(
        dashboard.attendanceRate.approved -
          dashboard.attendanceRate.attended -
          dashboard.attendanceRate.absent,
        0,
      ),
    },
  ];

  function submitFilters(formData: FormData) {
    const params = new URLSearchParams();
    const from = formData.get("from")?.toString();
    const to = formData.get("to")?.toString();

    if (from) params.set("from", from);
    if (to) params.set("to", to);
    params.set("period", period);

    router.push(`/my-clubs/${clubPathId}/dashboard?${params.toString()}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-900 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Dashboard CLB
              </h1>
              <Button asChild variant="outline" size="sm">
                <Link href={`/my-clubs/${clubPathId}`}>Chi tiết CLB</Link>
              </Button>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {dashboard.clubName} · tăng trưởng thành viên, điểm danh và mức độ
              tương tác.
            </p>
          </div>

          <form
            action={submitFilters}
            className="grid gap-3 rounded-lg border bg-white p-3 dark:border-gray-800 dark:bg-gray-950 sm:grid-cols-[1fr_1fr_160px_auto]"
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
                onValueChange={(value) =>
                  setPeriod(value as DashboardPeriodType)
                }
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
            title="Thành viên"
            value={formatNumber(dashboard.memberGrowth.totalMembers)}
            note={`+${formatNumber(dashboard.memberGrowth.newMembers)} trong khoảng lọc`}
            color="text-sky-600"
          />
          <MetricCard
            icon={UserCheck}
            title="Chờ duyệt"
            value={formatNumber(dashboard.memberGrowth.pendingMembers)}
            note={`${formatNumber(dashboard.memberGrowth.bannedMembers)} thành viên bị cấm`}
            color="text-amber-600"
          />
          <MetricCard
            icon={CheckCircle2}
            title="Tỷ lệ điểm danh"
            value={`${dashboard.attendanceRate.attendanceRate.toFixed(1)}%`}
            note={`${formatNumber(dashboard.attendanceRate.attended)} đã tham dự`}
            color="text-emerald-600"
          />
          <MetricCard
            icon={XCircle}
            title="Vắng / hủy"
            value={`${formatNumber(dashboard.attendanceRate.absent)} / ${formatNumber(
              dashboard.attendanceRate.cancelled,
            )}`}
            note={`${formatNumber(dashboard.attendanceRate.totalRegistrations)} lượt đăng ký`}
            color="text-rose-600"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={Trophy}
            title="Số event"
            value={formatNumber(dashboard.engagement.eventCount)}
            note={`${formatNumber(dashboard.engagement.eventsThisMonth)} event tháng này`}
            color="text-violet-600"
          />
          <MetricCard
            icon={TrendingUp}
            title="Người tham gia/event"
            value={dashboard.engagement.averageParticipantsPerEvent.toFixed(1)}
            note="Trung bình trong khoảng lọc"
            color="text-teal-600"
          />
          <MetricCard
            icon={Star}
            title="Đánh giá trung bình"
            value={dashboard.engagement.averageRating.toFixed(1)}
            note={`${formatNumber(dashboard.engagement.totalRating)} lượt đánh giá`}
            color="text-orange-600"
          />
          <MetricCard
            icon={CalendarDays}
            title="Đã duyệt tham gia"
            value={formatNumber(dashboard.attendanceRate.approved)}
            note="Mẫu số tính tỷ lệ điểm danh"
            color="text-indigo-600"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <ChartCard
            title="Tăng trưởng thành viên"
            description="Thành viên mới được duyệt theo khoảng thời gian đã chọn"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboard.memberGrowth.growth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Thành viên mới"
                  stroke="#0284c7"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Điểm danh"
            description="Tỷ lệ tham dự, vắng mặt và hủy đăng ký"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={112}
                  paddingAngle={3}
                >
                  {attendanceData.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={attendanceColors[index % attendanceColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Tham gia theo trạng thái"
            description="Số lượt đăng ký và kết quả điểm danh"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Bar dataKey="value" name="Số lượt" fill="#059669" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <TopEventTable data={dashboard.engagement.topEvents} />
        </div>

        <TopMemberTable data={dashboard.engagement.topActiveMembers} />
      </div>
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

function TopEventTable({ data }: { data: TopEventMetricType[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event nổi bật</CardTitle>
        <CardDescription>Xếp theo số lượt tham gia trong khoảng lọc</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có dữ liệu event.</p>
        ) : (
          <div className="space-y-3">
            {data.map((event, index) => (
              <div
                key={event.id}
                className="flex items-center justify-between gap-3 rounded-md border p-3 dark:border-gray-800"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {index + 1}. {event.title ?? "Không có tiêu đề"}
                  </p>
                  <p className="text-xs text-gray-500">{event.slug}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold">
                  {formatNumber(event.value)} lượt
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TopMemberTable({ data }: { data: TopMemberMetricType[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thành viên tích cực</CardTitle>
        <CardDescription>Xếp theo số lần tham dự event</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có dữ liệu thành viên.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {data.map((member, index) => (
              <div
                key={member.id}
                className="rounded-md border p-3 dark:border-gray-800"
              >
                <p className="truncate text-sm font-medium">
                  {index + 1}. {member.name ?? "Thành viên"}
                </p>
                <p className="text-xs text-gray-500">{member.slug}</p>
                <p className="mt-2 text-sm font-semibold">
                  {formatNumber(member.value)} lần tham dự
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
