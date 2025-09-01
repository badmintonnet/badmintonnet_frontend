// components/active-navigation-link.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface ActiveNavigationLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function ActiveNavigationLink({
  href,
  children,
  className,
}: ActiveNavigationLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} legacyBehavior passHref>
      <NavigationMenuLink
        className={cn(
          navigationMenuTriggerStyle(),
          "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
          isActive &&
            "text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20",
          className
        )}
      >
        {children}
      </NavigationMenuLink>
    </Link>
  );
}
