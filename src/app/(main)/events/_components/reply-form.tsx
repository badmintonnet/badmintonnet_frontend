"use client";

import { useState } from "react";
import ratingApiRequest from "@/apiRequest/rating";
import { ReplyBodyType } from "@/schemaValidations/rating.schema";
import { useRouter } from "next/navigation";

export default function ReplyForm({ ratingId }: { ratingId: string }) {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async () => {
    if (!reply.trim()) return;
    try {
      const body: ReplyBodyType = {
        ratingId,
        replyComment: reply,
      };
      setLoading(true);
      await ratingApiRequest.postReply(body);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <input
        type="text"
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Trả lời đánh giá..."
        className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-3 py-1.5 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
      >
        {loading ? "Đang gửi..." : "Gửi"}
      </button>
    </div>
  );
}
