"use client";

import {
  Calendar,
  DollarSign,
  Trophy,
  Clock,
  MapPin,
  Tag,
  Users,
  ClipboardList,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  getCategoryLabel,
  TournamentDetail,
} from "@/schemaValidations/tournament.schema";
import { isHTML } from "@/lib/utils";

export default function OverviewSection({
  tournament,
}: {
  tournament: TournamentDetail;
}) {
  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mt-6 shadow-sm">
      {/* --- Header --- */}
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
          Giới thiệu giải đấu
        </h2>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* --- Description --- */}
        {isHTML(tournament.description) ? (
          <div
            className="text-gray-700 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html:
                tournament.description || "Chưa có mô tả cho giải đấu này.",
            }}
          ></div>
        ) : (
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {tournament.description}
          </div>
        )}

        {/* --- Layout 2 cột: Địa điểm (trái) & Thông tin khác (phải) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* --- CỘT TRÁI: Địa điểm --- */}
          <div className="lg:col-span-1">
            <div className="flex flex-col gap-3 p-5 rounded-lg bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-950/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-800 h-full">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <p className="font-semibold text-gray-900 dark:text-white">
                  Địa điểm
                </p>
              </div>

              {tournament.facility ? (
                <div className="space-y-3 pl-8">
                  {/* Tên cơ sở */}
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Cơ sở thi đấu
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white text-lg break-words">
                      {tournament.facility.name}
                    </p>
                  </div>

                  {/* Địa chỉ đầy đủ */}
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Địa chỉ
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                      {tournament.facility.address}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {tournament.facility.district}, {tournament.facility.city}
                    </p>
                  </div>

                  {/* Google Maps Link */}
                  {tournament.facility.latitude &&
                    tournament.facility.longitude && (
                      <div className="pt-2">
                        <a
                          href={`https://www.google.com/maps?q=${tournament.facility.latitude},${tournament.facility.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-sm font-medium transition-colors"
                        >
                          <MapPin className="h-4 w-4" />
                          Xem trên Google Maps
                        </a>
                      </div>
                    )}
                </div>
              ) : (
                <div className="pl-8">
                  <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                    tournament.loca
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* --- CỘT PHẢI: Thông tin khác (chiều dọc) --- */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <InfoItem
              icon={
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              }
              label="Lệ phí"
              value={
                tournament.fee
                  ? tournament.fee.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })
                  : "Miễn phí"
              }
            />

            <InfoItem
              icon={
                <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
              }
              label="Đăng ký"
              value={`${format(tournament.registrationStartDate, "dd/MM/yyyy", {
                locale: vi,
              })} - ${format(tournament.registrationEndDate, "dd/MM/yyyy", {
                locale: vi,
              })}`}
            />

            <InfoItem
              icon={
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              }
              label="Thi đấu"
              value={`${format(tournament.startDate, "dd/MM/yyyy", {
                locale: vi,
              })} - ${format(tournament.endDate, "dd/MM/yyyy", {
                locale: vi,
              })}`}
            />
          </div>
        </div>

        {/* --- Hạng mục thi đấu --- */}
        {tournament.categories && tournament.categories.length > 0 && (
          <div className="pt-2">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Tag className="h-5 w-5 text-green-600 dark:text-green-400" />
              Các hạng mục thi đấu
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {tournament.categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20 hover:shadow transition-all"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {getCategoryLabel(category.category)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Cấp độ: {category.minLevel} - {category.maxLevel}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- Rules --- */}
        {tournament.rules && (
          <div className="pt-2">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Điều lệ giải đấu
            </h3>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 overflow-x-auto">
              {isHTML(tournament.rules) ? (
                <div
                  className="text-gray-700 dark:text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      tournament.rules || "Chưa có mô tả cho giải đấu này.",
                  }}
                ></div>
              ) : (
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {tournament.rules}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* --- Component phụ cho phần thông tin --- */
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
          {label}
        </p>
        <div className="text-sm text-gray-700 dark:text-gray-300 break-words">
          {value}
        </div>
      </div>
    </div>
  );
}
