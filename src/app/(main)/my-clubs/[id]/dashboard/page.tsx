import clubServiceApi from "@/apiRequest/club";
import ClubDashboardOverview from "@/app/(main)/my-clubs/[id]/dashboard/_components/club-dashboard-overview";
import { DashboardPeriodType } from "@/schemaValidations/dashboard.schema";
import { cookies } from "next/headers";

type DashboardSearchParams = {
  from?: string;
  to?: string;
  period?: DashboardPeriodType;
};

export default async function ClubDashboardPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: DashboardSearchParams;
}) {
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const query = {
    from: awaitedSearchParams.from,
    to: awaitedSearchParams.to,
    period: awaitedSearchParams.period ?? "DAY",
  };

  try {
    const response = await clubServiceApi.getClubDashboard(
      awaitedParams.id,
      query,
      accessToken,
    );

    return (
      <ClubDashboardOverview
        dashboard={response.payload.data}
        filters={query}
      />
    );
  } catch (error) {
    console.error("Error fetching club dashboard:", error);
    return (
      <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl rounded-lg border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
          <h1 className="text-xl font-semibold">Không thể tải dashboard CLB</h1>
          <p className="mt-2 text-sm">
            Vui lòng kiểm tra quyền chủ câu lạc bộ hoặc thử lại sau.
          </p>
        </div>
      </div>
    );
  }
}
