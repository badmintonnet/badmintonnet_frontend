"use client";

import React from "react";
import ApprovedMembers from "./approved-members";
import PendingMembers from "./pending-members";

export default function ClubMembers({
  id,
  accessToken,
  isOwner = false,
}: {
  id: string;
  accessToken: string;
  isOwner?: boolean;
}) {
  return (
    <div className="space-y-6">
      {isOwner && <PendingMembers id={id} accessToken={accessToken} isOwner={isOwner} />}
      <ApprovedMembers id={id} accessToken={accessToken} />
    </div>
  );
}
