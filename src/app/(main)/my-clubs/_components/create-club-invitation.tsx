"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import clubInvitationApiRequest from "@/apiRequest/club-invitation";
import {
  createClubInvitation,
  CreateClubInvitationType,
} from "@/schemaValidations/club-invitation";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function ClubInvitationDialog({
  initialValues,
}: {
  initialValues?: Partial<CreateClubInvitationType>;
}) {
  const [open, setOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<CreateClubInvitationType>({
    resolver: zodResolver(createClubInvitation),
    defaultValues: {
      receiverId: initialValues?.receiverId || "",
      clubId: initialValues?.clubId || "",
      message: initialValues?.message || "",
    },
  });

  useEffect(() => {
    form.reset({
      receiverId: initialValues?.receiverId || "",
      clubId: initialValues?.clubId || "",
      message: initialValues?.message || "",
    });
    setSelectedSample(null);
  }, [initialValues, open]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data: CreateClubInvitationType) => {
    try {
      await clubInvitationApiRequest.sendClubInvitation(data);
      toast.success("Lời mời đã được gửi thành công.");
      router.refresh();
      setOpen(false);
      form.reset();
    } catch {
      toast.error("Đã xảy ra lỗi khi gửi lời mời. Vui lòng thử lại.");
    }
  };

  // 🧠 Mẫu lời mời
  const sampleMessages = [
    "CLB chúng tôi rất vui nếu bạn tham gia để cùng luyện tập và giao lưu.",
    "Chúng tôi tin rằng bạn sẽ là một thành viên tuyệt vời của CLB.",
    "CLB đang mở rộng đội nhóm và rất mong nhận được sự tham gia của bạn.",
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {
          <Button
            variant="default"
            size="sm"
            className={cn(
              "rounded-md font-medium shadow-sm border transition-colors text-sm px-3 py-1",
              // light
              "bg-blue-600 text-white hover:bg-blue-700",
              // dark
              "dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white",
              // focus
              "focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-400"
            )}
          >
            Mời
          </Button>
        }
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl shadow-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center text-foreground dark:text-gray-100">
            Gửi lời mời tham gia CLB
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 px-4 pb-4"
        >
          {/* Nhập lời nhắn */}
          <div>
            <Label className="text-sm font-medium text-foreground dark:text-gray-200">
              Lời nhắn (tuỳ chọn)
            </Label>
            <Textarea
              id="message"
              rows={4}
              placeholder="Nhập lời nhắn bạn muốn gửi đến người được mời..."
              className="mt-2 rounded-lg border bg-background dark:bg-gray-900 text-sm resize-none dark:text-white"
              {...form.register("message")}
            />
            <p className="text-xs text-muted-foreground mt-1 dark:text-gray-400">
              Bạn có thể chọn nhanh một mẫu bên dưới hoặc tự viết lời mời riêng.
            </p>
          </div>

          {/* Gợi ý lời mời */}
          <div className="grid gap-2">
            {sampleMessages.map((msg, idx) => (
              <div
                key={idx}
                onClick={() => {
                  form.setValue("message", msg);
                  setSelectedSample(msg);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    form.setValue("message", msg);
                    setSelectedSample(msg);
                  }
                }}
                className={cn(
                  "cursor-pointer rounded-md border p-3 text-sm leading-relaxed transition-all duration-150 select-none",
                  // light hover/active
                  "hover:bg-slate-100 hover:text-slate-900",
                  // dark hover
                  "dark:hover:bg-slate-700 dark:hover:text-white",
                  // selected
                  selectedSample === msg
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-600/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                )}
              >
                {msg}
              </div>
            ))}
          </div>

          {/* Nút gửi */}
          <DialogFooter>
            <Button
              type="submit"
              className={cn(
                "w-full rounded-md font-medium shadow-sm transition-colors text-sm py-2",
                "bg-blue-600 text-white hover:bg-blue-700",
                "dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white"
              )}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Đang gửi..." : "Gửi lời mời"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
