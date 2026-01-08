"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, Clock, CheckCircle, XCircle } from "lucide-react";
import tournamentApiRequest from "@/apiRequest/tournament";
import { toast } from "sonner";
import { TournamentCategoryParticipant } from "@/schemaValidations/tournament.schema";
import Link from "next/link";

interface CategoryParticipantsProps {
  categoryId: string;
  isAdmin: boolean;
}

export default function CategoryParticipants({
  categoryId,
  isAdmin,
}: CategoryParticipantsProps) {
  const [approvedParticipants, setApprovedParticipants] = useState<
    TournamentCategoryParticipant[]
  >([]);
  const [pendingParticipants, setPendingParticipants] = useState<
    TournamentCategoryParticipant[]
  >([]);
  const [loadingApproved, setLoadingApproved] = useState(true);
  const [loadingPending, setLoadingPending] = useState(true);
  const [totalApproved, setTotalApproved] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchApprovedParticipants = useCallback(async () => {
    try {
      const response = await tournamentApiRequest.getAllParticipants(
        categoryId,
        ["APPROVED"],
        0,
        100
      );
      setApprovedParticipants(response.payload.data.content || []);
      setTotalApproved(response.payload.data.totalElements || 0);
    } catch {
      toast.error("Không thể tải danh sách người đã duyệt");
    } finally {
      setLoadingApproved(false);
    }
  }, [categoryId]);

  const fetchPendingParticipants = useCallback(async () => {
    if (!isAdmin) return;

    try {
      const response = await tournamentApiRequest.getAllParticipants(
        categoryId,
        ["PENDING"],
        0,
        100
      );
      setPendingParticipants(response.payload.data.content || []);
      setTotalPending(response.payload.data.totalElements || 0);
    } catch {
      toast.error("Không thể tải danh sách chờ duyệt");
    } finally {
      setLoadingPending(false);
    }
  }, [categoryId, isAdmin]);

  useEffect(() => {
    fetchApprovedParticipants();
    if (isAdmin) {
      fetchPendingParticipants();
    }
  }, [fetchApprovedParticipants, fetchPendingParticipants, isAdmin]);

  const handleApprove = async (participantId: string) => {
    setProcessingId(participantId);
    try {
      await tournamentApiRequest.approveParticipant(participantId);
      toast.success("Đã duyệt thành công!");
      // Refresh both lists
      fetchPendingParticipants();
      fetchApprovedParticipants();
    } catch {
      toast.error("Không thể duyệt người tham gia");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (participantId: string) => {
    setProcessingId(participantId);
    try {
      await tournamentApiRequest.rejectParticipant(participantId);
      toast.success("Đã từ chối!");
      fetchPendingParticipants();
    } catch {
      toast.error("Không thể từ chối người tham gia");
    } finally {
      setProcessingId(null);
    }
  };

  const ParticipantCard = ({
    participant,
    index,
    isPending = false,
    isAdmin = false,
  }: {
    participant: TournamentCategoryParticipant;
    index: number;
    isPending?: boolean;
    isAdmin?: boolean;
  }) => (
    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 transition border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 flex-1">
        {/* Ranking number */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            isPending
              ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
              : "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
          }`}
        >
          {isPending ? <Clock className="w-5 h-5" /> : index + 1}
        </div>

        {/* Avatar */}
        <Avatar className="w-12 h-12 border-2 border-gray-200 dark:border-gray-700">
          <AvatarImage
            src={participant.avatarUrl || `user.png`}
            alt={participant.fullName}
          />
          <AvatarFallback className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-semibold">
            {participant.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link href={`/profile/${participant.slug}`}>
              <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                {participant.fullName}
              </h4>
            </Link>
            {participant.gender && (
              <Badge variant="outline" className="text-xs shrink-0">
                {participant.gender === "MALE" ? "Nam" : "Nữ"}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {participant.email}
          </p>
        </div>
      </div>

      {/* Admin-only Paid Badge */}
      {isAdmin && (
        <div className="shrink-0">
          {participant.paid ? (
            <Badge className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400">
              <CheckCircle className="w-4 h-4 mr-1" />
              Đã thanh toán
            </Badge>
          ) : (
            <Badge className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400">
              <XCircle className="w-4 h-4 mr-1" />
              Chưa thanh toán
            </Badge>
          )}
        </div>
      )}

      {/* Actions or Date */}
      <div className="shrink-0">
        {isPending ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleApprove(participant.id)}
              disabled={processingId === participant.id}
              className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400 dark:border-green-800"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Duyệt
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleReject(participant.id)}
              disabled={processingId === participant.id}
              className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 dark:border-red-800"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Từ chối
            </Button>
          </div>
        ) : (
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Đăng ký</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {new Date(participant.createdAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse">
            <div className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
          </div>
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse"
            >
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Pending Participants - Admin Only */}
      {isAdmin && (
        <>
          {loadingPending ? (
            <LoadingSkeleton />
          ) : (
            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="bg-amber-50 dark:bg-amber-900/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Chờ duyệt
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Danh sách đăng ký chờ phê duyệt
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-sm bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700"
                  >
                    {totalPending} người
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {pendingParticipants.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                      <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      Không có đăng ký chờ duyệt
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingParticipants.map((participant, index) => (
                      <ParticipantCard
                        key={participant.id}
                        participant={participant}
                        index={index}
                        isPending={true}
                        isAdmin={isAdmin}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Approved Participants */}
      {loadingApproved ? (
        <LoadingSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Danh sách người tham gia
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Đã được phê duyệt tham gia
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-sm bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-700"
              >
                {totalApproved} người
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {approvedParticipants.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  Chưa có người tham gia nào
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Hãy là người đầu tiên đăng ký!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {approvedParticipants.map((participant, index) => (
                  <ParticipantCard
                    key={participant.id}
                    participant={participant}
                    index={index}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
