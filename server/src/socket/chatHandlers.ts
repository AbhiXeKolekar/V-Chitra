import { Server, Socket } from "socket.io";
import { v4 as uuid } from "uuid";

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
  socket.on("send-message", (data: SendMessageData) => {
    const chatMessage: ChatMessage = {
      id: uuid(),
      roomCode: data.roomCode,
      username: data.username,
      message: data.message,
      timestamp: Date.now(),
    };

    io.to(data.roomCode).emit("receive-message", chatMessage);
  });
}