"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import tournamentApiRequest from "@/apiRequest/tournament";
import { useRouter } from "next/navigation";
import CategoryBreadcrumb from "@/app/(main)/tournaments/[id]/categories/[categoryId]/_components/category-breadcrumb";
import CategoryHeader from "@/app/(main)/tournaments/[id]/categories/[categoryId]/_components/category-header";
import CategoryStats from "@/app/(main)/tournaments/[id]/categories/[categoryId]/_components/category-stats";
import CategoryTabs from "@/app/(main)/tournaments/[id]/categories/[categoryId]/_components/category-tabs";
import { CategoryDetail } from "@/schemaValidations/tournament.schema";
interface CategoryDetailProps {
  tournamentId: string;
  categoryId: string;
}

export default function TournamentCategoryDetail({
  tournamentId,
  categoryId,
}: CategoryDetailProps) {
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategoryDetail = async () => {
      try {
        const response = await tournamentApiRequest.getCategoryDetail(
          categoryId
        );
        setCategory(response.payload.data);
        console.log("Fetched category detail:", response.payload.data);
      } catch (error) {
        toast.error("Không thể tải thông tin hạng mục");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetail();
  }, [tournamentId, categoryId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Không tìm thấy hạng mục
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CategoryBreadcrumb
        tournamentId={tournamentId}
        tournamentName={category.tournamentName}
        categoryLabel={category.category}
      />
      <CategoryHeader category={category} categoryId={categoryId} />
      <CategoryStats category={category} />
      <CategoryTabs category={category} />
    </div>
  );
}
