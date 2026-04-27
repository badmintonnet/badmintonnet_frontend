"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Building2, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ClubTournamentParticipant,
  ClubTournamentStatus,
  getClubTournamentStatusInfo,
} from "@/schemaValidations/tournament.schema";
import clubTournamentApiRequest from "@/apiRequest/club-tournament";
import { toast } from "sonner";
import ClubRosterModal from "./club-roster-modal";
import Image from "next/image";

interface ClubTournamentParticipantsProps {
  categoryId: string;
  isAdmin?: boolean;
}

export default function ClubTournamentParticipants({
  categoryId,
  isAdmin = false,
}: ClubTournamentParticipantsProps) {
  const [participants, setParticipants] = useState<ClubTournamentParticipant[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchParticipants = useCallback(async () => {
    try {
      const statuses: ClubTournamentStatus[] = isAdmin
        ? [] // admin sees all statuses
        : ["APPROVED", "PAID", "PENDING", "PAYMENT_REQUIRED"];
      const res = await clubTournamentApiRequest.getParticipantsByCategory(
        categoryId,
        statuses,
        0,
        100,
      );
      setParticipants(res.payload.data.content ?? []);
      setTotal(res.payload.data.totalElements ?? 0);
    } catch {
      toast.error("Không thể tải danh sách CLB đã đăng ký");
    } finally {
      setLoading(false);
    }
  }, [categoryId, isAdmin]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  const handleApprove = async (participantId: string) => {
    setActionLoading(participantId + "-approve");
    try {
      await clubTournamentApiRequest.approveParticipant(participantId);
      toast.success("Đã duyệt CLB tham gia giải đấu");
      fetchParticipants();
    } catch {
      toast.error("Không thể duyệt CLB này");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (participantId: string) => {
    setActionLoading(participantId + "-reject");
    try {
      await clubTournamentApiRequest.rejectParticipant(participantId);
      toast.success("Đã từ chối CLB tham gia giải đấu");
      fetchParticipants();
    } catch {
      toast.error("Không thể từ chối CLB này");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
      </div>
    );
  }

  if (participants.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400">
          Chưa có CLB nào đăng ký
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {total} CLB đã đăng ký
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {participants.map((p) => {
          const statusInfo = getClubTournamentStatusInfo(p.status);
          const canApprove = isAdmin && p.status === "PAID";
          const canReject =
            isAdmin &&
            !["REJECTED", "CANCELLED", "APPROVED"].includes(p.status);
          return (
            <Card
              key={p.id}
              className="hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Logo */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
                    {p.clubLogoUrl ? (
                      <Image
                        src={p.clubLogoUrl}
                        alt={p.clubName}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-lg font-bold text-gray-400">
                        {p.clubName.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {p.clubName}
                      </p>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${statusInfo.badgeClass}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-gray-500 dark:text-gray-400 text-sm">
                      <Users className="w-3.5 h-3.5" />
                      <span>{p.rosterSize} thành viên</span>
                    </div>
                    {p.clubLocation && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                        {p.clubLocation}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <ClubRosterModal participant={p} />
                      {isAdmin && (
                        <>
                          {canApprove && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-teal-300 text-teal-700 hover:bg-teal-50 dark:border-teal-600 dark:text-teal-300 text-xs h-7"
                              disabled={actionLoading === p.id + "-approve"}
                              onClick={() => handleApprove(p.id)}
                            >
                              {actionLoading === p.id + "-approve" ? (
                                <Loader2 className="w-3 h-3 animate-spin mr-1" />
                              ) : (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              )}
                              Duyệt
                            </Button>
                          )}
                          {canReject && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-300 text-xs h-7"
                              disabled={actionLoading === p.id + "-reject"}
                              onClick={() => handleReject(p.id)}
                            >
                              {actionLoading === p.id + "-reject" ? (
                                <Loader2 className="w-3 h-3 animate-spin mr-1" />
                              ) : (
                                <XCircle className="w-3 h-3 mr-1" />
                              )}
                              Từ chối
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
