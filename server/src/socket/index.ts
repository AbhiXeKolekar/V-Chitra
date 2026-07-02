import { Server } from "socket.io";
import { registerConnectionHandlers } from "./connectionHandlers";
import { registerRoomHandlers } from "./roomHandlers";

export function registerSocketHandlers(io: Server) {
    io.on("connection", (socket) => {
        registerConnectionHandlers(socket);

        registerRoomHandlers(socket);
    });
}