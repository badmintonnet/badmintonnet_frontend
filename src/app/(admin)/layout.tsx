"use client";

import { clientSessionToken } from "@/lib/http";
import { isAdmin } from "@/lib/utils";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "./_components/sidebar";
import { Header } from "./_components/header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = clientSessionToken.value;
      if (!token || !isAdmin(token)) {
        redirect("/login");
      } else {
        setIsAuthorized(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Sẽ redirect trong useEffect
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      <Header />
      <div className="flex h-screen pt-16">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
