import adminApiRequest from "@/apiRequest/admin";
import AdminDashboardOverview from "@/app/(admin)/admin/_components/admin-dashboard-overview";
import { DashboardPeriodType } from "@/schemaValidations/dashboard.schema";
import { cookies } from "next/headers";

type DashboardSearchParams = {
  from?: string;
  to?: string;
  period?: DashboardPeriodType;
};

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: DashboardSearchParams;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const query = {
    from: params.from,
    to: params.to,
    period: params.period ?? "DAY",
  };

  try {
    const response = await adminApiRequest.getDashboardOverview(
      query,
      accessToken,
    );

    return (
      <AdminDashboardOverview
        dashboard={response.payload.data}
        filters={query}
      />
    );
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
        <h1 className="text-xl font-semibold">Không thể tải dashboard</h1>
        <p className="mt-2 text-sm">
          Vui lòng kiểm tra quyền quản trị hoặc thử tải lại trang.
        </p>
      </div>
    );
  }
}
