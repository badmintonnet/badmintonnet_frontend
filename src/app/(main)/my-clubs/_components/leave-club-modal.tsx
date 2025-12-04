"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, X, Check, Loader2 } from "lucide-react";
import clubServiceApi from "@/apiRequest/club";
import { useRouter } from "next/navigation";

// Component đơn file: chỉ dùng ICON, có hỗ trợ dark mode
export default function LeaveClubModal({ clubId }: { clubId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await clubServiceApi.outClubMember(clubId);
      router.replace("/my-clubs");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* NÚT RỜI CLB - CHỈ ICON */}
      <Button
        variant="destructive"
        size="icon"
        title="Rời CLB"
        onClick={() => setOpen(true)}
        className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
      >
        <LogOut className="w-5 h-5" />
      </Button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-xl border dark:border-gray-800 animate-scale">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <LogOut className="w-5 h-5 text-red-600 dark:text-red-500" />
              Rời CLB
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Bạn có chắc chắn muốn rời khỏi câu lạc bộ này? Hành động này không
              thể hoàn tác.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              {/* NÚT HỦY - ICON */}
              <Button
                variant="outline"
                size="icon"
                title="Hủy"
                onClick={() => setOpen(false)}
                className="dark:border-gray-700"
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </Button>

              {/* NÚT XÁC NHẬN - ICON */}
              <Button
                variant="destructive"
                size="icon"
                title="Xác nhận rời"
                onClick={handleConfirm}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
