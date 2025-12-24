import Image from "next/image";
import {
  getCategoryLabel,
  TournamentPlayer,
} from "@/schemaValidations/tournament.schema";
import Link from "next/link";

interface PlayersSectionProps {
  players: TournamentPlayer[];
}

export default function PlayersSection({ players }: PlayersSectionProps) {
  return (
    <div className="space-y-6">
      {players.map((item) => (
        <div key={item.id} className="border rounded-lg p-4">
          {/* Category */}
          <h3 className="text-lg font-semibold mb-3">
            Nội dung: {getCategoryLabel(item.category)}
          </h3>

          {/* Players - ĐƠN */}
          {item.players && item.players.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {item.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-3 border p-2 rounded"
                >
                  <Image
                    src={player.avatarUrl ?? "/avatar-default.png"}
                    alt={player.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <span className="font-medium">{player.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Teams - ĐÔI */}
          {item.teams && item.teams.length > 0 && (
            <div className="space-y-3">
              {item.teams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center gap-4 border p-3 rounded"
                >
                  {/* Player 1 */}
                  <div className="flex items-center gap-2">
                    <Link href={`/profile/${team.slug1}`}>
                      <Image
                        src={team.avatarUrl1 ?? "/avatar-default.png"}
                        alt={team.slug1 ?? "Player 1"}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </Link>
                  </div>

                  {/* Player 2 */}
                  <div className="flex items-center gap-2">
                    <Link href={`/profile/${team.slug2}`}>
                      <Image
                        src={team.avatarUrl2 ?? "/avatar-default.png"}
                        alt={team.slug2 ?? "Player 2"}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </Link>
                    <span>{team.teamName}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
