import { Server, Socket } from "socket.io";

import { roomManager, gameManager } from "../services";

function endRound(
  io: Server,
  roomCode: string
) {
  const room = roomManager.getRoom(roomCode);

  if (!room) return;

  const session = gameManager.getSession(roomCode);

  if (!session) return;

  io.to(room.code).emit("round-ended", {
    word: session.word,
  });

  setTimeout(() => {
    const nextSession =
      gameManager.nextRound(room);

    if (!nextSession) {
      io.to(room.code).emit("game-over", {
        scores: session.scores,
      });

      gameManager.endGame(room.code);

      return;
    }

    io.to(room.code).emit("clear-canvas");

    startRound(io, room.code);
  }, 3000);
}

function startRound(
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

export function registerGameHandlers(
  io: Server,
  socket: Socket
) {
  socket.on(
    "start-game",
    (roomCode: string) => {
      const room =
        roomManager.getRoom(roomCode);

      if (!room) return;

      const host = room.players.find(
        (player) => player.isHost
      );

      if (
        !host ||
        host.id !== socket.id
      ) {
        return;
      }

      gameManager.startGame(room);

      io.to(room.code).emit(
        "game-started"
      );

      startRound(io, room.code);
    }
  );

  socket.on(
    "get-game-state",
    (roomCode: string) => {
      const session =
        gameManager.getSession(roomCode);

      if (!session) return;

      socket.emit("game-state", {
        drawerId: session.drawerId,
        drawerName: session.drawerName,

        wordLength: session.word.length,

        timeLeft: session.timeLeft,

        currentRound: session.currentRound,
        totalRounds: session.totalRounds,
      });

      if (
        session.drawerId === socket.id
      ) {
        socket.emit("drawer-data", {
          drawerId: session.drawerId,
          word: session.word,
        });
      }
    }
  );

  socket.on(
    "end-round",
    (roomCode: string) => {
      const session =
        gameManager.getSession(roomCode);

      if (!session) return;

      if (session.timer) {
        clearInterval(session.timer);
        session.timer = null;
      }

      endRound(io, roomCode);
    }
  );
}