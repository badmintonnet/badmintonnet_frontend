import React from "react";
import { Calendar, MapPin, Users, Edit } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

import clubServiceApi from "@/apiRequest/club";
import { cookies } from "next/headers";
import ClubMembers from "@/app/(main)/my-clubs/_components/member";

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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-7 space-y-6">
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
                <Button
                  variant="outline"
                  className="flex-shrink-0 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Edit className="h-4 w-4 mr-1" /> Chỉnh sửa CLB
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Mô tả
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {clubDetail.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {clubDetail.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
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

        {/* Sidebar */}

        <div className="lg:col-span-3">
          <ClubMembers
            id={clubDetail.id}
            accessToken={accessToken?.value || ""}
            isOwner={clubDetail.owner}
          />
        </div>
      </div>
    </div>
  );
}
