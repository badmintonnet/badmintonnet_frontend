"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import React, { useEffect, useRef, useState } from "react";
import {
  Trophy,
  Target,
  Zap,
  Brain,
  ChevronLeft,
  ChevronRight,
  Check,
  Info,
} from "lucide-react";
import { PlayerRatingCreateBodyType } from "@/schemaValidations/account.schema";
import accountApiRequest from "@/apiRequest/account";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const initialRatings = {
  experience: 0,
  serve: 0,
  smash: 0,
  clear: 0,
  dropShot: 0,
  drive: 0,
  netShot: 0,
  doubles: 0,
  defense: 0,
  footwork: 0,
  stamina: 0,
  tactics: 0,
};

const criteriaData = {
  experience: {
    title: "Kinh nghiệm & thời gian chơi",
    descriptions: [
      "Chưa từng chơi",
      "< 6 tháng, mới bắt đầu",
      "6 tháng – 1 năm, nắm luật cơ bản",
      "1 – 2 năm, chơi thành thạo các luật cơ bản",
      "2 – 4 năm, đã chơi nhiều trận, hiểu chiến thuật cơ bản",
      "> 4 năm, nhiều kinh nghiệm, quen với mọi tình huống",
    ],
  },
  serve: {
    title: "Serve (Phát cầu)",
    descriptions: [
      "Không biết phát",
      "Phát cầu thường không qua lưới",
      "Phát cầu qua lưới nhưng không đủ gây khó khăn",
      "Phát cầu ổn định, gây được khó khăn",
      "Phát cầu chính xác, phát được nhiều vị trí",
      "Phát đa dạng, chính xác, gây được khó khăn và gần như không bị hỏng",
    ],
  },
  smash: {
    title: "Smash (Đập cầu)",
    descriptions: [
      "Không biết",
      "Smash không qua lưới",
      "Smash thiếu lực/chưa chính xác",
      "Smash ổn định",
      "Smash chính xác, uy lực",
      "Smash mạnh, chính xác, kiểm soát hướng",
    ],
  },
  clear: {
    title: "Clear (Phông cầu)",
    descriptions: [
      "Không biết",
      "Chỉ đánh cầu qua lưới",
      "Clear cầu thiếu lực/chưa chuẩn",
      "Clear ổn định",
      "Clear chính xác, xa",
      "Clear chuẩn xác, cao sâu, kiểm soát nhịp trận đấu",
    ],
  },
  dropShot: {
    title: "Drop (Bỏ nhỏ xa lưới)",
    descriptions: [
      "Không biết",
      "Chỉ đánh đôi lần",
      "Drop không chuẩn, dễ bị trả",
      "Drop ổn định",
      "Drop chính xác, kiểm soát lưới",
      "Drop tinh tế, khó trả, kiểm soát trận đấu",
    ],
  },
  drive: {
    title: "Drive (Tạt ngang)",
    descriptions: [
      "Không biết",
      "Drive không qua lưới",
      "Drive qua lưới nhưng thiếu lực",
      "Drive ổn định",
      "Drive chính xác, áp lực",
      "Drive mạnh, chính xác, áp đảo đối thủ",
    ],
  },
  netShot: {
    title: "Net shot (Đánh lưới)",
    descriptions: [
      "Không biết",
      "Chỉ đẩy cầu qua lưới",
      "Thiếu kiểm soát",
      "Net shot ổn định",
      "Net shot chính xác",
      "Net shot tinh tế, khó trả cầu, kiểm soát điểm",
    ],
  },
  doubles: {
    title: "Doubles (Phối hợp đánh đôi)",
    descriptions: [
      "Không biết",
      "Hiểu vị trí cơ bản",
      "Biết thay đổi vị trí nhưng phối hợp kém",
      "Phối hợp cơ bản",
      "Phối hợp tốt, hiểu nhịp",
      "Phối hợp nhuần nhuyễn, khai thác điểm yếu đối thủ",
    ],
  },
  defense: {
    title: "Defense (Phòng thủ)",
    descriptions: [
      "Không biết",
      "Phản ứng chậm, dễ để mất điểm",
      "Chặn được vài pha đơn giản",
      "Phòng thủ ổn định, giữ điểm",
      "Phòng thủ tốt, chuyển trạng thái tấn công",
      "Phòng thủ xuất sắc, phản xạ nhanh, kiểm soát trận đấu",
    ],
  },
  footwork: {
    title: "Footwork (Bộ pháp)",
    descriptions: [
      "Không biết",
      "Di chuyển chậm, phản xạ kém",
      "Di chuyển cơ bản, chưa nhịp nhàng",
      "Di chuyển ổn, phản xạ trung bình",
      "Di chuyển linh hoạt, phản xạ tốt",
      "Di chuyển cực nhanh, nhịp nhàng, phản xạ xuất sắc",
    ],
  },
  stamina: {
    title: "Stamina (Thể lực & di chuyển)",
    descriptions: [
      "Yếu, mệt nhanh, di chuyển chậm",
      "Khá yếu, khó duy trì trận đấu",
      "Trung bình, chơi được 1 set, di chuyển ổn",
      "Trung bình khá, chơi 1–2 set liên tục, phản xạ ổn",
      "Tốt, bền bỉ, phản xạ nhanh, 2–3 set liên tục thoải mái",
      "Xuất sắc, sức bền cao, phản xạ cực nhanh, chạy nhiều trận liên tiếp",
    ],
  },
  tactics: {
    title: "Tactics (Chiến thuật & phối hợp)",
    descriptions: [
      "Không hiểu chiến thuật, đánh theo bản năng",
      "Hiểu cơ bản, đôi khi thay đổi vị trí",
      "Áp dụng chiến thuật đơn giản",
      "Biết điều chỉnh chiến thuật, phối hợp tốt",
      "Chủ động điều tiết trận đấu, phối hợp nhuần nhuyễn",
      "Xuất sắc, khai thác điểm yếu đối thủ, phối hợp hoàn hảo",
    ],
  },
};

