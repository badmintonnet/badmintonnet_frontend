"use client";

import { TournamentDetail } from "@/schemaValidations/tournament.schema";
import { Shield, Users, Trophy, Calendar, DollarSign } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import ClubRegisterButtonSimple from "./club-register-button-simple";

interface ClubInfoCardProps {
  tournament: TournamentDetail;
}

export default function ClubInfoCard({ tournament }: ClubInfoCardProps) {
  const {
    teamMatchFormat,
    clubRegistrationFee,
    minClubRosterSize,
    maxClubRosterSize,
    maxClubs,
    currentClubCount,
    registrationEndDate,
  } = tournament;

  // Parse team match format JSON
  const parseMatchFormat = (format?: string | null) => {
    try {
      return format ? JSON.parse(format) : {};
    } catch {
      return {};
    }
  };

  const matchFormat = parseMatchFormat(teamMatchFormat);
  const filledPercent = ((currentClubCount ?? 0) / (maxClubs ?? 1)) * 100;
  const isFull = (currentClubCount ?? 0) >= (maxClubs ?? 0);

  // Format dates
  const endDate = registrationEndDate ? new Date(registrationEndDate) : null;
  const isExpired = endDate && endDate < new Date();

  return (
    <div className="border-2 border-violet-200 dark:border-violet-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 to-violet-600 dark:from-violet-600 dark:to-violet-700 px-5 py-4">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-white" />
          <div>
            <h3 className="text-lg font-semibold text-white">
              Giải đấu theo CLB
            </h3>
            <p className="text-violet-100 text-sm">
              Đăng ký theo câu lạc bộ • {currentClubCount ?? 0}/{maxClubs ?? "?"} CLB
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5 bg-white dark:bg-gray-800">
        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-900/20">
            <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium">Phí đăng ký</span>
            </div>
            <p className="font-bold text-gray-900 dark:text-white">
              {(clubRegistrationFee ?? 0).toLocaleString("vi-VN")} VNĐ
            </p>
          </div>

          <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-900/20">
            <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium">Thành viên</span>
            </div>
            <p className="font-bold text-gray-900 dark:text-white">
              {minClubRosterSize ?? "?"} - {maxClubRosterSize ?? "?"} người
            </p>
          </div>

          <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-900/20">
            <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 mb-1">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-medium">Số CLB tối đa</span>
            </div>
            <p className="font-bold text-gray-900 dark:text-white">
              {maxClubs ?? "?"} CLB
            </p>
          </div>

          <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-900/20">
            <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-medium">Hạn đăng ký</span>
            </div>
            <p className={`font-bold ${isExpired ? "text-red-500" : "text-gray-900 dark:text-white"}`}>
              {endDate
                ? endDate.toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                  })
                : "Chưa có"}
            </p>
          </div>
        </div>

        {/* Match Format */}
        {Object.keys(matchFormat).length > 0 && (
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Format thi đấu
            </h4>
            <div className="flex flex-wrap gap-2">
              {matchFormat.singles > 0 && (
                <span className="px-3 py-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-full text-sm font-medium">
                  {matchFormat.singles} Ván đơn
                </span>
              )}
              {matchFormat.menDoubles > 0 && (
                <span className="px-3 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 rounded-full text-sm font-medium">
                  {matchFormat.menDoubles} Đôi nam
                </span>
              )}
              {matchFormat.womenDoubles > 0 && (
                <span className="px-3 py-1.5 bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300 rounded-full text-sm font-medium">
                  {matchFormat.womenDoubles} Đôi nữ
                </span>
              )}
              {matchFormat.mixedDoubles > 0 && (
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 rounded-full text-sm font-medium">
                  {matchFormat.mixedDoubles} Đôi hỗn hợp
                </span>
              )}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              <Users className="w-4 h-4 inline mr-1" />
              {currentClubCount ?? 0}/{maxClubs ?? "?"} CLB đã đăng ký
            </span>
            <span className={isFull ? "text-red-500 font-medium" : "text-gray-500"}>
              {isFull ? "Đã đầy" : `${Math.round(100 - filledPercent)}% còn trống`}
            </span>
          </div>
          <Progress
            value={filledPercent}
            className={`h-2.5 ${isFull ? "[&>div]:bg-red-500" : "[&>div]:bg-violet-500"}`}
          />
        </div>

        {/* Register Button */}
        <div className="pt-2">
          <ClubRegisterButtonSimple
            tournamentId={tournament.id}
            tournamentName={tournament.name}
            minRoster={minClubRosterSize ?? 1}
            maxRoster={maxClubRosterSize ?? 10}
            registrationFee={clubRegistrationFee ?? 0}
            isFull={isFull}
            registrationDeadline={endDate ?? new Date()}
          />
        </div>
      </div>
    </div>
  );
}
