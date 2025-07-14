import { formatPhoneNumber } from "@/lib/phoneUtils";
import { Mail, MessageSquare, Phone } from "lucide-react";
import Link from "next/link";

interface ContactCardProps {
  email?: string;
  openChatLink?: string;
  proposerPhone?: string;
}

export default function ContactCard({
  email,
  openChatLink,
  proposerPhone,
}: ContactCardProps) {
  const isValidLink = openChatLink?.startsWith("http");

  return (
    <div className="w-full h-auto p-5 flex flex-col gap-3 border shadow-md rounded-lg">
      <span className="text-lg lg:text-xl pb-3 font-semibold">연락처</span>

      {email && (
        <div className="flex items-center gap-2">
          <Mail size={24} />
          <span className="text-sm font-normal">이메일: {email}</span>
        </div>
      )}

      {openChatLink && (
        <div className="flex items-center gap-2">
          <MessageSquare size={24} />
          {isValidLink ? (
            <div>
              <span className="text-sm font-normal">오픈채팅: </span>
              <Link
                href={openChatLink}
                className="text-sm font-normal underline underline-offset-4"
              >
                {openChatLink}
              </Link>
            </div>
          ) : (
            <span className="text-sm font-normal">
              오픈채팅: {openChatLink}
            </span>
          )}
        </div>
      )}

      {proposerPhone && (
        <div className="flex items-center gap-2">
          <Phone size={24} />
          <span className="text-sm font-normal">
            연락처: {formatPhoneNumber(proposerPhone)}
          </span>
        </div>
      )}
    </div>
  );
}
