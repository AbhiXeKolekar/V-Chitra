import { Server } from "socket.io";
import { registerConnectionHandlers } from "./connectionHandlers";
import { registerRoomHandlers } from "./roomHandlers";
import { registerGameHandlers } from "./gameHandlers";
import { registerDrawingHandlers } from "./drawingHandlers";
import { registerChatHandlers } from "./chatHandlers";

export function registerSocketHandlers(io: Server) {
  io.on("connection", (socket) => {
    console.log(`✅ ${socket.id} connected`);

    registerConnectionHandlers(socket);
    registerRoomHandlers(io, socket);
    registerGameHandlers(io, socket);
    registerDrawingHandlers(io, socket);
    registerChatHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`❌ ${socket.id} disconnected`);
    });
  });
}