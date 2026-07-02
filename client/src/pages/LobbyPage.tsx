import { useEffect } from "react";
import { useGame } from "../context/GameContext";
import { socket } from "../socket/socket";

type Player = {
  id: string;
  username: string;
  isHost: boolean;
};

type Room = {
  code: string;
  players: Player[];
};

function LobbyPage() {
  const { room, setRoom } = useGame();

  useEffect(() => {
    const onPlayerJoined = (updatedRoom: Room) => {
      setRoom(updatedRoom);
    };

    socket.on("player-joined", onPlayerJoined);

    return () => {
      socket.off("player-joined", onPlayerJoined);
    };
  }, [setRoom]);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <h2>No room found.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center pt-16">
      <h1 className="text-4xl font-bold">Lobby</h1>

      <p className="mt-4 text-xl">
        Room Code:
        <span className="ml-2 font-mono text-blue-400">
          {room.code}
        </span>
      </p>

      <div className="mt-10 w-96 rounded-xl bg-slate-900 p-6">
        <h2 className="mb-4 text-2xl font-semibold">
          Players
        </h2>

        <ul className="space-y-3">
          {room.players.map((player) => (
            <li
              key={player.id}
              className="flex justify-between rounded-lg bg-slate-800 px-4 py-3"
            >
              <span>{player.username}</span>

              {player.isHost && (
                <span>👑 Host</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LobbyPage;