import { useState } from "react";

type ChatInputProps = {
  onSend: (message: string) => void;
};

function ChatInput({
  onSend,
}: ChatInputProps) {
  const [message, setMessage] =
    useState("");

  const send = () => {
    if (!message.trim()) return;

    onSend(message);

    setMessage("");
  };

  return (
    <div className="mt-4 flex gap-2">
      <input
        className="flex-1 rounded-lg bg-slate-800 p-3 text-white"
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            send();
          }
        }}
        placeholder="Type a message..."
      />

      <button
        onClick={send}
        className="rounded-lg bg-blue-600 px-5"
      >
        Send
      </button>
    </div>
  );
}

export default ChatInput;