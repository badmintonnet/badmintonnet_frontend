"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Calendar,
  MapPin,
  Target,
  Award,
  TrendingUp,
  Swords,
  Medal,
} from "lucide-react";
import accountApiRequest from "@/apiRequest/account";
import { PlayerTournamentHistorySchemaType } from "@/schemaValidations/account.schema";
import Image from "next/image";
import Link from "next/link";

interface ProfileTournamentHistoryProps {
  userId: string;
}

export default function ProfileTournamentHistory({
  userId,
}: ProfileTournamentHistoryProps) {
  const [history, setHistory] = useState<PlayerTournamentHistorySchemaType[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const res =
          await accountApiRequest.getHistoryTournamentByPlayer(userId);
        setHistory(res.payload.data);
      } catch (error) {
        console.error("Error fetching tournament history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  const getRankingColor = (rank: number) => {
    if (rank === 1)
      return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white";
    if (rank === 2)
      return "bg-gradient-to-br from-gray-300 to-gray-500 text-white";
    if (rank === 3)
      return "bg-gradient-to-br from-orange-400 to-orange-600 text-white";
    return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
  };

  const getRankingIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank ?? ""}`;
  };

  const getWinRate = (rounds: PlayerTournamentHistorySchemaType["rounds"]) => {
    const wins = rounds.filter((r) => r.won).length;
    return rounds.length > 0 ? ((wins / rounds.length) * 100).toFixed(0) : 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="py-20">
          <div className="text-center">
            <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Trophy className="w-12 h-12 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Chưa có lịch sử thi đấu
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Tham gia giải đấu để ghi lại thành tích của bạn
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate statistics
  const totalTournaments = history.length;
  const totalMatches = history.reduce((sum, h) => sum + h.rounds.length, 0);
  const totalWins = history.reduce(
    (sum, h) => sum + h.rounds.filter((r) => r.won).length,
    0,
  );
  const winRate =
    totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(0) : 0;
  const topRankings = history.filter((h) => h.finalRanking <= 3).length;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Tổng giải đấu
                </p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                  {totalTournaments}
                </p>
              </div>
              <div className="p-3 bg-blue-200 dark:bg-blue-800 rounded-full">
                <Trophy className="w-6 h-6 text-blue-700 dark:text-blue-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Tỷ lệ thắng
                </p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">
                  {winRate}%
                </p>
              </div>
              <div className="p-3 bg-green-200 dark:bg-green-800 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-700 dark:text-green-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Tổng trận
                </p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-2">
                  {totalMatches}
                </p>
              </div>
              <div className="p-3 bg-purple-200 dark:bg-purple-800 rounded-full">
                <Swords className="w-6 h-6 text-purple-700 dark:text-purple-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                  Top 3
                </p>
                <p className="text-3xl font-bold text-amber-900 dark:text-amber-100 mt-2">
                  {topRankings}
                </p>
              </div>
              <div className="p-3 bg-amber-200 dark:bg-amber-800 rounded-full">
                <Medal className="w-6 h-6 text-amber-700 dark:text-amber-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tournament History List */}
      <div className="space-y-4">
        {history.map((item) => (
          <Card
            key={item.historyId}
            className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                {/* Tournament Logo */}
                <Link
                  href={`/tournaments/${item.tournament.slug}`}
                  className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 hover:ring-blue-500 transition-all"
                >
                  <Image
                    src={item.tournament.logoUrl}
                    alt={item.tournament.name}
                    sizes="(max-width: 640px) 60px, (max-width: 1024px) 80px, 80px"
                    fill
                    priority
                    className="object-cover"
                  />
                </Link>

                {/* Tournament Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/tournaments/${item.tournament.slug}`}
                        className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1"
                      >
                        {item.tournament.name}
                      </Link>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{item.tournament.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(
                              item.tournament.startDate,
                            ).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ranking Badge */}
                    <div
                      className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl shadow-lg ${getRankingColor(
                        item.finalRanking,
                      )}`}
                    >
                      <span className="text-2xl font-bold">
                        {getRankingIcon(item.finalRanking)}
                      </span>
                      <span className="text-xs font-semibold mt-1">
                        Hạng {item.finalRanking}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Category & Prize */}
              <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                <Badge
                  variant="outline"
                  className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                >
                  <Target className="w-3 h-3 mr-1" />
                  {item.category.categoryName}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300"
                >
                  {item.category.type}
                </Badge>
                {item.isDouble && (
                  <Badge
                    variant="outline"
                    className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                  >
                    Đôi
                  </Badge>
                )}
                {item.prize && (
                  <Badge
                    variant="outline"
                    className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300"
                  >
                    <Award className="w-3 h-3 mr-1" />
                    {item.prize}
                  </Badge>
                )}
                <Badge variant="outline" className="ml-auto">
                  Thắng {getWinRate(item.rounds)}% (
                  {item.rounds.filter((r) => r.won).length}/{item.rounds.length}
                  )
                </Badge>
              </div>

              {/* Match Results */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Lịch sử đối đầu
                </h4>
                <div className="grid gap-2">
                  {item.rounds.map((round) => (
                    <div
                      key={round.id}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                        round.won
                          ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800"
                          : "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Badge
                          className={`${
                            round.won
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          {round.won ? "THẮNG" : "THUA"}
                        </Badge>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Vòng {round.round}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          vs {round.opponentName}
                        </span>
                      </div>

                      {/* Set Scores */}
                      <div className="flex items-center gap-2 ml-3">
                        {round.scoreP1.map((score, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${
                              score > round.scoreP2[idx]
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            <span>{score}</span>
                            <span className="text-gray-400">-</span>
                            <span>{round.scoreP2[idx]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
