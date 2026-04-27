import CategoryBreadcrumb from "@/app/(main)/tournaments/[id]/categories/[categoryId]/_components/category-breadcrumb";
import CategoryHeader from "@/app/(main)/tournaments/[id]/categories/[categoryId]/_components/category-header";
import CategoryStats from "@/app/(main)/tournaments/[id]/categories/[categoryId]/_components/category-stats";
import CategoryTabs from "@/app/(main)/tournaments/[id]/categories/[categoryId]/_components/category-tabs";
import tournamentApiRequest from "@/apiRequest/tournament";
import { CategoryDetail } from "@/schemaValidations/tournament.schema";
import PaymentSection from "@/app/(main)/tournaments/[id]/categories/[categoryId]/_components/payment-section";
import { CheckCircle2 } from "lucide-react";
import { cookies } from "next/headers";
interface CategoryDetailProps {
  tournamentId: string;
  categoryId: string;
}

export default async function TournamentCategoryDetail({
  tournamentId,
  categoryId,
}: CategoryDetailProps) {
  let category: CategoryDetail | null = null;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  try {
    const response = await tournamentApiRequest.getCategoryDetail(
      categoryId,
      accessToken?.value,
    );
    category = response.payload.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết hạng mục:", error);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600 dark:text-gray-400">
          Không thể tải thông tin hạng mục
        </p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600 dark:text-gray-400">
          Không tìm thấy hạng mục
        </p>
      </div>
    );
  }

  const isApproved = category.participantStatus === "APPROVED";
  const hasPaid = category.paid;

  return (
    <div className="space-y-6">
      <CategoryBreadcrumb
        tournamentId={tournamentId}
        tournamentName={category.tournamentName}
        categoryLabel={category.category}
      />

      <CategoryHeader category={category} categoryId={categoryId} />

      {/* Thông báo đã thanh toán - Phiên bản đơn giản */}
      {isApproved && hasPaid && (
        <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-400">
                ✓ Đã thanh toán lệ phí tham gia
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Số tiền:{" "}
                <span className="font-semibold">
                  {category.registrationFee.toLocaleString("vi-VN")} VNĐ
                </span>
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                Đăng ký của bạn đã được xác nhận. Chúc bạn thi đấu thành công!
                🎉
              </p>
            </div>
          </div>
        </div>
      )}

      <PaymentSection
        categoryId={categoryId}
        tournamentId={tournamentId}
        registrationFee={category.registrationFee}
        isApproved={isApproved}
        hasPaid={hasPaid}
      />

      <CategoryStats category={category} />

      {/* ⚠ Nếu CategoryTabs dùng hook → phải "use client" */}
      <CategoryTabs category={category} />
    </div>
  );
}
