import eventClubApiRequest from "@/apiRequest/club.event";
import { EventClubList } from "../../_components/event-club-list";
import { cookies } from "next/headers";

interface EventsPageProps {
  searchParams: Promise<{ 
    page?: string; 
    clubId?: string;
    status?: string;
    type?: string;
    search?: string;
  }>;
}

export default async function ClubEvents({ searchParams }: EventsPageProps) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  // Lấy params từ URL
  const params = await searchParams;
  const page = parseInt(params.page || "0", 10);
  const size = 10;
  const clubId = params.clubId;

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

  let response: any;
  let events: any[];
  let totalPages = 0;
  let currentPage = 0;

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <EventClubList
          events={events}
          totalPages={totalPages}
          currentPage={currentPage}
          clubId={clubId}
          accessToken={accessToken?.value || ""}
        />
      </div>
    </div>
  );
}
