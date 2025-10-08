"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import accountApiRequest from "@/apiRequest/account";
import { ReputationHistoryType } from "@/schemaValidations/account.schema";
import { CalendarClock } from "lucide-react";

export default function ReputationHistoryDialog() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ReputationHistoryType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      accountApiRequest
        .getReputationHistory()
        .then((res) => {
          setItems(res.payload.data ?? []);
        })
        .catch(() => setItems([]))
        .finally(() => setLoading(false));
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium
            bg-gradient-to-r from-white to-gray-50 text-gray-900 border-gray-200 
            hover:from-gray-50 hover:to-gray-100 hover:border-gray-300 
            hover:shadow-md transition-all duration-200
            dark:from-gray-800 dark:to-gray-800/80 dark:text-white 
            dark:border-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-700/80
            dark:hover:border-gray-600 dark:hover:shadow-lg dark:hover:shadow-gray-900/20
            flex items-center gap-2"
        >
          <CalendarClock className="w-4 h-4 " />
          <span>Lịch sử uy tín</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-lg p-5 
        bg-white border border-gray-200 
        rounded-xl shadow-2xl 
        dark:bg-gradient-to-br dark:from-gray-900/95 dark:to-gray-800/95 
        dark:border-gray-700/50 
        transition-all duration-200"
      >
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Lịch sử thay đổi điểm uy tín
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          {loading && (
            <div className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Đang tải...
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Chưa có lịch sử thay đổi uy tín.
            </div>
          )}

          {!loading && items.length > 0 && (
            <ul className="space-y-3 max-h-72 overflow-y-auto pr-2">
              {items.map((it) => {
                const positive = it.change > 0;
                return (
                  <li
                    key={it.id}
                    className="flex items-start justify-between gap-3 
                    p-3 rounded-lg 
                    border border-gray-200 bg-gray-50 hover:bg-gray-100 
                    dark:border-gray-700/50 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 
                    transition-colors duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3">
                        <span
                          className={`px-2 py-0.5 text-xs font-semibold rounded border
                            ${
                              positive
                                ? "text-green-700 bg-green-100 border-green-200 dark:text-green-300 dark:bg-green-900/40 dark:border-green-800"
                                : "text-red-700 bg-red-100 border-red-200 dark:text-red-300 dark:bg-red-900/40 dark:border-red-800"
                            }`}
                        >
                          {positive ? `+${it.change}` : it.change}
                        </span>

                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 break-words whitespace-normal max-w-full">
                          {it.reason ?? "Không có lý do"}
                        </p>
                      </div>

                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {new Date(it.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
