import { TrophyIcon, ChartBarIcon } from "@heroicons/react/24/outline";

export default function ProfileStats() {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <TrophyIcon className="h-6 w-6 mr-2 text-yellow-500" />
          Thống kê thi đấu
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-gray-600 dark:text-gray-300">Rating</span>
            <span className="text-2xl font-bold text-green-600">1650</span>
          </div>

          <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-gray-600 dark:text-gray-300">Tổng trận</span>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              127
            </span>
          </div>

          <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-gray-600 dark:text-gray-300">
              Tỷ lệ thắng
            </span>
            <span className="text-xl font-semibold text-blue-600">68%</span>
          </div>

          <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-gray-600 dark:text-gray-300">
              Tham gia từ
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              2/9/2025
            </span>
          </div>
        </div>
      </div>

      {/* Hoạt động gần đây */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <ChartBarIcon className="h-6 w-6 mr-2 text-blue-500" />
          Hoạt động gần đây
        </h3>
        <div className="space-y-3">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Thắng trận đấu với <span className="font-medium">Nguyễn Văn B</span>{" "}
            - 2 giờ trước
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Tham gia giải <span className="font-medium">Cúp Mùa Xuân 2025</span>{" "}
            - 1 ngày trước
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Cập nhật thông tin cá nhân - 3 ngày trước
          </div>
        </div>
      </div>
    </div>
  );
}
