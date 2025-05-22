import type { ChatItemGroup, ChatMessageContent } from "@/types/chat"; // 타입 경로 수정 필요
import { SquareUserRound } from "lucide-react";
import { forwardRef } from "react"; // React import 추가

interface ChatBubbleProps {
  chatGroup: ChatItemGroup; // 수정된 타입 사용
  // `ref`는 forwardRef의 두 번째 인자로 전달되므로 props에서 명시적으로 받을 필요는 없습니다.
  // 하지만, 부모 컴포넌트에서 ChatBubble에 ref를 직접 할당하려면,
  // 이 컴포넌트의 props 타입에 ref를 포함시키고, 내부에서 사용할 수 있습니다.
  // 여기서는 forwardRef의 표준 사용법에 따라 props에는 ref를 명시하지 않겠습니다.
  // 부모에서 <ChatBubble ref={myRef} ... /> 형태로 사용하면 ref가 두 번째 인자로 잘 전달됩니다.
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
          {" "}
          {/* 이름 숨김/표시 */}
          <SquareUserRound
            size={30}
            className={
              chatGroup.isCurrentUser ? "text-transparent" : "text-gray-500"
            }
          />{" "}
          {/* 아이콘 색상 또는 투명도 조절 가능 */}
          <div className="text-xs text-wrap max-w-[50px] truncate">
            {chatGroup.name}
          </div>
        </div>

        {/* 메시지 내용 영역 */}
        <div
          className={`flex flex-col w-full gap-1 ${messageContentAlignment}`}
        >
          {chatGroup.content.map((msg: ChatMessageContent, i: number) => (
            <div
              key={msg.id.toString()} // 메시지 ID를 key로 사용
              className={`w-fit text-sm font-medium max-w-[85%] sm:max-w-[70%] break-words py-1.5 px-2.5 rounded-lg ${messageBubbleColor} whitespace-pre-wrap`}
            >
              {msg.text}
              {/* 시간 표시가 필요하다면 여기에 추가 */}
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
