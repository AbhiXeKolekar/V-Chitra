import { Server, Socket } from "socket.io";
import { v4 as uuid } from "uuid";

import { roomManager, gameManager } from "../services";

import type { ChatMessage } from "../../../shared/chat";

import { endRound } from "./roundManager";

type SendMessageData = {
  roomCode: string;
 username: string;
  message: string;
};

export function registerChatHandlers(
  io: Server,
  socket: Socket
) {
  socket.on(
    "send-message",
    (data: SendMessageData) => {
      const room = roomManager.getRoom(data.roomCode);

      if (!room) return;

      const session = gameManager.getSession(data.roomCode);

      if (!session) return;

      const player = room.players.find(
        (p) => p.id === socket.id
      );

      if (!player) return;

      const guess = data.message.trim().toLowerCase();
      const answer = session.word.trim().toLowerCase();

      // --------------------------------------------------
      // Secret word entered
      // Never reveal it in chat.
      // --------------------------------------------------
      if (guess === answer) {
        // Drawer typed the word
        if (player.id === session.drawerId) {
          return;
        }

        // Already guessed this round
        if (
          gameManager.hasGuessed(
            data.roomCode,
            player.id
          )
        ) {
          return;
        }

        // First correct guess
        gameManager.markGuessed(
          data.roomCode,
          player.id
        );

        gameManager.addPoint(
          data.roomCode,
          player.id
        );

        io.to(data.roomCode).emit(
          "score-update",
          gameManager.getScores(data.roomCode)
        );

        io.to(data.roomCode).emit(
          "correct-guess",
          {
            username: player.username,
          }
        );

        if (gameManager.everyoneGuessed(room)) {
          endRound(io, data.roomCode);
        }

        if (
          gameManager.everyoneGuessed(room)
        ) {
          io.to(data.roomCode).emit(
            "all-guessed"
          );
        }

        // Never send the secret word to chat.
        return;
      }

      // --------------------------------------------------
      // Normal chat message
      // --------------------------------------------------
      const chatMessage: ChatMessage = {
        id: uuid(),
        roomCode: data.roomCode,
        username: player.username,
        message: data.message,
        timestamp: Date.now(),
      };

      io.to(data.roomCode).emit(
        "receive-message",
        chatMessage
      );
    }
  );
}