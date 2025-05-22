import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

  const [chats, setChats] = useState<Chat[]>(ChatExample);
  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit() {
    const textarea = textareaRef.current;
    if (textarea) {
      if (textarea.value.trim() === "") {
        textarea.focus();
        return;
      }
      const newChat: Chat = {
        name: "익명2",
        content: [
          {
            text: textarea.value,
            time: new Date().toLocaleString(),
          },
        ],
      };
      setChats((prev) => [...prev, newChat]);
      textarea.value = ""; // textarea 초기화
      textarea.style.height = "auto"; // textarea 높이 초기화
      textarea.focus();
    }
  }

  return (
    <div className="w-full h-[460px]">
      <ScrollArea className="h-[380px] p-2">
        <div className="flex flex-col gap-2">
          {chats.map((chat, index) => (
            <ChatBubble
              key={index}
              chat={chat}
              ref={index === chats.length - 1 ? lastElementRef : null}
            />
          ))}
          <div ref={lastElementRef} />
        </div>
      </ScrollArea>

      <div className="w-full p-2 flex relative items-center">
        <Textarea
          ref={textareaRef}
          name="text"
          className="w-[70%] sm:w-[80%] lg:w-[90%] resize-none text-gray-500 font-medium"
          placeholder="채팅을 입력하세요."
          rows={3}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Send className="size-6 cursor-pointer absolute right-3 bottom-3" />
        </button>
      </div>
    </div>
  );
}
