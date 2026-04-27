"use client";

import { Button } from "@/components/ui/button";
import { Bell, LogOut, Moon, Search, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import authApiRequest from "@/apiRequest/auth";

export function Header() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    try {
      await authApiRequest.logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center">
          <span className="text-3xl font-extrabold italic text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-400 dark:from-green-400 dark:to-blue-300 group-hover:from-blue-700 group-hover:to-blue-500 dark:group-hover:from-blue-500 dark:group-hover:to-blue-400 tracking-tighter transition-all duration-300 drop-shadow-md">
            BadmintonNet Admin
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="py-2 pl-10 pr-4 w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full h-9 w-9 p-0"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-gray-400 hover:text-gray-300" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600 hover:text-gray-700" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-9 w-9 p-0 relative"
          >
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9 p-0 overflow-hidden"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <Image
                src="/user.png"
                alt="User"
                width={36}
                height={36}
                className="rounded-full"
              />
            </Button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Admin
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    admin@gmail.com
                  </p>
                </div>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  onClick={() => router.push("/admin/profile")}
                >
                  <User className="h-4 w-4" />
                  <span>Hồ sơ</span>
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
