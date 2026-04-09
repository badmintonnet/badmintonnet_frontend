"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trophy, CheckCircle } from "lucide-react";
import accountApiRequest from "@/apiRequest/account";
import { PlayerRatingType } from "@/schemaValidations/account.schema";
import clubServiceApi from "@/apiRequest/club";
import { useRouter } from "next/navigation";

interface Props {
  clubId: string;
  memberId: string;
  ratingVerified: boolean;
}

export default function VerifyMemberRatingDialog({
  clubId,
  memberId,
  ratingVerified,
}: Props) {
  const [open, setOpen] = useState(false);
  const [detailData, setDetailData] = useState<PlayerRatingType | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const router = useRouter();
  const fetchDetail = async () => {
    try {
      setFetching(true);
      const res = await accountApiRequest.getClubMemberRating(memberId);
      setDetailData(res?.payload?.data ?? null);
    } catch {
      toast.error("Không thể tải đánh giá.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchDetail();
      console.log("Fetching rating detail for ratingVerified:", ratingVerified);
    } else {
      setDetailData(null);
    }
  }, [open]);

  const handleVerify = async () => {
    try {
      setLoading(true);

      await clubServiceApi.verifyMemberRating(clubId, memberId);

      toast.success("Đã xác nhận đánh giá.");
      router.refresh();
      setOpen(false);
    } catch {
      toast.error("Thao tác thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const renderProgress = (value: number) => (
    <div className="mt-1 h-2 bg-gray-200 rounded-full">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500"
        style={{ width: `${(value / 5) * 100}%` }}
      />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* icon trigger to save space and look cleaner */}
        <Button
          variant="ghost"
          size="icon"
          title="Xác minh đánh giá"
          className="text-green-600 hover:bg-green-100 dark:hover:bg-gray-700 transition-colors"
        >
          <CheckCircle className="w-5 h-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Trophy className="w-5 h-5 text-emerald-600" />
            Đánh giá tổng quan
          </DialogTitle>
        </DialogHeader>

        {fetching ? (
          <div className="text-center py-6 text-sm text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : !detailData ? (
          <div className="text-center py-6 text-sm text-gray-500">
            Không có dữ liệu.
          </div>
        ) : (
          // wrap details in card-like container for cleaner look
          <div className="space-y-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            {/* Overall Score */}
            <div className="flex flex-col items-center">
              <div className="relative w-28 h-28">
                <svg
                  className="w-28 h-28 transform -rotate-90"
                  viewBox="0 0 128 128"
                >
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-gray-200"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    fill="none"
                    stroke="url(#verifyGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${
                      (detailData.overallScore / 5) * 326.7
                    } 326.7`}
                  />
                  <defs>
                    <linearGradient
                      id="verifyGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {detailData.overallScore.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">/5.0</div>
                </div>
              </div>

              <div className="mt-3 px-4 py-1 text-sm font-semibold rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
                {detailData.skillLevel}
              </div>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Kinh nghiệm", value: detailData.experience },
                {
                  label: "Kỹ thuật",
                  value: detailData.averageTechnicalScore,
                },
                { label: "Thể lực", value: detailData.stamina },
                { label: "Chiến thuật", value: detailData.tactics },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3 rounded-lg border bg-gray-50"
                >
                  <div className="text-xs text-gray-500">{item.label}</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {item.value.toFixed(1)}
                  </div>
                  {renderProgress(item.value)}
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-2 pt-4">
          {ratingVerified ? (
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Đánh giá đã được xác nhận.
            </span>
          ) : (
            <Button
              onClick={() => handleVerify()}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
