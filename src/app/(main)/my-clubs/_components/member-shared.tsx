"use client";

import React from "react";

export const Avatar = ({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) => (
  <div
    className={`relative flex shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-green-500 ${className}`}
  >
    <div className="flex h-full w-full items-center justify-center text-white font-semibold text-sm">
      {name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  </div>
);

export const MemberSkeleton = () => (
  <div className="animate-pulse p-4 border rounded-lg mb-3 bg-gray-100 dark:bg-gray-800">
    <div className="flex items-center gap-3 mb-3">
      <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
    <div className="flex gap-3">
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded flex-1"></div>
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded flex-1"></div>
    </div>
  </div>
);


