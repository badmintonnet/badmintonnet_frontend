import accountApiRequest from "@/apiRequest/account";
import friendApiRequest from "@/apiRequest/friend";
import ProfileActivity from "@/app/(main)/profile/_components/profile-activity";
import FriendList from "@/app/(main)/profile/_components/profile-friend-list";
import ProfileHeaderSection from "@/app/(main)/profile/_components/profile-header-section";
import ProfileInformation from "@/app/(main)/profile/_components/profile-information";
import ProfileStats from "@/app/(main)/profile/_components/profile-stats";
import ProfileTournamentHistory from "@/app/(main)/profile/_components/profile-tournament-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cookies } from "next/headers";

interface ProfileDetailPageProps {
  params: Promise<{ id: string }>;
}
export default async function ProfileDetailPage({
  params,
}: ProfileDetailPageProps) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  const { id } = await params;
  let profile;
  let relationship = null as unknown as
    | import("@/schemaValidations/friend.schema").FriendShipSchemaType
    | null;
  let currentUserId: string | null = null;

  try {
    if (!accessToken?.value) {
      throw new Error("Access token is missing");
    }
    const res = await accountApiRequest.getOtherAccount(accessToken.value, id);
    profile = res.payload.data;

    // fetch current user to know requester/receiver role for actions
    const me = await accountApiRequest.getAccount(accessToken.value);
    currentUserId = me.payload.data.id;

    // Fetch relationship status with this profile
    try {
      const relRes = await friendApiRequest.getRelationships(
        profile.id,
        accessToken.value,
      );
      relationship = relRes.payload.data ?? null;
    } catch {
      relationship = null;
    }
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
        <ProfileHeaderSection
          profile={profile}
          canEdit={profile.id === currentUserId}
          relationship={relationship}
          currentUserId={currentUserId || ""}
        />

        <div className="mt-8">
          {!profile.profileProtected || profile.id === currentUserId ? (
            <>
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <TabsTrigger value="info">Thông tin</TabsTrigger>
                  <TabsTrigger value="friend">Bạn bè</TabsTrigger>
                  <TabsTrigger value="activity">Hoạt động</TabsTrigger>
                  <TabsTrigger value="stats">Kỹ năng</TabsTrigger>
                  <TabsTrigger value="history">Thành tích</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="mt-6">
                  <ProfileInformation profile={profile} />
                </TabsContent>

                <TabsContent value="friend" className="mt-6">
                  <FriendList
                    accountId={profile.id}
                    accessToken={accessToken.value}
                  />
                </TabsContent>

                <TabsContent value="activity" className="mt-6">
                  <ProfileActivity userId={profile.id} user={profile} />
                </TabsContent>

                <TabsContent value="stats" className="mt-6">
                  <ProfileStats
                    canEdit={profile.id === currentUserId}
                    id={profile.id}
                  />
                </TabsContent>

                <TabsContent value="history" className="mt-6">
                  <ProfileTournamentHistory userId={profile.id} />
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="text-center py-20 px-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Trang cá nhân này đang được bảo vệ
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Chủ tài khoản đã bật chế độ bảo vệ trang cá nhân. Vui lòng gửi
                yêu cầu kết bạn để xem thông tin chi tiết.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
