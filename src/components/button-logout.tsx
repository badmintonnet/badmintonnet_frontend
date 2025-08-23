"use client";

import authApiRequest from "@/apiRequest/auth";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await authApiRequest.logout();
      window.location.href = "/"; // ép redirect về trang chủ hoặc login
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      className="bg-red-600 text-white hover:bg-red-700"
    >
      Đăng xuất
    </Button>
  );
}
