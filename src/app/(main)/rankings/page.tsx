import rankingApiRequest from "@/apiRequest/ranking";
import RankingScopeFilter from "@/app/(main)/rankings/_components/ranking-scope-filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  PlayerRankingType,
  RankingPageType,
} from "@/schemaValidations/ranking.schema";
import {
  Award,
  MapPin,
  Medal,
  ShieldCheck,
  Swords,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";

export const dynamic = "force-dynamic";

type RankingScope = "GLOBAL" | "AREA" | "CLUB";

type RankingSearchParams = {
  scope?: string;
  area?: string;
  province?: string;
  ward?: string;
  club?: string;
  page?: string;
};

const PAGE_SIZE = 20;

const scopeTabs: { label: string; value: RankingScope; href: string }[] = [
  { label: "Toàn hệ thống", value: "GLOBAL", href: "/rankings?scope=GLOBAL" },
  { label: "Theo khu vực", value: "AREA", href: "/rankings?scope=AREA" },
  { label: "Theo CLB", value: "CLUB", href: "/rankings?scope=CLUB" },
];

const parseScope = (value?: string): RankingScope => {
  if (value === "AREA" || value === "CLUB" || value === "GLOBAL") {
    return value;
  }
  return "GLOBAL";
};

const parsePage = (value?: string) => {
  const page = Number.parseInt(value || "0", 10);
  return Number.isFinite(page) && page >= 0 ? page : 0;
};

const formatScore = (value: number, maximumFractionDigits = 1) =>
  value.toLocaleString("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  });

const buildPageHref = ({
  scope,
  area,
  province,
  ward,
  club,
  page,
}: {
  scope: RankingScope;
  area: string;
  province: string;
  ward: string;
  club: string;
  page: number;
}) => {
  const params = new URLSearchParams();
  params.set("scope", scope);
  params.set("page", page.toString());
  if (area) params.set("area", area);
  if (province) params.set("province", province);
  if (ward) params.set("ward", ward);
  if (club) params.set("club", club);
  return `/rankings?${params.toString()}`;
};

export default async function RankingsPage({
  searchParams,
}: {
  searchParams: Promise<RankingSearchParams>;
}) {
  const params = await searchParams;
  const scope = parseScope(params.scope);
  const area = params.area?.trim() || "";
  const province = params.province?.trim() || "";
  const ward = params.ward?.trim() || "";
  const club = params.club?.trim() || "";
  const page = parsePage(params.page);
  const shouldFetch = scope !== "CLUB" || club.length > 0;

  let rankingPage: RankingPageType | null = null;
  let errorMessage = "";

  if (shouldFetch) {
    try {
      const response = await rankingApiRequest.getRankings({
        scope,
        area,
        province,
        ward,
        club,
        page,
        size: PAGE_SIZE,
      });
      rankingPage = response.payload.data;
    } catch (error) {
      console.error("Error fetching rankings:", error);
      errorMessage = "Không thể tải bảng xếp hạng ở thời điểm này.";
    }
  }

  const players = rankingPage?.content ?? [];
  const topPlayer = players[0];
  const stableCount = players.filter((player) => !player.provisional).length;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                <Trophy className="h-4 w-4" />
                Bảng xếp hạng người chơi
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
                  Xếp hạng cạnh tranh BadmintonNet
                </h1>
                <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-300">
                  Điểm được tổng hợp từ thành tích giải đấu, tỷ lệ thắng, số
                  trận đã chơi và điểm uy tín hiện tại.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {scopeTabs.map((tab) => (
                  <Button
                    key={tab.value}
                    asChild
                    variant={scope === tab.value ? "default" : "outline"}
                    className={cn(
                      "rounded-md",
                      scope === tab.value &&
                        "bg-gray-950 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200",
                    )}
                  >
                    <Link href={tab.href}>{tab.label}</Link>
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <MetricTile
                icon={Users}
                label="Người chơi"
                value={formatScore(rankingPage?.totalElements ?? 0, 0)}
              />
              <MetricTile
                icon={Target}
                label="Điểm đầu bảng"
                value={
                  topPlayer ? formatScore(topPlayer.competitiveScore) : "0"
                }
              />
              <MetricTile
                icon={ShieldCheck}
                label="Xếp hạng ổn định"
                value={formatScore(stableCount, 0)}
              />
            </div>
          </div>
        </section>

        <RankingScopeFilter
          scope={scope}
          area={area}
          province={province}
          ward={ward}
          club={club}
        />

        {errorMessage ? (
          <StatePanel
            title="Không thể tải dữ liệu"
            description={errorMessage}
          />
        ) : !shouldFetch ? (
          <StatePanel
            title="Chọn CLB để xem bảng xếp hạng"
            description="Nhập slug hoặc ID CLB để hệ thống lọc các thành viên đã được duyệt."
          />
        ) : players.length === 0 ? (
          <StatePanel
            title="Chưa có dữ liệu xếp hạng"
            description="Thử đổi phạm vi lọc hoặc kiểm tra lại khu vực, slug CLB."
          />
        ) : (
          <section className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
            <div className="hidden border-b border-gray-200 bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 lg:grid lg:grid-cols-[88px_1.5fr_120px_120px_120px_120px_150px] lg:gap-4">
              <span>Hạng</span>
              <span>Người chơi</span>
              <span>Điểm</span>
              <span>Giải đấu</span>
              <span>Win rate</span>
              <span>Số trận</span>
              <span>Uy tín</span>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {players.map((player) => (
                <RankingRow key={player.accountId} player={player} />
              ))}
            </div>
          </section>
        )}

        {rankingPage && rankingPage.totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 sm:flex-row">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Trang {rankingPage.page + 1} / {rankingPage.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                asChild
                variant="outline"
                className={cn(
                  "rounded-md",
                  rankingPage.page === 0 && "pointer-events-none opacity-50",
                )}
              >
                <Link
                  aria-disabled={rankingPage.page === 0}
                  href={buildPageHref({
                    scope,
                    area,
                    province,
                    ward,
                    club,
                    page: Math.max(rankingPage.page - 1, 0),
                  })}
                >
                  Trước
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className={cn(
                  "rounded-md",
                  rankingPage.last && "pointer-events-none opacity-50",
                )}
              >
                <Link
                  aria-disabled={rankingPage.last}
                  href={buildPageHref({
                    scope,
                    area,
                    province,
                    ward,
                    club,
                    page: rankingPage.page + 1,
                  })}
                >
                  Sau
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function MetricTile({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </span>
        <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">
        {value}
      </div>
    </div>
  );
}

function RankingRow({ player }: { player: PlayerRankingType }) {
  const profileHref = player.slug ? `/profile/${player.slug}` : "#";

  return (
    <article className="grid gap-4 px-5 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 lg:grid-cols-[88px_1.5fr_120px_120px_120px_120px_150px] lg:items-center">
      <div className="flex items-center gap-3">
        <RankBadge rank={player.rank} />
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 lg:hidden">
          Hạng
        </span>
      </div>

      <div className="flex min-w-0 items-center gap-3">
        <Link
          href={profileHref}
          className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900"
        >
          <Image
            src={player.avatarUrl || "/user.png"}
            alt={player.fullName}
            fill
            sizes="48px"
            className="object-cover"
          />
        </Link>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={profileHref}
              className="truncate text-base font-semibold text-gray-950 hover:text-emerald-700 dark:text-white dark:hover:text-emerald-300"
            >
              {player.fullName}
            </Link>
            {player.provisional && (
              <Badge
                variant="outline"
                className="border-amber-300 text-amber-700 dark:border-amber-800 dark:text-amber-300"
              >
                Tạm tính
              </Badge>
            )}
          </div>
          <div className="mt-1 flex min-w-0 items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {player.address || "Chưa cập nhật khu vực"}
            </span>
          </div>
        </div>
      </div>

      <ScoreCell
        icon={Award}
        label="Điểm"
        value={formatScore(player.competitiveScore)}
        strong
      />
      <ScoreCell
        icon={Trophy}
        label="Giải đấu"
        value={`${formatScore(player.tournamentScore)}%`}
        note={`${player.completedTournaments} giải`}
      />
      <ScoreCell
        icon={Target}
        label="Win rate"
        value={`${formatScore(player.winRate)}%`}
        note={`${player.totalWins} thắng`}
      />
      <ScoreCell
        icon={Swords}
        label="Số trận"
        value={formatScore(player.totalMatches, 0)}
      />
      <ScoreCell
        icon={ShieldCheck}
        label="Uy tín"
        value={formatScore(player.reputationScore, 0)}
      />
    </article>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const isTopRank = rank <= 3;

  return (
    <div
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-md border text-sm font-bold",
        isTopRank
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
          : "border-gray-200 bg-white text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300",
      )}
    >
      {isTopRank ? (
        <span className="flex items-center gap-1">
          <Medal className="h-4 w-4" />
          {rank}
        </span>
      ) : (
        `#${rank}`
      )}
    </div>
  );
}

function ScoreCell({
  icon: Icon,
  label,
  value,
  note,
  strong = false,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  note?: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 lg:block">
      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 lg:hidden">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div
        className={cn(
          "text-sm font-semibold",
          strong && "text-lg text-emerald-700 dark:text-emerald-300",
        )}
      >
        {value}
      </div>
      {note && (
        <div className="text-xs text-gray-500 dark:text-gray-400">{note}</div>
      )}
    </div>
  );
}

function StatePanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-950">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
        <TrendingUp className="h-5 w-5" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-gray-950 dark:text-white">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </section>
  );
}
