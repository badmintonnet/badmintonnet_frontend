"use client";

import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function RankingInfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Cách tính điểm xếp hạng"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:text-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <Info className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cách tính điểm xếp hạng</DialogTitle>
          <DialogDescription>
            Điểm cạnh tranh (competitive score) được tổng hợp từ 4 thành phần
            theo trọng số cố định.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <ul className="space-y-2.5">
            <li className="flex items-baseline justify-between gap-3 rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-900">
              <span>
                <strong>40%</strong> — Thành tích giải đấu
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Giải đấu
              </span>
            </li>
            <li className="flex items-baseline justify-between gap-3 rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-900">
              <span>
                <strong>20%</strong> — Tỷ lệ thắng
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Win rate
              </span>
            </li>
            <li className="flex items-baseline justify-between gap-3 rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-900">
              <span>
                <strong>20%</strong> — Số trận đã thi đấu
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Số trận
              </span>
            </li>
            <li className="flex items-baseline justify-between gap-3 rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-900">
              <span>
                <strong>20%</strong> — Điểm uy tín tài khoản
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Uy tín
              </span>
            </li>
          </ul>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-950 dark:text-white">
              Chi tiết từng phần
            </h3>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <strong>Giải đấu:</strong> mỗi giải đã hoàn thành được quy đổi
                theo hạng chót cuối (vô địch = 100 điểm, hạng cuối = 0 điểm,
                các hạng giữa nội suy theo số người tham dự), sau đó lấy trung
                bình các giải.
              </li>
              <li>
                <strong>Win rate:</strong> % số trận thắng trên tổng số trận
                đã đấu ở các giải đấu chính thức.
              </li>
              <li>
                <strong>Số trận:</strong> tăng dần theo số trận đã chơi nhưng
                tăng chậm lại và đạt tối đa khi chơi đủ 30 trận, để tránh việc
                thi đấu quá nhiều trận dễ nhưng không tăng chất lượng.
              </li>
              <li>
                <strong>Uy tín:</strong> bắt đầu ở 100 điểm, tăng khi tham gia
                đầy đủ các hoạt động CLB đã đăng ký và giảm khi vắng mặt không
                lý do.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-950 dark:text-white">
              Xếp hạng bằng điểm
            </h3>
            <p>
              Nếu nhiều người cùng điểm, thứ tự được phân định lần lượt theo:
              điểm giải đấu → tỷ lệ thắng → điểm uy tín → số trận đã đấu → tên
              (A-Z).
            </p>
          </div>

          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
            Nhãn <strong>&quot;Tạm tính&quot;</strong> xuất hiện khi người chơi
            có dưới 3 trận đấu và chưa hoàn thành giải đấu nào — hạng của họ
            có thể thay đổi nhiều khi có thêm dữ liệu thi đấu.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
