import { cookies } from "next/headers";
import adminApiRequest from "@/apiRequest/admin";
import UsersTable from "@/app/(admin)/admin/users/_components/users-table";

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
    const response = await adminApiRequest.getAllUsers(
      page,
      size,
      accessToken?.value,
    );

    if (!response.payload || !response.payload.data) {
      throw new Error("Invalid response format");
    }

    const users = response.payload.data.content || [];
    const {
      totalPages,
      page: currentPage,
      totalElements: totalElements,
    } = response.payload.data;

    return (
      <UsersTable
        users={users}
        totalPages={totalPages}
        currentPage={currentPage}
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
