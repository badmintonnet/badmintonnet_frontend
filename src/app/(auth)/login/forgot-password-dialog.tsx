"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import authApiRequest from "@/apiRequest/auth";

export default function ForgotPasswordDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Vui lòng nhập email hợp lệ");
      return;
    }
    try {
      setLoading(true);
      await authApiRequest.forgetPassword(email);
      toast.success(
        "Yêu cầu đặt lại mật khẩu đã được gửi. Kiểm tra email của bạn.",
      );
      setOpen(false);
      setEmail("");
    } catch {
      toast.error("Không thể gửi yêu cầu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-medium hover:underline transition-colors duration-300"
        >
          Quên mật khẩu?
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Đặt lại mật khẩu</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Nhập email được dùng để tạo tài khoản. Mật khẩu mới sẽ được gửi đến
            email của bạn.
          </p>

          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email của bạn"
            type="email"
            className="h-12"
          />
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Đang gửi..." : "Gửi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
