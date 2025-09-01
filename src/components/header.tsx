import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ModeToggle } from "@/components/dark-toggle";
import { cookies } from "next/headers";
import MobileMenu from "@/components/mobile-menu";
import UserMenu from "@/components/user-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ActiveNavigationLink } from "@/components/active-navigation-link";

export default async function Header() {
  const navItems = [
    { name: "Trang chủ", href: "/" },
    { name: "Hoạt động", href: "/events" },
    { name: "Câu lạc bộ", href: "/clubs" },
    { name: "Về chúng tôi", href: "/about" },
    { name: "Liên hệ", href: "/contact" },
  ];

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <span className="text-3xl font-extrabold italic text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-400 dark:from-green-400 dark:to-blue-300 group-hover:from-blue-700 group-hover:to-blue-500 dark:group-hover:from-blue-500 dark:group-hover:to-blue-400 tracking-tighter transition-all duration-300 drop-shadow-md">
            BadmintonNet
          </span>
        </Link>

        {/* Menu Desktop với NavigationMenu */}
        <nav className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <ActiveNavigationLink href={item.href}>
                    {item.name}
                  </ActiveNavigationLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Search Icon */}
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Link href="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          {/* Nếu chưa login */}
          {!accessToken && (
            <div className="hidden md:flex space-x-2">
              <Button
                asChild
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/50"
              >
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button
                asChild
                className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500"
              >
                <Link href="/signup">Đăng ký</Link>
              </Button>
            </div>
          )}

          {/* Nếu đã login */}
          {accessToken && <UserMenu />}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <MobileMenu navItems={navItems} accessToken={!!accessToken} />
          </div>

          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
