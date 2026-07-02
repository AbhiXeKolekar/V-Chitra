import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

type Player = {
  id: string;
  username: string;
  isHost: boolean;
};

type Room = {
  code: string;
  players: Player[];
};

function HomePage() {
  const { setRoom } = useGame();

  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const onRoomCreated = (room: Room) => {
      setRoom(room);
      navigate(`/lobby/${room.code}`);
    };

    const onRoomJoined = (room: Room) => {
      setRoom(room);
      navigate(`/lobby/${room.code}`);
    };

    const onRoomError = (error: { message: string }) => {
      alert(error.message);
    };

    socket.on("room-created", onRoomCreated);
    socket.on("room-joined", onRoomJoined);
    socket.on("room-error", onRoomError);

    return () => {
      socket.off("room-created", onRoomCreated);
      socket.off("room-joined", onRoomJoined);
      socket.off("room-error", onRoomError);
    };
  }, [navigate, setRoom]);

  const createRoom = () => {
    if (!username.trim()) return;

    socket.emit("create-room", {
      username,
    });
  };

  const joinRoom = () => {
    if (!username.trim()) return;
    if (!roomCode.trim()) return;

    socket.emit("join-room", {
      username,
      roomCode,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-5xl font-bold">🎨 Draw Together</h1>

      <input
        className="w-80 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 outline-none focus:border-blue-500"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your name"
      />

      <input
        className="w-80 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 uppercase outline-none focus:border-blue-500"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
        placeholder="Room Code"
      />

      <div className="flex gap-4">
        <button
          className="rounded-lg bg-blue-600 px-6 py-2 hover:bg-blue-500 transition"
          onClick={createRoom}
        >
          Create Room
        </button>

        <button
          className="rounded-lg bg-green-600 px-6 py-2 hover:bg-green-500 transition"
          onClick={joinRoom}
        >
          Join Room
        </button>
      </div>
    </div>
  );
}

export default HomePage;