// app/profile/page.tsx (Server Component)
import ProfileContainer from "@/app/(main)/profile/profile-container";
import ProfileStats from "@/app/(main)/profile/profile-stats";

// Server component để fetch data
export default async function ProfilePage() {
  // Fetch dữ liệu từ server
  const profile = await getProfileData();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grid layout cho profile info và stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Thông tin cá nhân (chiếm 2 cột trên desktop) */}
          <div className="lg:col-span-2">
            <ProfileContainer profile={profile} />
          </div>
          
          {/* Thống kê (chiếm 1 cột) */}
          <div className="lg:col-span-1">
            <ProfileStats
              stats={{
                rating: profile.rating,
                totalMatches: profile.totalMatches,
                winRate: profile.winRate,
                joinDate: profile.joinDate,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Hàm fetch data từ server (có thể từ database, API, etc.)
async function getProfileData() {
  // Trong thực tế, fetch từ database hoặc API
  // const response = await fetch(`${process.env.API_URL}/api/profile`);
  // return await response.json();
  
  // Mock data cho demo
  await new Promise(resolve => setTimeout(resolve, 100)); // Giả lập API delay
  
  return {
    id: "user_123",
    email: "nguyenvana@example.com",
    fullName: "Nguyễn Văn An",
    birthDate: "1995-03-15",
    gender: "Nam",
    address: "123 Đường Nguyễn Trãi, Quận 1, TP.HCM",
    bio: "Đam mê cầu lông từ nhỏ, thích thi đấu và giao lưu với các bạn cùng sở thích. Mục tiêu là trở thành tay vợt giỏi và tham gia nhiều giải đấu chuyên nghiệp.",
    avatarUrl: "/api/placeholder/128/128",
    rating: 1650,
    rank: "Trung bình khá",
    totalMatches: 127,
    winRate: 68,
    joinDate: "Tháng 6, 2023",
  };
}

// Export types for TypeScript
export type Profile = {
  id: string;
  email: string;
  fullName: string;
  birthDate: string;
  gender: string;
  address: string;
  bio: string;
  avatarUrl: string;
  rating: number;
  rank: string;
  totalMatches: number;
  winRate: number;
  joinDate: string;
};