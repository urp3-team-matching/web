import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";

export type Chat = {
  name: string;
  content: {
    text: string;
    time: string;
  }[];
};

const ChatExample: Chat[] = [
  {
    name: "익명1",
    content: [
      {
        text: "안녕하세요",
        time: "2023-10-01 12:00",
      },
      {
        text: "이 프로젝트에 관심이 있어서 질문드려요!",
        time: "2023-10-01 12:01",
      },
      {
        text: "혹시 프론트엔드 인원은 아직 모집 중인가요?",
        time: "2023-10-01 12:02",
      },
    ],
  },
];

export default function ChatField() {
  const lastElementRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (lastElementRef.current) {
      lastElementRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [ChatExample]);

  return (
    <div className="w-full h-full">
      <ScrollArea className="h-[380px] p-2">
        <ChatBubble chat={ChatExample[0]} />
        <ChatBubble chat={ChatExample[0]} />
        <ChatBubble chat={ChatExample[0]} />
        <ChatBubble chat={ChatExample[0]} />
        <ChatBubble chat={ChatExample[0]} ref={lastElementRef} />
      </ScrollArea>

      <div className="w-full p-2 h-[80px] flex relative items-center ">
        <Textarea
          className="w-[70%] sm:w-[80%] lg:w-[90%] resize-none text-gray-500 font-medium"
          placeholder="채팅을 입력하세요."
        />
        <Send className="size-6 cursor-pointer absolute right-3 bottom-3" />
      </div>
    </div>
  );
}
