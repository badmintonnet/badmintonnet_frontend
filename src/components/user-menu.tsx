"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, UserCircle, Users, LogOut, Calendar } from "lucide-react";
import LogoutButton from "@/components/button-logout";
import { useState } from "react";
import ChangePasswordModal from "@/components/change-password-modal";

export default function UserMenu() {
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <User className="h-5 w-5" />
            <span className="sr-only">Mở menu tài khoản</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-64 p-2 shadow-lg border border-gray-200 dark:border-gray-700"
          sideOffset={8}
        >
          {/* Header */}
          <DropdownMenuLabel className="px-3 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
            Tài khoản của bạn
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-1" />

          {/* Menu Items */}
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-150"
            >
              <UserCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span>Thông tin cá nhân</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer">
            <Link
              href="/my-clubs"
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-150"
            >
              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span>CLB của tôi</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer">
            <Link
              href="/events/my-joined-events"
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-150"
            >
              <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span>Hoạt động đã tham gia</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <button
              onClick={() => setOpenPasswordModal(true)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-150 w-full"
            >
              <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span>Đổi mật khẩu</span>
            </button>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1" />

          {/* Logout Section */}
          <DropdownMenuItem className="p-0">
            <div className="w-full">
              <LogoutButton />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ChangePasswordModal
        isOpen={openPasswordModal}
        onClose={() => setOpenPasswordModal(false)}
      />
    </>
  );
}
