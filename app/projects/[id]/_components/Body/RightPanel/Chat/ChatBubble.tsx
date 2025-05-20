import { SquareUserRound } from "lucide-react";

export default function ChatBubble({ ChatExample }: { ChatExample: any }) {
  return (
    <div className="flex py-2">
      <div className="flex flex-col">
        <SquareUserRound size={30} />
        <span className="text-[10px]">{ChatExample[0].name}</span>
      </div>
      <div className="flex flex-col w-full gap-1">
        {ChatExample[0].content.map((msg, i) => (
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
