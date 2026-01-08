"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import tournamentApiRequest from "@/apiRequest/tournament";
import { TournamentCategoryTeamParticipant } from "@/schemaValidations/tournament.schema";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CategoryTeamParticipantsProps {
  categoryId: string;
  isAdmin: boolean;
}

export default function CategoryTeamParticipants({
  categoryId,
  isAdmin,
}: CategoryTeamParticipantsProps) {
  const [approvedTeams, setApprovedTeams] = useState<
    TournamentCategoryTeamParticipant[]
  >([]);
  const [pendingTeams, setPendingTeams] = useState<
    TournamentCategoryTeamParticipant[]
  >([]);

  const [loadingApproved, setLoadingApproved] = useState(true);
  const [loadingPending, setLoadingPending] = useState(true);

  const [processingId, setProcessingId] = useState<string | null>(null);

  // Modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedTeam, setSelectedTeam] =
    useState<TournamentCategoryTeamParticipant | null>(null);

  const openTeamModal = (team: TournamentCategoryTeamParticipant) => {
    setSelectedTeam(team);
    setOpenModal(true);
  };

  const fetchApprovedTeams = async () => {
    try {
      const res = await tournamentApiRequest.getAllTeamParticipants(
        categoryId,
        ["APPROVED"],
        0,
        100
      );
      setApprovedTeams(res.payload.data.content || []);
    } catch {
      toast.error("Không thể tải danh sách team đã duyệt");
    } finally {
      setLoadingApproved(false);
    }
  };

  const fetchPendingTeams = async () => {
    if (!isAdmin) return;
    try {
      const res = await tournamentApiRequest.getAllTeamParticipants(
        categoryId,
        ["PENDING"],
        0,
        100
      );
      setPendingTeams(res.payload.data.content || []);
    } catch {
      toast.error("Không thể tải danh sách team chờ duyệt");
    } finally {
      setLoadingPending(false);
    }
  };

  useEffect(() => {
    fetchApprovedTeams();
    if (isAdmin) fetchPendingTeams();
  }, [categoryId, isAdmin]);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await tournamentApiRequest.approveTeamParticipant(id);
      toast.success("Đã duyệt team thành công!");
      fetchPendingTeams();
      fetchApprovedTeams();
    } catch {
      toast.error("Không thể duyệt team");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await tournamentApiRequest.rejectTeamParticipant(id);
      toast.success("Đã từ chối!");
      fetchPendingTeams();
    } catch {
      toast.error("Không thể từ chối team");
    } finally {
      setProcessingId(null);
    }
  };

  const TeamCard = ({
    team,
    index,
    isPending,
  }: {
    team: TournamentCategoryTeamParticipant;
    index: number;
    isPending?: boolean;
  }) => (
    <div
      onClick={() => openTeamModal(team)}
      className="cursor-pointer flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 transition border border-gray-200 dark:border-gray-700"
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
          isPending
            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
            : "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
        }`}
      >
        {isPending ? <Clock className="w-5 h-5" /> : index + 1}
      </div>

      <div className="flex flex-1 items-center gap-4">
        <Avatar className="w-12 h-12 border">
          <AvatarImage src={team.player1AvatarUrl || "/user.png"} />
          <AvatarFallback>
            {team.player1FullName
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <Avatar className="w-12 h-12 border">
          <AvatarImage
            src={
              team.player2AvatarUrl ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${team.player2Slug}`
            }
          />
          <AvatarFallback>
            {team.player2FullName
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white truncate">
            {team.teamName}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {team.player1FullName} & {team.player2FullName}
          </p>
        </div>
      </div>

      {isAdmin && (
        <div className="shrink-0">
          {team.paid ? (
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

      {isPending ? (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleApprove(team.id);
            }}
            disabled={processingId === team.id}
            className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Duyệt
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleReject(team.id);
            }}
            disabled={processingId === team.id}
            className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400"
          >
            <XCircle className="w-4 h-4 mr-1" />
            Từ chối
          </Button>
        </div>
      ) : (
        <div className="text-right shrink-0">
          <p className="text-xs text-gray-500">Đăng ký</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {new Date(team.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
      )}
    </div>
  );

  const LoadingSkeleton = () => (
    <Card>
      <CardHeader>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse"
            >
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/** PENDING (Admin Only) */}
      {isAdmin &&
        (loadingPending ? (
          <LoadingSkeleton />
        ) : (
          <Card className="border-amber-200 dark:border-amber-800">
            <CardHeader className="bg-amber-50 dark:bg-amber-900/10">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-500" />
                <h3 className="text-xl font-semibold">Team chờ duyệt</h3>
                <Badge>{pendingTeams.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              {pendingTeams.length === 0 ? (
                <p className="text-center text-gray-400">
                  Không có team chờ duyệt
                </p>
              ) : (
                pendingTeams.map((team, i) => (
                  <TeamCard key={team.id} team={team} index={i} isPending />
                ))
              )}
            </CardContent>
          </Card>
        ))}

      {/** APPROVED */}
      {loadingApproved ? (
        <LoadingSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-teal-600" />
              <h3 className="text-xl font-semibold">Đội tham gia</h3>
              <Badge>{approvedTeams.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            {approvedTeams.length === 0 ? (
              <p className="text-center text-gray-400">
                Chưa có team được duyệt
              </p>
            ) : (
              approvedTeams.map((team, i) => (
                <TeamCard key={team.id} team={team} index={i} />
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/** MODAL DETAIL */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thông tin chi tiết team</DialogTitle>
          </DialogHeader>

          {selectedTeam && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedTeam.teamName}
                </h3>
              </div>

              {[1, 2].map((num) => {
                const fullName =
                  num === 1
                    ? selectedTeam.player1FullName
                    : selectedTeam.player2FullName;
                const slug =
                  num === 1
                    ? selectedTeam.player1Slug
                    : selectedTeam.player2Slug;
                const avatar =
                  num === 1
                    ? selectedTeam.player1AvatarUrl
                    : selectedTeam.player2AvatarUrl;
                const email =
                  num === 1
                    ? selectedTeam.player1Email
                    : selectedTeam.player2Email;
                const gender =
                  num === 1
                    ? selectedTeam.player1Gender
                    : selectedTeam.player2Gender;

                return (
                  <div
                    key={num}
                    className="flex items-center gap-4 p-4 rounded border"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={avatar || ""} />
                      <AvatarFallback>
                        {fullName
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <Link href={`/profile/${slug}`}>
                        <p className="font-semibold hover:underline">
                          {fullName}
                        </p>
                      </Link>
                      <p className="text-sm text-gray-500">{email}</p>
                      <Badge variant="outline" className="mt-1">
                        {gender === "MALE" ? "Nam" : "Nữ"}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
