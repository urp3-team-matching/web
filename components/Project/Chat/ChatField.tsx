import { Textarea } from "@/components/ui/textarea";
import ChatBubble from "./ChatBubble";
import { Send } from "lucide-react";

const ChatExample = [
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
  return (
    <div className="w-full h-full">
      <div className="h-[380px] p-2  overflow-y-auto">
        <ChatBubble ChatExample={ChatExample}></ChatBubble>
        <ChatBubble ChatExample={ChatExample}></ChatBubble>
        <ChatBubble ChatExample={ChatExample}></ChatBubble>
        <ChatBubble ChatExample={ChatExample}></ChatBubble>
        <ChatBubble ChatExample={ChatExample}></ChatBubble>
      </div>
      <div className="w-full p-2 h-[80px] flex relative items-center ">
        <Textarea className="w-56 resize-none text-gray-500 font-medium"></Textarea>
        <Send className="size-6 cursor-pointer absolute right-3 bottom-3" />
      </div>
    </div>
  );
}
