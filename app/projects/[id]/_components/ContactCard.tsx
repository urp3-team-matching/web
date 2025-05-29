import { Mail, MessageSquare } from "lucide-react";
import Link from "next/link";

interface ContactCardProps {
  email?: string;
  openChatLink?: string;
}
export default function ContactCard(ContactCardProps: ContactCardProps) {
  return (
    <div className="w-full h-auto p-5 flex flex-col gap-3 border shadow-md rounded-lg">
      <span className="text-xl pb-3 font-semibold">연락처</span>
      <div className="flex gap-2">
        <Mail size={24} />
        <span className="text-sm pl-5 font-normal">{`이메일:  ${ContactCardProps.email}`}</span>
      </div>
      <div className="flex gap-2">
        <MessageSquare size={24} />
        <Link
          href={ContactCardProps.openChatLink as string}
          className="pl-2 text-sm font-normal"
        >{`오픈채팅:  ${ContactCardProps.openChatLink}`}</Link>
      </div>
    </div>
  );
}
