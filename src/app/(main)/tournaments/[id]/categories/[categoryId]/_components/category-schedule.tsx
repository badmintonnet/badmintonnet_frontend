import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Sparkles, Edit, X, Check } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import matchApiRequest from "@/apiRequest/match";
import tournamentApiRequest from "@/apiRequest/tournament";
import {
  BracketTreeSchemaType,
  MatchStatus,
  TournamentMatchSchemaType,
  UpdateMatchResultBodyType,
} from "@/schemaValidations/match";
import { CategoryResultType } from "@/schemaValidations/tournament-result";
import { toast } from "sonner";
import {
  CategoryDetail,
  getCategoryLabel,
} from "@/schemaValidations/tournament.schema";
import { Input } from "@/components/ui/input";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

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

// Validation cho điểm số theo luật cầu lông
const isValidSetScore = (p1: number | null, p2: number | null): boolean => {
  if (p1 === null || p2 === null) return false;
  if (p1 < 0 || p2 < 0 || p1 > 30 || p2 > 30) return false;

  // Trường hợp thắng bình thường (21 với cách biệt >= 2)
  if ((p1 === 21 && p2 < 20) || (p2 === 21 && p1 < 20)) return true;

  // Trường hợp deuce từ 20-20
  if (p1 >= 20 && p2 >= 20) {
    // Thắng với cách biệt 2 điểm (trước 30)
    if (p1 < 30 && p2 < 30 && Math.abs(p1 - p2) === 2 && (p1 >= 21 || p2 >= 21))
      return true;
    // Trường hợp 30-29 hoặc 29-30
    if ((p1 === 30 && p2 === 29) || (p2 === 30 && p1 === 29)) return true;
  }

  return false;
};

const validateMatchResult = (
  sets: Array<{ p1: number | null; p2: number | null }>,
  allowPartial: boolean = false
): { valid: boolean; message: string } => {
  // Lọc các set đã nhập đủ điểm
  const completedSets = sets.filter((s) => s.p1 !== null && s.p2 !== null);

  // Nếu cho phép nhập từng phần, có thể cập nhật điểm số đang diễn ra
  if (allowPartial) {
    // Chỉ kiểm tra giá trị nằm trong khoảng hợp lệ, không validate theo luật cầu lông
    for (let i = 0; i < sets.length; i++) {
      const set = sets[i];
      // Kiểm tra từng điểm (nếu có) nằm trong khoảng 0-30
      if (set.p1 !== null && (set.p1 < 0 || set.p1 > 30)) {
        return {
          valid: false,
          message: `Set ${i + 1}: Điểm người chơi 1 phải từ 0-30`,
        };
      }
      if (set.p2 !== null && (set.p2 < 0 || set.p2 > 30)) {
        return {
          valid: false,
          message: `Set ${i + 1}: Điểm người chơi 2 phải từ 0-30`,
        };
      }
    }

    // Cho phép cập nhật bất kỳ điểm số nào, không cần validate logic thắng thua
    return { valid: true, message: "" };
  }

  // Validation nghiêm ngặt cho kết quả hoàn chỉnh
  if (completedSets.length < 2 || completedSets.length > 3) {
    return { valid: false, message: "Cần nhập kết quả 2 hoặc 3 set" };
  }

  // Kiểm tra từng set có hợp lệ không
  for (let i = 0; i < completedSets.length; i++) {
    if (!isValidSetScore(completedSets[i].p1, completedSets[i].p2)) {
      return {
        valid: false,
        message: `Set ${
          i + 1
        } không hợp lệ. Điểm phải là 21 (cách biệt ≥2) hoặc deuce đến 30`,
      };
    }
  }

  // Đếm số set thắng của mỗi người
  let p1Wins = 0;
  let p2Wins = 0;
  completedSets.forEach((set) => {
    if (set.p1! > set.p2!) p1Wins++;
    else p2Wins++;
  });

  // Phải có người thắng 2 set
  if (p1Wins !== 2 && p2Wins !== 2) {
    return { valid: false, message: "Chưa có người thắng 2 set" };
  }

  // Nếu có người thắng 2-0 mà nhập 3 set
  if (completedSets.length === 3 && (p1Wins === 3 || p2Wins === 3)) {
    return {
      valid: false,
      message: "Trận đấu đã kết thúc sau 2 set, không cần set thứ 3",
    };
  }

  return { valid: true, message: "" };
};

