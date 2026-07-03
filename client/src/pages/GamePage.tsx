import GameHeader from "../components/game/GameHeader";
import Canvas from "../components/game/Canvas";
import Sidebar from "../components/game/Sidebar";

function GamePage() {
  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <GameHeader />

      <div className="mt-8 flex gap-8">
        <Canvas />

        <Sidebar />
      </div>
    </div>
  );
}

export default GamePage;