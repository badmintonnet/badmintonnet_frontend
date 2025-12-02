import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import matchApiRequest from "@/apiRequest/match";
import { BracketTreeSchemaType, MatchStatus } from "@/schemaValidations/match";
import { toast } from "sonner";
import { CategoryDetail } from "@/schemaValidations/tournament.schema";

interface CategoryScheduleProps {
  category: CategoryDetail;
}

const getMatchStatusText = (status: MatchStatus) => {
  switch (status) {
    case "NOT_STARTED":
      return "Chưa bắt đầu";
    case "IN_PROGRESS":
      return "Đang diễn ra";
    case "FINISHED":
      return "Đã kết thúc";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status;
  }
};

const getMatchStatusColor = (status: MatchStatus) => {
  switch (status) {
    case "NOT_STARTED":
      return "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
    case "IN_PROGRESS":
      return "bg-green-50 text-green-700 border border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
    case "FINISHED":
      return "bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    case "CANCELLED":
      return "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
    default:
      return "";
  }
};

const getRoundName = (round: number, totalRounds: number) => {
  const roundFromEnd = totalRounds - round + 1;
  if (roundFromEnd === 1) return "Chung kết";
  if (roundFromEnd === 2) return "Bán kết";
  if (roundFromEnd === 3) return "Tứ kết";
  return `Vòng ${round}`;
};

export default function CategorySchedule({ category }: CategoryScheduleProps) {
  const [bracketData, setBracketData] = useState<BracketTreeSchemaType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasBracket, setHasBracket] = useState<boolean | null>(null); // null = chưa check, true = có, false = không có

  useEffect(() => {
    fetchBracketTree();
  }, [category.id]);

  const fetchBracketTree = async () => {
    try {
      setIsLoading(true);
      const response = await matchApiRequest.getBracketTree(category.id);
      setBracketData(response.payload.data);
      setHasBracket(true);
    } catch (error: any) {
      if (error?.status === 404) {
        setHasBracket(false);
        setBracketData(null);
      } else {
        console.error("Error fetching bracket tree:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateBracket = async () => {
    try {
      setIsGenerating(true);
      await matchApiRequest.generateBracket(category.id);
      toast.success("Tạo cặp thi đấu thành công!");
      await fetchBracketTree();
    } catch (error: any) {
      toast.error(
        error?.payload?.message || "Có lỗi xảy ra khi tạo cặp thi đấu"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="border-b bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Lịch thi đấu
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {category.category}
              </p>
            </div>
          </div>
          {category.admin && hasBracket === false && (
            <Button
              onClick={handleGenerateBracket}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang tạo...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Tạo cặp thi đấu
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {isLoading && hasBracket === null ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Đang tải lịch thi đấu...
            </p>
          </div>
        ) : bracketData && bracketData.rounds.length > 0 ? (
          <div className="space-y-8">
            {bracketData.rounds.map((round) => (
              <div key={round.round} className="space-y-4">
                {/* Round Header */}
                <div className="flex items-center justify-between pb-3 border-b">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {getRoundName(round.round, bracketData.totalRounds)}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      • Vòng {round.round}
                    </span>
                  </div>
                  <Badge variant="outline" className="font-normal">
                    {round.matches.length} trận
                  </Badge>
                </div>

                {/* Matches Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {round.matches.map((match) => (
                    <div
                      key={match.matchId}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                    >
                      {/* Match Header */}
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between rounded-t-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Trận {match.matchIndex}
                        </span>
                        <Badge className={getMatchStatusColor(match.status)}>
                          {getMatchStatusText(match.status)}
                        </Badge>
                      </div>

                      <div className="p-4 space-y-3">
                        {/* Player 1 */}
                        <div
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            match.winnerId === match.player1Id
                              ? "bg-green-50 border-green-500 dark:bg-green-950 dark:border-green-600"
                              : "bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400">
                                1
                              </span>
                              <span
                                className={`font-medium truncate ${
                                  match.winnerId === match.player1Id
                                    ? "text-green-900 dark:text-green-100"
                                    : "text-gray-900 dark:text-white"
                                }`}
                              >
                                {match.player1Name || "TBD"}
                              </span>
                            </div>
                            {match.scoreP1 !== null && (
                              <span className="text-xl font-semibold text-gray-900 dark:text-white ml-2">
                                {match.scoreP1}
                              </span>
                            )}
                            {match.winnerId === match.player1Id && (
                              <Trophy className="w-4 h-4 text-amber-500 ml-2 flex-shrink-0" />
                            )}
                          </div>
                        </div>

                        {/* VS */}
                        <div className="text-center">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                            VS
                          </span>
                        </div>

                        {/* Player 2 */}
                        <div
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            match.winnerId === match.player2Id
                              ? "bg-green-50 border-green-500 dark:bg-green-950 dark:border-green-600"
                              : "bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400">
                                2
                              </span>
                              <span
                                className={`font-medium truncate ${
                                  match.winnerId === match.player2Id
                                    ? "text-green-900 dark:text-green-100"
                                    : "text-gray-900 dark:text-white"
                                }`}
                              >
                                {match.player2Name || "TBD"}
                              </span>
                            </div>
                            {match.scoreP2 !== null && (
                              <span className="text-xl font-semibold text-gray-900 dark:text-white ml-2">
                                {match.scoreP2}
                              </span>
                            )}
                            {match.winnerId === match.player2Id && (
                              <Trophy className="w-4 h-4 text-amber-500 ml-2 flex-shrink-0" />
                            )}
                          </div>
                        </div>

                        {/* Winner Info */}
                        {match.winnerName && (
                          <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                Người chiến thắng:
                              </span>
                              <span className="font-semibold text-green-700 dark:text-green-400">
                                {match.winnerName}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-600" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Chưa có lịch thi đấu
            </h4>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {category.admin
                ? "Nhấn nút 'Tạo cặp thi đấu' để bắt đầu tạo lịch thi đấu."
                : "Lịch thi đấu sẽ được cập nhật sớm."}
            </p>
            {category.admin && hasBracket === false && (
              <Button
                onClick={handleGenerateBracket}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Tạo cặp thi đấu
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
