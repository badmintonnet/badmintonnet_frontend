import React from "react";
import { Calendar, MapPin, Users, Edit, Plus, Club } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

import clubServiceApi from "@/apiRequest/club";
import { cookies } from "next/headers";
import ClubMembers from "@/app/(main)/my-clubs/_components/member";
import { CreateEventClubButton } from "@/app/(main)/my-clubs/_components/create-event-club-button";
import ClubEvents from "@/app/(main)/my-clubs/[id]/events/club-event";

interface ClubDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MyClubDetail({ params }: ClubDetailPageProps) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  const { id } = await params;
  let clubDetail = null;

  try {
    const response = await clubServiceApi.getMyClubById(
      id,
      accessToken?.value || ""
    );
    clubDetail = response.payload.data || null;
  } catch (error) {
    console.log("Error fetching club detail:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500">
          Đã có lỗi xảy ra khi tải chi tiết câu lạc bộ.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Section - Club Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Club Info */}
          <div className="lg:col-span-8 space-y-6">
            {/* Club Header Info */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Image
                  src={clubDetail.logoUrl || ""}
                  alt={`${clubDetail.name} logo`}
                  width={80}
                  height={80}
                  className="rounded-xl border-2 border-gray-100 dark:border-gray-700 transition-colors"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                      {clubDetail.name}
                    </h1>
                    {clubDetail.owner && (
                      <Badge className="mt-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
                        🏆 Bạn là chủ CLB
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {clubDetail.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" /> {clubDetail.memberCount}/
                      {clubDetail.maxMembers} thành viên
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Tham gia:{" "}
                      {new Date(clubDetail.dateJoined).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {clubDetail.owner && (
                  <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Edit className="h-4 w-4 mr-1" /> Chỉnh sửa CLB
                    </Button>
                    <CreateEventClubButton clubId={clubDetail.id} />
                  </div>
                )}
              </CardHeader>
            </Card>

            {/* Club Description and Tags */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Mô tả về CLB
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {clubDetail.description}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Chủ đề quan tâm
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {clubDetail.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                          idx % 2 === 0
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Club Stats */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Thống kê CLB
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {clubDetail.memberCount}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Thành viên
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      12
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Sự kiện
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      85%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Tham gia
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      4.8
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Đánh giá
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Members & Activities */}
          <div className="lg:col-span-4 space-y-6">
            <ClubMembers
              id={clubDetail.id}
              accessToken={accessToken?.value || ""}
              isOwner={clubDetail.owner}
            />

            {/* Danh sách hoạt động gần đây */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Hoạt động gần đây
                </h3>
                <Link
                  href={`/my-clubs/events?clubId=${clubDetail.id}`}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Xem tất cả
                </Link>
              </div>
              <div className="space-y-3">
                {/* Placeholder cho danh sách hoạt động */}
                <div className="text-center py-8">
                  <Calendar className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Chưa có hoạt động nào
                  </p>
                  {clubDetail.owner && (
                    <Link
                      href={`/my-clubs/create-event?clubId=${clubDetail.id}`}
                      className="inline-block mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Tạo hoạt động đầu tiên
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Club Events */}
        <div className="w-full">
          <ClubEvents
            searchParams={Promise.resolve({ clubId: clubDetail.id })}
            owner={clubDetail.owner}
          />
        </div>
      </div>
    </div>
  );
}
