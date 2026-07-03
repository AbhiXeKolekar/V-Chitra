import { useEffect, useState } from "react";

import { socket } from "../../socket/socket";
import { useGame } from "../../context/GameContext";

import ChatBox from "./ChatBox";
import ChatInput from "./ChatInput";

import type { ChatMessage } from "../../../../shared/chat";

function Sidebar() {
  const { room } = useGame();

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const onReceiveMessage = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("receive-message", onReceiveMessage);

    return () => {
      socket.off("receive-message", onReceiveMessage);
    };
  }, []);

  const sendMessage = (message: string) => {
    if (!room) return;

    const currentPlayer = room.players.find(
      (player) => player.id === socket.id
    );

    if (!currentPlayer) return;

    socket.emit("send-message", {
      roomCode: room.code,
      username: currentPlayer.username,
      message,
    });
  };

  return (
    <div className="w-80">
      <ChatBox messages={messages} />

      <ChatInput onSend={sendMessage} />
    </div>
  );
}

export default Sidebar;