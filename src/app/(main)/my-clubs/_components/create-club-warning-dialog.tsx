"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ClubWarningResType,
  ClubWarningSchema,
  ClubWarningType,
} from "@/schemaValidations/clubs.schema";
import clubServiceApi from "@/apiRequest/club";
import { AlertTriangle } from "lucide-react";

interface Props {
  clubId: string;
  memberId?: string; // optional nếu chọn từ danh sách thành viên
}

const warningTemplates = [
  {
    title: "Vắng mặt không lý do",
    text: "Bạn đã vắng mặt không lý do trong hoạt động gần đây của CLB. Vui lòng giải trình với ban chủ nhiệm.",
  },
  {
    title: "Không tích cực tham gia",
    text: "Bạn chưa tham gia đủ các hoạt động CLB trong thời gian gần đây. Đây là cảnh báo chính thức.",
  },
  {
    title: "Hành vi không phù hợp",
    text: "Hành vi của bạn trong buổi sinh hoạt vừa qua chưa phù hợp với nội quy CLB. Vui lòng rút kinh nghiệm.",
  },
];

export default function CreateClubWarningDialog({ clubId, memberId }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [warnings, setWarnings] = useState<ClubWarningResType[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const handleSelectTemplate = (templateText: string, title: string) => {
    setReason(templateText);
    setSelectedTemplate(title);
  };

  const fetchWarnings = async () => {
    try {
      const response = await clubServiceApi.getClubWarning(
        clubId,
        memberId || "",
      );
      // try to be defensive about shape
      setWarnings(response?.payload?.data ?? []);
    } catch {
      toast.error("Không thể tải cảnh báo. Vui lòng thử lại.");
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const body: ClubWarningType = {
        accountId: memberId,
        clubId,
        reason,
      } as unknown as ClubWarningType;

      const parsed = ClubWarningSchema.safeParse(body);
      if (!parsed.success) {
        toast.error("Vui lòng nhập đầy đủ thông tin cảnh báo");
        setLoading(false);
        return;
      }

      await clubServiceApi.createClubWarning(parsed.data);
      toast.success("Đã tạo cảnh báo cho thành viên");

      // refresh list
      await fetchWarnings();

      // reset input
      setReason("");
      setSelectedTemplate(null);
      // keep dialog open or close? keep open so user can add more (matches "có thể bấm thêm như cũ")
      // if want to close, uncomment next two lines:
      // setOpen(false);
      // router.refresh();
    } catch {
      toast.error("Không thể tạo cảnh báo. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (warningId: string) => {
    try {
      setLoading(true);
      await clubServiceApi.revokeWarning(warningId);
      toast.success("Đã thu hồi cảnh báo.");
      // refresh list
      await fetchWarnings();
    } catch {
      toast.error("Không thể thu hồi cảnh báo. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setReason("");
      setSelectedTemplate(null);
      setWarnings([]);
      setShowCreate(false);
    } else {
      // load warnings when dialog opens
      fetchWarnings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative inline-block">
          {/* icon only (no outer circular border) */}
          <Button
            size="sm"
            variant="ghost"
            className={
              "peer p-2 text-amber-600 dark:text-amber-300 " +
              "hover:text-amber-800 dark:hover:text-amber-50 transition-colors duration-150 ease-out " +
              "focus:outline-none focus:ring-2 focus:ring-amber-200 dark:focus:ring-amber-400"
            }
            aria-label="Thêm cảnh báo"
            title="Thêm cảnh báo"
          >
            <AlertTriangle className="w-5 h-5" />
          </Button>

          {/* Tooltip appears only when hovering the button */}
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="hidden peer-hover:flex transform-gpu scale-95 opacity-0 peer-hover:opacity-100 peer-hover:scale-100 transition-all duration-150 ease-out origin-bottom">
              <div className="mb-1 flex items-center justify-center">
                <div className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold shadow-lg bg-amber-600 text-white dark:bg-amber-700 dark:text-white">
                  Thêm cảnh báo
                </div>
              </div>
              <div className="flex justify-center">
                <svg
                  width="18"
                  height="10"
                  viewBox="0 0 14 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-amber-600 dark:text-amber-700"
                >
                  <path
                    d="M1 1L7 7L13 1"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Tạo cảnh báo cho thành viên
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

                    {/* Right section - action button or status */}
                    <div className="w-full sm:w-auto flex justify-between sm:justify-end items-center gap-3">
                      {w.status === "ACTIVE" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRevoke(w.id)}
                          disabled={loading}
                          className="border-rose-500/40 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                        >
                          Thu hồi
                        </Button>
                      ) : (
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400"></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* show "Thêm cảnh báo" button — form hidden until clicked */}
            <div className="mt-3">
              {!showCreate ? (
                <Button variant="outline" onClick={() => setShowCreate(true)}>
                  Thêm cảnh báo
                </Button>
              ) : null}
            </div>
          </div>

          {/* Form area: only shown when user clicks "Thêm cảnh báo" */}
          {showCreate && (
            <>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Chọn một mẫu cảnh báo hoặc nhập lý do tuỳ chỉnh bên dưới.
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {warningTemplates.map((t) => (
                    <button
                      key={t.title}
                      onClick={() => handleSelectTemplate(t.text, t.title)}
                      className={`px-4 py-2 text-sm rounded-md border transition ${
                        selectedTemplate === t.title
                          ? "bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-500/20"
                          : "bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {t.title}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Nhập lý do cảnh báo (tuỳ chọn)"
                  rows={5}
                  className="w-full text-sm"
                />
              </div>
            </>
          )}
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
            {showCreate ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowCreate(false);
                    setReason("");
                    setSelectedTemplate(null);
                  }}
                  disabled={loading}
                >
                  Hủy
                </Button>
                <Button
                  onClick={async () => {
                    await handleSubmit();
                    // keep form open for adding more, but clear input
                    setReason("");
                    setSelectedTemplate(null);
                  }}
                  disabled={loading}
                  className="bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-600 px-4 py-2"
                >
                  {loading ? "Đang xử lý..." : "Tạo cảnh báo"}
                </Button>
              </>
            ) : null}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
