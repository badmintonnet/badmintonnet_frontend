import { cookies } from "next/headers";
import adminApiRequest from "@/apiRequest/admin";
import EventsTable from "@/app/(admin)/admin/events/_components/events_table";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const params = await searchParams;
  const page = Math.max(0, parseInt((params.page as string) || "0", 10));
  const size = 20;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  try {
    const response = await adminApiRequest.getAllEvents(
      page,
      size,
      accessToken?.value
    );

    if (!response.payload || !response.payload.data) {
      throw new Error("Invalid response format");
    }

    const events = response.payload.data.content || [];
    const {
      totalPages,
      page: currentPage,
      totalElements: totalElements,
    } = response.payload.data;

    return (
      <EventsTable
        events={events}
        totalPages={totalPages}
        currentPage={currentPage}
        accessToken={accessToken?.value || ""}
        totalElements={totalElements}
      />
    );
  } catch (error) {
    console.error("Error fetching clubs:", error);
    // Xử lý lỗi, có thể hiển thị thông báo lỗi
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Lỗi</h1>
        <p>Không thể tải danh sách câu lạc bộ. Vui lòng thử lại sau.</p>
      </div>
    );
  }
}
