"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
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
import React, { useState } from "react";
import ViewDetailParticipants from "@/app/(main)/events/_components/view-detail-participants";
import Link from "next/link";
import Attendance from "@/app/(main)/events/_components/attendance";
import ReasonDialog from "@/app/(main)/events/_components/absent-reason/view-reason";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import EventCancellationList from "@/app/(main)/events/_components/event-cancellation-list";

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
  status: string;
  token?: string;
}

export default function ParticipantsSection({
  participants,
  eventId,
  status,
  token,
}: ParticipantsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("active");

  const activeParticipants = participants.filter(
    (p) =>
      p.status === "APPROVED" ||
      p.status === "ATTENDED" ||
      p.status === "ABSENT"
  );
  const pendingParticipants = participants.filter(
    (p) => p.status === "PENDING"
  );

  // don't fetch cancellations here — EventCancellationList will fetch its own data
  const counts = {
    active: activeParticipants.length,
    pending: pendingParticipants.length,
    cancelled: participants.filter((p) => p.status === "CANCELLED").length,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <div className="w-2 h-8 bg-gradient-to-b from-emerald-400 to-teal-600 rounded-full mr-4"></div>
            Quản lý người tham gia
          </h2>
        </div>

        <div className="mt-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)}>
            <TabsList className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <TabsTrigger value="active" className="rounded-md px-4 py-2">
                Đã tham gia
                <Badge
                  variant="outline"
                  className="ml-2 bg-white dark:bg-gray-800"
                >
                  {counts.active}
                </Badge>
              </TabsTrigger>

              <TabsTrigger value="pending" className="rounded-md px-4 py-2">
                Chờ duyệt
                <Badge
                  variant="outline"
                  className="ml-2 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                >
                  {counts.pending}
                </Badge>
              </TabsTrigger>

              <TabsTrigger value="cancelled" className="rounded-md px-4 py-2">
                Đã hủy
                <Badge
                  variant="outline"
                  className="ml-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                >
                  {counts.cancelled}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6">
              <ParticipantsList
                participants={activeParticipants}
                eventId={eventId}
                status={status}
                emptyMessage="Chưa có thành viên nào tham gia"
              />
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <ParticipantsList
                participants={pendingParticipants}
                eventId={eventId}
                status={status}
                emptyMessage="Không có ai đang chờ duyệt"
              />
            </TabsContent>

            <TabsContent value="cancelled" className="mt-6">
              <EventCancellationList eventId={eventId} token={token} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function ParticipantsList({
  participants,
  eventId,
  status,
  emptyMessage,
}: {
  participants: ParticipantType[];
  eventId: string;
  status: string;
  emptyMessage: string;
}) {
  if (participants.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {participants.map((p) => (
        <ParticipantCard
          key={p.id}
          participant={p}
          eventId={eventId}
          status={status}
        />
      ))}
    </div>
  );
}

function ParticipantCard({
  participant,
  eventId,
  status,
}: {
  participant: ParticipantType;
  eventId: string;
  status: string;
}) {
  return (
    <div className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600"></div>

      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl ring-4 ring-gray-100 dark:ring-gray-800">
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
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0 flex-1">
                <Link href={`/profile/${participant.slug}`}>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white truncate hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    {participant.fullName}
                  </h4>
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {participant.email}
                  </p>
                </div>
              </div>

              <Badge
                className={`${
                  STATUS_COLORS[participant.status]
                } flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border ml-2 flex-shrink-0`}
              >
                {STATUS_ICONS[participant.status]}
                {STATUS_LABELS[participant.status]}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(participant.joinedAt).toLocaleDateString("vi-VN")}
                </span>
              </div>

              {participant.overallScore && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {participant.overallScore.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {participant.gender === "FEMALE" ? "Nữ" : "Nam"}
                </Badge>

                {participant.clubMember && (
                  <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-700 dark:text-purple-300 border-0 text-xs">
                    <Crown className="w-3 h-3 mr-1" />
                    CLB
                  </Badge>
                )}
              </div>

              {participant.status === "PENDING" ? (
                <ViewDetailParticipants
                  participant={participant}
                  eventId={eventId}
                />
              ) : (
                status === "FINISHED" && (
                  <div className="flex items-center gap-2">
                    {participant.status === "ABSENT" &&
                      participant.sendReason && (
                        <ReasonDialog idPart={participant.id} />
                      )}
                    <Attendance
                      eventId={eventId}
                      participantId={participant.id}
                      value={participant.status}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
