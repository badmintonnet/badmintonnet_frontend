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
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";

import clubServiceApi from "@/apiRequest/club";
import { cookies } from "next/headers";
import ClubMembers from "@/app/(main)/my-clubs/_components/member";
import { CreateEventClubButton } from "@/app/(main)/my-clubs/_components/create-event-club-button";
import ClubEvents from "@/app/(main)/my-clubs/[id]/events/club-event";
import ApprovedMembers from "@/app/(main)/my-clubs/_components/approved-members";
import PendingMembers from "@/app/(main)/my-clubs/_components/pending-members";

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
        {/* Club Header - Always visible */}
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
                <CreateEventClubButton clubId={clubDetail.id} />
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Tab Navigation */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 w-full lg:grid-cols-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-300"
            >
              <Club className="h-4 w-4" />
              <span className="hidden sm:inline">Tổng quan</span>
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
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Mô tả về CLB
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Reviews Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Reviews Overview */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Đánh giá từ thành viên
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          23 đánh giá • Điểm trung bình: 4.6/5
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Viết đánh giá
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {/* Review 1 */}
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          AN
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              Nguyễn Anh
                            </span>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= 5
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              2 ngày trước
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            CLB rất tuyệt vời! Các hoạt động đa dạng và thú vị.
                            Thành viên rất thân thiện và nhiệt tình. Tôi đã học
                            được rất nhiều điều mới và kết bạn với nhiều người
                            cùng sở thích.
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                            <button className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400">
                              <ThumbsUp className="h-3 w-3" />
                              Hữu ích (12)
                            </button>
                            <button className="hover:text-blue-600 dark:hover:text-blue-400">
                              Trả lời
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Review 2 */}
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                          MT
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              Mai Thảo
                            </span>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= 4
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              1 tuần trước
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            Môi trường học tập và giao lưu rất tốt. Các sự kiện
                            được tổ chức chuyên nghiệp. Chỉ có điều thỉnh thoảng
                            lịch trình hơi dày đặc, hy vọng sẽ có sự điều chỉnh
                            hợp lý hơn.
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                            <button className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400">
                              <ThumbsUp className="h-3 w-3" />
                              Hữu ích (8)
                            </button>
                            <button className="hover:text-blue-600 dark:hover:text-blue-400">
                              Trả lời
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Review 3 */}
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          DH
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              Đức Huy
                            </span>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= 5
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              2 tuần trước
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            Tham gia CLB đã được 6 tháng và thấy rất hài lòng.
                            Ban quản lý nhiệt tình, các hoạt động phong phú. Đặc
                            biệt là các workshop kỹ năng rất bổ ích cho công
                            việc.
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                            <button className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400">
                              <ThumbsUp className="h-3 w-3" />
                              Hữu ích (15)
                            </button>
                            <button className="hover:text-blue-600 dark:hover:text-blue-400">
                              Trả lời
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Load More */}
                <div className="text-center">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Xem thêm đánh giá
                  </Button>
                </div>
              </div>

              {/* Sidebar - Rating Summary */}
              <div className="lg:col-span-1 space-y-4">
                {/* Rating Breakdown */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                      Phân bố đánh giá
                    </h4>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        4.6
                      </div>
                      <div className="flex justify-center items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-5 w-5 text-yellow-400 fill-yellow-400"
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        23 đánh giá
                      </div>
                    </div>

                    {/* Rating bars */}
                    {[
                      { stars: 5, count: 15, percentage: 65 },
                      { stars: 4, count: 6, percentage: 26 },
                      { stars: 3, count: 2, percentage: 9 },
                      { stars: 2, count: 0, percentage: 0 },
                      { stars: 1, count: 0, percentage: 0 },
                    ].map((rating) => (
                      <div
                        key={rating.stars}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="w-8">{rating.stars}★</span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                          <div
                            className="h-2 bg-yellow-400 rounded-full"
                            style={{ width: `${rating.percentage}%` }}
                          ></div>
                        </div>
                        <span className="w-8 text-gray-500 dark:text-gray-400 text-right">
                          {rating.count}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                      Tương tác
                    </h4>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Viết đánh giá
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Flag className="h-4 w-4 mr-2" />
                      Báo cáo
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                      Hoạt động gần đây
                    </h4>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>5 đánh giá mới trong tuần</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Điểm trung bình tăng 0.2</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>3 phản hồi từ ban quản lý</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
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

        {/* Bottom Section - Club Events (Always visible) */}
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
