"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type {
  BracketTreeSchemaType,
  TournamentMatchSchemaType,
} from "@/schemaValidations/match";
import BracketRound from "./BracketRound";
import BracketMatchCard from "./BracketMatchCard";
import BracketConnector from "./BracketConnector";
import ChampionCard from "./ChampionCard";

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

  return (
    <>
      {/* ── Desktop/Tablet: horizontal scrollable bracket ── */}
      <div className="hidden sm:block">
        <div className="w-full overflow-x-auto pb-4">
          <div className="flex min-w-max items-start gap-0 pb-4 pt-1">
            {rounds.map((round, idx) => (
              <div key={round.round} className="flex items-start">
                <BracketRound
                  round={round}
                  totalRounds={totalRounds}
                  isAdmin={isAdmin}
                  onEditMatch={onEditMatch}
                />
                {idx < rounds.length - 1 && (
                  <BracketConnector matchCount={round.matches.length} />
                )}
              </div>
            ))}

            {/* Champion column */}
            <div className="ml-3 mt-6">
              <ChampionCard winnerName={champion} />
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
