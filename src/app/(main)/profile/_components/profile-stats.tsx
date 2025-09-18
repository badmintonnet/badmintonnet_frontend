import { cookies } from "next/headers";
import accountApiRequest from "@/apiRequest/account";
import { Trophy, TrendingUp, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

function getLevelGradient(score: number) {
  if (score < 1) return "from-gray-500 to-gray-600";
  if (score < 2) return "from-red-500 to-red-600";
  if (score < 3) return "from-yellow-500 to-orange-500";
  if (score < 4) return "from-blue-500 to-blue-600";
  if (score < 4.5) return "from-indigo-500 to-purple-600";
  return "from-emerald-500 to-teal-600";
}

export default async function ProfileStats() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  const res = await accountApiRequest.getPlayerRating(accessToken?.value || "");
  const playerRating = res.payload.data;

  if (!playerRating) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm ">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white ">
          Đánh giá trình độ
        </h3>
        <div className="text-center py-6">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Star className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Bạn chưa có đánh giá năng lực
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Hãy tự đánh giá trình độ bản thân để hệ thống gợi ý đối thủ và CLB
            phù hợp với bạn hơn.
          </p>
        </div>
        <Button
          asChild
          className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 mt-auto 
    bg-gradient-to-r from-emerald-500 to-emerald-600  
    hover:from-emerald-700 hover:to-emerald-800 
    dark:from-blue-400 dark:to-blue-500  
    dark:hover:from-blue-600 dark:hover:to-blue-700 
    text-white hover:shadow-md transform hover:scale-105 active:scale-95"
        >
          <Link href="/profile/player-rating">Thêm tự đánh giá</Link>
        </Button>
      </div>
    );
  }

  const {
    overallScore,
    averageTechnicalScore,
    experience,
    stamina,
    tactics,
    skillLevel,
  } = playerRating;

  const technicalSkills = [
    { name: "Serve (Phát cầu)", value: playerRating.serve },
    { name: "Smash (Đập cầu)", value: playerRating.smash },
    { name: "Clear (Phông cầu)", value: playerRating.clear },
    { name: "Drop (Bỏ nhỏ xa lưới)", value: playerRating.dropShot },
    { name: "Drive (Tạt ngang)", value: playerRating.drive },
    { name: "Net shot (Đánh lưới)", value: playerRating.netShot },
    { name: "Doubles (Phối hợp đánh đôi)", value: playerRating.doubles },
    { name: "Defense (Phòng thủ)", value: playerRating.defense },
    { name: "Footwork (Bộ pháp)", value: playerRating.footwork },
  ];

  const mainStats = [
    {
      title: "Kinh nghiệm",
      value: experience,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Kỹ thuật",
      value: averageTechnicalScore,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Thể lực",
      value: stamina,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Chiến thuật",
      value: tactics,
      color: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm space-y-4">
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
        Đánh giá trình độ
      </h3>
      {/* Header with main score */}
      <div className="text-center pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="relative w-24 h-24 mx-auto mb-3">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(overallScore / 5) * 251.3} 251.3`}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              {overallScore.toFixed(1)}
            </div>
          </div>
        </div>

        <div
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-white text-sm font-semibold bg-gradient-to-r ${getLevelGradient(
            overallScore
          )}`}
        >
          <Trophy className="h-4 w-4" />
          {skillLevel}
        </div>
      </div>

      {/* Main stats - 2x2 grid */}
      <div className="grid grid-cols-2 gap-3">
        {mainStats.map((stat) => (
          <div
            key={stat.title}
            className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              {stat.title}
            </div>
            <div className={`text-lg font-bold ${stat.color}`}>
              {typeof stat.value === "number"
                ? stat.value.toFixed(1)
                : stat.value}
            </div>
            <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
              <div
                className="h-1 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-700"
                style={{ width: `${(stat.value / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Technical skills - compact list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-base  font-bold text-gray-800 dark:text-gray-200">
            Chi tiết từng kỹ thuật
          </h4>
        </div>

        <div className="space-y-2">
          {technicalSkills.map((skill) => (
            <div
              key={skill.name}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-700 dark:text-gray-300 flex-1 truncate font-medium">
                {skill.name}
              </span>
              <div className="flex items-center gap-3 ml-3">
                <div className="w-18 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                    style={{ width: `${(skill.value / 5) * 100}%` }}
                  />
                </div>
                <span className="text-gray-600 dark:text-gray-400 font-semibold min-w-[1.2rem] text-right">
                  {skill.value}/5
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick tip */}
      <div className="p-3 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800">
        <div className="flex items-start gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1">
              Gợi ý
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {overallScore < 3
                ? "Tập trung luyện kỹ thuật cơ bản"
                : overallScore < 4
                ? "Phát triển chiến thuật và kỹ thuật nâng cao"
                : "Duy trì phong độ và tham gia thi đấu"}
            </p>
          </div>
        </div>
      </div>
      <Button
        asChild
        className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 mt-auto 
    bg-gradient-to-r from-emerald-500 to-emerald-600  
    hover:from-emerald-700 hover:to-emerald-800 
    dark:from-blue-400 dark:to-blue-500  
    dark:hover:from-blue-600 dark:hover:to-blue-700 
    text-white hover:shadow-md transform hover:scale-105 active:scale-95"
      >
        <Link href="/profile/player-rating?mode=edit">Chỉnh sửa</Link>
      </Button>
    </div>
  );
}
