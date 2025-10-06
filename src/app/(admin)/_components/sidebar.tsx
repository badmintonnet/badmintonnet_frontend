"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  ShieldAlert,
  BarChart3,
  FileText,
  MessageSquare,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Quản lý người dùng",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Quản lý câu lạc bộ",
    href: "/admin/clubs",
    icon: Users,
  },
  {
    title: "Quản lý sự kiện",
    href: "/admin/events",
    icon: Calendar,
  },
  {
    title: "Báo cáo thống kê",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Quản lý nội dung",
    href: "/admin/content",
    icon: FileText,
  },
  {
    title: "Phản hồi người dùng",
    href: "/admin/feedback",
    icon: MessageSquare,
  },
  {
    title: "Cài đặt hệ thống",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Quản lý quyền",
    href: "/admin/roles",
    icon: ShieldAlert,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Admin Panel
        </h2>
      </div>
      <nav className="mt-2">
        <ul className="space-y-1 px-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
