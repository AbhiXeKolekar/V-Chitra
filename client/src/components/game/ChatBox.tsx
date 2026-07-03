import type { ChatMessage } from "../../../../shared/chat";

type ChatBoxProps = {
  messages: ChatMessage[];
};

function ChatBox({
  messages,
}: ChatBoxProps) {
  return (
    <div className="h-96 overflow-y-auto rounded-xl bg-slate-900 p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className="mb-3"
        >
          <span className="font-bold text-blue-400">
            {message.username}
          </span>

          <span className="ml-2 text-white">
            {message.message}
          </span>
        </div>
      ))}
    </div>
  );
}

export default ChatBox;