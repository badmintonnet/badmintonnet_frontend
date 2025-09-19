import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ParticipantType } from "@/schemaValidations/event.schema";
import {
  Users,
  Clock,
  CheckCircle,
  UserCheck,
  UserX,
  Crown,
  Mail,
  Calendar,
  GraduationCap,
} from "lucide-react";
import React from "react";
import ViewDetailParticipants from "@/app/(main)/events/_components/view-detail-participants";

const STATUS_COLORS: Record<string, string> = {
  PENDING:
    "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200 dark:from-amber-900/20 dark:to-yellow-900/20 dark:text-amber-300 dark:border-amber-800",
  APPROVED:
    "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200 dark:from-emerald-900/20 dark:to-green-900/20 dark:text-emerald-300 dark:border-emerald-800",
  ATTENDED:
    "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200 dark:from-blue-900/20 dark:to-cyan-900/20 dark:text-blue-300 dark:border-blue-800",
  ABSENT:
    "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200 dark:from-red-900/20 dark:to-rose-900/20 dark:text-red-300 dark:border-red-800",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  ATTENDED: "Đã tham gia",
  ABSENT: "Vắng mặt",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  PENDING: <Clock className="w-4 h-4" />,
  APPROVED: <CheckCircle className="w-4 h-4" />,
  ATTENDED: <UserCheck className="w-4 h-4" />,
  ABSENT: <UserX className="w-4 h-4" />,
};

interface ParticipantsSectionProps {
  participants: ParticipantType[];
  eventId: string;
}

export default function ParticipantsSection({
  participants,
  eventId,
}: ParticipantsSectionProps) {
  const pending = participants.filter((p) => p.status === "PENDING");
  const others = participants.filter((p) => p.status !== "PENDING");

  const getStatusCounts = () => {
    return {
      pending: pending.length,
      approved: participants.filter((p) => p.status === "APPROVED").length,
      attended: participants.filter((p) => p.status === "ATTENDED").length,
      absent: participants.filter((p) => p.status === "ABSENT").length,
      total: participants.length,
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className=" p-8 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <div className="w-2 h-8 bg-gradient-to-b from-emerald-400 to-teal-600 rounded-full mr-4"></div>
            Người tham gia hoạt động
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Pending Section */}
        <Section
          title="Chờ duyệt"
          empty="Không có ai đang chờ duyệt"
          icon={<Clock className="w-5 h-5 text-amber-500" />}
          count={counts.pending}
        >
          {pending.map((p) => (
            <ParticipantCard key={p.id} participant={p} eventId={eventId} />
          ))}
        </Section>

        {/* Other Section */}
        <Section
          title="Thành viên tham gia"
          empty="Chưa có thành viên nào"
          icon={<Users className="w-5 h-5 text-blue-500" />}
          count={others.length}
        >
          {others.map((p) => (
            <ParticipantCard key={p.id} participant={p} eventId={eventId} />
          ))}
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  empty,
  children,
  icon,
  count,
}: {
  title: string;
  empty: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  count: number;
}) {
  return (
    <div className="mb-10 last:mb-0">
      <div className="flex items-center gap-3 mb-6">
        {icon}
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          {title}
        </h3>
        <Badge variant="outline" className="ml-auto">
          {count} người
        </Badge>
      </div>

      {React.Children.count(children) > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {children}
        </div>
      ) : (
        <div className="text-center py-2">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
            {empty}
          </p>
        </div>
      )}
    </div>
  );
}

function ParticipantCard({
  participant,
  eventId,
}: {
  participant: ParticipantType;
  eventId: string;
}) {
  return (
    <div className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600"></div>

      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl ring-4 ring-gray-100 dark:ring-gray-800">
              <Image
                src={participant.avatarUrl || "/user.png"}
                alt="Avatar"
                priority
                width={128}
                height={128}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0 flex-1">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {participant.fullName}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {participant.email}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-4 flex-shrink-0">
                {/* Ngày tham gia */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {new Date(participant.joinedAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                {/* Điểm tổng quan */}
                {participant.overallScore && (
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      Trình độ: {participant.overallScore.toFixed(1)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="mb-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                Giới tính: {participant.gender == "FEMALE" ? "Nữ" : "Nam"}
              </div>

              {participant.clubMember && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-700 dark:text-purple-300 ml-2 font-medium">
                  <Crown className="w-4 h-4 mr-1" />
                  Thành viên CLB
                </div>
              )}
            </div>

            {/* Status + Actions */}
            <div className="flex items-center justify-between">
              <Badge
                className={`${
                  STATUS_COLORS[participant.status]
                } flex items-center gap-2 px-3 py-2 text-sm font-medium border`}
              >
                {STATUS_ICONS[participant.status]}
                {STATUS_LABELS[participant.status]}
              </Badge>

              {participant.status === "PENDING" && (
                <ViewDetailParticipants
                  participant={participant}
                  eventId={eventId}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
