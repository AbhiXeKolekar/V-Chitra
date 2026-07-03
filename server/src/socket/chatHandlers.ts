import { Server, Socket } from "socket.io";
import { v4 as uuid } from "uuid";

import { gameManager } from "../services";

import type { ChatMessage } from "../../../shared/chat";

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
      const session = gameManager.getSession(
        data.roomCode
      );

      // No active game → behave like normal chat
      if (!session) {
        const chatMessage: ChatMessage = {
          id: uuid(),
          roomCode: data.roomCode,
          username: data.username,
          message: data.message,
          timestamp: Date.now(),
        };

        io.to(data.roomCode).emit(
          "receive-message",
          chatMessage
        );

        return;
      }

      // Drawer cannot guess
      if (socket.id === session.drawerId) {
        return;
      }

      const guess = data.message
        .trim()
        .toLowerCase();

      const answer = session.word
        .trim()
        .toLowerCase();

      // Correct guess
      if (guess === answer) {
        gameManager.addPoint(
          data.roomCode,
          socket.id
        );

        io.to(data.roomCode).emit(
          "correct-guess",
          {
            username: data.username,
          }
        );

        io.to(data.roomCode).emit(
          "score-update",
          gameManager.getScores(
            data.roomCode
          )
        );

        return;
      }

      // Normal chat message
      const chatMessage: ChatMessage = {
        id: uuid(),
        roomCode: data.roomCode,
        username: data.username,
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