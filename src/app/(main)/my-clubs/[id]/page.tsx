import React from "react";
import {
  Calendar,
  MapPin,
  Users,
  Edit,
  Plus,
  Club,
  Activity,
  BarChart3,
  Clock,
  Settings,
  Flag,
  MessageCircle,
  Star,
  ThumbsUp,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

import clubServiceApi from "@/apiRequest/club";
import { cookies } from "next/headers";
import { CreateEventClubButton } from "@/app/(main)/my-clubs/_components/create-event-club-button";
import ClubEvents from "@/app/(main)/my-clubs/[id]/events/club-event";
import ApprovedMembers from "@/app/(main)/my-clubs/_components/approved-members";
import PendingMembers from "@/app/(main)/my-clubs/_components/pending-members";
import TabWrapper from "@/app/(main)/my-clubs/_components/tab-wrapper";
import RatingView from "@/app/(main)/my-clubs/_components/rating-view";

interface ClubDetailPageProps {
  params: { id: string };
  searchParams: {
    tab?: string;
    page?: string;
    status?: string;
    type?: string;
    search?: string;
  };
}

export default async function MyClubDetail({
  params,
  searchParams,
}: ClubDetailPageProps) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;
  const tab = awaitedSearchParams?.tab ?? "overview";
  const id = awaitedParams.id;
  const page = awaitedSearchParams?.page
    ? parseInt(awaitedSearchParams.page, 10)
    : 0;
  const status = awaitedSearchParams?.status ?? "";
  const type = awaitedSearchParams?.type ?? "";
  const search = awaitedSearchParams?.search ?? "";

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
        {/* Club Header - Always visible */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Image
              src={clubDetail.logoUrl || ""}
              alt={`${clubDetail.name} logo`}
              priority
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
                  <Badge className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
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
                <CreateEventClubButton club={clubDetail.slug} />
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Tab Navigation */}
        <Tabs defaultValue={tab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 w-full lg:grid-cols-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-300"
            >
              <Club className="h-4 w-4" />
              <span className="hidden sm:inline">Tổng quan</span>
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-300"
            >
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Hoạt động</span>
            </TabsTrigger>
            <TabsTrigger
              value="members"
              className="flex items-center gap-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-600 dark:data-[state=active]:bg-green-900 dark:data-[state=active]:text-green-300"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Thành viên</span>
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="flex items-center gap-2 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-300"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Đánh giá</span>
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="flex items-center gap-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 dark:data-[state=active]:bg-orange-900 dark:data-[state=active]:text-orange-300"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Thống kê</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Club Description */}
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all rounded-2xl">
                <CardHeader>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Info className="w-5 h-5 text-emerald-500" />
                    Mô tả về CLB
                  </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Trình độ yêu cầu */}
                  <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Trình độ yêu cầu:</span>
                    <span className="ml-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      {clubDetail.minLevel.toFixed(1)} -{" "}
                      {clubDetail.maxLevel.toFixed(1)}
                    </span>
                  </div>

                  {/* Nội dung mô tả */}
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm border-l-4 border-emerald-400 pl-3 italic">
                    {clubDetail.description}
                  </p>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Chủ đề quan tâm
                  </h3>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="mt-6">
            <ClubEvents
              page={page}
              status={status}
              type={type}
              search={search}
              owner={clubDetail.owner}
              clubId={clubDetail.slug}
            />
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Members List */}
              <div className="lg:col-span-3">
                <ApprovedMembers
                  id={clubDetail.id}
                  accessToken={accessToken?.value || ""}
                />
              </div>

              {/* Sidebar - Pending Requests & Member Actions */}
              <div className="lg:col-span-1 space-y-4">
                {clubDetail.owner && (
                  <>
                    <PendingMembers
                      id={clubDetail.id}
                      slug={clubDetail.slug}
                      accessToken={accessToken?.value || ""}
                      isOwner={clubDetail.owner}
                    />
                  </>
                )}

                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                      Thao tác
                    </h4>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {clubDetail.owner && (
                      <>
                        <Button variant="outline" size="sm" className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Mời thành viên
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <Settings className="h-4 w-4 mr-2" />
                          Cài đặt thành viên
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Reviews & Comments Tab */}
          <TabsContent value="reviews" className="mt-6">
            <RatingView id={clubDetail.id} />
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="mt-6">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Thống kê CLB
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {clubDetail.memberCount}
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                      Thành viên
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                      12
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-300 font-medium">
                      Sự kiện
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      85%
                    </div>
                    <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                      Tham gia
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-xl">
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                      4.8
                    </div>
                    <div className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                      Đánh giá
                    </div>
                  </div>
                </div>

                {/* Additional stats charts or info can go here */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Tỷ lệ tham gia sự kiện
                      </h4>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        85% tham gia
                      </span>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Mức độ hoạt động
                      </h4>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: "92%" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Rất tích cực
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
