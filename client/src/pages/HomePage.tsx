import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const onRoomCreated = (room: { code: string }) => {
      console.log("Room created:", room);

      navigate(`/lobby/${room.code}`);
    };

    socket.on("room-created", onRoomCreated);

    return () => {
      socket.off("room-created", onRoomCreated);
    };
  }, [navigate]);

  const createRoom = () => {
    if (!username.trim()) return;

    socket.emit("create-room", {
      username,
    });
  };

  return (
    <div>
      <h1>🎨 Draw Together</h1>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your name"
      />

      <br />
      <br />

      <button onClick={createRoom}>
        Create Room
      </button>

      <button>
        Join Room
      </button>
    </div>
  );
}

export default HomePage;