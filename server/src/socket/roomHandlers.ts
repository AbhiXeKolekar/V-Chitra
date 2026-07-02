import { Socket } from "socket.io";
import { roomManager } from "../services";

export function registerRoomHandlers(socket: Socket) {
    socket.on("create-room", (data: { username: string }) => {
        const room = roomManager.createRoom(data.username, socket.id);

        socket.join(room.code);

        socket.emit("room-created", room);

        console.log(`🏠 Room ${room.code} created by ${data.username}`);
    });
}