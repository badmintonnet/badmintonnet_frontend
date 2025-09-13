import Image from "next/image";
import { MapPin, Users, Calendar } from "lucide-react";
import clubServiceApi from "@/apiRequest/club";
import { JoinClubButton } from "@/app/(main)/clubs/_components/join-club-button";
import RatingView from "@/app/(main)/my-clubs/_components/rating-view";

interface ClubDetailPageProps {
  params: Promise<{ id: string }>;
}
const ClubDetailPage = async ({ params }: ClubDetailPageProps) => {
  const { id } = await params;
  const response = await clubServiceApi.getClubById(id);
  const club = response.payload.data || null;
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Content */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Image
              src={club.logoUrl || ""}
              alt={club.name}
              width={80}
              height={80}
              className="rounded-full border-2 border-green-500 dark:border-green-400"
              priority
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {club.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Chủ nhiệm: {club.ownerName}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {club.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {club.tags.map((tag, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  idx % 2 === 0
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Info */}
        </div>

        {/* Right Sidebar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Thông tin
            </h2>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                {club.location}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Users className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Tối đa {club.maxMembers} thành viên
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
                <Calendar className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                Ngày tạo: {new Date(club.createdAt).toLocaleDateString("vi-VN")}
              </div>
            </div>
            <JoinClubButton
              clubId={club.id}
              clubName={club.name}
              isRefresh={false}
            />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto space-y-8 mt-6">
        <RatingView id={club.id} />
      </div>
    </div>
  );
};

export default ClubDetailPage;
