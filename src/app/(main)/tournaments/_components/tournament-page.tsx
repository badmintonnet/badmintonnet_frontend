"use client";

import {
  getCategoryLabel,
  getTournamentStatusInfo,
  TournamentResponse,
} from "@/schemaValidations/tournament.schema";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface TournamentPageProps {
  tournaments: TournamentResponse[];
}

export default function TournamentPage({ tournaments }: TournamentPageProps) {
  const tournamentsByMonth = tournaments.reduce((acc, t) => {
    const date = new Date(t.startDate);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(t);
    return acc;
  }, {} as Record<string, TournamentResponse[]>);

  const dataBymonth = Object.keys(tournamentsByMonth);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-8 px-6 overflow-hidden transition-colors duration-300">
      {/* Đường timeline trung tâm */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-200 dark:bg-slate-700 pointer-events-none z-0" />

      {dataBymonth.map((monthKey, i) => {
        const items = tournamentsByMonth[monthKey];
        const monthDate = new Date(monthKey + "-02");
        const monthName = `${monthDate.toLocaleString("vi-VN", {
          month: "long",
        })} - ${monthDate.getFullYear()}`;

        return (
          <section key={monthKey} className="relative mb-24">
            {/* Tiêu đề tháng */}
            <div className="relative text-center mb-12 z-10">
              <h2 className="inline-block px-6 py-2 rounded-full bg-white/80 dark:bg-slate-800/70 text-sky-600 dark:text-sky-400 font-semibold text-xl md:text-2xl tracking-wide backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm">
                {monthName}
              </h2>
            </div>

            {/* Timeline các giải */}
            <div className="flex flex-col gap-12 md:gap-20 relative z-10">
              {items.map((tournament, index) => {
                const side = (i + index) % 2 === 0 ? "left" : "right";
                return (
                  <motion.div
                    key={tournament.id}
                    initial={{ opacity: 0, x: side === "left" ? -100 : 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.3 }}
                    className={`relative flex items-center w-full md:w-1/2 ${
                      side === "left" ? "md:self-start" : "md:self-end"
                    }`}
                  >
                    {/* Card giải đấu */}
                    <Link
                      href={`/tournaments/${tournament.slug}`}
                      className="w-full"
                    >
                      <div
                        className={`w-full bg-white/90 dark:bg-slate-800/90 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col sm:flex-row border border-slate-200 dark:border-slate-700 hover:border-sky-400/50 dark:hover:border-sky-500/70 backdrop-blur-sm ${
                          side === "right" ? "sm:flex-row-reverse" : ""
                        }`}
                      >
                        {/* Logo */}
                        <div className="w-full sm:w-1/3 bg-slate-100 dark:bg-slate-900/40 flex items-center justify-center p-5">
                          <Image
                            src={tournament.logoUrl || "/default-logo.png"}
                            alt={tournament.name || "Logo giải đấu"}
                            width={130}
                            height={130}
                            className="object-contain rounded-lg drop-shadow-md"
                          />
                        </div>

                        {/* Banner + Info */}
                        <div className="w-full sm:w-2/3 flex flex-col">
                          <Image
                            src={tournament.bannerUrl || "/default-banner.jpg"}
                            alt={tournament.name || "Ảnh banner giải đấu"}
                            width={400}
                            height={240}
                            className="object-cover w-full h-48 sm:h-56"
                          />
                          <div className="p-5 flex flex-col flex-grow">
                            <div
                              className={`${
                                getTournamentStatusInfo(tournament.status).color
                              } text-xs font-semibold uppercase mb-2 tracking-wider`}
                            >
                              {getTournamentStatusInfo(tournament.status).label}
                            </div>
                            <h3
                              className={`text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug`}
                            >
                              {tournament.name}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 line-clamp-2 flex-grow">
                              {tournament.facility
                                ? tournament.facility.location
                                : tournament.location ?? "Chưa cập nhật"}
                            </p>
                            {tournament.categories &&
                              tournament.categories.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {tournament.categories.map((cat) => (
                                    <span
                                      key={cat.id}
                                      className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                                    >
                                      {getCategoryLabel(cat.category)}
                                    </span>
                                  ))}
                                </div>
                              )}

                            {/* Thời gian đăng ký */}
                            <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                              Đăng ký:{" "}
                              <span className="text-sky-600 dark:text-sky-400 font-medium">
                                {new Date(
                                  tournament.registrationStartDate
                                ).toLocaleDateString("vi-VN")}
                              </span>{" "}
                              →{" "}
                              <span className="text-sky-600 dark:text-sky-400 font-medium">
                                {new Date(
                                  tournament.registrationEndDate
                                ).toLocaleDateString("vi-VN")}
                              </span>
                            </div>

                            {/* Thời gian thi đấu */}
                            <p className="text-slate-400 dark:text-slate-500 text-xs mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                              Thi đấu:{" "}
                              <span className="text-sky-500 dark:text-sky-400 font-medium">
                                {new Date(
                                  tournament.startDate
                                ).toLocaleDateString("vi-VN")}
                              </span>{" "}
                              →{" "}
                              <span className="text-sky-500 dark:text-sky-400 font-medium">
                                {new Date(
                                  tournament.endDate
                                ).toLocaleDateString("vi-VN")}
                              </span>
                            </p>
                            {/* <p className="text-slate-400 dark:text-slate-500 text-xs mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                            {new Date(tournament.startDate).toLocaleDateString(
                              "vi-VN"
                            )}{" "}
                            -{" "}
                            {new Date(tournament.endDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p> */}
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Chấm timeline */}
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-slate-50 dark:bg-slate-900 rounded-full border-[5px] border-sky-500 shadow-[0_0_10px_rgba(56,189,248,0.5)] hidden md:block ${
                        side === "left"
                          ? "right-0 translate-x-[calc(50%+1px)]"
                          : "left-0 -translate-x-[calc(50%+1px)]"
                      }`}
                    />
                  </motion.div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
