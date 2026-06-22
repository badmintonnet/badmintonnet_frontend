import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  winnerName?: string | null;
}

export default function ChampionCard({ winnerName }: Props) {
  return (
    <div className="w-40 shrink-0 flex flex-col items-center justify-center gap-3 rounded-xl border border-amber-300/60 dark:border-amber-700/40 bg-amber-50/60 dark:bg-amber-950/20 py-8 px-4 text-center">
      <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50">
        <Trophy className="h-7 w-7 text-amber-500" />
      </div>
      <Badge
        variant="outline"
        className="border-amber-400 text-amber-700 dark:text-amber-400 text-[11px]"
      >
        Vô địch
      </Badge>
      <p
        className={`text-sm font-bold leading-snug ${
          winnerName
            ? "text-foreground"
            : "italic text-muted-foreground text-xs"
        }`}
      >
        {winnerName ?? "Chờ kết quả"}
      </p>
    </div>
  );
}