const tabs = [
  {
    id: "experience",
    title: "Kinh nghiệm",
    icon: Trophy,
    color: "emerald",
    fields: ["experience"],
  },
  {
    id: "technical",
    title: "Kỹ thuật",
    icon: Target,
    color: "blue",
    fields: [
      "serve",
      "smash",
      "clear",
      "dropShot",
      "drive",
      "netShot",
      "doubles",
      "defense",
      "footwork",
    ],
  },
  {
    id: "stamina",
    title: "Thể lực",
    icon: Zap,
    color: "emerald",
    fields: ["stamina"],
  },
  {
    id: "tactics",
    title: "Chiến thuật",
    icon: Brain,
    color: "blue",
    fields: ["tactics"],
  },
  {
    id: "result",
    title: "Kết quả",
    icon: Trophy,
    color: "emerald",
    fields: [],
  },
];

const levelRanges = [
  { min: 0, max: 1, label: "Mới tập chơi", color: "bg-gray-500" },
  { min: 1, max: 2, label: "Cơ bản", color: "bg-red-500" },
  { min: 2, max: 3, label: "Trung bình", color: "bg-yellow-500" },
  { min: 3, max: 4, label: "Trung bình khá", color: "bg-orange-500" },
  { min: 4, max: 4.5, label: "Khá", color: "bg-blue-500" },
  { min: 4.5, max: 5, label: "Bán chuyên", color: "bg-emerald-500" },
];

