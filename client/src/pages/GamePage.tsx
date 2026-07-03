import { useState } from "react";

import GameHeader from "../components/game/GameHeader";
import Toolbar from "../components/game/Toolbar";
import Canvas from "../components/game/Canvas";
import Sidebar from "../components/game/Sidebar";

function GamePage() {
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);

  const clearCanvas = () => {
    window.dispatchEvent(new Event("clear-canvas"));
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <GameHeader />

      <Toolbar
        color={color}
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        onClear={clearCanvas}
      />

      <div className="flex gap-8">
        <Canvas
          color={color}
          brushSize={brushSize}
        />

        <Sidebar />
      </div>
    </div>
  );
}

export default GamePage;