// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { Toaster } from "sonner";
import { cookies } from "next/headers";
import { clientSessionToken } from "@/lib/http";
import AppProvider from "@/app/app-provider";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SportNet",
  description: "Ứng dụng kết nối người hâm mộ thể thao",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const refreshToken = cookieStore.get("refreshToken")?.value || "";
  const deviceId = cookieStore.get("deviceId")?.value || "";
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased  pt-16`}>
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider
            inititalAccessToken={accessToken}
            inititalRefreshToken={refreshToken}
            inititalDeviceId={deviceId}
          >
            {children}
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
