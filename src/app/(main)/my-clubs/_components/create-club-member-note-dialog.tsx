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
import clubMemberNoteApi from "@/apiRequest/club-member-note";
import { FileText } from "lucide-react";
import {
  ClubMemberNoteType,
  CreateClubMemberNoteBodyType,
} from "@/schemaValidations/club-member-note.schema";

interface Props {
  clubId: string;
  memberId: string;
}

const noteTemplates = [
  {
    title: "Tích cực tham gia",
    text: "Thành viên tích cực tham gia các hoạt động CLB, nhiệt tình và có tinh thần trách nhiệm cao.",
  },
  {
    title: "Cần cải thiện",
    text: "Thành viên cần cải thiện sự tham gia và đóng góp vào các hoạt động CLB.",
  },
  {
    title: "Xuất sắc",
    text: "Thành viên có đóng góp xuất sắc, là gương mẫu cho các thành viên khác trong CLB.",
  },
];

export default function CreateClubMemberNoteDialog({
  clubId,
  memberId,
}: Props) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<ClubMemberNoteType[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  const handleSelectTemplate = (templateText: string, title: string) => {
    setComment(templateText);
    setSelectedTemplate(title);
  };

  const fetchNotes = async () => {
    try {
      const response = await clubMemberNoteApi.getAllNotes(clubId, memberId);
      setNotes(response?.payload?.data ?? []);
    } catch {
      toast.error("Không thể tải ghi chú. Vui lòng thử lại.");
    }
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error("Vui lòng nhập nội dung ghi chú");
      return;
    }

    try {
      setLoading(true);
      const body: CreateClubMemberNoteBodyType = {
        clubId,
        accountId: memberId,
        comment,
      };

      await clubMemberNoteApi.createNote(body);
      toast.success("Đã tạo ghi chú cho thành viên");

      // refresh list
      await fetchNotes();

      // reset input
      setComment("");
      setSelectedTemplate(null);
    } catch {
      toast.error("Không thể tạo ghi chú. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setComment("");
      setSelectedTemplate(null);
      setNotes([]);
      setShowCreate(false);
    } else {
      fetchNotes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative inline-block">
          <Button
            size="sm"
            variant="ghost"
            className={
              "peer p-2 text-blue-600 dark:text-blue-300 " +
              "hover:text-blue-800 dark:hover:text-blue-50 transition-colors duration-150 ease-out " +
              "focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400"
            }
            aria-label="Thêm ghi chú"
            title="Thêm ghi chú"
          >
            <FileText className="w-5 h-5" />
          </Button>

          <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="hidden peer-hover:flex transform-gpu scale-95 opacity-0 peer-hover:opacity-100 peer-hover:scale-100 transition-all duration-150 ease-out origin-bottom">
              <div className="mb-1 flex items-center justify-center">
                <div className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold shadow-lg bg-blue-600 text-white dark:bg-blue-700 dark:text-white">
                  Thêm ghi chú
                </div>
              </div>
              <div className="flex justify-center">
                <svg
                  width="18"
                  height="10"
                  viewBox="0 0 14 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-blue-600 dark:text-blue-700"
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
            Tạo ghi chú cho thành viên
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Lịch sử ghi chú
            </h4>

            {notes.length === 0 ? (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Chưa có ghi chú nào.
              </div>
            ) : (
              <div className="mt-2 space-y-3 max-h-64 overflow-auto pr-2">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="flex flex-col rounded-lg border border-blue-300 bg-blue-50/70 dark:border-blue-700 dark:bg-blue-500/10 p-4 shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0 rounded-full p-1.5 bg-blue-500/20 text-blue-700 dark:text-blue-300">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug">
                          {note.comment || "—"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {note.createdAt
                            ? new Date(note.createdAt).toLocaleString("vi-VN")
                            : "Không rõ thời gian"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3">
              {!showCreate ? (
                <Button variant="outline" onClick={() => setShowCreate(true)}>
                  Thêm ghi chú
                </Button>
              ) : null}
            </div>
          </div>

          {showCreate && (
            <>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Chọn một mẫu ghi chú hoặc nhập nội dung tuỳ chỉnh bên dưới.
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {noteTemplates.map((t) => (
                    <button
                      key={t.title}
                      onClick={() => handleSelectTemplate(t.text, t.title)}
                      className={`px-4 py-2 text-sm rounded-md border transition ${
                        selectedTemplate === t.title
                          ? "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-500/20"
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
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Nhập nội dung ghi chú"
                  rows={5}
                  className="w-full text-sm"
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center gap-4 pt-6">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {notes.length > 0 ? `${notes.length} ghi chú` : "Chưa có ghi chú"}
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Đóng
            </Button>

            {showCreate ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowCreate(false);
                    setComment("");
                    setSelectedTemplate(null);
                  }}
                  disabled={loading}
                >
                  Hủy
                </Button>
                <Button
                  onClick={async () => {
                    await handleSubmit();
                    setComment("");
                    setSelectedTemplate(null);
                  }}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 px-4 py-2"
                >
                  {loading ? "Đang xử lý..." : "Tạo ghi chú"}
                </Button>
              </>
            ) : null}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
