import { Card, CardContent } from "@/components/ui/card";
import { CategoryDetail } from "@/schemaValidations/tournament.schema";

interface CategoryStatsProps {
  category: CategoryDetail;
}

const getFormatLabel = (format: string) => {
  const formatLabels: Record<string, string> = {
    LOAI_TRUC_TIEP: "Loại trực tiếp",
    VONG_TRON: "Vòng tròn",
    VONG_BANG: "Vòng bảng",
    KET_HOP: "Kết hợp",
  };
  return formatLabels[format] || format;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export default function CategoryStats({ category }: CategoryStatsProps) {
  const stats = [
    {
      label: "Lệ phí đăng ký",
      value: category.registrationFee
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
      label: "Hạn đăng ký",
      value: category.registrationDeadline
        ? new Date(category.registrationDeadline).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "Chưa có",
      gradient: "from-blue-500 to-cyan-500",
      textColor: "text-blue-700 dark:text-blue-300",
    },
    {
      label: "Thể thức thi đấu",
      value: getFormatLabel(category.format),
      gradient: "from-purple-500 to-pink-500",
      textColor: "text-purple-700 dark:text-purple-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
  );
}
