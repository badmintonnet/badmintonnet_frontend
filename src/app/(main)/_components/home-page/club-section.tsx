import clubServiceApi from "@/apiRequest/club";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  MapPin,
  GraduationCap,
  ChevronRight,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { isHTML } from "@/lib/utils";

type ClubSectionProps = {
  accessToken: string;
};

export default async function ClubSection({ accessToken }: ClubSectionProps) {
  let clubs;

  try {
    const res = await clubServiceApi.getSuggestedClubs(accessToken);
    clubs = res.payload.data.content;
  } catch (error) {
    console.error("Error fetching suggested clubs:", error);
    return (
      <div className="min-h-[300px] flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 rounded-2xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-200 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
            Không thể tải danh sách CLB
          </h3>
          <p className="text-red-700 dark:text-red-300">
            Vui lòng thử lại sau.
          </p>
        </div>
      </div>
    );
  }

  if (!clubs || clubs.length === 0) {
    return (
      <div className="min-h-[300px] flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-900/20 rounded-2xl p-8">
        <div className="text-center">
          <Users className="w-16 h-16 text-emerald-400 dark:text-emerald-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Chưa có CLB gợi ý
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Hiện chưa có CLB phù hợp để gợi ý cho bạn.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              CLB Gợi Ý Cho Bạn
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Tham gia ngay để kết nối với cộng đồng
            </p>
          </div>

          <Link
            href="/clubs"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg group"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid - 4 cards per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {clubs.map((club) => (
            <Link
              key={club.id}
              href={`/clubs/${club.slug}`}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl border border-emerald-100 dark:border-emerald-900 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1"
            >
              {/* Header with gradient background */}
              <div className="relative bg-gradient-to-br from-emerald-500 to-teal-500 p-6 pb-12">
                {/* Logo */}
                <div className="absolute top-4 right-4 w-14 h-14 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-lg bg-white dark:bg-gray-700">
                  <Image
                    src={club.logoUrl || "/images/club-default.png"}
                    alt={club.name}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Club Name */}
                <h3 className="text-lg font-bold text-white pr-16 line-clamp-2 drop-shadow-md">
                  {club.name}
                </h3>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                {/* Description */}
                {club.description && (
                  <div className="mb-4">
                    {!isHTML(club.description) ? (
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {club.description}
                      </p>
                    ) : (
                      <div
                        className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: club.description }}
                      />
                    )}
                  </div>
                )}

                {/* Info Section */}
                <div className="space-y-2.5 mb-4">
                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-md flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" />
                    </div>
                    <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium line-clamp-1">
                      {club.facility
                        ? [club.facility.district, club.facility.city]
                            .filter(Boolean)
                            .join(", ")
                        : club.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-md flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {club.totalEvent}
                      </span>{" "}
                      hoạt động
                    </span>
                  </div>
                  {/* Members */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-md flex items-center justify-center flex-shrink-0">
                      <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {club.memberCount}/{club.maxMembers}
                      </span>{" "}
                      thành viên
                    </span>
                  </div>

                  {/* Level */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-md flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Trình độ:
                      </span>{" "}
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {club.minLevel} – {club.maxLevel}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {club.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {club.tags.slice(0, 3).map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 dark:from-emerald-900/40 dark:to-teal-900/40 dark:text-emerald-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Hover overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