export default function CategorySchedule({ category }: CategoryScheduleProps) {
  const router = useRouter();
  const [bracketData, setBracketData] = useState<BracketTreeSchemaType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasBracket, setHasBracket] = useState<boolean | null>(null);
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [editingSets, setEditingSets] = useState<
    Array<{ p1: number | null; p2: number | null }>
  >([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [categoryResult, setCategoryResult] =
    useState<CategoryResultType | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matchUpdateSubRef = useRef<any>(null);

  useEffect(() => {
    if (category.scheduled) {
      fetchBracketTree();
      fetchCategoryResults();
    } else {
      setHasBracket(false);
      setBracketData(null);
      setIsLoading(false);
    }
  }, [category.id, category.scheduled]);

  // WebSocket for match updates
  useEffect(() => {
    if (!category.scheduled || !bracketData) return;

    if (matchUpdateSubRef.current) {
      matchUpdateSubRef.current.unsubscribe();
    }

    const socket = new SockJS(`${process.env.NEXT_PUBLIC_WS_ENDPOINT}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log("STOMP MATCH UPDATE DEBUG:", str),
    });

    stompClient.onConnect = () => {
      matchUpdateSubRef.current = stompClient.subscribe(
        `/topic/match-updates/${category.id}`,
        (message) => {
          if (message.body) {
            const updatedMatch: TournamentMatchSchemaType = JSON.parse(
              message.body
            );

            // Update the match in bracketData
            setBracketData((prev) => {
              if (!prev) return prev;

              const newRounds = prev.rounds.map((round) => ({
                ...round,
                matches: round.matches.map((match) =>
                  match.matchId === updatedMatch.matchId ? updatedMatch : match
                ),
              }));

              return {
                ...prev,
                rounds: newRounds,
              };
            });

            // Show toast notification if not the current editor
            if (editingMatchId !== updatedMatch.matchId) {
              toast.info(
                `Trận ${updatedMatch.matchIndex} đã được cập nhật kết quả`,
                {
                  description: updatedMatch.winnerName
                    ? `${updatedMatch.winnerName} chiến thắng`
                    : undefined,
                }
              );
            }
          }
        }
      );
    };

    stompClient.activate();

    return () => {
      if (matchUpdateSubRef.current) {
        matchUpdateSubRef.current.unsubscribe();
        matchUpdateSubRef.current = null;
      }
      stompClient.deactivate();
    };
  }, [category.id, category.scheduled, bracketData, editingMatchId]);

  const fetchBracketTree = async () => {
    try {
      setIsLoading(true);
      const response = await matchApiRequest.getBracketTree(category.id);
      setBracketData(response.payload.data);
      setHasBracket(true);
    } catch (error: unknown) {
      console.error("Error fetching bracket tree:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategoryResults = async () => {
    try {
      const response = await tournamentApiRequest.getCategoryResults(
        category.id
      );
      setCategoryResult(response.payload.data);
    } catch (error: unknown) {
      // Không có kết quả thì không hiển thị gì
      console.log("No results available yet", error);
      setCategoryResult(null);
    }
  };

  const handleGenerateBracket = async () => {
    try {
      setIsGenerating(true);
      await matchApiRequest.generateBracket(category.id);
      toast.success("Tạo cặp thi đấu thành công!");
      await fetchBracketTree();
      router.refresh();
    } catch (error: unknown) {
      toast.error("Có lỗi xảy ra khi tạo cặp thi đấu");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditMatch = (match: TournamentMatchSchemaType) => {
    setEditingMatchId(match.matchId);

    // Initialize sets with existing scores or default values
    const maxSets = Math.max(
      match.setScoreP1?.length || 0,
      match.setScoreP2?.length || 0,
      3 // Default to 3 sets minimum
    );

    const initialSets = Array.from({ length: maxSets }, (_, index) => ({
      p1: match.setScoreP1?.[index] ?? null,
      p2: match.setScoreP2?.[index] ?? null,
    }));

    setEditingSets(initialSets);
  };

  const handleCancelEdit = () => {
    setEditingMatchId(null);
    setEditingSets([]);
  };

  const handleSetScoreChange = (
    setIndex: number,
    player: "p1" | "p2",
    value: string
  ) => {
    const numValue = value === "" ? null : parseInt(value);

    // Giới hạn giá trị từ 0-30
    if (numValue !== null && (numValue < 0 || numValue > 30)) {
      return;
    }

    setEditingSets((prev) => {
      const newSets = [...prev];
      newSets[setIndex] = {
        ...newSets[setIndex],
        [player]: numValue,
      };
      return newSets;
    });
  };

  const handleAddSet = () => {
    if (editingSets.length >= 3) {
      toast.error("Tối đa 3 set trong một trận đấu");
      return;
    }
    setEditingSets((prev) => [...prev, { p1: null, p2: null }]);
  };

  const handleRemoveSet = (setIndex: number) => {
    if (editingSets.length > 1) {
      setEditingSets((prev) => prev.filter((_, index) => index !== setIndex));
    }
  };

  const handleUpdateResult = async (matchId: string) => {
    try {
      setIsUpdating(true);

      // Lọc các set đã nhập đủ điểm
      const completedSets = editingSets.filter(
        (s) => s.p1 !== null && s.p2 !== null
      );

      // Kiểm tra có ít nhất 1 điểm được nhập
      const hasAnyScore = editingSets.some(
        (s) => s.p1 !== null || s.p2 !== null
      );
      if (!hasAnyScore) {
        toast.error("Vui lòng nhập ít nhất 1 điểm để cập nhật");
        setIsUpdating(false);
        return;
      }

      // Validation với allowPartial = true để cho phép cập nhật từng phần
      const validation = validateMatchResult(editingSets, true);
      if (!validation.valid) {
        toast.error(validation.message);
        setIsUpdating(false);
        return;
      }

      const body: UpdateMatchResultBodyType = {
        sets: completedSets,
      };

      await matchApiRequest.updateMatchResult(matchId, body);
      toast.success("Cập nhật kết quả thành công!");

      // Reset editing state
      setEditingMatchId(null);
      setEditingSets([]);

      // Refresh to get latest data including results
      router.refresh();
      await fetchCategoryResults();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.payload?.message || "Có lỗi xảy ra khi cập nhật kết quả"
      );
    } finally {
      setIsUpdating(false);
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
                {getCategoryLabel(category.category)}
              </p>
            </div>
          </div>
          {category.admin && !category.scheduled && (
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
                  {round.matches.map((match) => {
                    const isEditing = editingMatchId === match.matchId;
                    const hasScores =
                      match.setScoreP1 && match.setScoreP1.length > 0;

                    return (
                      <div
                        key={match.matchId}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors overflow-hidden"
                      >
                        {/* Match Header */}
                        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                          <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                            Trận {match.matchIndex}
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={getMatchStatusColor(match.status)}
                            >
                              {getMatchStatusText(match.status)}
                            </Badge>
                            {category.admin && !isEditing && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditMatch(match)}
                                className="h-7 w-7 p-0 hover:bg-blue-200 dark:hover:bg-blue-800"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="p-4">
                          {isEditing ? (
                            <>
                              {/* Editing Mode */}
                              <div className="space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b">
                                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Nhập kết quả
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleAddSet}
                                    className="h-7 text-xs"
                                  >
                                    + Thêm set
                                  </Button>
                                </div>

                                {/* Score Table */}
                                <div className="space-y-3">
                                  {editingSets.map((set, setIndex) => (
                                    <div key={setIndex} className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                          Set {setIndex + 1}
                                        </span>
                                        {editingSets.length > 1 && (
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() =>
                                              handleRemoveSet(setIndex)
                                            }
                                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                          >
                                            <X className="w-3.5 h-3.5" />
                                          </Button>
                                        )}
                                      </div>

                                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 space-y-2">
                                        <div className="flex items-center gap-2">
                                          <div className="flex-1">
                                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
                                              {match.player1Name || "Player 1"}
                                            </label>
                                            <Input
                                              type="number"
                                              min="0"
                                              max="30"
                                              value={set.p1 ?? ""}
                                              onChange={(e) =>
                                                handleSetScoreChange(
                                                  setIndex,
                                                  "p1",
                                                  e.target.value
                                                )
                                              }
                                              className="h-10 text-center text-lg font-bold"
                                              placeholder="0"
                                            />
                                          </div>
                                          <div className="text-gray-400 font-bold">
                                            :
                                          </div>
                                          <div className="flex-1">
                                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
                                              {match.player2Name || "Player 2"}
                                            </label>
                                            <Input
                                              type="number"
                                              min="0"
                                              max="30"
                                              value={set.p2 ?? ""}
                                              onChange={(e) =>
                                                handleSetScoreChange(
                                                  setIndex,
                                                  "p2",
                                                  e.target.value
                                                )
                                              }
                                              className="h-10 text-center text-lg font-bold"
                                              placeholder="0"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div className="flex gap-2 pt-3 border-t">
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleUpdateResult(match.matchId)
                                    }
                                    disabled={isUpdating}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white h-10"
                                  >
                                    {isUpdating ? (
                                      <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Đang lưu...
                                      </>
                                    ) : (
                                      <>
                                        <Check className="w-4 h-4 mr-2" />
                                        Lưu kết quả
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCancelEdit}
                                    disabled={isUpdating}
                                    className="flex-1 h-10"
                                  >
                                    <X className="w-4 h-4 mr-2" />
                                    Hủy
                                  </Button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              {/* Display Mode - BWF Style */}
                              <div className="space-y-0">
                                {/* Player 1 Row */}
                                <div
                                  className={`flex items-center p-3 ${
                                    match.winnerId === match.player1Id
                                      ? "bg-green-50 dark:bg-green-950/30"
                                      : "bg-white dark:bg-gray-800"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <div
                                      className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold ${
                                        match.winnerId === match.player1Id
                                          ? "bg-green-600 text-white"
                                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                      }`}
                                    >
                                      1
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div
                                        className={`font-semibold truncate ${
                                          match.winnerId === match.player1Id
                                            ? "text-green-900 dark:text-green-100"
                                            : "text-gray-900 dark:text-white"
                                        }`}
                                      >
                                        {match.player1Name || "TBD"}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Set Scores with fixed width container */}
                                  <div className="flex items-center gap-1.5 ml-3 min-w-[160px] justify-end">
                                    {hasScores ? (
                                      <div className="flex items-center gap-1.5">
                                        {match.setScoreP1!.map(
                                          (score, index) => {
                                            const p2Score =
                                              match.setScoreP2![index];
                                            const wonSet = score > p2Score;
                                            return (
                                              <div
                                                key={index}
                                                className={`w-10 h-10 flex items-center justify-center rounded text-lg font-bold ${
                                                  wonSet
                                                    ? "bg-green-600 text-white"
                                                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                                }`}
                                              >
                                                {score}
                                              </div>
                                            );
                                          }
                                        )}
                                        <div className="w-6 h-10 flex items-center justify-center">
                                          {match.winnerId ===
                                            match.player1Id && (
                                            <Trophy className="w-5 h-5 text-amber-500" />
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="w-10 h-10 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-sm">
                                        -
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gray-200 dark:bg-gray-700"></div>

                                {/* Player 2 Row */}
                                <div
                                  className={`flex items-center p-3 ${
                                    match.winnerId === match.player2Id
                                      ? "bg-green-50 dark:bg-green-950/30"
                                      : "bg-white dark:bg-gray-800"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <div
                                      className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold ${
                                        match.winnerId === match.player2Id
                                          ? "bg-green-600 text-white"
                                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                      }`}
                                    >
                                      2
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div
                                        className={`font-semibold truncate ${
                                          match.winnerId === match.player2Id
                                            ? "text-green-900 dark:text-green-100"
                                            : "text-gray-900 dark:text-white"
                                        }`}
                                      >
                                        {match.player2Name || "TBD"}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Set Scores with fixed width container */}
                                  <div className="flex items-center gap-1.5 ml-3 min-w-[160px] justify-end">
                                    {hasScores ? (
                                      <div className="flex items-center gap-1.5">
                                        {match.setScoreP2!.map(
                                          (score, index) => {
                                            const p1Score =
                                              match.setScoreP1![index];
                                            const wonSet = score > p1Score;
                                            return (
                                              <div
                                                key={index}
                                                className={`w-10 h-10 flex items-center justify-center rounded text-lg font-bold ${
                                                  wonSet
                                                    ? "bg-green-600 text-white"
                                                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                                }`}
                                              >
                                                {score}
                                              </div>
                                            );
                                          }
                                        )}
                                        <div className="w-6 h-10 flex items-center justify-center">
                                          {match.winnerId ===
                                            match.player2Id && (
                                            <Trophy className="w-5 h-5 text-amber-500" />
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="w-10 h-10 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-sm">
                                        -
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Winner Badge */}
                              {match.winnerName && (
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                  <div className="flex items-center justify-center gap-2 text-sm">
                                    <Trophy className="w-4 h-4 text-amber-500" />
                                    <span className="font-semibold text-green-700 dark:text-green-400">
                                      {match.winnerName}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400">
                                      chiến thắng
                                    </span>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
            {category.admin && !category.scheduled && (
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

      {/* Results Section */}
      {categoryResult &&
        categoryResult.results &&
        categoryResult.results.length > 0 && (
          <CardContent className="p-6 border-t bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950">
            <div className="mb-4 flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Kết quả giải đấu
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bảng xếp hạng cuối cùng
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {categoryResult.results.map((result, index) => {
                const getRankingBadgeColor = (ranking: number) => {
                  switch (ranking) {
                    case 1:
                      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300";
                    case 2:
                      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-gray-300";
                    case 3:
                      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-300";
                    default:
                      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-300";
                  }
                };

                const getRankingIcon = (ranking: number) => {
                  if (ranking === 1) return "🥇";
                  if (ranking === 2) return "🥈";
                  if (ranking === 3) return "🥉";
                  return `#${ranking}`;
                };

                return (
                  <div
                    key={result.participantId || `result-${index}`}
                    className={`p-4 rounded-lg border bg-white dark:bg-gray-800 hover:shadow-md transition-shadow ${
                      result.ranking <= 3
                        ? "border-amber-200 dark:border-amber-800"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center min-w-[3rem]">
                        <span className="text-2xl font-bold">
                          {getRankingIcon(result.ranking)}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {result.participantName}
                          </h4>
                          <Badge
                            className={getRankingBadgeColor(result.ranking)}
                          >
                            Hạng {result.ranking}
                          </Badge>
                        </div>
                        {result.teamName && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Đội: {result.teamName}
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Trophy className="w-4 h-4 text-amber-500" />
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {result.prize}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        )}
    </Card>
  );
}
