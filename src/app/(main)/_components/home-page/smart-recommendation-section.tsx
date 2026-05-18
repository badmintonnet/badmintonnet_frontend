import recommendationApiRequest from "@/apiRequest/recommendation";
import { RecommendationItemType } from "@/schemaValidations/recommendation.schema";
import {
  Bot,
  CalendarDays,
  ChevronRight,
  Clock,
  Gauge,
  MapPin,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type SmartRecommendationSectionProps = {
  accessToken: string;
};

const categoryMapVN: Record<string, string> = {
  MEN_SINGLE: "Đơn nam",
  WOMEN_SINGLE: "Đơn nữ",
  MEN_DOUBLE: "Đôi nam",
  WOMEN_DOUBLE: "Đôi nữ",
  MIXED_DOUBLE: "Đôi nam nữ",
};

const typeConfig = {
  CLUB: {
    label: "CLB",
    title: "CLB phù hợp",
    icon: Users,
    imageFallback: "/logo.png",
    accent: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  CLUB_EVENT: {
    label: "Hoạt động",
    title: "Hoạt động nên tham gia",
    icon: CalendarDays,
    imageFallback: "/cover.jpg",
    accent: "text-sky-700 bg-sky-50 border-sky-200",
  },
  TOURNAMENT: {
    label: "Giải đấu",
    title: "Giải đấu đáng chú ý",
    icon: Trophy,
    imageFallback: "/cover.jpg",
    accent: "text-amber-700 bg-amber-50 border-amber-200",
  },
};

const formatDate = (value?: Date | string | null) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTime = (value?: Date | string | null) => {
  if (!value) return "";
  return new Date(value).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getScoreClass = (score: number) => {
  if (score >= 75) return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (score >= 55) return "text-sky-700 bg-sky-50 border-sky-200";
  return "text-amber-700 bg-amber-50 border-amber-200";
};

function RecommendationCard({ item }: { item: RecommendationItemType }) {
  const config = typeConfig[item.type];
  const Icon = config.icon;
  const metadata = [
    item.distanceKm != null ? `${item.distanceKm} km` : null,
    item.startTime ? `${formatDate(item.startTime)} · ${formatTime(item.startTime)}` : null,
    item.minLevel != null && item.maxLevel != null
      ? `Trình ${item.minLevel} - ${item.maxLevel}`
      : null,
  ].filter(Boolean);

  return (
    <Link
      href={item.detailUrl}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700"
    >
      <div className="relative h-32 w-full bg-gray-100 dark:bg-gray-800">
        <Image
          src={item.imageUrl || config.imageFallback}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <div
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold ${config.accent}`}
        >
          <Icon className="h-3.5 w-3.5" />
          {config.label}
        </div>
        <div
          className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold ${getScoreClass(
            item.score,
          )}`}
        >
          <Gauge className="h-3.5 w-3.5" />
          {Math.round(item.score)}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h4 className="line-clamp-2 text-base font-semibold text-gray-950 dark:text-white">
          {item.title}
        </h4>

        {item.clubName && (
          <p className="mt-1 line-clamp-1 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            {item.clubName}
          </p>
        )}

        <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
          {item.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="line-clamp-1">{item.location}</span>
            </div>
          )}

          {item.startTime && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 flex-shrink-0 text-sky-600 dark:text-sky-400" />
              <span className="line-clamp-1">
                {formatDate(item.startTime)} · {formatTime(item.startTime)}
              </span>
            </div>
          )}
        </div>

        {metadata.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {metadata.map((value) => (
              <span
                key={value}
                className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                {value}
              </span>
            ))}
          </div>
        )}

        {item.categories && item.categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.categories.slice(0, 3).map((category) => (
              <span
                key={category}
                className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
              >
                {categoryMapVN[category] || category}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 space-y-1.5">
          {item.reasons.slice(0, 3).map((reason) => (
            <p
              key={reason}
              className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400"
            >
              {reason}
            </p>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-end pt-4 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
          Xem chi tiết
          <ChevronRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

function RecommendationGroup({
  title,
  items,
}: {
  title: string;
  items: RecommendationItemType[];
}) {
  if (!items.length) return null;

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gray-950 dark:text-white">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <RecommendationCard key={`${item.type}-${item.id}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export default async function SmartRecommendationSection({
  accessToken,
}: SmartRecommendationSectionProps) {
  try {
    const res =
      await recommendationApiRequest.getPersonalizedRecommendations(
        4,
        accessToken,
      );
    const recommendations = res.payload.data;
    const hasRecommendations =
      recommendations.clubs.length > 0 ||
      recommendations.events.length > 0 ||
      recommendations.tournaments.length > 0;

    if (!hasRecommendations) {
      return (
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-semibold text-gray-950 dark:text-white">
              Chưa có gợi ý cá nhân hóa
            </h2>
          </div>
        </section>
      );
    }

    return (
      <section className="space-y-8">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-5 dark:border-gray-800 md:flex-row md:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
              <Bot className="h-4 w-4" />
              Gợi ý thông minh
            </div>
            <h2 className="text-2xl font-bold text-gray-950 dark:text-white">
              Dành cho {recommendations.profile.fullName || "bạn"}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
              {recommendations.profile.skillLevel || "Chưa đánh giá"} ·{" "}
              {recommendations.profile.skillScore ?? "--"}/5
            </span>
            <span className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
              {recommendations.profile.hasLocation
                ? "Đã có vị trí"
                : "Chưa có vị trí"}
            </span>
          </div>
        </div>

        <RecommendationGroup title={typeConfig.CLUB.title} items={recommendations.clubs} />
        <RecommendationGroup
          title={typeConfig.CLUB_EVENT.title}
          items={recommendations.events}
        />
        <RecommendationGroup
          title={typeConfig.TOURNAMENT.title}
          items={recommendations.tournaments}
        />
      </section>
    );
  } catch (error) {
    console.error("Error fetching personalized recommendations:", error);
    return (
      <section className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-900 dark:bg-red-950/20 dark:text-red-200">
        Không thể tải gợi ý thông minh.
      </section>
    );
  }
}
