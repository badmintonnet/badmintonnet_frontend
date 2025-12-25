import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Users } from "lucide-react";
import { CategoryResultType } from "@/schemaValidations/tournament-result";

interface ResultsSectionProps {
  categories: CategoryResultType[];
}

export default function ResultsSection({ categories }: ResultsSectionProps) {
  const getRankingIcon = (ranking: number) => {
    switch (ranking) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-600" />;
      default:
        return null;
    }
  };

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

  if (!categories || categories.length === 0) {
    return (
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Trophy className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Chưa có kết quả giải đấu
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <Card
          key={category.categoryId}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              {category.categoryName}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {category.results && category.results.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {category.results.map((result, index) => (
                  <div
                    key={
                      result.participantId ||
                      `result-${category.categoryId}-${index}`
                    }
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${
                      result.ranking <= 3
                        ? "bg-gray-50/50 dark:bg-gray-800/50"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Ranking */}
                      <div className="flex items-center justify-center w-12">
                        {getRankingIcon(result.ranking) || (
                          <span className="text-xl font-bold text-gray-600 dark:text-gray-400">
                            {result.ranking}
                          </span>
                        )}
                      </div>

                      {/* Participant Info */}
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
                        {result.teamId && result.teamName && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <Users className="w-4 h-4" />
                            <span>{result.teamName}</span>
                          </div>
                        )}
                      </div>

                      {/* Prize */}
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
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Chưa có kết quả cho hạng mục này
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
