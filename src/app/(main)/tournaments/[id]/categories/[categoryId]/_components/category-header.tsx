import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Calendar, Users, MapPin } from "lucide-react";
import {
  CategoryDetail,
  getCategoryLabel,
} from "@/schemaValidations/tournament.schema";
import JoinCategoryButton from "../../../_components/join-category-button";
import SelectPartnerModal from "@/app/(main)/tournaments/[id]/categories/[categoryId]/_components/partner-list";
import SentPartnerInvitationModal from "@/app/(main)/tournaments/[id]/categories/[categoryId]/_components/sent-partner-invitation-modal";
import InviterList from "@/app/(main)/tournaments/[id]/categories/[categoryId]/_components/inviter-list";
import PartnerMatchedModal from "@/app/(main)/tournaments/[id]/categories/[categoryId]/_components/partner-matched-modal";
import ClubRegisterButton from "./club-register-button";

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

  // Detect if this is a CLUB tournament (club fields present)
  const isClubTournament =
    category.clubRegistrationFee != null || category.minClubRosterSize != null;

  // Determine button text and state based on participant status
  const getButtonConfig = () => {
    const status = category.participantStatus;

    const defaultBtn = {
      text: isFull ? "Đã đầy" : "Tham gia",
      disabled: isFull,
      className:
        "bg-white text-teal-600 hover:bg-teal-50 dark:bg-teal-800 dark:text-white dark:hover:bg-teal-700 font-semibold shadow-md",
    };

    if (!status) return defaultBtn;

    switch (status) {
      case "PENDING":
        return {
          text: "Chờ duyệt",
          disabled: true,
          className:
            "bg-amber-100 text-amber-700 dark:bg-amber-600 dark:text-white cursor-not-allowed font-semibold shadow-md",
        };

      case "PAYMENT_REQUIRED":
        return {
          text: "Chờ thanh toán",
          disabled: true,
          className:
            "bg-orange-100 text-orange-700 dark:bg-orange-600 dark:text-white cursor-not-allowed font-semibold shadow-md",
        };

      case "APPROVED":
        return {
          text: "Đã tham gia",
          disabled: true,
          className:
            "bg-teal-100 text-teal-700 dark:bg-teal-600 dark:text-white cursor-not-allowed font-semibold shadow-md",
        };

      case "REJECTED":
        return {
          text: "Đã từ chối",
          disabled: true,
          className:
            "bg-red-100 text-red-700 dark:bg-red-600 dark:text-white cursor-not-allowed font-semibold shadow-md",
        };

      case "CANCELLED":
        return {
          text: "Đã hủy",
          disabled: true,
          className:
            "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-white cursor-not-allowed font-semibold shadow-md",
        };

      case "ELIMINATED":
        return {
          text: "Đã loại",
          disabled: true,
          className:
            "bg-purple-100 text-purple-700 dark:bg-purple-600 dark:text-white cursor-not-allowed font-semibold shadow-md",
        };

      default:
        return defaultBtn;
    }
  };

  const buttonConfig = getButtonConfig();

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
          {!category.admin && (
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              {isClubTournament ? (
                <ClubRegisterButton
                  categoryId={categoryId}
                  category={category}
                />
              ) : (
                <>
                  {(!category.double ||
                    (category.participantStatus &&
                      category.participantStatus != "DRAFT")) && (
                    <JoinCategoryButton
                      categoryId={categoryId}
                      isDisabled={buttonConfig.disabled}
                      buttonText={buttonConfig.text}
                      className={buttonConfig.className}
                    />
                  )}
                  {category.double &&
                    category.response == null &&
                    category.partner == null && (
                      <SelectPartnerModal categoryId={categoryId} />
                    )}
                  {category.double &&
                    category.response != null &&
                    category.partner == null && (
                      <SentPartnerInvitationModal
                        invitation={category.response}
                      />
                    )}
                  {category.double && category.partner == null && (
                    <InviterList inviterList={category.requests} />
                  )}
                  {category.double &&
                    category.partner != null &&
                    category.participantStatus == "DRAFT" && (
                      <PartnerMatchedModal
                        partner={category.partner}
                        categoryId={category.id}
                      />
                    )}
                </>
              )}
            </div>
          )}
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
