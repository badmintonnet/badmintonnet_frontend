import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Crown } from "lucide-react";
import Image from "next/image";
import clubServiceApi from "@/apiRequest/club";
import { MemberType } from "@/schemaValidations/clubs.schema";

async function getApprovedMembers(
  id: string,
  accessToken: string,
  page = 0
): Promise<{ members: MemberType[]; totalPages: number }> {
  const res = await clubServiceApi.getClubMembers(
    id,
    page,
    10,
    accessToken,
    "APPROVED"
  );

  return {
    members: res.payload.data.content,
    totalPages: res.payload.data.totalPages || 0,
  };
}

export default async function ApprovedMembers({
  id,
  accessToken,
  page = 0,
}: {
  id: string;
  accessToken: string;
  page?: number;
}) {
  const { members, totalPages } = await getApprovedMembers(
    id,
    accessToken,
    page
  );

  return (
    <Card className="h-full gap-0 flex flex-col shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Danh sách thành viên
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
        <div className="flex-1 overflow-y-auto space-y-3">
          {members.length > 0 ? (
            members.map((member, index) => (
              <div key={member.id} className="space-y-3">
                <div className="group relative p-4 dark:bg-gray-800">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <Image
                        src={member.avatar || "/user.png"}
                        alt={member.name}
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-full object-cover border-3 border-white dark:border-gray-700 shadow-md"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg truncate">
                          {member.name}
                        </h4>
                        {member.role === "OWNER" && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-blue-500 rounded-full">
                            <Crown className="h-3 w-3 text-white" />
                            <span className="text-xs font-medium text-white">
                              Quản trị viên
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                          Tham gia:{" "}
                          {new Date(member.joinedAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                        {member.role !== "OWNER" && (
                          <Badge variant="outline" className="text-xs">
                            Thành viên
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {index < members.length - 1 && (
                  <hr className="border-t border-gray-200 dark:border-gray-700" />
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                Chưa có thành viên
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Danh sách thành viên đã duyệt sẽ hiển thị tại đây
              </p>
            </div>
          )}
        </div>

        {/* Pagination (chỉ hiển thị, muốn chuyển trang thì phải điều hướng link khác) */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Trang {page + 1} / {totalPages}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
