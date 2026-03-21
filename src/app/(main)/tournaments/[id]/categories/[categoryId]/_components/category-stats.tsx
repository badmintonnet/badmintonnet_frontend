import { Card, CardContent } from "@/components/ui/card";
import { CategoryDetail } from "@/schemaValidations/tournament.schema";
import { Users, Swords } from "lucide-react";

interface CategoryStatsProps {
  category: CategoryDetail;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

function parseTeamMatchFormat(jsonStr?: string | null): string | null {
  if (!jsonStr) return null;
  try {
    const fmt = JSON.parse(jsonStr) as {
      singles?: number;
      menDoubles?: number;
      womenDoubles?: number;
      mixedDoubles?: number;
    };
    const parts: string[] = [];
    if (fmt.singles) parts.push(`${fmt.singles} ván đơn`);
    if (fmt.menDoubles) parts.push(`${fmt.menDoubles} ván đôi nam`);
    if (fmt.womenDoubles) parts.push(`${fmt.womenDoubles} ván đôi nữ`);
    if (fmt.mixedDoubles) parts.push(`${fmt.mixedDoubles} ván đôi hỗn hợp`);
    const total =
      (fmt.singles ?? 0) +
      (fmt.menDoubles ?? 0) +
      (fmt.womenDoubles ?? 0) +
      (fmt.mixedDoubles ?? 0);
    return parts.length > 0 ? `${parts.join(" + ")} (tổng ${total} ván)` : null;
  } catch {
    return null;
  }
}

export default function CategoryStats({ category }: CategoryStatsProps) {
  const isClub =
    category.clubRegistrationFee != null || category.minClubRosterSize != null;

  const stats = [
    {
      label: isClub ? "Lệ phí đăng ký CLB" : "Lệ phí đăng ký",
      value: isClub
        ? category.clubRegistrationFee != null
          ? formatCurrency(category.clubRegistrationFee)
          : category.registrationFee
            ? formatCurrency(category.registrationFee)
            : "Miễn phí"
        : category.registrationFee
          ? formatCurrency(category.registrationFee)
          : "Miễn phí",
      gradient: "from-teal-500 to-emerald-500",
      textColor: "text-teal-700 dark:text-teal-300",
    },
    {
      label: "Giải nhất",
      value: category.firstPrize || "Chưa công bố",
      gradient: "from-amber-500 to-orange-500",
      textColor: "text-amber-700 dark:text-amber-300",
    },
    {
      label: "Đăng ký",
      value: (() => {
        const start = category.registrationStartDate ? new Date(category.registrationStartDate) : null;
        const end = category.registrationEndDate ? new Date(category.registrationEndDate) : null;
        const startValid = start && !isNaN(start.getTime());
        const endValid = end && !isNaN(end.getTime());

        const formatDate = (d: Date) => d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

        if (startValid && endValid) {
          return `${formatDate(start)} - ${formatDate(end)}`;
        }
        if (endValid) {
          return `đến ${formatDate(end)}`;
        }
        return "Chưa có";
      })(),
      gradient: "from-blue-500 to-cyan-500",
      textColor: "text-blue-700 dark:text-blue-300",
    },
  ];

  const rosterText =
    category.minClubRosterSize != null && category.maxClubRosterSize != null
      ? `${category.minClubRosterSize} - ${category.maxClubRosterSize} thành viên`
      : null;

  const formatText = parseTeamMatchFormat(category.teamMatchFormat);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-0 group"
          >
            {/* Gradient bar at top */}
            <div className={`h-1 w-full bg-gradient-to-r ${stat.gradient}`} />

            <CardContent className="p-5">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p
                  className={`text-xl font-bold ${stat.textColor} leading-tight break-words`}
                >
                  {stat.value}
                </p>
              </div>
            </CardContent>

            {/* Subtle background decoration */}
            <div
              className={`absolute -right-8 -bottom-8 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`}
            />
          </Card>
        ))}
      </div>

      {/* Thông tin CLB */}
      {isClub && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rosterText && (
            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-0 group">
              <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-purple-500" />
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Roster CLB
                    </p>
                    <p className="text-lg font-bold text-violet-700 dark:text-violet-300">
                      {rosterText}
                    </p>
                  </div>
                </div>
              </CardContent>
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-gradient-to-br from-violet-500 to-purple-500 opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity" />
            </Card>
          )}

          {formatText && (
            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-0 group">
              <div className="h-1 w-full bg-gradient-to-r from-rose-500 to-pink-500" />
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Swords className="h-5 w-5 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Format thi đấu
                    </p>
                    <p className="text-sm font-bold text-rose-700 dark:text-rose-300 leading-snug">
                      {formatText}
                    </p>
                  </div>
                </div>
              </CardContent>
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-gradient-to-br from-rose-500 to-pink-500 opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity" />
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
