import eventClubApiRequest from "@/apiRequest/club.event";
import { EventClubList } from "../../_components/event-club-list";
import { cookies } from "next/headers";

interface EventsPageProps {
  page: number;
  status?: string;
  type?: string;
  search?: string;
  owner: boolean;
  clubId: string;
}

export default async function ClubEvents({
  page,
  status,
  type,
  search,
  owner,
  clubId,
}: EventsPageProps) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  // Lấy params từ URL

  const size = 10;
  if (!clubId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Không tìm thấy thông tin câu lạc bộ. Vui lòng quay lại trang trước.
          </p>
        </div>
      </div>
    );
  }

  let response;
  let events;
  let totalPages = 0;
  let currentPage = 0;
  let totalElements = 0;

  try {
    // Lấy event clubs theo club ID
    response = await eventClubApiRequest.getEventClubsByClubId(
      clubId,
      page,
      size,
      accessToken?.value || ""
    );
    events = response.payload.data.content || [];
    totalPages = response.payload.data.totalPages || 0;
    totalElements = response.payload.data.totalElements;
    currentPage = response.payload.data.page || 0;
  } catch (error) {
    console.log("Error fetching events:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Đã có lỗi xảy ra khi tải danh sách hoạt động.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900">
      <div className="w-full">
        <EventClubList
          events={events}
          totalPages={totalPages}
          currentPage={currentPage}
          totalElements={totalElements}
          clubId={clubId}
          accessToken={accessToken?.value || ""}
          owner={owner}
        />
      </div>
    </div>
  );
}
