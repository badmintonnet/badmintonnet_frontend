import { Suspense } from "react";
import CategoryDetail from "./_components/category-detail";
import { Skeleton } from "@/components/ui/skeleton";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string; categoryId: string }>;
}) {
  const { id, categoryId } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<CategoryDetailSkeleton />}>
        <CategoryDetail tournamentId={id} categoryId={categoryId} />
      </Suspense>
    </div>
  );
}

function CategoryDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
