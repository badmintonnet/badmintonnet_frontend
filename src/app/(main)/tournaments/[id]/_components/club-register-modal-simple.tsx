"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle2, Users, Building2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clubServiceApi from "@/apiRequest/club";
import clubTournamentApiRequest from "@/apiRequest/club-tournament";
import { toast } from "sonner";
import { MyClubSchema } from "@/schemaValidations/clubs.schema";
import z from "zod";

type MyClubType = z.infer<typeof MyClubSchema>;

interface ClubMember {
  clubMemberId: string;
  accountId: string;
  name: string;
  avatar: string;
  slug: string;
  role: string;
}

interface ClubRegisterModalSimpleProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  tournamentId: string;
  tournamentName: string;
  minRoster: number;
  maxRoster: number;
  registrationFee: number;
  onRegistered?: () => void;
}

export default function ClubRegisterModalSimple({
  open,
  onOpenChange,
  tournamentId,
  tournamentName,
  minRoster,
  maxRoster,
  registrationFee,
  onRegistered,
}: ClubRegisterModalSimpleProps) {
  const [step, setStep] = useState<"select-club" | "select-members">(
    "select-club",
  );
  const [clubs, setClubs] = useState<MyClubType[]>([]);
  const [selectedClub, setSelectedClub] = useState<MyClubType | null>(null);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load user's clubs
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    clubServiceApi
      .getMyClubs(0, 50)
      .then((res) => {
        // Chỉ lấy CLB mà user là OWNER
        const ownedClubs = (res.payload.data.content ?? []).filter(
          (c) => c.owner,
        );
        setClubs(ownedClubs);
        if (ownedClubs.length === 1) {
          setSelectedClub(ownedClubs[0]);
          setStep("select-members");
        }
      })
      .catch(() => toast.error("Không thể tải danh sách CLB"))
      .finally(() => setLoading(false));
  }, [open]);

  // Load members when club selected
  useEffect(() => {
    if (!selectedClub) return;
    setLoading(true);
    clubServiceApi
      .getClubMembers(selectedClub.id, 0, 100, "", "APPROVED")
      .then((res) => {
        const raw = res.payload.data.content ?? [];
        // Lọc chỉ lấy thành viên có status === "APPROVED" (đã lọc ở API)
        setMembers(
          raw.map(
            (m: {
              clubMemberId: string;
              id: string;
              name: string;
              avatar: string;
              slug: string;
              role: string;
            }) => ({
              clubMemberId: m.clubMemberId,
              accountId: m.id,
              name: m.name,
              avatar: m.avatar,
              slug: m.slug,
              role: m.role,
            }),
          ),
        );
      })
      .catch(() => toast.error("Không thể tải danh sách thành viên"))
      .finally(() => setLoading(false));
  }, [selectedClub]);

  const toggleMember = (accountId: string) => {
    setSelectedIds((prev) =>
      prev.includes(accountId)
        ? prev.filter((x) => x !== accountId)
        : [...prev, accountId],
    );
  };

  const isCountValid =
    selectedIds.length >= minRoster && selectedIds.length <= maxRoster;
  const tooFew = selectedIds.length < minRoster;

  const handleSubmit = async () => {
    if (!selectedClub) return;
    setSubmitting(true);
    try {
      await clubTournamentApiRequest.registerClub(tournamentId, {
        clubId: selectedClub.id,
        rosterAccountIds: selectedIds,
      });
      toast.success("Đăng ký CLB thành công!");
      onOpenChange(false);
      onRegistered?.();
    } catch (error: unknown) {
      console.error("Register club error:", error);
      const err = error as {
        payload?: { message?: string };
        response?: { data?: { message?: string } };
      };
      toast.error(
        err.payload?.message ||
          err.response?.data?.message ||
          "Không thể đăng ký CLB",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) {
      setStep("select-club");
      setSelectedClub(null);
      setSelectedIds([]);
    }
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-violet-600" />
            Đăng ký CLB - {tournamentName}
          </DialogTitle>
        </DialogHeader>

        {step === "select-club" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Chọn CLB bạn muốn đăng ký:
            </p>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
              </div>
            ) : clubs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Bạn không sở hữu CLB nào</p>
              </div>
            ) : (
              <Select
                value={selectedClub?.id}
                onValueChange={(v) => {
                  const club = clubs.find((c) => c.id === v);
                  if (club) {
                    setSelectedClub(club);
                    setStep("select-members");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn CLB" />
                </SelectTrigger>
                <SelectContent>
                  {clubs.map((club) => (
                    <SelectItem key={club.id} value={club.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={club.logoUrl || ""} />
                          <AvatarFallback className="text-xs">
                            {club.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{club.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {step === "select-members" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chọn thành viên vào đội hình ({minRoster}-{maxRoster} người):
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("select-club")}
              >
                Đổi CLB
              </Button>
            </div>

            {/* Summary */}
            <div className="bg-violet-50 dark:bg-violet-900/20 p-3 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-violet-600" />
                  {selectedClub?.name}
                </span>
                <span
                  className={`font-medium ${
                    !isCountValid
                      ? tooFew
                        ? "text-red-500"
                        : "text-orange-500"
                      : "text-green-600"
                  }`}
                >
                  {selectedIds.length}/{maxRoster}
                </span>
              </div>
              {!isCountValid && (
                <p className="text-xs text-red-500 mt-1">
                  {tooFew
                    ? `Cần chọn ít nhất ${minRoster} thành viên`
                    : `Tối đa ${maxRoster} thành viên`}
                </p>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>CLB chưa có thành viên nào</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {members.map((m) => (
                  <label
                    key={m.accountId}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedIds.includes(m.accountId)}
                      onCheckedChange={() => toggleMember(m.accountId)}
                      className="flex-shrink-0"
                    />
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={m.avatar} />
                      <AvatarFallback className="text-xs bg-teal-100 text-teal-700">
                        {m.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {m.name}
                      </p>
                      <p className="text-xs text-gray-500">{m.role}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* Fee info */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Phí đăng ký:
              </span>
              <span className="font-semibold text-violet-600">
                {registrationFee.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep("select-club")}
                className="flex-1"
              >
                Quay lại
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!isCountValid || submitting}
                className="flex-1 bg-violet-600 hover:bg-violet-700"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Đăng ký
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
