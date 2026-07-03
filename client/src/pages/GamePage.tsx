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

type ScoreMap = Record<string, number>;

function GamePage() {
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);
  const [announcement, setAnnouncement] = useState("");

  const {
    room,

    gameState,
    setGameState,

    drawerWord,
    setDrawerWord,

    timeLeft,
    setTimeLeft,

    scores,
    setScores,
  } = useGame();

  useEffect(() => {
    if (!room) return;

    socket.emit("get-game-state", room.code);

    const onGameState = (state: GameState) => {
      setGameState(state);
      setTimeLeft(state.timeLeft);
    };

    const onDrawerData = (data: DrawerData) => {
      setDrawerWord(data.word);
    };

    const onTimerUpdate = (time: number) => {
      setTimeLeft(time);
    };

    const onScoreUpdate = (updatedScores: ScoreMap) => {
      setScores(updatedScores);
    };

    const onCorrectGuess = (data: {
      username: string;
    }) => {
      setAnnouncement(
        `🎉 ${data.username} guessed the word!`
      );

      setTimeout(() => {
        setAnnouncement("");
      }, 3000);
    };

    socket.on("game-state", onGameState);
    socket.on("drawer-data", onDrawerData);
    socket.on("timer-update", onTimerUpdate);
    socket.on("score-update", onScoreUpdate);
    socket.on("correct-guess", onCorrectGuess);

    return () => {
      socket.off("game-state", onGameState);
      socket.off("drawer-data", onDrawerData);
      socket.off("timer-update", onTimerUpdate);
      socket.off("score-update", onScoreUpdate);
      socket.off("correct-guess", onCorrectGuess);
    };
  }, [
    room,
    setGameState,
    setDrawerWord,
    setTimeLeft,
    setScores,
  ]);

  const clearCanvas = () => {
    window.dispatchEvent(
      new Event("clear-canvas")
    );
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

          <h1 className="mt-4 text-5xl font-bold text-yellow-400">
            ⏱ {timeLeft}s
          </h1>

          {announcement && (
            <div className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-xl font-semibold">
              {announcement}
            </div>
          )}
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

        <div className="flex flex-col gap-6">
          <div className="rounded-xl bg-slate-900 p-4 w-72">
            <h2 className="mb-3 text-xl font-bold">
              🏆 Scoreboard
            </h2>

            {room?.players.map((player) => (
              <div
                key={player.id}
                className="flex justify-between border-b border-slate-700 py-2"
              >
                <span>
                  {player.username}
                  {player.isHost && " 👑"}
                </span>

                <span>
                  {scores[player.id] ?? 0}
                </span>
              </div>
            ))}
          </div>

          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default GamePage;