"use client";

import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function RatingInfoTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="ml-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Info className="w-4 h-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-sm leading-relaxed bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-md p-3">
          <p>Điểm đánh giá sự kiện được tính theo trọng số:</p>
          <ul className="list-disc list-inside mt-1 space-y-0.5">
            <li>30% từ thành viên CLB</li>
            <li>70% từ khách vãng lai</li>
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
