"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ClubEventCancellationType } from "@/schemaValidations/event-cancellation.schema";
import cancelReasonRequest from "@/apiRequest/cancel-event-reason";
import { Mail, Calendar, Crown } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  eventId: string;
  token?: string;
}

type CancellationItem = ClubEventCancellationType;

export default function EventCancellationList({ eventId, token }: Props) {
  const [items, setItems] = useState<CancellationItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<CancellationItem | null>(null);
  const [open, setOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const router = useRouter();

  const fetchList = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const res = await cancelReasonRequest.getEventCancellations(
        eventId,
        token || ""
      );
      const list: CancellationItem[] = res?.payload?.data || [];
      setItems(list);
    } catch (e) {
      console.error("Load cancellations failed", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [eventId, token]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // status dựa trên approved: boolean | null
  const statusBadge = (approved?: boolean | null) => {
    if (approved === null || typeof approved === "undefined") {
      return (
        <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium px-3 py-1 text-xs">
          Chờ duyệt
        </Badge>
      );
    }
    if (approved === true) {
      return (
        <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium px-3 py-1 text-xs">
          Đã duyệt
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-800 font-medium px-3 py-1 text-xs">
        Từ chối
      </Badge>
    );
  };

  const formatDate = (d?: string | Date) => {
    if (!d) return "-";
    try {
      const iso =
        typeof d === "string"
          ? d
          : d instanceof Date
          ? d.toISOString()
          : String(d);
      const normalized = iso.replace(/\.(\d{3})\d+/, ".$1");
      return new Date(normalized).toLocaleString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(d);
    }
  };

  const handleReview = async (cancellationId: string, approve: boolean) => {
    if (!cancellationId) return;
    setActionLoadingId(cancellationId);
    try {
      await cancelReasonRequest.reviewCancellation(
        cancellationId,
        approve,
        token || ""
      );
      router.refresh();
      // if dialog open and selected item was the one reviewed, refresh selected
      if (selected?.cancellationId === cancellationId) {
        const refreshed = (
          await cancelReasonRequest.getEventCancellations(eventId, token || "")
        )?.payload?.data as CancellationItem[] | undefined;
        const updated = refreshed?.find(
          (i) => i.cancellationId === cancellationId
        );
        setSelected((prev) => (updated ? updated : prev));
      }
    } catch (e) {
      console.error("Review cancellation failed", e);
      // optionally show toast (not included)
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <p className="text-sm text-gray-600 dark:text-gray-300">Đang tải...</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
        <p className="text-sm text-amber-700 dark:text-amber-300 text-center">
          Chưa có ai hủy tham gia hoạt động.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {items.map((it) => (
        <div
          key={it.cancellationId}
          role="button"
          onClick={() => {
            setSelected(it);
            setOpen(true);
          }}
          className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600"></div>

          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl ring-4 ring-gray-100 dark:ring-gray-800">
                  <Image
                    src={(it.avatarUrl as string) || "/user.png"}
                    alt={it.fullName || "User"}
                    priority
                    width={128}
                    height={128}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 flex-1">
                    {it.accountSlug || it.accountSlug ? (
                      <Link href={`/profile/${it.accountSlug}`}>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white truncate hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                          {it.fullName || "Người dùng"}
                        </h4>
                      </Link>
                    ) : (
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {it.fullName || "Người dùng"}
                      </h4>
                    )}
                  </div>

                  <div className="flex-shrink-0 ml-2">
                    {statusBadge(it.approved)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {it.cancelDate ? formatDate(it.cancelDate) : "-"}
                    </span>
                  </div>

                  {it.lateCancellation && (
                    <div className="flex items-center gap-2">
                      <Crown className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Hủy trễ
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    {it.reason ? it.reason : "Không có lý do"}
                  </div>

                  <div className="text-xs text-gray-400 ml-2">
                    {it.approved === null ? (
                      <>
                        <Button
                          size="sm"
                          className="mr-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReview(it.cancellationId, true);
                          }}
                          disabled={actionLoadingId === it.cancellationId}
                        >
                          {actionLoadingId === it.cancellationId
                            ? "Đang..."
                            : "Phê duyệt"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReview(it.cancellationId, false);
                          }}
                          disabled={actionLoadingId === it.cancellationId}
                        >
                          {actionLoadingId === it.cancellationId
                            ? "Đang..."
                            : "Từ chối"}
                        </Button>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">
                        {it.reviewedBy ? `Bởi ${it.reviewedBy}` : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết lý do hủy</DialogTitle>
            <DialogDescription>
              Thông tin hủy tham gia sự kiện
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Họ và tên
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {selected?.fullName || "-"}
            </p>

            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Lý do</p>
              <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line">
                {selected?.reason || "Không có lý do"}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ngày hủy
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selected?.cancelDate ? formatDate(selected.cancelDate) : "-"}
                </p>

                {selected?.reviewedAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    Phê duyệt lúc: {formatDate(selected.reviewedAt)}
                  </p>
                )}
                {selected?.reviewedBy && (
                  <p className="text-xs text-gray-500 mt-1">
                    Người duyệt: {selected.reviewedBy}
                  </p>
                )}
              </div>

              <div>{statusBadge(selected?.approved)}</div>
            </div>
          </div>

          <DialogFooter>
            {selected?.approved === null && (
              <div className="flex gap-2 mr-auto">
                <Button
                  onClick={() =>
                    selected && handleReview(selected.cancellationId, true)
                  }
                  disabled={actionLoadingId === selected?.cancellationId}
                >
                  {actionLoadingId === selected?.cancellationId
                    ? "Đang..."
                    : "Phê duyệt"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() =>
                    selected && handleReview(selected.cancellationId, false)
                  }
                  disabled={actionLoadingId === selected?.cancellationId}
                >
                  {actionLoadingId === selected?.cancellationId
                    ? "Đang..."
                    : "Từ chối"}
                </Button>
              </div>
            )}
            <DialogClose asChild>
              <Button variant="ghost">Đóng</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
