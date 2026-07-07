import { Server } from "socket.io";

import { roomManager, gameManager } from "../services";



export function startRound(
  io: Server,
  roomCode: string
) {
  const room = roomManager.getRoom(roomCode);

  if (!room) return;

  const session = gameManager.getSession(roomCode);

  if (!session) return;

  io.to(room.code).emit("game-state", {
    drawerId: session.drawerId,
    drawerName: session.drawerName,

    wordLength: session.word.length,

    timeLeft: session.timeLeft,

    currentRound: session.currentRound,
    totalRounds: session.totalRounds,
  });

  io.to(session.drawerId).emit("drawer-data", {
    drawerId: session.drawerId,
    word: session.word,
  });

  gameManager.startTimer(
    room.code,

    (timeLeft) => {
      io.to(room.code).emit(
        "timer-update",
        timeLeft
      );
    },

    () => {
      endRound(io, room.code);
    }
  );
}

export function endRound(
  io: Server,
  roomCode: string
) {
  const room = roomManager.getRoom(roomCode);

  if (!room) return;

  const session = gameManager.getSession(roomCode);

  if (!session) return;

  if (session.timer) {
    clearInterval(session.timer);
    session.timer = null;
  }

  io.to(room.code).emit("round-ended", {
    word: session.word,
  });

  setTimeout(() => {
    const nextSession =
      gameManager.nextRound(room);

    if (!nextSession) {
      const finalScores = room.players
        .map((player) => ({
          playerId: player.id,
          username: player.username,
          score: session.scores[player.id] ?? 0,
        }))
        .sort((a, b) => b.score - a.score);

      io.to(room.code).emit("game-over", {
        scores: finalScores,
      });

      session.timeLeft = 60;
      session.guessedPlayers.clear();

      gameManager.endGame(room.code);

      return;
    }

    io.to(room.code).emit("clear-canvas");

    startRound(io, room.code);
  }, 3000);
}
