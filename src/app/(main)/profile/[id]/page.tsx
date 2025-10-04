import accountApiRequest from "@/apiRequest/account";
import friendApiRequest from "@/apiRequest/friend";
import ProfileActivity from "@/app/(main)/profile/_components/profile-activity";
import FriendList from "@/app/(main)/profile/_components/profile-friend-list";
import ProfileHeaderSection from "@/app/(main)/profile/_components/profile-header-section";
import ProfileInformation from "@/app/(main)/profile/_components/profile-information";
import ProfileStats from "@/app/(main)/profile/_components/profile-stats";
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
        accessToken.value
      );
      relationship = relRes.payload.data ?? null;
    } catch (e) {
      relationship = null;
    }
    // console.log("Profile data:", profile);
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
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <TabsTrigger value="info">Thông tin</TabsTrigger>
              <TabsTrigger value="friend">Bạn bè</TabsTrigger>
              <TabsTrigger value="activity">Hoạt động</TabsTrigger>
              <TabsTrigger value="stats">Kỹ năng</TabsTrigger>
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
              <ProfileStats canEdit={profile.id === currentUserId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
