import "@ant-design/v5-patch-for-react-19";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { cookies } from "next/headers";
import AppProvider from "@/app/app-provider";
import RefreshToken from "@/components/refresh-token";
import { AntdRegistry } from "@ant-design/nextjs-registry";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BadmintonNet",
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
      <body className={`${inter.variable} antialiased  `}>
        <Toaster />
        <RefreshToken />
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
            <AntdRegistry>{children}</AntdRegistry>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
