"use client";

import { useEffect, useState } from "react";
import { TournamentDetail } from "@/schemaValidations/tournament.schema";
import { Users, Shield, Building2, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import clubTournamentApiRequest from "@/apiRequest/club-tournament";
import ClubRegisterButtonSimple from "./club-register-button-simple";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { clientSessionToken } from "@/lib/http";
import { isAdmin } from "@/lib/utils";
import { toast } from "sonner";

interface ClubCategorySectionProps {
  tournament: TournamentDetail;
}

interface ParticipantData {
  id: string;
  clubId: string;
  clubName?: string;
  clubSlug?: string;
  status: string;
  rosterAccountIds?: string[];
  club?: {
    name?: string;
    avatar?: string;
  };
  [key: string]: unknown;
}

export default function ClubCategorySection({
  tournament,
}: ClubCategorySectionProps) {
  const [participants, setParticipants] = useState<ParticipantData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const accessToken = clientSessionToken.value;
  const isUserAdmin = accessToken ? isAdmin(accessToken) : false;

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const res = await clubTournamentApiRequest.getParticipantsByTournament(
        tournament.id,
        undefined, // all statuses
        0,
        50
      );
      setParticipants(res.payload.data.content || []);
    } catch (error) {
      console.error("Failed to fetch participants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tournament.participationType === "CLUB") {
      fetchParticipants();
    }
  }, [tournament.id, tournament.participationType]);

  const handleApprove = async (participantId: string) => {
    setActionLoading(participantId);
    try {
      await clubTournamentApiRequest.approveParticipant(participantId);
      toast.success("Đã duyệt đăng ký CLB");
      fetchParticipants();
    } catch (error) {
      toast.error("Không thể duyệt đăng ký");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (participantId: string) => {
    setActionLoading(participantId);
    try {
      await clubTournamentApiRequest.rejectParticipant(participantId);
      toast.success("Đã từ chối đăng ký CLB");
      fetchParticipants();
    } catch (error) {
      toast.error("Không thể từ chối đăng ký");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
      PENDING: {
        label: "Chờ duyệt",
        className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
        icon: <Clock className="w-3 h-3 mr-1" />,
      },
      PAYMENT_REQUIRED: {
        label: "Chờ thanh toán",
        className: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
        icon: <AlertCircle className="w-3 h-3 mr-1" />,
      },
      PAID: {
        label: "Đã thanh toán",
        className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
        icon: <CheckCircle className="w-3 h-3 mr-1" />,
      },
      APPROVED: {
        label: "Đã duyệt",
        className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
        icon: <CheckCircle className="w-3 h-3 mr-1" />,
      },
      REJECTED: {
        label: "Từ chối",
        className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
        icon: <XCircle className="w-3 h-3 mr-1" />,
      },
      CANCELLED: {
        label: "Đã hủy",
        className: "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300",
        icon: <XCircle className="w-3 h-3 mr-1" />,
      },
      ELIMINATED: {
        label: "Bị loại",
        className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
        icon: <XCircle className="w-3 h-3 mr-1" />,
      },
    };

    const config = statusConfig[status] || { label: status, className: "bg-gray-100", icon: null };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  if (!tournament.participationType || tournament.participationType !== "CLUB") {
    return (
      <p className="text-center text-gray-500 italic mt-6">
        Giải đấu này không phải loại CLB.
      </p>
    );
  }

  // Check if registration is still open
  const registrationEndDate = tournament.registrationEndDate ? new Date(tournament.registrationEndDate) : null;
  const isRegistrationOpen = registrationEndDate ? registrationEndDate > new Date() : false;

  return (
    <div className="space-y-6">
      {/* Tournament Info & Registration */}
      <Card className="p-5 bg-gradient-to-br from-violet-50 to-violet-50/50 dark:from-violet-950/20 dark:to-violet-900/10 border-violet-200 dark:border-violet-800">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Tournament Info */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                <Shield className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tournament.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {participants.length} CLB đã đăng ký
                </p>
              </div>
            </div>

            {/* Tournament Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {tournament.clubRegistrationFee !== undefined && (
                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-violet-100 dark:border-violet-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Phí đăng ký</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {tournament.clubRegistrationFee.toLocaleString("vi-VN")} VNĐ
                  </p>
                </div>
              )}
              {tournament.minClubRosterSize !== undefined && (
                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-violet-100 dark:border-violet-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Số thành viên</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {tournament.minClubRosterSize} - {tournament.maxClubRosterSize} người
                  </p>
                </div>
              )}
              {tournament.maxClubs !== undefined && (
                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-violet-100 dark:border-violet-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Số CLB tối đa</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {tournament.maxClubs} CLB
                  </p>
                </div>
              )}
              {tournament.registrationEndDate && (
                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-violet-100 dark:border-violet-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Hạn đăng ký</p>
                  <p className={`font-semibold ${isRegistrationOpen ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {format(new Date(tournament.registrationEndDate), "dd/MM/yyyy", { locale: vi })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Register Button */}
          <div className="flex-shrink-0">
            <ClubRegisterButtonSimple
              tournamentId={tournament.id}
              tournamentName={tournament.name}
              minRoster={tournament.minClubRosterSize || 1}
              maxRoster={tournament.maxClubRosterSize || 10}
              registrationFee={tournament.clubRegistrationFee || 0}
              isFull={participants.length >= (tournament.maxClubs || Infinity)}
              registrationDeadline={registrationEndDate || new Date()}
            />
          </div>
        </div>
      </Card>

      {/* CLB List Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
          <Users className="w-5 h-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Danh sách CLB tham gia
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {participants.length} CLB đã đăng ký
          </p>
        </div>
      </div>

      {/* Club List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
          <p className="mt-2 text-gray-500">Đang tải...</p>
        </div>
      ) : participants.length === 0 ? (
        <Card className="p-8 text-center border-dashed">
          <Building2 className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            Chưa có CLB đăng ký
          </h4>
          <p className="text-gray-500 dark:text-gray-400">
            Hãy là CLB đầu tiên tham gia giải đấu này!
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {participants.map((club: ParticipantData) => (
            <Card key={club.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Club Avatar */}
                  <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center overflow-hidden">
                    <Shield className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  </div>

                  {/* Club Info */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {club.clubName || club.club?.name || "CLB Unknown"}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {club.rosterAccountIds?.length || 0} thành viên
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-3">
                  {getStatusBadge(club.status)}

                  {/* Admin Actions */}
                  {isUserAdmin && club.status === "PENDING" && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-300 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20"
                        onClick={() => handleApprove(club.id)}
                        disabled={actionLoading === club.id}
                      >
                        {actionLoading === club.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Duyệt
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-300 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                        onClick={() => handleReject(club.id)}
                        disabled={actionLoading === club.id}
                      >
                        {actionLoading === club.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 mr-1" />
                            Từ chối
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
