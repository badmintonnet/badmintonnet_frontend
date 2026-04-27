"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  getCategoryLabel,
  TournamentCategoryDetailResponse,
} from "@/schemaValidations/tournament.schema";
import { Users, Info, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import JoinCategoryButton from "./join-category-button";

export default function CategorySection({
  categories,
  tournamentSlug,
}: {
  categories: TournamentCategoryDetailResponse[];
  tournamentSlug: string;
}) {
  if (!categories?.length)
    return (
      <p className="text-center text-gray-500 italic mt-6">
        Hiện chưa có hạng mục thi đấu nào.
      </p>
    );

  // Helper function to get button config based on status
  const getButtonConfig = (
    participantStatus?: string | null,
    isFull?: boolean
  ) => {
    if (!participantStatus) {
      return {
        text: isFull ? "Đã đầy" : "Tham gia",
        disabled: isFull,
        className: isFull
          ? "w-full bg-gray-100 text-gray-700 cursor-not-allowed"
          : "w-full",
      };
    }

    switch (participantStatus) {
      case "PENDING":
        return {
          text: "Chờ duyệt",
          disabled: true,
          className: "w-full bg-amber-100 text-amber-700 cursor-not-allowed",
        };
      case "PAYMENT_REQUIRED":
        return {
          text: "Chờ thanh toán",
          disabled: true,
          className: "w-full bg-orange-100 text-orange-700 cursor-not-allowed",
        };
      case "APPROVED":
        return {
          text: "Đã tham gia",
          disabled: true,
          className: "w-full bg-green-100 text-green-700 cursor-not-allowed",
        };
      case "REJECTED":
        return {
          text: "Đã từ chối",
          disabled: true,
          className: "w-full bg-red-100 text-red-700 cursor-not-allowed",
        };
      case "CANCELLED":
        return {
          text: "Đã hủy",
          disabled: true,
          className: "w-full bg-gray-100 text-gray-700 cursor-not-allowed",
        };
      case "ELIMINATED":
        return {
          text: "Đã loại",
          disabled: true,
          className: "w-full bg-purple-100 text-purple-700 cursor-not-allowed",
        };
      default:
        return {
          text: isFull ? "Đã đầy" : "Tham gia",
          disabled: isFull,
          className: isFull
            ? "w-full bg-gray-100 text-gray-700 cursor-not-allowed"
            : "w-full",
        };
    }
  };

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((cat) => {
        const filledPercent =
          (cat.currentParticipantCount / cat.maxParticipants) * 100;
        const isFull = cat.currentParticipantCount >= cat.maxParticipants;
        const buttonConfig = getButtonConfig(cat.participantStatus, isFull);

        return (
          <Card
            key={cat.id}
            className="relative overflow-hidden group border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-teal-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            {/* Header */}
            <CardHeader>
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {getCategoryLabel(cat.category)}
                </h4>
                <span className="text-sm text-teal-700 dark:text-teal-400 font-medium bg-teal-100 dark:bg-teal-900/50 px-2 py-1 rounded-md">
                  {cat.category.includes("DOUBLE") ? "Đôi" : "Đơn"}
                </span>
              </div>
            </CardHeader>

            {/* Content */}
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Users className="h-4 w-4 text-teal-600" />
                  <span>
                    Người tham gia:{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {cat.currentParticipantCount}/{cat.maxParticipants}
                    </span>
                  </span>
                </div>

                {/* Thanh tiến độ */}
                <Progress
                  value={filledPercent}
                  className="h-2 bg-gray-200 dark:bg-gray-700"
                />

                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Còn trống:{" "}
                    {cat.maxParticipants - cat.currentParticipantCount}
                  </span>
                </div>

                {/* Nút tham gia */}
                <div className="mt-4 flex items-center justify-center">
                  <Link
                    href={`/tournaments/${tournamentSlug}/categories/${cat.id}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group"
                  >
                    <Info className="w-4 h-4" />
                    <span>Xem chi tiết</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
