import accountApiRequest from "@/apiRequest/account";
import ProfileContainer from "@/app/(main)/profile/_components/profile-container";
import ProfileStats from "@/app/(main)/profile/_components/profile-stats";
import { cookies } from "next/headers";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  let profile;

  try {
    const res = await accountApiRequest.getAccount(accessToken?.value || "");
    profile = res.payload.data;
    console.log("Profile data:", profile);
  } catch (error) {
    console.log("Error fetching clubs:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500">
          Đã có lỗi xảy ra khi tải profile của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grid layout cho profile info và stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Thông tin cá nhân (chiếm 2 cột trên desktop) */}
          <div className="lg:col-span-2">
            <ProfileContainer profile={profile} />
          </div>

          {/* Thống kê (chiếm 1 cột) */}
          <div className="lg:col-span-1">
            <ProfileStats />
          </div>
        </div>
      </div>
    </div>
  );
}
