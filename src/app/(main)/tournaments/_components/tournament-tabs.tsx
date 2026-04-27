"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import tournamentApiRequest from "@/apiRequest/tournament";
import { TournamentResponse } from "@/schemaValidations/tournament.schema";
import TournamentPage from "./tournament-page";
import { Users, Trophy } from "lucide-react";
import Link from "next/link";

export default function TournamentTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<"INDIVIDUAL" | "CLUB">(
    "INDIVIDUAL",
  );
  const [tournaments, setTournaments] = useState<TournamentResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentPage = parseInt(searchParams.get("page") || "0", 10);
  const size = 20;

  // Fetch data when tab or page changes
  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);
      try {
        const response = await tournamentApiRequest.getAllTournaments(
          currentPage,
          size,
          "",
          activeTab,
        );
        const data = response.payload.data;
        setTournaments(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [activeTab, currentPage]);

  const handleTabChange = (tab: "INDIVIDUAL" | "CLUB") => {
    setActiveTab(tab);
    router.push(`/tournaments?type=${tab}&page=0`);
  };

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-2 mb-6 justify-center">
        <button
          onClick={() => handleTabChange("INDIVIDUAL")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all ${
            activeTab === "INDIVIDUAL"
              ? "bg-sky-500 text-white shadow-lg"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
          }`}
        >
          <Users className="w-4 h-4" />
          Cá nhân
        </button>
        <button
          onClick={() => handleTabChange("CLUB")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all ${
            activeTab === "CLUB"
              ? "bg-violet-500 text-white shadow-lg"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
          }`}
        >
          <Trophy className="w-4 h-4" />
          CLB
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
        </div>
      ) : (
        <>
          {/* Tournament List */}
          <TournamentPage tournaments={tournaments} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12 gap-3">
              {Array.from({ length: totalPages }, (_, i) => (
                <Link
                  key={i}
                  href={`/tournaments?type=${activeTab}&page=${i}`}
                  className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-200 ${
                    i === currentPage
                      ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg"
                      : "bg-white/10 text-gray-800 dark:text-gray-300 hover:bg-gradient-to-r hover:from-green-600 hover:to-blue-600 hover:text-white"
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
