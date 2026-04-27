import { cookies } from "next/headers";
import facilityApiRequest from "@/apiRequest/facility";
import FacilitiesClient from "./_components/facilities-client";

export default async function FacilitiesPage() {
  const page = Math.max(0, parseInt("0", 10));
  const size = 10;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  try {
    const response = await facilityApiRequest.getAllFacilities(
      page,
      size,
      accessToken?.value,
    );

    if (!response.payload || !response.payload.data) {
      throw new Error("Invalid response format");
    }

    const facilities = response.payload.data.content || [];
    const {
      totalPages,
      page: currentPage,
      totalElements: totalElements,
    } = response.payload.data;

    return (
      <FacilitiesClient
        facilities={facilities}
        totalPages={totalPages}
        currentPage={currentPage}
        totalElements={totalElements}
      />
    );
  } catch (error) {
    console.error("Error fetching facilities:", error);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Lỗi</h1>
        <p>Không thể tải danh sách cơ sở vật chất. Vui lòng thử lại sau.</p>
      </div>
    );
  }
}
