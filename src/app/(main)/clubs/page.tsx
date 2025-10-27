import Image from "next/image";
import { GraduationCap, MapPin, Users } from "lucide-react";
import { CreateClubButton } from "@/app/(main)/clubs/_components/create-club-button";
import { JoinClubButton } from "@/app/(main)/clubs/_components/join-club-button";
import clubServiceApi from "@/apiRequest/club";
import { cookies } from "next/headers";
import { isClubOwner } from "@/lib/utils";
import Link from "next/link";
import ClubFilterForm from "@/app/(main)/clubs/_components/club-filter-form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const ClubList = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    province?: string;
    ward?: string;
    levels?: string; // comma-separated
    reputationSort?: string;
    facilityNames?: string; // comma-separated
  }>;
}) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  // const clubOwner = isClubOwner(accessToken?.value || "");
  // Extract page number from query params, default to 0
  const params = (await searchParams) || {};
  const page = parseInt(params.page || "0", 10);
  const size = 20; // Match the API's default page size

  // Lấy các tham số lọc từ URL - aligned with client-side filter
  const search = params.search || "";
  const province = params.province || "";
  const ward = params.ward || "";
  const selectedLevels = params.levels
    ? params.levels.split(",").filter(Boolean)
    : [];
  const reputationSort = params.reputationSort || "";
  const facilityNames = params.facilityNames
    ? params.facilityNames.split(",").filter(Boolean)
    : [];

  // Fetch clubs dynamically from the API
  const response = await clubServiceApi.getAllPublicClubs({
    page,
    size,
    search,
    province,
    ward,
    selectedLevels,
    reputationSort,
    facilityNames,
    token: accessToken?.value,
  });
  const clubs = response.payload.data.content;
  const { totalPages, page: currentPage, last } = response.payload.data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Câu lạc bộ Cầu Lông
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Tìm kiếm và tham gia các câu lạc bộ cầu lông phù hợp với bạn
          </p>
          {<CreateClubButton />}
        </div>

        <div className="mb-6">
          <ClubFilterForm />
        </div>

        {/* Clubs Grid */}
        {clubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {clubs.map((club) => (
              <div
                key={club.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col justify-between"
              >
                {/* Card Header with Logo */}
                <div className="relative p-6 pb-4">
                  <Link href={`/clubs/${club.slug}`}>
                    <div className="absolute top-4 right-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-lg">
                        <Image
                          src={club.logoUrl || ""}
                          alt={`${club.name} logo`}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          priority
                        />
                      </div>
                    </div>

                    {/* Club Name */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 pr-16">
                      {club.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
                      {club.description}
                    </p>

                    {/* Location */}
                    <TooltipProvider delayDuration={150}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2 cursor-default">
                            <MapPin className="w-4 h-4 mr-2 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <span className="line-clamp-1">
                              {club.facility
                                ? [
                                    club.facility.name,
                                    club.facility.district,
                                    club.facility.city,
                                  ]
                                    .filter(Boolean)
                                    .join(", ")
                                : club.location}
                            </span>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent
                          side="top"
                          className="bg-gray-800 text-white dark:bg-gray-700 dark:text-gray-100 text-sm px-3 py-2 rounded-md shadow-md max-w-xs"
                        >
                          <p>
                            {club.facility
                              ? [
                                  club.facility.name,
                                  club.facility.address,
                                  club.facility.district,
                                  club.facility.city,
                                ]
                                  .filter(Boolean)
                                  .join(", ")
                              : club.location}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Members Count */}
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                      <Users className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                      {club.memberCount}/{club.maxMembers} thành viên
                    </div>

                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4 ">
                      <GraduationCap className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                      Trình độ yêu cầu: {club.minLevel} - {club.maxLevel}
                    </div>
                  </Link>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {club.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          index % 2 === 0
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer with Join Button */}
                <div className="px-6 pb-6">
                  <Button
                    asChild
                    className={`
    w-full py-2.5 rounded-lg font-semibold text-sm mt-auto
    bg-green-600 hover:bg-green-700
    text-white transition-all duration-300 shadow-sm
    dark:bg-green-500 dark:hover:bg-green-600
  `}
                  >
                    <Link href={`/clubs/${club.slug}`}>Xem chi tiết</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Chưa có câu lạc bộ nào
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Hãy là người đầu tiên tạo một câu lạc bộ cầu lông!
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {clubs.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-4">
            <Link
              href={`?page=${currentPage - 1}`}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                currentPage === 0
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed pointer-events-none"
                  : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              }`}
            >
              Trang trước
            </Link>

            <span className="text-gray-600 dark:text-gray-300">
              Trang {currentPage + 1} / {totalPages}
            </span>

            <Link
              href={`?page=${currentPage + 1}`}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                last
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed pointer-events-none"
                  : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              }`}
            >
              Trang sau
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubList;
