import { useEffect, useState } from "react";

import GameHeader from "../components/game/GameHeader";
import Toolbar from "../components/game/Toolbar";
import Canvas from "../components/game/Canvas";
import Sidebar from "../components/game/Sidebar";

import { socket } from "../socket/socket";
import { useGame } from "../context/GameContext";

import type {
  GameState,
  DrawerData,
} from "../../../shared/game";

function GamePage() {
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);

  const {
    room,
    gameState,
    setGameState,
    drawerWord,
    setDrawerWord,
  } = useGame();

  useEffect(() => {
    if (!room) return;

    // Ask the server for the latest game state
    socket.emit("get-game-state", room.code);

    const onGameState = (state: GameState) => {
      setGameState(state);
    };

    const onDrawerData = (data: DrawerData) => {
      setDrawerWord(data.word);
    };

    socket.on("game-state", onGameState);
    socket.on("drawer-data", onDrawerData);

    return () => {
      socket.off("game-state", onGameState);
      socket.off("drawer-data", onDrawerData);
    };
  }, [room, setGameState, setDrawerWord]);

  const clearCanvas = () => {
    window.dispatchEvent(new Event("clear-canvas"));
  };

  const isDrawer =
    gameState?.drawerId === socket.id;

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <GameHeader />

      {gameState && (
        <div className="mb-6 rounded-xl bg-slate-900 p-4 text-center">
          <h2 className="text-2xl font-bold">
            🎨 {gameState.drawerName} is drawing
          </h2>

          <p className="mt-2 text-lg">
            {isDrawer
              ? `Your word: ${drawerWord}`
              : `Word: ${"_ ".repeat(
                  gameState.wordLength
                )}`}
          </p>
        </div>
      )}

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