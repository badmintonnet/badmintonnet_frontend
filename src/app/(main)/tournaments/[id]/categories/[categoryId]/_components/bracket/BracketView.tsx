"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type {
  BracketTreeSchemaType,
  TournamentMatchSchemaType,
} from "@/schemaValidations/match";
import BracketMatchCard from "./BracketMatchCard";
import ChampionCard from "./ChampionCard";
import { useBracketConnectors } from "@/components/bracket/useBracketConnectors";

function getRoundLabel(round: number, totalRounds: number): string {
  const fromEnd = totalRounds - round + 1;
  if (fromEnd === 1) return "Chung kết";
  if (fromEnd === 2) return "Bán kết";
  if (fromEnd === 3) return "Tứ kết";
  return `Vòng ${round}`;
}

interface Props {
  bracketData: BracketTreeSchemaType;
  isAdmin?: boolean;
  onEditMatch?: (match: TournamentMatchSchemaType) => void;
}

export default function BracketView({
  bracketData,
  isAdmin,
  onEditMatch,
}: Props) {
  const { rounds, totalRounds } = bracketData;
  const finalMatch = rounds[rounds.length - 1]?.matches[0];
  const champion = finalMatch?.winnerName ?? null;

  // Đường nối khuỷu giữa các vòng — đo vị trí card thật (dùng chung với bracket CLB)
  const { containerRef, paths, size } = useBracketConnectors(bracketData);

  return (
    <>
      {/* ── Desktop/Tablet: horizontal scrollable bracket ── */}
      <div className="hidden sm:block">
        <div className="w-full overflow-x-auto pb-4">
          <div
            ref={containerRef}
            className="relative flex min-w-max items-stretch gap-0 pb-4 pt-1"
          >
            {/* Lớp đường nối khuỷu giữa các vòng */}
            <svg
              className="pointer-events-none absolute left-0 top-0 z-0 overflow-visible text-border"
              width={size.w}
              height={size.h}
              aria-hidden="true"
            >
              <path
                d={paths}
                fill="none"
                strokeWidth={1.5}
                className="stroke-current"
              />
            </svg>

            {rounds.map((round, roundIdx) => (
              <div
                key={round.round}
                className={`relative z-[1] flex shrink-0 ${
                  roundIdx > 0 ? "pl-8 sm:pl-12" : ""
                }`}
              >
                <div className="flex w-52 flex-col">
                  {/* Round label */}
                  <div className="mb-3 flex h-6 items-center justify-center px-1">
                    <span className="text-[11px] font-semibold tracking-widest text-muted-foreground">
                      {getRoundLabel(round.round, totalRounds).toUpperCase()}
                    </span>
                  </div>

                  {/* Mỗi card trong 1 ô flex-1 căn giữa dọc → card vòng sau rơi đúng
                      trung điểm cặp đấu vòng trước, bất kể chiều cao card. */}
                  <div className="flex flex-1 flex-col">
                    {round.matches.map((match, idx) => (
                      <div
                        key={match.matchId}
                        className="flex flex-1 items-center justify-center py-2"
                      >
                        <div
                          data-bracket-card
                          data-bracket-round={round.round}
                          data-bracket-index={idx}
                        >
                          <BracketMatchCard
                            match={match}
                            isFinal={round.round === totalRounds}
                            isAdmin={isAdmin}
                            onEditMatch={onEditMatch}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Champion column — nối tiếp từ trận chung kết */}
            <div className="relative z-[1] flex shrink-0 pl-8 sm:pl-12">
              <div className="flex flex-col">
                <div className="mb-3 flex h-6 items-center justify-center px-1">
                  <span className="text-[11px] font-semibold tracking-widest text-amber-500">
                    VÔ ĐỊCH
                  </span>
                </div>
                <div className="flex flex-1 items-center justify-center py-2">
                  <div
                    data-bracket-card
                    data-bracket-round={totalRounds + 1}
                    data-bracket-index={0}
                  >
                    <ChampionCard winnerName={champion} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile: tabs per round ── */}
      <div className="sm:hidden">
        <Tabs defaultValue={`round-${rounds[0]?.round ?? 1}`}>
          <TabsList className="mb-3 h-auto flex-wrap gap-1 bg-muted/50">
            {rounds.map((round) => (
              <TabsTrigger
                key={round.round}
                value={`round-${round.round}`}
                className="text-xs"
              >
                {getRoundLabel(round.round, totalRounds)}
              </TabsTrigger>
            ))}
          </TabsList>

          {rounds.map((round) => (
            <TabsContent
              key={round.round}
              value={`round-${round.round}`}
              className="space-y-3"
            >
              {round.matches.map((match) => (
                <BracketMatchCard
                  key={match.matchId}
                  match={match}
                  isFinal={round.round === totalRounds}
                  isAdmin={isAdmin}
                  onEditMatch={onEditMatch}
                />
              ))}
              {champion && round.round === totalRounds && (
                <div className="flex justify-center pt-4">
                  <ChampionCard winnerName={champion} />
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
}
