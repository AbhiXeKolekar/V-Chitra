type Player = {
  id: string;
  username: string;
  isHost: boolean;
};

import type { Player } from "../../../shared";

function PlayerCard({ player }: PlayerCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-800 px-4 py-3">
      <span className="font-medium">{player.username}</span>

      {player.isHost && (
        <span className="text-yellow-400 font-semibold">
          👑 Host
        </span>
      )}
    </div>
  );
}

export default PlayerCard;