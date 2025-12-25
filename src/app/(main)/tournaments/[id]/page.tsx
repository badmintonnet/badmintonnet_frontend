import { cookies } from "next/headers";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Calendar,
  MapPin,
  Trophy,
  Info,
  BarChart3,
  Users,
  Activity,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import tournamentApiRequest from "@/apiRequest/tournament";
import { getTournamentStatusInfo } from "@/schemaValidations/tournament.schema";

import OverviewSection from "@/app/(main)/tournaments/[id]/_components/overview-section";
import CategorySection from "@/app/(main)/tournaments/[id]/_components/category-section";
import PlaceholderSection from "@/app/(main)/tournaments/[id]/_components/placeholder-section";
import ResultsSection from "@/app/(main)/tournaments/[id]/_components/results-section";
import PlayersSection from "@/app/(main)/tournaments/[id]/_components/players-section";

export default async function TournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const { id } = await params;

  const response = await tournamentApiRequest.getDetailBySlug(id, accessToken);
  const tournament = response.payload.data;
  const statusInfo = getTournamentStatusInfo(tournament.status);

  // Fetch tournament results
  let tournamentResults = null;
  try {
    const resultsResponse = await tournamentApiRequest.getTournamentResults(
      tournament.id,
      accessToken
    );
    tournamentResults = resultsResponse.payload.data;
  } catch (error) {
    // Results might not be available yet
    console.error("Error fetching tournament results:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* --- Banner Section --- */}
      {tournament.bannerUrl && (
        <div className="relative w-full h-64 sm:h-80 md:h-[400px] overflow-hidden">
          <Image
            src={tournament.bannerUrl}
            alt={`${tournament.name} banner`}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-6 sm:left-10 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              {tournament.name}
            </h1>
            <p className="flex items-center gap-2 text-sm sm:text-base">
              <MapPin className="w-4 h-4" />{" "}
              {tournament.facility
                ? tournament.facility.name
                : tournament.location ?? "Chưa cập nhật"}
            </p>
          </div>
        </div>
      )}

      {/* --- Main Content --- */}
      <div className="max-w-6xl mx-auto mt-20 p-6 space-y-8">
        {/* Header Card */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 -mt-16 sm:-mt-20 relative z-10 shadow-lg rounded-2xl">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Image
              src={tournament.logoUrl || ""}
              alt={tournament.name}
              width={80}
              height={80}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tournament.name}
                </h2>
                <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(tournament.startDate, "dd/MM/yyyy", {
                    locale: vi,
                  })}{" "}
                  - {format(tournament.endDate, "dd/MM/yyyy", { locale: vi })}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="w-full ">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <TabsTrigger value="overview">
              <Info className="w-4 h-4 mr-1" />
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="categories">
              <Trophy className="w-4 h-4 mr-1" />
              Hạng mục
            </TabsTrigger>
            <TabsTrigger value="players">
              <Users className="w-4 h-4 mr-1" />
              Người chơi
            </TabsTrigger>
            <TabsTrigger value="results">
              <BarChart3 className="w-4 h-4 mr-1" />
              Kết quả
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewSection tournament={tournament} />
          </TabsContent>

          <TabsContent value="categories">
            <CategorySection
              categories={tournament.categories}
              tournamentSlug={tournament.slug || ""}
            />
          </TabsContent>

          <TabsContent value="players">
            <PlayersSection players={tournament.players || []} />
          </TabsContent>

          <TabsContent value="results">
            <ResultsSection categories={tournamentResults?.categories || []} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
