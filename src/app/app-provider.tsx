"use client";
import { clientSessionToken } from "@/lib/http";
import { useState } from "react";

export default function AppProvider({
  children,
  inititalAccessToken = "",
  inititalRefreshToken = "",
  inititalDeviceId = "",
}: {
  children: React.ReactNode;
  inititalAccessToken?: string;
  inititalRefreshToken?: string;
  inititalDeviceId?: string;
}) {
  useState(() => {
    if (typeof window !== "undefined") {
      clientSessionToken.value = inititalAccessToken;
      clientSessionToken.refreshValue = inititalRefreshToken;
      clientSessionToken.deviceIdValue = inititalDeviceId;
    }
  });

  return <>{children}</>;
}
