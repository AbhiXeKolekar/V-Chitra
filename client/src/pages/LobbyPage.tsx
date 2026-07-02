import { useEffect } from "react";
import { useGame } from "../context/GameContext";
import { socket } from "../socket/socket";
import LobbyHeader from "../components/LobbyHeader";
import RoomCode from "../components/RoomCode";
import PlayerCard from "../components/PlayerCard";

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

    const onPlayerLeft = (updatedRoom: Room) => {
  setRoom(updatedRoom);
};

socket.on("player-left", onPlayerLeft);

    return () => {
      socket.off("player-joined", onPlayerJoined);
      socket.off("player-left", onPlayerLeft);
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
      <LobbyHeader />

<div className="mt-6">
  <RoomCode code={room.code} />
</div>

<div className="mt-10 w-96 rounded-xl bg-slate-900 p-6">
  <h2 className="mb-4 text-2xl font-semibold">
    Players
  </h2>

  <div className="space-y-3">
    {room.players.map((player) => (
      <PlayerCard
        key={player.id}
        player={player}
      />
    ))}
  </div>
</div>
    </div>
  );
}

export default LobbyPage;