export default function PlayerRatingForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    const top = formRef.current?.offsetTop || 0;
    window.scrollTo({
      top: top + 240, // trừ chiều cao header (ví dụ 80px)
      behavior: "smooth",
    });
  };
  const router = useRouter();
  const [ratings, setRatings] =
    useState<PlayerRatingCreateBodyType>(initialRatings);
  const [activeTab, setActiveTab] = useState(0);
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [playerLevel, setPlayerLevel] = useState<string>("");
  const [actives, setActives] = useState<number[]>([0]);
  const handleChange = (
    field: keyof PlayerRatingCreateBodyType,
    value: number
  ) => {
    setRatings((prev) => ({ ...prev, [field]: value }));
  };

  const getPlayerLevel = (score: number) => {
    const level = levelRanges.find(
      (range) => score > range.min && score <= range.max
    );
    return level ? level.label : "Mới bắt đầu";
  };

  const getLevelColor = (score: number) => {
    const level = levelRanges.find(
      (range) => score > range.min && score <= range.max
    );
    return level ? level.color : "bg-gray-500";
  };

  const calculateScore = () => {
    const technicalSkills = [
      ratings.serve,
      ratings.smash,
      ratings.clear,
      ratings.dropShot,
      ratings.drive,
      ratings.netShot,
      ratings.doubles,
      ratings.defense,
      ratings.footwork,
    ];
    const experience = ratings.experience;
    const technical = technicalSkills.reduce((a, b) => a + b, 0) / 9;
    const stamina = ratings.stamina;
    const tactics = ratings.tactics;

    const total =
      0.3 * experience + 0.4 * technical + 0.2 * stamina + 0.1 * tactics;
    const finalScore = Number(total.toFixed(2));
    setTotalScore(finalScore);
    setPlayerLevel(getPlayerLevel(finalScore));
  };

  const submitRating = async () => {
    try {
      await accountApiRequest.createPlayerRating(ratings);
      toast("Đã cập nhật trình độ của bạn thành công");
      router.push("/profile");
    } catch (error) {
      toast("Không thể cập nhật trình độ của bạn");
      console.error("Error create player rating", error);
    }
  };

  const nextTab = () => {
    if (activeTab < tabs.length - 1) {
      setActiveTab(activeTab + 1);
      setActives((prev) => {
        // nếu đã tồn tại thì không thêm
        if (prev.includes(activeTab + 1)) return prev;
        return [...prev, activeTab + 1];
      });
      if (activeTab === tabs.length - 2) calculateScore();
      scrollToTop();
    }
  };

  const prevTab = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
      setActives((prev) => {
        // nếu đã tồn tại thì không thêm
        if (prev.includes(activeTab - 1)) return prev;
        return [...prev, activeTab - 1];
      });
      scrollToTop();
    }
  };

  const goToTab = (tabIndex: number) => {
    setActiveTab(tabIndex);
    setActives((prev) => {
      // nếu đã tồn tại thì không thêm
      if (prev.includes(tabIndex)) return prev;
      return [...prev, tabIndex];
    });
    if (tabIndex === tabs.length - 1) calculateScore();
  };

  const isTabCompleted = (tabIndex: number) => {
    return actives.includes(tabIndex);
  };
  useEffect(() => {
    const fetchPlayerRating = async () => {
      try {
        const res = await accountApiRequest.getPlayerRating();
        if (res) {
          const initial = {
            experience: res.payload.data.experience,
            serve: res.payload.data.serve,
            smash: res.payload.data.smash,
            clear: res.payload.data.clear,
            dropShot: res.payload.data.dropShot,
            drive: res.payload.data.drive,
            netShot: res.payload.data.netShot,
            doubles: res.payload.data.doubles,
            defense: res.payload.data.defense,
            footwork: res.payload.data.footwork,
            stamina: res.payload.data.stamina,
            tactics: res.payload.data.tactics,
          };
          setRatings(initial);
          setActives([0, 1, 2, 3, 4]);
        }
      } catch {}
    };

    fetchPlayerRating();
  }, []);
  const renderRatingField = (field: keyof typeof initialRatings) => {
    const criteria = criteriaData[field];

    return (
      <div key={field} className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-emerald-500 text-white p-4 rounded-t-lg">
            <h3 className="text-lg font-semibold">{criteria.title}</h3>
            <p className="text-sm">
              {ratings[field]}/5 - {criteria.descriptions[ratings[field]]}
            </p>
          </div>

          {/* Criteria Table */}
          <div className="p-4">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-blue-500" />
                <h4 className="font-medium">Tiêu chí đánh giá</h4>
              </div>
              <div className="space-y-2">
                {criteria.descriptions.map((desc, index) => (
                  <div
                    key={index}
                    onClick={() => handleChange(field, index)}
                    className={`flex items-center p-3 rounded border cursor-pointer transition-all duration-200 ${
                      ratings[field] === index
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                        : "border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        ratings[field] === index
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-200 dark:bg-gray-600"
                      }`}
                    >
                      {index}
                    </div>
                    <span className="flex-1 ml-3">{desc}</span>
                    {ratings[field] === index && (
                      <Check className="h-4 w-4 text-emerald-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Buttons */}
            <div className="space-y-2">
              <Progress
                value={(ratings[field] / 5) * 100}
                className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    const currentTab = tabs[activeTab];

    if (currentTab.id === "result") {
      const technicalAverage =
        [
          ratings.serve,
          ratings.smash,
          ratings.clear,
          ratings.dropShot,
          ratings.drive,
          ratings.netShot,
          ratings.doubles,
          ratings.defense,
          ratings.footwork,
        ].reduce((a, b) => a + b, 0) / 9;

      return (
        <div className="space-y-6">
          {/* Formula Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Công thức tính điểm
            </h3>
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800">
              <p className="font-mono text-center text-gray-700 dark:text-gray-300 font-medium">
                Điểm tổng = 0.3 × Kinh nghiệm + 0.4 × Kỹ thuật + 0.2 × Thể lực +
                0.1 × Chiến thuật
              </p>
            </div>
          </div>

          {/* Results */}
          {totalScore !== null && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
              <div className="text-center space-y-6">
                {/* Score Display with Circular Progress */}
                <div className="space-y-4">
                  {/* Circular Progress */}
                  <div className="flex justify-center">
                    <div className="relative w-32 h-32">
                      <svg
                        className="w-32 h-32 transform -rotate-90"
                        viewBox="0 0 120 120"
                      >
                        {/* Background circle */}
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${
                            (totalScore / 5) * 314.16
                          } 314.16`}
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient
                            id="gradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#3b82f6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      {/* Score in center */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                          {totalScore}/5
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`inline-flex items-center px-6 py-3 rounded-full text-white font-semibold text-lg shadow-md ${getLevelColor(
                      totalScore
                    )}`}
                  >
                    {playerLevel}
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                  <div className="border-l-4 border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-gray-800/30 p-3 rounded-md italic">
                    <strong>Ghi chú:</strong> 0–1 (Mới bắt đầu), 1–2 (Cơ bản),
                    2–3 (Trung bình), 3–4 (Trung bình khá), 4–4.5 (Khá), 4.5–5
                    (Bán chuyên).
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 p-5 rounded-xl border-l-4 border-emerald-500">
                    <div className="text-emerald-700 dark:text-emerald-300 font-semibold text-sm  tracking-wide mb-2">
                      Kinh nghiệm
                    </div>
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                      {ratings.experience}/5
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-5 rounded-xl border-l-4 border-blue-500">
                    <div className="text-blue-700 dark:text-blue-300 font-semibold text-sm  tracking-wide mb-2">
                      Kỹ thuật
                    </div>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {technicalAverage.toFixed(1)}/5
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 p-5 rounded-xl border-l-4 border-emerald-500">
                    <div className="text-emerald-700 dark:text-emerald-300 font-semibold text-sm  tracking-wide mb-2">
                      Thể lực
                    </div>
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                      {ratings.stamina}/5
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-5 rounded-xl border-l-4 border-blue-500">
                    <div className="text-blue-700 dark:text-blue-300 font-semibold text-sm  tracking-wide mb-2">
                      Chiến thuật
                    </div>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {ratings.tactics}/5
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {currentTab.fields.map((field) =>
          renderRatingField(field as keyof typeof initialRatings)
        )}
      </div>
    );
  };

  const completedTabs = tabs.filter((_, index) => isTabCompleted(index)).length;
  const progressPercentage = (completedTabs / tabs.length) * 100;

  return (
    <div ref={formRef} className=" bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Header */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-4">
            <div className="mt-4 space-y-1">
              {/* Tiến độ */}
              <div className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300 font-medium">
                <span>Tiến độ</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>

              {/* Progress Bar */}
              <Progress
                value={progressPercentage}
                className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 [&>div]:rounded-full [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-blue-500 transition-all duration-700"
              />
            </div>
          </CardHeader>
        </Card>

        {/* Tab Navigation */}
        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === index;
              const isCompleted = isTabCompleted(index);

              return (
                <button
                  key={tab.id}
                  onClick={() => goToTab(index)}
                  className={`flex-1 p-3 flex items-center gap-2 border-b-2 ${
                    isActive
                      ? tab.color === "emerald"
                        ? "border-emerald-500 text-emerald-500"
                        : "border-blue-500 text-blue-500"
                      : isCompleted
                      ? "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400"
                      : "border-transparent text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.title}</span>
                  {isCompleted && !isActive && (
                    <Check className="h-4 w-4 text-emerald-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div>{renderTabContent()}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            onClick={prevTab}
            disabled={activeTab === 0}
            variant="outline"
            className="flex items-center gap-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400"
          >
            <ChevronLeft className="h-4 w-4" />
            Quay lại
          </Button>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {activeTab + 1} / {tabs.length}
          </div>
          {activeTab === tabs.length - 1 ? (
            <Button
              onClick={submitRating}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Xác nhận
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={nextTab}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Tiếp theo
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
