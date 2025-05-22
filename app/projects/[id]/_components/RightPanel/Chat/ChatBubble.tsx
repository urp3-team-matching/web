import type { ChatItemGroup, ChatMessageContent } from "@/types/chat";
import { SquareUserRound } from "lucide-react";
import { forwardRef } from "react";

interface ChatBubbleProps {
  chatGroup: ChatItemGroup;
}

const ChatBubble = forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ chatGroup }, ref) => {
    // 현재 사용자인지 여부에 따라 스타일 결정
    const bubbleContainerAlignment = chatGroup.isCurrentUser
      ? "flex-row-reverse" // 내 메시지는 오른쪽 정렬 (아이콘과 텍스트 순서 반전)
      : "flex-row"; // 상대방 메시지는 왼쪽 정렬

    const messageContentAlignment = chatGroup.isCurrentUser
      ? "items-end" // 내 메시지 내용물 오른쪽 정렬
      : "items-start"; // 상대방 메시지 내용물 왼쪽 정렬

    const messageBubbleColor = chatGroup.isCurrentUser
      ? "bg-sky-500 text-white" // 내 메시지 배경색
      : "bg-gray-200 text-gray-800"; // 상대방 메시지 배경색

    const nameVisibility = chatGroup.isCurrentUser ? "hidden" : "visible"; // 내 이름은 숨김 (선택 사항)

    return (
      <div
        ref={ref}
        className={`flex py-2 gap-x-2 ${bubbleContainerAlignment}`}
      >
        {/* 사용자 아이콘 및 이름 영역 */}
        <div className={`flex flex-col items-center ${nameVisibility}`}>
          <SquareUserRound
            size={36}
            className={
              chatGroup.isCurrentUser ? "text-transparent" : "text-gray-500"
            }
          />
          <div className="text-xs text-wrap max-w-[50px] truncate">
            {chatGroup.name}
          </div>
        </div>

        {/* 메시지 내용 영역 */}
        <div
          className={`flex flex-col w-full gap-1 ${messageContentAlignment}`}
        >
          {chatGroup.content.map((msg: ChatMessageContent) => (
            <div
              key={msg.id.toString()}
              className={`w-fit text-sm font-medium max-w-[85%] sm:max-w-[70%] break-words py-1.5 px-2.5 rounded-lg ${messageBubbleColor} whitespace-pre-wrap`}
            >
              {msg.text}
              <div
                className={`text-xs mt-1 ${
                  chatGroup.isCurrentUser ? "text-sky-200" : "text-gray-500"
                } ${chatGroup.isCurrentUser ? "text-right" : "text-left"}`}
              >
                {msg.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

ChatBubble.displayName = "ChatBubble";
export default ChatBubble;
