import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import clubServiceApi from "@/apiRequest/club";
import { GuestType } from "@/schemaValidations/clubs.schema";
import MembersList from "@/app/(main)/my-clubs/_components/members-list";
import GuestList from "@/app/(main)/my-clubs/_components/guests-list";
// component client hiển thị thành viên

async function getGuestMembers(
  id: string,
  accessToken: string
): Promise<GuestType[]> {
  const res = await clubServiceApi.getGuests(id, accessToken);
  return res.payload.data;
}

export default async function GuestMembers({
  id,
  accessToken,
  isOwner,
}: {
  id: string;
  accessToken: string;
  isOwner: boolean;
}) {
  const members = await getGuestMembers(id, accessToken);

  return (
    <Card className="h-full flex flex-col shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Danh sách các vãng lai
            </h3>
          </div>
          <Badge
            variant="secondary"
            className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-md"
          >
            {members.length} thành viên
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col overflow-hidden px-6">
        <GuestList members={members} clubId={id} isOwner={isOwner} />
      </CardContent>
    </Card>
  );
}
