import type {
  BracketRoundSchemaType,
  TournamentMatchSchemaType,
} from "@/schemaValidations/match";
import BracketMatchCard from "./BracketMatchCard";

function getRoundLabel(round: number, totalRounds: number): string {
  const fromEnd = totalRounds - round + 1;
  if (fromEnd === 1) return "CHUNG KẾT";
  if (fromEnd === 2) return "BÁN KẾT";
  if (fromEnd === 3) return "TỨ KẾT";
  return `VÒNG ${round}`;
}

interface Props {
  round: BracketRoundSchemaType;
  totalRounds: number;
  isAdmin?: boolean;
  onEditMatch?: (match: TournamentMatchSchemaType) => void;
}

export default function BracketRound({
  round,
  totalRounds,
  isAdmin,
  onEditMatch,
}: Props) {
  const isFinalRound = round.round === totalRounds;
  const label = getRoundLabel(round.round, totalRounds);

  return (
    <div className="flex shrink-0 flex-col">
      {/* Round label */}
      <div className="mb-3 px-1 h-6 flex items-center">
        <span className="text-[11px] font-semibold tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>

      {/* Match cards */}
      <div className="flex flex-col gap-3">
        {round.matches.map((match) => (
          <BracketMatchCard
            key={match.matchId}
            match={match}
            isFinal={isFinalRound}
            isAdmin={isAdmin}
            onEditMatch={onEditMatch}
          />
        ))}
      </div>
    </div>
  );
}
