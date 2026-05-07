"use client";

import { Button } from "@/components/ui/button";

export default function AdminDashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
      <h1 className="text-xl font-semibold">Không thể tải dashboard</h1>
      <p className="mt-2 text-sm">Có lỗi khi lấy dữ liệu thống kê.</p>
      <Button onClick={reset} className="mt-4">
        Thử lại
      </Button>
    </div>
  );
}
