"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function CustomPagination({
  totalPages,
  currentPage,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    if (page < 0 || page >= totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* Nút Trước */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={cn(
          "flex items-center gap-1 px-3 py-2 rounded-xl border border-transparent transition-all text-sm font-medium",
          "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-[0.97]",
          "dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
          currentPage === 0 &&
            "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900"
        )}
      >
        ← <span className="hidden sm:inline">Trước</span>
      </button>

      {/* Các trang */}
      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={cn(
              "px-3 py-2 rounded-lg border text-sm font-medium transition-all",
              page === currentPage
                ? "bg-blue-600 text-white border-blue-600 shadow-sm dark:bg-blue-500 dark:border-blue-500"
                : "bg-transparent border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            )}
          >
            {page + 1}
          </button>
        ))}
      </div>

      {/* Nút Sau */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className={cn(
          "flex items-center gap-1 px-3 py-2 rounded-xl border border-transparent transition-all text-sm font-medium",
          "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-[0.97]",
          "dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
          currentPage >= totalPages - 1 &&
            "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900"
        )}
      >
        <span className="hidden sm:inline">Sau</span> →
      </button>
    </div>
  );
}
