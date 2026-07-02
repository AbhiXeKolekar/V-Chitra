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

removePlayer(socketId: string): Room | null {
  for (const room of this.rooms.values()) {
    const index = room.players.findIndex(
      (player) => player.id === socketId
    );

    if (index === -1) {
      continue;
    }

    room.players.splice(index, 1);

    if (room.players.length === 0) {
      this.rooms.delete(room.code);
      return null;
    }

    const hasHost = room.players.some(
      (player) => player.isHost
    );

    if (!hasHost) {
      room.players[0].isHost = true;
    }

    return room;
  }

  return null;
}

getRoomByPlayer(socketId: string) {
  for (const room of this.rooms.values()) {
    if (
      room.players.some((player) => player.id === socketId)
    ) {
      return room;
    }
  }

  return null;
}
}