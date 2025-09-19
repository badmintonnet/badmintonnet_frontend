"use client";
import Link from "next/link";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Trang chủ", href: "/" },
  { name: "Hoạt động", href: "/events" },
  { name: "Câu lạc bộ", href: "/clubs" },
  { name: "Về chúng tôi", href: "/about" },
];

export default function HeaderNav() {
  const pathname = usePathname();
  return (
    <NavigationMenu.Root className="hidden md:block">
      <NavigationMenu.List className="flex space-x-8 items-center">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <NavigationMenu.Item key={item.name} className="flex-shrink-0">
              <NavigationMenu.Link asChild>
                <Link
                  href={item.href}
                  className={`
                    whitespace-nowrap
                    hover:text-blue-600 dark:hover:text-blue-400
                    transition-colors px-2 py-1
                    ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400 underline underline-offset-4 font-semibold"
                        : "text-gray-700 dark:text-gray-200"
                    }
                `}
                >
                  {item.name}
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
