import { Chat } from "@/app/projects/[id]/_components/RightPanel/Chat/ChatField";
import { SquareUserRound } from "lucide-react";
import { forwardRef } from "react";

interface ChatBubbleProps {
  chat: Chat;
  ref: React.Ref<HTMLDivElement>;
}

const ChatBubble = forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ chat }, ref) => {
    return (
      <div ref={ref} className="flex py-2 gap-x-2">
        <div className="flex flex-col items-center">
          <SquareUserRound size={30} />
          <div className="text-xs text-wrap">{chat.name}</div>
        </div>
        <div className="flex flex-col w-full gap-1">
          {chat.content.map((msg, i) => (
            <div
              key={i}
              className="w-fit text-xs font-medium max-w-[90%] break-words py-1 px-1.5 whitespace-pre-wrap  flex items-center bg-gray-200 rounded-lg"
            >
              {msg.text}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

ChatBubble.displayName = "ChatBubble";
export default ChatBubble;
