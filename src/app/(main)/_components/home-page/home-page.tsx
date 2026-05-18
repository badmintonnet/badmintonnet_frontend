import ClubSection from "@/app/(main)/_components/home-page/club-section";
import MyClubEventSection from "@/app/(main)/_components/home-page/my-club-event-section";
import MyClubSection from "@/app/(main)/_components/home-page/my-club-section";
import SmartRecommendationSection from "@/app/(main)/_components/home-page/smart-recommendation-section";
import WelcomeCard from "@/app/(main)/_components/home-page/welcome-card";
import { jwtDecode } from "jwt-decode";

type HomePageProps = {
  accessToken: string;
};

interface JwtPayload {
  sub: string;
  id: string;
  exp: number;
  iat: number;
  fullName: string;
  authorities: string[];
}

export default async function HomePage({ accessToken }: HomePageProps) {
  const tokenData: JwtPayload = jwtDecode(accessToken);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-14">
        {/* 1. Welcome */}
        <WelcomeCard fullName={tokenData.fullName} />

        {/* 2. My Clubs */}
        <MyClubSection accessToken={accessToken} />

        {/* 3. Smart recommendations */}
        <SmartRecommendationSection accessToken={accessToken} />

        {/* 4. Suggested Clubs */}
        <ClubSection accessToken={accessToken} />

        {/* 5. My Events */}
        <MyClubEventSection accessToken={accessToken} />
      </div>
    </main>
  );
}
