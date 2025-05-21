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
      <div ref={ref} className="flex py-2">
        <div className="flex flex-col">
          <SquareUserRound size={30} />
          <span className="text-[10px]">{chat.name}</span>
        </div>
        <div className="flex flex-col w-full gap-1">
          {chat.content.map((msg, i) => (
            <div
              key={i}
              className="w-fit  text-[10px] font-medium max-w-[90%]  break-words px-1 py-2 whitespace-pre-wrap  flex items-center bg-white border-black border-2 rounded-lg"
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
