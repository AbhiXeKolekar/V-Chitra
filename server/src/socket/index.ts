import { Server } from "socket.io";
import { registerConnectionHandlers } from "./connectionHandlers";
import { registerRoomHandlers } from "./roomHandlers";
import { registerGameHandlers } from "./gameHandlers";
import { registerDrawingHandlers } from "./drawingHandlers";
import { registerChatHandlers } from "./chatHandlers";

export function registerSocketHandlers(io: Server) {
    io.on("connection", (socket) => {
        registerConnectionHandlers(socket);

        registerRoomHandlers(io, socket);
        registerConnectionHandlers(socket);
        registerRoomHandlers(io, socket);
        registerGameHandlers(io, socket);
        registerDrawingHandlers(io, socket);
        registerChatHandlers(io, socket);
    });
}