import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CategoryDetail } from "@/schemaValidations/tournament.schema";
import { Trophy } from "lucide-react";

interface CategoryOverviewProps {
  category: CategoryDetail;
}

export default function CategoryOverview({ category }: CategoryOverviewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Mô tả hạng mục
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {category.description || "Chưa có mô tả cho hạng mục này."}
          </p>
        </CardContent>
      </Card>

      {category.rules && category.rules.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Thể lệ thi đấu
            </h3>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {category.rules.map((rule: string, index: number) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                >
                  <span className="w-6 h-6 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {(category.firstPrize || category.secondPrize || category.thirdPrize) && (
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Cơ cấu giải thưởng
              </h3>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {category.firstPrize && (
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-900/30 dark:via-amber-900/20 dark:to-orange-900/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-amber-200 dark:border-amber-800">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 dark:bg-amber-700/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-amber-500 dark:bg-amber-600 flex items-center justify-center shadow-md">
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-lg font-bold text-amber-900 dark:text-amber-200">
                          Giải nhất
                        </span>
                      </div>
                      <div className="text-4xl font-bold text-amber-500/20 dark:text-amber-400/10">
                        🥇
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
                      <p className="text-xl text-center font-bold text-amber-800 dark:text-amber-300 break-words">
                        {category.firstPrize}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {category.secondPrize && (
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-800/30 dark:via-gray-800/20 dark:to-zinc-800/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-700">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-200/30 dark:bg-gray-700/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gray-400 dark:bg-gray-500 flex items-center justify-center shadow-md">
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-gray-200">
                          Giải nhì
                        </span>
                      </div>
                      <div className="text-4xl font-bold text-gray-400/20 dark:text-gray-500/10">
                        🥈
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
                      <p className="text-xl text-center font-bold text-gray-700 dark:text-gray-300 break-words">
                        {category.secondPrize}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {category.thirdPrize && (
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900/30 dark:via-amber-900/20 dark:to-yellow-900/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-orange-200 dark:border-orange-800">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/30 dark:bg-orange-700/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-orange-500 dark:bg-orange-600 flex items-center justify-center shadow-md">
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-lg font-bold text-orange-900 dark:text-orange-200">
                          Giải ba
                        </span>
                      </div>
                      <div className="text-4xl font-bold text-orange-400/20 dark:text-orange-500/10">
                        🥉
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
                      <p className="text-xl text-center font-bold text-orange-700 dark:text-orange-300 break-words">
                        {category.thirdPrize}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
