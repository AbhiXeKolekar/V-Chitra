import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-6xl font-bold">
        🎨 Draw Together
      </h1>

      <p className="text-slate-400">
        Multiplayer Drawing Game
      </p>

      <button className="rounded-xl bg-blue-600 px-6 py-3 hover:bg-blue-500 transition">
        Create Room
      </button>
    </div>
  );
}

export default HomePage;