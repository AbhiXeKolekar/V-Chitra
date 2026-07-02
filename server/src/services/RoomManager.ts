import { Room } from "../types/Room";
import { Player } from "../types/Player";
import { v4 as uuid } from "uuid";

export class RoomManager {
  private rooms = new Map<string, Room>();

  createRoom(username: string, socketId: string): Room {
    const roomCode = uuid().substring(0, 6).toUpperCase();

    const host: Player = {
      id: socketId,
      username,
      isHost: true,
    };

    const room: Room = {
      code: roomCode,
      players: [host],
    };

    this.rooms.set(roomCode, room);

    return room;
  }

  getRoom(roomCode: string): Room | undefined {
    return this.rooms.get(roomCode);
  }

  addPlayer(roomCode: string, username: string, socketId: string): Room | null {
  const room = this.rooms.get(roomCode);

  if (!room) {
    return null;
  }

  const player = {
    id: socketId,
    username,
    isHost: false,
  };

  room.players.push(player);

  return room;
}
}