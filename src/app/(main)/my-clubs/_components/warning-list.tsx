"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClubWarningResType } from "@/schemaValidations/clubs.schema";
import { AlertTriangle } from "lucide-react";

interface Props {
  warnings: ClubWarningResType[];
}

export default function ClubWarningDialog({ warnings }: Props) {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative inline-flex items-center">
          {/* Nút có icon + label */}
          <div
            className="
        flex 
        items-center 
        gap-2
        whitespace-nowrap 
        rounded-md 
        px-3 
        py-1.5 
        text-sm 
        font-semibold 
        shadow-lg 
        bg-rose-600 
        text-white 
        dark:bg-rose-700 
        dark:text-white 
        transition 
        duration-200 
        ease-out 
        hover:bg-rose-700 
        dark:hover:bg-rose-600 
        hover:scale-105 
        hover:shadow-xl
        cursor-pointer
      "
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Xem cảnh báo</span>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Xem danh sách cảnh báo từ CLB
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* existing warnings list */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Lịch sử cảnh báo
            </h4>

            {warnings.length === 0 ? (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Chưa có cảnh báo nào.
              </div>
            ) : (
              <div className="mt-2 space-y-3 max-h-64 overflow-auto pr-2">
                {warnings.map((w) => (
                  <div
                    key={w.id}
                    className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 rounded-lg border p-4 shadow-sm transition-all ${
                      w.status === "ACTIVE"
                        ? "border-amber-300 bg-amber-50/70 dark:border-amber-700 dark:bg-amber-500/10"
                        : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                    }`}
                  >
                    {/* Left section - reason + status icon */}
                    <div className="flex items-start gap-3 w-full sm:w-auto">
                      <div
                        className={`mt-1 flex-shrink-0 rounded-full p-1.5 ${
                          w.status === "ACTIVE"
                            ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                            : "bg-gray-500/10 text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug">
                          {w.reason || "—"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {w.createdAt
                            ? new Date(w.createdAt).toLocaleString()
                            : "Không rõ thời gian"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center gap-4 pt-6">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {warnings.length > 0
              ? `${warnings.length} cảnh báo`
              : "Chưa có cảnh báo"}
          </div>

          <div className="flex gap-2">
            {/* Close always present */}
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Đóng
            </Button>

            {/* Show create / cancel controls only when form visible */}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
