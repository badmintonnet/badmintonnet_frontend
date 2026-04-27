"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TabWrapper({
  children,
  clubId,
}: {
  children: React.ReactNode;
  clubId: string;
}) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/my-clubs/${clubId}`);
  }, [clubId, router]);

  return <>{children}</>;
}
