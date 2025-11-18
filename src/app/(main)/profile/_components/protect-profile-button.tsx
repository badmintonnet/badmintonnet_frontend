"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import accountApiRequest from "@/apiRequest/account";
import { ShieldCheck } from "lucide-react";

interface ProtectProfileButtonProps {
  defaultValue: boolean; // trạng thái ban đầu (true = đang bật bảo vệ)
}

const ProtectProfileButton: React.FC<ProtectProfileButtonProps> = ({
  defaultValue,
}) => {
  const [isProtected, setIsProtected] = useState(defaultValue);
  const [loading, setLoading] = useState(false);

  const handleToggleProtect = async () => {
    try {
      setLoading(true);
      const newStatus = !isProtected;
      await accountApiRequest.protectProfile();
      setIsProtected(newStatus);

      toast.success(
        newStatus
          ? "Đã bật bảo vệ trang cá nhân"
          : "Đã tắt bảo vệ trang cá nhân"
      );
    } catch (err) {
      toast.error("❌ Có lỗi xảy ra khi cập nhật trạng thái!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-block">
      {/* icon-only shield button with tooltip (adapts to light/dark) */}
      <Button
        onClick={handleToggleProtect}
        disabled={loading}
        variant="ghost"
        className={
          "peer p-2 rounded-md focus:outline-none focus:ring-2 transition-colors duration-150 " +
          "hover:bg-gray-100 dark:hover:bg-gray-800/40"
        }
        aria-label="Bảo vệ trang cá nhân"
        title="Bảo vệ trang cá nhân"
      >
        <ShieldCheck
          className={`w-10 h-10 transition-colors duration-150 ${
            isProtected
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-gray-600 dark:text-gray-300"
          }`}
        />
      </Button>

      {/* tooltip shown only when hovering the button */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="hidden peer-hover:flex transform-gpu scale-95 opacity-0 peer-hover:opacity-100 peer-hover:scale-100 transition-all duration-150 ease-out origin-bottom">
          <div className="mb-1 flex items-center justify-center">
            <div className="whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium shadow-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900">
              {isProtected
                ? "Đang bảo vệ trang cá nhân"
                : "Bật bảo vệ trang cá nhân"}
            </div>
          </div>
          <div className="flex justify-center">
            <svg
              width="14"
              height="8"
              viewBox="0 0 14 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-900 dark:text-gray-100"
            >
              <path
                d="M1 1L7 7L13 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectProfileButton;
