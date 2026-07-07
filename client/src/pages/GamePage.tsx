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
  FinalScore,
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

    revealedWord,
    setRevealedWord,

    gameOver,
    setGameOver,

    finalScores,
    setFinalScores,
  } = useGame();

  useEffect(() => {
    if (!room) return;

    socket.emit("get-game-state", room.code);

    const onGameState = (state: GameState) => {
      setGameState(state);
      setTimeLeft(state.timeLeft);

      // New round starts
      setRevealedWord("");
      setAnnouncement("");
    };

    const onDrawerData = (data: DrawerData) => {
      setDrawerWord(data.word);
    };

    const onTimerUpdate = (time: number) => {
      setTimeLeft(time);
    };

    const onScoreUpdate = (
      updatedScores: ScoreMap
    ) => {
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

    const onRoundEnded = (data: {
      word: string;
    }) => {
      setRevealedWord(data.word);
    };

    const onGameOver = (data: {
      scores: FinalScore[];
    }) => {
      setFinalScores(data.scores);
      setGameOver(true);
    };

    socket.on("game-state", onGameState);
    socket.on("drawer-data", onDrawerData);
    socket.on("timer-update", onTimerUpdate);
    socket.on("score-update", onScoreUpdate);
    socket.on("correct-guess", onCorrectGuess);
    socket.on("round-ended", onRoundEnded);
    socket.on("game-over", onGameOver);

    return () => {
      socket.off("game-state", onGameState);
      socket.off("drawer-data", onDrawerData);
      socket.off("timer-update", onTimerUpdate);
      socket.off("score-update", onScoreUpdate);
      socket.off("correct-guess", onCorrectGuess);
      socket.off("round-ended", onRoundEnded);
      socket.off("game-over", onGameOver);
    };
  }, [
    room,
    setGameState,
    setDrawerWord,
    setTimeLeft,
    setScores,
    setRevealedWord,
    setFinalScores,
    setGameOver,
  ]);

  const clearCanvas = () => {
    window.dispatchEvent(
      new Event("clear-canvas")
    );
  };

  const isDrawer =
    gameState?.drawerId === socket.id;

  if (gameOver) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="w-full max-w-lg rounded-xl bg-slate-900 p-8 shadow-2xl">
          <h1 className="mb-6 text-center text-4xl font-bold">
            🏆 Game Over
          </h1>

          <div className="space-y-3">
            {finalScores.map(
              (player, index) => (
                <div
                  key={player.playerId}
                  className="flex justify-between rounded-lg bg-slate-800 p-3"
                >
                  <span>
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : `${index + 1}.`}{" "}
                    {player.username}
                  </span>

                  <span>
                    {player.score} pts
                  </span>
                </div>
              )
            )}
          </div>

          <button
            className="mt-8 w-full rounded-lg bg-green-600 py-3 font-semibold transition hover:bg-green-500"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <GameHeader />

      {gameState && (
        <div className="mb-6 rounded-xl bg-slate-900 p-4 text-center">
          <h2 className="text-2xl font-bold">
            🎨 {gameState.drawerName} is drawing
          </h2>

          <p className="mt-2 text-lg">
            Round {gameState.currentRound} /{" "}
            {gameState.totalRounds}
          </p>

          <p className="mt-3 text-xl font-semibold">
            {revealedWord
              ? `Word: ${revealedWord}`
              : isDrawer
              ? `Your word: ${drawerWord}`
              : `Word: ${"_ ".repeat(
                  gameState.wordLength
                )}`}
          </p>

          <h1 className="mt-4 text-5xl font-bold text-yellow-400">
            ⏱ {timeLeft}s
          </h1>

          {announcement && (
            <div className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-lg font-semibold">
              {announcement}
            </div>
          )}

          {revealedWord && (
            <div className="mt-4 rounded-lg bg-red-600 px-4 py-3 text-xl font-bold">
              📢 Round Over!
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
        disabled={!isDrawer}
      />

      <div className="mt-6 flex gap-8">
        <Canvas
          color={color}
          brushSize={brushSize}
        />

        <div className="flex flex-col gap-6">
          <div className="w-72 rounded-xl bg-slate-900 p-4">
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