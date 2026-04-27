"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  RefreshCw,
  XCircle,
  CreditCard,
  Loader2,
  UserCheck,
  CalendarDays,
  ExternalLink,
  Crown,
  CheckCircle2,
  ClipboardCheck,
  ShieldCheck,
  Trophy,
  AlertTriangle,
  Info,
  Ban,
} from "lucide-react";
import {
  ClubTournamentParticipant,
  getClubTournamentStatusInfo,
} from "@/schemaValidations/tournament.schema";
import paymentApiRequest from "@/apiRequest/payment";
import ClubRosterModal from "@/app/(main)/tournaments/[id]/categories/[categoryId]/_components/club-roster-modal";
import RepresentativeSelector from "./representative-selector";
import { toast } from "sonner";

interface ClubTournamentRegistrationCardProps {
  participant: ClubTournamentParticipant;
  onUpdate: (participant: ClubTournamentParticipant) => void;
  onCancel: (participant: ClubTournamentParticipant) => void;
  onRepresentativeChanged?: () => void;
}

// Map status -> dải màu bên trái card + tint
const STATUS_ACCENT: Record<
  ClubTournamentParticipant["status"],
  { stripe: string; softBg: string; iconColor: string }
> = {
  DRAFT: {
    stripe: "bg-gray-300 dark:bg-gray-600",
    softBg: "bg-gray-50 dark:bg-gray-800/40",
    iconColor: "text-gray-500",
  },
  PENDING: {
    stripe: "bg-amber-400",
    softBg: "bg-amber-50 dark:bg-amber-900/20",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  PAYMENT_REQUIRED: {
    stripe: "bg-orange-400",
    softBg: "bg-orange-50 dark:bg-orange-900/20",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  PAID: {
    stripe: "bg-blue-400",
    softBg: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  APPROVED: {
    stripe: "bg-emerald-500",
    softBg: "bg-emerald-50 dark:bg-emerald-900/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  REJECTED: {
    stripe: "bg-rose-400",
    softBg: "bg-rose-50 dark:bg-rose-900/20",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  CANCELLED: {
    stripe: "bg-gray-400",
    softBg: "bg-gray-100 dark:bg-gray-800/40",
    iconColor: "text-gray-500",
  },
  ELIMINATED: {
    stripe: "bg-slate-400",
    softBg: "bg-slate-50 dark:bg-slate-800/40",
    iconColor: "text-slate-500",
  },
};

export default function ClubTournamentRegistrationCard({
  participant,
  onUpdate,
  onCancel,
  onRepresentativeChanged,
}: ClubTournamentRegistrationCardProps) {
  const [paying, setPaying] = useState(false);
  const [repDialogOpen, setRepDialogOpen] = useState(false);
  const statusInfo = getClubTournamentStatusInfo(participant.status);
  const accent = STATUS_ACCENT[participant.status];

  const canUpdate = ["DRAFT", "PENDING", "PAYMENT_REQUIRED"].includes(
    participant.status,
  );
  const canCancel = !["CANCELLED", "REJECTED", "APPROVED"].includes(
    participant.status,
  );
  const canPay = participant.status === "PENDING";
  const canSelectRepresentative = ["PAID", "APPROVED"].includes(
    participant.status,
  );
  const isTerminal = ["CANCELLED", "REJECTED"].includes(participant.status);

  // Có người có position === "SINGLES" → CLB đã chọn đại diện
  const hasRepresentative = useMemo(
    () => participant.roster?.some((r) => r.position === "SINGLES") ?? false,
    [participant.roster],
  );

  const representative = useMemo(
    () => participant.roster?.find((r) => r.position === "SINGLES"),
    [participant.roster],
  );

  // Stepper: Đăng ký → Thanh toán → Duyệt → Đại diện → Thi đấu
  const stepIndex = useMemo(() => {
    switch (participant.status) {
      case "DRAFT":
      case "PENDING":
        return 0;
      case "PAYMENT_REQUIRED":
        return 1;
      case "PAID":
        return 2;
      case "APPROVED":
        return hasRepresentative ? 4 : 3;
      case "ELIMINATED":
        return 5;
      default:
        return -1;
    }
  }, [participant.status, hasRepresentative]);

  const registeredAtText = participant.registeredAt
    ? new Date(participant.registeredAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  const handlePayment = async () => {
    setPaying(true);
    try {
      const response = await paymentApiRequest.createClubPayment(
        participant.id,
      );
      const data = response.payload.data;
      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        toast.error("Không nhận được đường dẫn thanh toán");
      }
    } catch {
      toast.error("Không thể tạo thanh toán. Vui lòng thử lại.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <Card className="relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all rounded-2xl">
      {/* Left status stripe */}
      <span
        aria-hidden
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${accent.stripe}`}
      />

      <CardContent className="p-4 md:p-5 pl-5 md:pl-6">
        {/* ===== Header ===== */}
        <div className="flex items-start gap-3 md:gap-4">
          {/* Logo CLB */}
          <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            {participant.clubLogoUrl ? (
              <Image
                src={participant.clubLogoUrl}
                alt={participant.clubName}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-base font-bold text-gray-500">
                {participant.clubName.charAt(0)}
              </div>
            )}
          </div>

          {/* Title block */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-2 justify-between">
              <div className="min-w-0 flex-1">
                {participant.tournamentSlug ? (
                  <Link
                    href={`/tournaments/${participant.tournamentSlug}`}
                    className="group inline-flex items-center gap-1.5 text-base md:text-lg font-bold text-gray-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
                  >
                    <span className="truncate">
                      {participant.tournamentName ?? "Giải đấu"}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </Link>
                ) : (
                  <p className="text-base md:text-lg font-bold text-gray-900 dark:text-white truncate">
                    {participant.tournamentName ?? "Giải đấu"}
                  </p>
                )}

                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5" />
                    {participant.clubName}
                  </span>
                  {participant.categoryName && (
                    <span className="inline-flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" />
                      {participant.categoryName}
                    </span>
                  )}
                  {registeredAtText && (
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      Đăng ký: {registeredAtText}
                    </span>
                  )}
                </div>
              </div>

              {/* Status badge */}
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${statusInfo.badgeClass}`}
              >
                {statusInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* ===== Meta row ===== */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Roster preview */}
          <MetaBlock
            icon={<Users className="w-4 h-4 text-violet-500" />}
            label="Roster"
          >
            <div className="flex items-center gap-2">
              <RosterAvatars
                members={participant.roster ?? []}
                count={participant.rosterSize}
              />
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {participant.rosterSize}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                thành viên
              </span>
            </div>
          </MetaBlock>

          {/* Representative */}
          <MetaBlock
            icon={<UserCheck className={`w-4 h-4 ${accent.iconColor}`} />}
            label="Đại diện"
          >
            {hasRepresentative ? (
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {representative?.fullName ?? "Đã chọn"}
                </span>
              </div>
            ) : (
              <span className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Chưa chọn
              </span>
            )}
          </MetaBlock>

          {/* Payment */}
          <MetaBlock
            icon={<CreditCard className="w-4 h-4 text-blue-500" />}
            label="Thanh toán"
          >
            {participant.paid ||
            ["PAID", "APPROVED", "ELIMINATED"].includes(participant.status) ? (
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                Đã hoàn tất
              </span>
            ) : participant.status === "PAYMENT_REQUIRED" ? (
              <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                Đang xử lý…
              </span>
            ) : ["CANCELLED", "REJECTED"].includes(participant.status) ? (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                —
              </span>
            ) : (
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                Chưa thanh toán
              </span>
            )}
          </MetaBlock>
        </div>

        {/* ===== Progress stepper (ẩn khi CANCELLED/REJECTED) ===== */}
        {!isTerminal && (
          <div className="mt-5">
            <ProgressStepper currentIndex={stepIndex} />
          </div>
        )}

        {/* ===== Action hint banner ===== */}
        <ActionHint
          status={participant.status}
          hasRepresentative={hasRepresentative}
        />

        {/* ===== Action row ===== */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <ClubRosterModal
            participant={participant}
            trigger={
              <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:hover:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 transition-colors">
                <Users className="w-3.5 h-3.5" />
                Xem roster
              </button>
            }
          />

          {participant.tournamentSlug && (
            <Link
              href={`/tournaments/${participant.tournamentSlug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white hover:bg-violet-50 text-violet-700 dark:bg-gray-700/40 dark:hover:bg-violet-900/30 dark:text-violet-300 border border-violet-200 dark:border-violet-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Xem giải đấu
            </Link>
          )}

          {/* Push actions to the right on larger screens */}
          <div className="flex-1" />

          {canPay && (
            <Button
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs shadow-sm"
              onClick={handlePayment}
              disabled={paying}
            >
              {paying ? (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              ) : (
                <CreditCard className="w-3.5 h-3.5 mr-1" />
              )}
              Thanh toán ngay
            </Button>
          )}

          {canSelectRepresentative && (
            <Button
              size="sm"
              className={`text-white text-xs shadow-sm ${
                hasRepresentative
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              }`}
              onClick={() => setRepDialogOpen(true)}
            >
              <UserCheck className="w-3.5 h-3.5 mr-1" />
              {hasRepresentative ? "Đổi đại diện" : "Chọn đại diện"}
            </Button>
          )}

          {canUpdate && (
            <Button
              size="sm"
              variant="outline"
              className="border-teal-300 text-teal-700 hover:bg-teal-50 dark:border-teal-700 dark:text-teal-300 dark:hover:bg-teal-900/30 text-xs"
              onClick={() => onUpdate(participant)}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Cập nhật roster
            </Button>
          )}

          {canCancel && (
            <Button
              size="sm"
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30 text-xs"
              onClick={() => onCancel(participant)}
            >
              <XCircle className="w-3.5 h-3.5 mr-1" />
              Hủy đăng ký
            </Button>
          )}
        </div>
      </CardContent>

      <RepresentativeSelector
        participantId={participant.id}
        roster={participant.roster ?? []}
        representativeId={undefined}
        onSuccess={() => onRepresentativeChanged?.()}
        open={repDialogOpen}
        onOpenChange={setRepDialogOpen}
      />
    </Card>
  );
}

// ===== Sub components =====

function MetaBlock({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/40 px-3 py-2">
      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {icon}
        {label}
      </div>
      <div className="min-h-[1.25rem]">{children}</div>
    </div>
  );
}

function RosterAvatars({
  members,
  count,
}: {
  members: ClubTournamentParticipant["roster"];
  count: number;
}) {
  const visible = (members ?? []).slice(0, 3);
  const extra = count - visible.length;
  return (
    <div className="flex -space-x-2">
      {visible.map((m) => (
        <div
          key={m.rosterEntryId}
          className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center"
          title={m.fullName}
        >
          {m.avatarUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={m.avatarUrl}
              alt={m.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[10px] font-bold text-violet-700 dark:text-violet-300">
              {m.fullName.charAt(0)}
            </span>
          )}
        </div>
      ))}
      {extra > 0 && (
        <div className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-200">
          +{extra}
        </div>
      )}
    </div>
  );
}

function ProgressStepper({ currentIndex }: { currentIndex: number }) {
  const steps = [
    { label: "Đăng ký", Icon: ClipboardCheck },
    { label: "Thanh toán", Icon: CreditCard },
    { label: "Duyệt", Icon: ShieldCheck },
    { label: "Đại diện", Icon: UserCheck },
    { label: "Thi đấu", Icon: Trophy },
  ];
  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const completed = idx < currentIndex;
          const active = idx === currentIndex;
          return (
            <div
              key={step.label}
              className="flex-1 flex flex-col items-center relative"
            >
              {/* Connector */}
              {idx > 0 && (
                <div
                  className={`absolute right-1/2 top-3 h-0.5 w-full ${
                    idx <= currentIndex
                      ? "bg-violet-500"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                  aria-hidden
                />
              )}
              <div
                className={`relative z-10 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                  completed
                    ? "bg-violet-500 border-violet-500 text-white"
                    : active
                      ? "bg-white border-violet-500 text-violet-600 ring-4 ring-violet-100 dark:ring-violet-900/40 dark:bg-gray-900"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400"
                }`}
              >
                <step.Icon className="w-3 h-3 md:w-3.5 md:h-3.5" />
              </div>
              <span
                className={`mt-1 text-[10px] md:text-xs font-medium text-center ${
                  completed || active
                    ? "text-gray-800 dark:text-gray-100"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActionHint({
  status,
  hasRepresentative,
}: {
  status: ClubTournamentParticipant["status"];
  hasRepresentative: boolean;
}) {
  let config: {
    tone: "amber" | "orange" | "blue" | "emerald" | "rose" | "slate";
    Icon: React.ComponentType<{ className?: string }>;
    text: string;
  } | null = null;

  switch (status) {
    case "PENDING":
      config = {
        tone: "amber",
        Icon: AlertTriangle,
        text: "Cần thanh toán phí đăng ký để tiếp tục.",
      };
      break;
    case "PAYMENT_REQUIRED":
      config = {
        tone: "orange",
        Icon: Loader2,
        text: "Đang chờ cổng thanh toán VNPay xác nhận. Nếu thất bại bạn có thể thử lại.",
      };
      break;
    case "PAID":
      config = {
        tone: "blue",
        Icon: ShieldCheck,
        text: "Đã thanh toán. Chờ ban tổ chức duyệt để vào bảng đấu.",
      };
      break;
    case "APPROVED":
      config = hasRepresentative
        ? {
            tone: "emerald",
            Icon: Trophy,
            text: "CLB của bạn đã sẵn sàng thi đấu. Theo dõi bảng đấu ở trang giải.",
          }
        : {
            tone: "emerald",
            Icon: UserCheck,
            text: "Hãy chọn đại diện đơn nam để CLB được xếp vào bảng đấu.",
          };
      break;
    case "REJECTED":
      config = {
        tone: "rose",
        Icon: Ban,
        text: "Ban tổ chức đã từ chối đăng ký này.",
      };
      break;
    case "CANCELLED":
      config = {
        tone: "slate",
        Icon: Ban,
        text: "Đăng ký đã được hủy.",
      };
      break;
    default:
      config = null;
  }

  if (!config) return null;

  const toneMap: Record<typeof config.tone, string> = {
    amber:
      "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800/40",
    orange:
      "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-200 dark:border-orange-800/40",
    blue: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800/40",
    emerald:
      "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-200 dark:border-emerald-800/40",
    rose: "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-900/20 dark:text-rose-200 dark:border-rose-800/40",
    slate:
      "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/40 dark:text-slate-200 dark:border-slate-700/60",
  };

  const { Icon } = config;
  const isSpinner = status === "PAYMENT_REQUIRED";

  return (
    <div
      className={`mt-4 flex items-start gap-2 text-sm px-3 py-2 rounded-lg border ${toneMap[config.tone]}`}
    >
      <Icon
        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isSpinner ? "animate-spin" : ""}`}
      />
      <span className="leading-snug">{config.text}</span>
    </div>
  );
}
