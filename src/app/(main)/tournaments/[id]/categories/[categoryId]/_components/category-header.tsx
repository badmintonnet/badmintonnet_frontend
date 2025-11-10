import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Calendar,
  Users,
  Share2,
  Download,
  MapPin,
} from "lucide-react";
import {
  CategoryDetail,
  getCategoryLabel,
} from "@/schemaValidations/tournament.schema";
import JoinCategoryButton from "../../../_components/join-category-button";
import { toast } from "sonner";

interface CategoryHeaderProps {
  category: CategoryDetail;
  categoryId: string;
}

export default function CategoryHeader({
  category,
  categoryId,
}: CategoryHeaderProps) {
  const filledPercent =
    (category.currentParticipantCount / category.maxParticipants) * 100;
  const spotsLeft = category.maxParticipants - category.currentParticipantCount;
  const isFull = category.currentParticipantCount >= category.maxParticipants;

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      {/* Header Banner with Subtle Gradient */}
      <div className="bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {getCategoryLabel(category.category)}
                </h1>
                <p className="text-teal-50 text-sm mt-1">
                  {category.tournamentName}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <JoinCategoryButton
              categoryId={categoryId}
              isDisabled={isFull}
              className="bg-white text-teal-600 hover:bg-teal-50 font-semibold shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Info Section */}
      <CardContent className="p-6 bg-white dark:bg-gray-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
              <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Thời gian
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {new Date(category.startDate).toLocaleDateString("vi-VN")} -{" "}
                {new Date(category.endDate).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Số lượng
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {category.currentParticipantCount}/{category.maxParticipants}{" "}
                người chơi
              </p>
            </div>
          </div>

          {category.facility && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Địa điểm
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {category.facility.name} - {category.facility.address}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              Tiến độ đăng ký
            </span>
            <span
              className={`font-semibold ${
                isFull ? "text-red-600" : "text-teal-600 dark:text-teal-400"
              }`}
            >
              {isFull ? "Đã đầy" : `Còn ${spotsLeft} chỗ`}
            </span>
          </div>
          <Progress
            value={filledPercent}
            className="h-2.5 bg-gray-200 dark:bg-gray-700"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {filledPercent.toFixed(0)}% đã đăng ký
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
