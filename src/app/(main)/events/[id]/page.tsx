import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  UserMinus,
  CircleStar,
  CheckCircle,
  GraduationCap,
  UserX,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import eventClubApiRequest from "@/apiRequest/club.event";
import { cookies } from "next/headers";
import { ParticipantType } from "@/schemaValidations/event.schema";
import { JoinEventButton } from "@/app/(main)/events/_components/join-event-button";
import EditEventButton from "@/app/(main)/events/_components/edit-event-button";
import ViewRating from "@/app/(main)/events/_components/view-rating";
import EventHighlights from "@/app/(main)/events/_components/highlight/event-highlights";
import CreateHighlightButton from "@/app/(main)/events/_components/highlight/create-highlight-button";
import ParticipantsSection from "@/app/(main)/events/_components/view-participants";
import AbsenceDialog from "@/app/(main)/events/_components/absent-reason/absence-dialog";
import accountApiRequest from "@/apiRequest/account";
import { CancelEventDialog } from "@/app/(main)/events/_components/cancel-event-button";
import { CancelJoinEventButton } from "@/app/(main)/events/_components/cancel-join-button";
import Link from "next/link";
import { isHTML } from "@/lib/utils";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetail({ params }: EventDetailPageProps) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  const { id } = await params;

  const response = await eventClubApiRequest.getEventById(
    id,
    accessToken?.value || "",
  );

  const me = await accountApiRequest.getAccount(accessToken?.value || "");
  const user = me.payload.data;

  const eventDetail = response.payload.data || null;
  let participantRes;
  if (eventDetail.participantRole === "OWNER") {
    participantRes = await eventClubApiRequest.getParticipants(
      eventDetail?.id,
      accessToken?.value || "",
    );
  }
  const participants: ParticipantType[] = participantRes?.payload.data || [];
  if (!eventDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Không tìm thấy sự kiện.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (date: string | Date) =>
    new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      MEN_SINGLE: "Đơn nam",
      WOMEN_SINGLE: "Đơn nữ",
      MEN_DOUBLE: "Đôi nam",
      WOMEN_DOUBLE: "Đôi nữ",
      MIXED_DOUBLE: "Đôi nam nữ",
    };
    return labels[category] || category;
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      ONGOING: {
        label: "Đang diễn ra",
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-600",
      },
      OPEN: {
        label: "Mở đăng ký",
        color:
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
      },
      CLOSED: {
        label: "Đã đóng",
        color:
          "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
      },
      FINISHED: {
        label: "Đã kết thúc",
        color:
          "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
      },
      CANCELLED: {
        label: "Đã hủy",
        color:
          "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800",
      },
      DRAFT: {
        label: "Chưa mở đăng ký",
        color:
          "bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300 border border-gray-200 dark:border-gray-800",
      },
    };

    return (
      <Badge className={`${config[status].color} font-medium px-3 py-1`}>
        {config[status].label}
      </Badge>
    );
  };
  const renderParticipantStatus = (
    status: "PENDING" | "APPROVED" | "ATTENDED" | "ABSENT" | "CANCELLED",
  ) => {
    // const [isDialogOpen, setIsDialogOpen] = useState(false);

    if (!status) return null;

    const STATUS_CONFIG = {
      PENDING: {
        bg: "bg-amber-50 dark:bg-amber-900/20",
        border: "border border-amber-200 dark:border-amber-800",
        icon: <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
        title: "Chờ duyệt",
        subtitle: "Đang chờ xác nhận tham gia",
        iconBg: "bg-amber-100 dark:bg-amber-900/30",
        textColor: "text-amber-900 dark:text-amber-300",
        subTextColor: "text-amber-700 dark:text-amber-400",
      },
      APPROVED: {
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        border: "border border-emerald-200 dark:border-emerald-800",
        icon: (
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        ),
        title: "Đã duyệt",
        subtitle: "Bạn đã đăng ký thành công",
        iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
        textColor: "text-emerald-900 dark:text-emerald-300",
        subTextColor: "text-emerald-700 dark:text-emerald-400",
      },
      ATTENDED: {
        bg: "bg-green-50 dark:bg-green-900/20",
        border: "border border-green-200 dark:border-green-800",
        icon: (
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
        ),
        title: "Đã tham gia",
        subtitle: "Bạn đã được xác nhận tham gia hoạt động",
        iconBg: "bg-green-100 dark:bg-green-900/30",
        textColor: "text-green-900 dark:text-green-300",
        subTextColor: "text-green-700 dark:text-green-400",
      },
      ABSENT: {
        bg: "bg-red-50 dark:bg-red-900/20",
        border: "border border-red-200 dark:border-red-800",
        icon: <UserX className="w-5 h-5 text-red-600 dark:text-red-400" />,
        title: "Vắng mặt",
        subtitle: "Bạn đã không tham gia hoạt động",
        iconBg: "bg-red-100 dark:bg-red-900/30",
        textColor: "text-red-900 dark:text-red-300",
        subTextColor: "text-red-700 dark:text-red-400",
      },
      CANCELLED: {
        bg: "bg-gray-50 dark:bg-gray-900/20",
        border: "border border-gray-200 dark:border-gray-800",
        icon: <XCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
        title: "Đã hủy",
        subtitle: "Bạn đã hủy tham gia hoạt động này",
        iconBg: "bg-gray-100 dark:bg-gray-900/30",
        textColor: "text-gray-900 dark:text-gray-300",
        subTextColor: "text-gray-700 dark:text-gray-400",
      },
    };

    const conf = STATUS_CONFIG[status];

    return (
      <>
        <div
          className={`relative flex items-start gap-3 p-3 rounded-xl ${conf.bg} ${conf.border}`}
        >
          <div
            className={`w-10 h-10 ${conf.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}
          >
            {conf.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-sm font-medium ${conf.textColor}`}>
              {conf.title}
            </p>
            <p className={`text-sm font-semibold ${conf.subTextColor}`}>
              {conf.subtitle}
            </p>
          </div>

          {/* Dialog đặt ở góc phải của item */}
          {status === "ABSENT" && (
            <div className="ml-auto flex items-center">
              {!eventDetail.sendReason ? (
                <AbsenceDialog eventId={eventDetail.id} />
              ) : (
                <span className="px-4 py-2 text-sm font-medium text-red-700 border border-red-300 rounded-lg bg-red-50 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700 transition-colors duration-200">
                  Đã gửi lý do
                </span>
              )}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Section với ảnh */}
        <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="relative h-80 lg:h-96">
            <Image
              src={eventDetail.image || "/api/placeholder/800/400"}
              alt={eventDetail.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-6 right-6">
              {getStatusBadge(eventDetail.status)}
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                {eventDetail.title}
              </h1>
              <div className="mb-2 flex items-center text-white/90 text-sm">
                <CircleStar className="w-4 h-4 mr-2 text-yellow-400" />
                <span className="mr-1">Câu lạc bộ:</span>
                <Link
                  href={`/clubs/${eventDetail.clubSlug}`}
                  className="font-medium hover:text-white transition-colors"
                >
                  {eventDetail.nameClub}
                </Link>
              </div>
              <div className="flex items-center text-white/90 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(eventDetail.startTime)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-4"></div>
                Mô tả sự kiện
              </h2>
              {isHTML(eventDetail.description) ? (
                <div
                  className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: eventDetail.description }}
                />
              ) : (
                <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
                  <p className="whitespace-pre-line leading-relaxed text-base">
                    {eventDetail.description}
                  </p>
                </div>
              )}
            </div>

            {eventDetail.requirements && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full mr-4"></div>
                  Yêu cầu tham gia
                </h2>
                {isHTML(eventDetail.requirements) ? (
                  <div
                    className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300"
                    dangerouslySetInnerHTML={{
                      __html: eventDetail.requirements,
                    }}
                  />
                ) : (
                  <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
                    <p className="whitespace-pre-line leading-relaxed text-base">
                      {eventDetail.requirements}
                    </p>
                  </div>
                )}
              </div>
            )}

            {eventDetail.categories != null &&
              eventDetail.categories?.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full mr-4"></div>
                    Nội dung thi đấu
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {eventDetail.categories.map((c: string, i: number) => (
                      <Badge
                        key={i}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-5 py-3 font-semibold text-base"
                      >
                        {getCategoryLabel(c)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Thông tin hoạt động
              </h2>

              <div className="space-y-4">
                {/* Joined Status */}
                {renderParticipantStatus(eventDetail.participantStatus)}

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Địa điểm
                    </p>

                    {eventDetail.facility ? (
                      <>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {eventDetail.facility.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
                          {eventDetail.facility.address},{" "}
                          {eventDetail.facility.district},{" "}
                          {eventDetail.facility.city}
                        </p>
                        {eventDetail.facility.latitude &&
                          eventDetail.facility.longitude && (
                            <a
                              href={`https://www.google.com/maps?q=${eventDetail.facility.latitude},${eventDetail.facility.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 underline text-sm"
                            >
                              Xem trên Google Maps
                            </a>
                          )}
                      </>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
                        {eventDetail.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Trình độ yêu cầu
                    </p>
                    <span className="text-sm text-gray-600 dark:text-gray-300 break-words">
                      {eventDetail.minLevel.toFixed(1)} -{" "}
                      {eventDetail.maxLevel.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Ngày diễn ra
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {formatDate(eventDetail.startTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Thời gian
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {formatTime(eventDetail.startTime)} -{" "}
                      {formatTime(eventDetail.endTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Số lượng
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {eventDetail.joinedMember}/{eventDetail.totalMember} thành
                      viên ({eventDetail.joinedOpenMembers}/
                      {eventDetail.maxOutsideMembers} vãng lai)
                    </p>
                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (eventDetail.joinedMember /
                              eventDetail.totalMember) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {eventDetail.fee != null && eventDetail.fee > 0 && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Phí tham gia
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold">
                        {eventDetail.fee.toLocaleString("vi-VN")} VNĐ
                      </p>
                    </div>
                  </div>
                )}

                {eventDetail.deadline && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-red-900 dark:text-red-300">
                        Hạn đăng ký
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-400">
                        {formatTime(eventDetail.deadline)} -{" "}
                        {formatDate(eventDetail.deadline)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                {eventDetail.participantRole === "OWNER" && (
                  <div className="flex flex-col gap-3">
                    {eventDetail.status !== "CANCELLED" &&
                      eventDetail.status !== "FINISHED" &&
                      eventDetail.status !== "ONGOING" && (
                        <EditEventButton eventData={eventDetail} />
                      )}
                    {eventDetail.status !== "CANCELLED" &&
                      eventDetail.status !== "FINISHED" &&
                      eventDetail.status !== "ONGOING" && (
                        <CancelEventDialog
                          eventId={eventDetail.id}
                          token={accessToken?.value || ""}
                        />
                      )}
                  </div>
                )}

                {eventDetail.participantRole === "MEMBER" &&
                  eventDetail.status == "OPEN" && (
                    <div className="flex flex-col gap-3">
                      {eventDetail.joinedMember == eventDetail.totalMember ? (
                        <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                          <p className="text-amber-700 dark:text-amber-300 text-sm font-medium">
                            Đã đầy
                          </p>
                        </div>
                      ) : !eventDetail.joined ? (
                        <JoinEventButton
                          eventId={eventDetail.id}
                          isMember={true}
                        />
                      ) : (
                        eventDetail.participantStatus !== "CANCELLED" && (
                          <CancelJoinEventButton
                            eventId={eventDetail.id}
                            token={accessToken?.value || ""}
                          />
                        )
                      )}
                    </div>
                  )}

                {eventDetail.participantRole === "GUEST" &&
                  eventDetail.status == "OPEN" && (
                    <>
                      {eventDetail.joinedMember == eventDetail.totalMember ? (
                        <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                          <p className="text-amber-700 dark:text-amber-300 text-sm font-medium">
                            Đã đầy
                          </p>
                        </div>
                      ) : eventDetail.openForOutside ? (
                        <div className="flex flex-col gap-3">
                          {!eventDetail.joined ? (
                            <>
                              {eventDetail.joinedOpenMembers <
                              eventDetail.maxOutsideMembers ? (
                                <JoinEventButton
                                  eventId={eventDetail.id}
                                  isMember={false}
                                />
                              ) : (
                                <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                                  <p className="text-amber-700 dark:text-amber-300 text-sm font-medium">
                                    Đã đủ số lượng vãng lai
                                  </p>
                                </div>
                              )}
                            </>
                          ) : eventDetail.participantStatus !== "PENDING" ? (
                            eventDetail.participantStatus !== "CANCELLED" && (
                              <CancelJoinEventButton
                                eventId={eventDetail.id}
                                token={accessToken?.value || ""}
                              />
                            )
                          ) : (
                            <Button
                              variant="ghost"
                              disabled
                              className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                              <UserMinus className="w-4 h-4 mr-2" />
                              Vui lòng chờ phê duyệt
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                          <p className="text-amber-700 dark:text-amber-300 text-sm font-medium">
                            Sự kiện này không mở cho thành viên ngoài tham gia.
                          </p>
                        </div>
                      )}
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-6">
        {eventDetail.participantRole === "OWNER" && (
          <>
            <ParticipantsSection
              participants={participants}
              eventId={eventDetail.id}
              status={eventDetail.status}
              token={accessToken?.value || ""}
            />
          </>
        )}
      </div>
      <div className="max-w-7xl mx-auto p-6">
        {eventDetail.status == "FINISHED" && (
          <>
            <ViewRating
              eventId={eventDetail.id}
              isJoined={eventDetail.joined}
              isOwner={eventDetail.participantRole === "OWNER"}
            />
            <div className="mt-8">
              {/* Hiển thị form đăng highlights cho người dùng đã tham gia sự kiện */}
              {(eventDetail.joined ||
                eventDetail.participantRole === "OWNER") && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <div className="w-2 h-8 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full mr-4"></div>
                    Chia sẻ khoảnh khắc của bạn
                  </h2>
                  <CreateHighlightButton eventId={eventDetail.id} user={user} />
                </div>
              )}

              {/* Hiển thị component highlights khi sự kiện đã kết thúc */}
              <EventHighlights
                eventId={eventDetail.id}
                isFinished={eventDetail.status === "FINISHED"}
                user={user}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
