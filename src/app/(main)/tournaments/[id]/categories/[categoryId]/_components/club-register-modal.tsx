"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Users,
  Building2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryDetail } from "@/schemaValidations/tournament.schema";
import clubServiceApi from "@/apiRequest/club";
import clubTournamentApiRequest from "@/apiRequest/club-tournament";
import { toast } from "sonner";
import { MyClubSchema } from "@/schemaValidations/clubs.schema";
import z from "zod";

type MyClubType = z.infer<typeof MyClubSchema>;

interface ClubMember {
  clubMemberId: string; // ID bảng club_members (dùng để hiển thị)
  accountId: string; // Account ID - DÙNG CHO API đăng ký
  name: string;
  avatar: string;
  slug: string;
  role: string;
}

interface ClubRegisterModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  category: CategoryDetail;
  categoryId: string;
  onRegistered?: () => void;
}

export default function ClubRegisterModal({
  open,
  onOpenChange,
  category,
  categoryId,
  onRegistered,
}: ClubRegisterModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [myClubs, setMyClubs] = useState<MyClubType[]>([]);
  const [loadingClubs, setLoadingClubs] = useState(false);
  const [selectedClub, setSelectedClub] = useState<MyClubType | null>(null);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const minRoster = category.minClubRosterSize ?? 1;
  const maxRoster = category.maxClubRosterSize ?? 999;

  // Fetch owner clubs on open
  useEffect(() => {
    if (!open) return;
    setStep(1);
    setSelectedClub(null);
    setMembers([]);
    setSelectedIds([]);
    setLoadingClubs(true);
    clubServiceApi
      .getMyClubs(0, 50)
      .then((res) => {
        const clubs = res.payload.data.content ?? [];
        setMyClubs(clubs.filter((c) => c.owner));
      })
      .catch(() => toast.error("Không thể tải danh sách CLB"))
      .finally(() => setLoadingClubs(false));
  }, [open]);

  // Fetch members when club selected
  const loadMembers = useCallback(async (clubId: string) => {
    setLoadingMembers(true);
    try {
      const res = await clubServiceApi.getClubMembers(
        clubId,
        0,
        100,
        "",
        "APPROVED",
      );
      const raw = res.payload.data.content ?? [];
      // Lọc lại chỉ lấy thành viên có status === "APPROVED"
      const approved = raw.filter((m) => m.status === "APPROVED");
      setMembers(
        approved.map((m) => ({
          clubMemberId: m.clubMemberId,
          accountId: m.id, // Account ID dùng cho API đăng ký
          name: m.name,
          avatar: m.avatar,
          slug: m.slug,
          role: m.role,
        })),
      );
    } catch {
      toast.error("Không thể tải danh sách thành viên");
    } finally {
      setLoadingMembers(false);
    }
  }, []);

  const handleSelectClub = (clubId: string) => {
    const club = myClubs.find((c) => c.id === clubId);
    if (!club) return;
    setSelectedClub(club);
    setSelectedIds([]);
    loadMembers(clubId);
  };

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
  const tooMany = selectedIds.length > maxRoster;

  const handleSubmit = async () => {
    if (!selectedClub) return;
    setSubmitting(true);
    try {
      await clubTournamentApiRequest.registerClub(categoryId, {
        clubId: selectedClub.id,
        rosterAccountIds: selectedIds, // Gửi account IDs
      });
      toast.success("Đăng ký CLB thành công!");
      onOpenChange(false);
      onRegistered?.();
    } catch (err: unknown) {
      const msg =
        (err as { payload?: { message?: string } })?.payload?.message ??
        "Đăng ký thất bại";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Đăng ký CLB tham gia</DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-4">
          {[
            { n: 1, label: "Chọn CLB" },
            { n: 2, label: "Chọn roster" },
            { n: 3, label: "Xác nhận" },
          ].map(({ n, label }, i) => (
            <div key={n} className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  step > n
                    ? "bg-teal-600 text-white"
                    : step === n
                      ? "bg-teal-600 text-white ring-2 ring-teal-300"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                }`}
              >
                {step > n ? <CheckCircle2 className="w-4 h-4" /> : n}
              </div>
              <span
                className={`text-xs hidden sm:block ${
                  step === n
                    ? "text-teal-700 dark:text-teal-400 font-semibold"
                    : "text-gray-400"
                }`}
              >
                {label}
              </span>
              {i < 2 && (
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 1: Select Club ── */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Chọn CLB mà bạn là Chủ CLB (Owner):
            </p>
            {loadingClubs ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
              </div>
            ) : myClubs.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                <Building2 className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                Bạn không phải Chủ CLB nào
              </div>
            ) : (
              <Select onValueChange={handleSelectClub}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn CLB của bạn..." />
                </SelectTrigger>
                <SelectContent className="z-[10000]">
                  {myClubs.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {selectedClub && (
              <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700">
                <p className="text-sm font-semibold text-teal-800 dark:text-teal-300">
                  Đã chọn: {selectedClub.name}
                </p>
                <p className="text-xs text-teal-600 dark:text-teal-400 mt-0.5">
                  {selectedClub.memberCount} thành viên ·{" "}
                  {selectedClub.location ?? ""}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedClub}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Tiếp theo <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 2: Select Roster ── */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chọn thành viên vào roster:
              </p>
              <span
                className={`text-sm font-semibold px-2 py-0.5 rounded ${
                  tooFew || tooMany
                    ? "text-red-600 bg-red-50 dark:bg-red-900/20"
                    : "text-teal-600 bg-teal-50 dark:bg-teal-900/20"
                }`}
              >
                {selectedIds.length}/{maxRoster > 999 ? "∞" : maxRoster} (tối
                thiểu {minRoster})
              </span>
            </div>

            {tooFew && selectedIds.length > 0 && (
              <div className="flex items-center gap-2 text-amber-600 text-xs bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                Cần chọn thêm {minRoster - selectedIds.length} thành viên nữa
              </div>
            )}
            {tooMany && (
              <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                Đã vượt quá giới hạn {maxRoster} thành viên
              </div>
            )}

            {loadingMembers ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
              </div>
            ) : members.length === 0 ? (
              <p className="text-center py-6 text-gray-500 text-sm">
                Không có thành viên APPROVED
              </p>
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
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {m.name}
                      </p>
                      {m.role === "OWNER" && (
                        <span className="text-xs text-amber-600 dark:text-amber-400">
                          Chủ CLB
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className="flex justify-between gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Quay lại
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!isCountValid}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Tiếp theo <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Confirm ── */}
        {step === 3 && selectedClub && (
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
              <div className="flex justify-between p-3 text-sm">
                <span className="text-gray-500">CLB</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedClub.name}
                </span>
              </div>
              <div className="flex justify-between p-3 text-sm">
                <span className="text-gray-500">Hạng mục</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {category.category}
                </span>
              </div>
              <div className="flex justify-between p-3 text-sm">
                <span className="text-gray-500">Số thành viên</span>
                <span className="font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {selectedIds.length} thành viên
                </span>
              </div>
              {category.clubRegistrationFee != null &&
                category.clubRegistrationFee > 0 && (
                  <div className="flex justify-between p-3 text-sm">
                    <span className="text-gray-500">Phí đăng ký</span>
                    <span className="font-semibold text-orange-600">
                      {category.clubRegistrationFee.toLocaleString("vi-VN")} VNĐ
                    </span>
                  </div>
                )}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Sau khi đăng ký, bạn có thể cập nhật roster trước khi hết thời
              gian đăng ký. Cần thanh toán phí để hoàn tất đăng ký.
            </p>

            <div className="flex justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                disabled={submitting}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Quay lại
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Xác nhận đăng ký
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
