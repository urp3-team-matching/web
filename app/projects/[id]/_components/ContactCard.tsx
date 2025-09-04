import { BookA, Mail, User } from "lucide-react";

interface ContactCardProps {
  email?: string;
  openChatLink?: string;
  proposerName?: string;
  proposerMajor?: string;
}

export default function ContactCard({
  proposerName,
  email,
  // openChatLink,
  proposerMajor,
}: ContactCardProps) {
  // const isValidLink = openChatLink?.startsWith("http");

  return (
    <div className="w-full h-auto p-5 flex flex-col gap-3 border shadow-md rounded-lg">
      <span className="text-lg lg:text-xl pb-3 font-semibold">제안자</span>

      {proposerName && (
        <div className="flex items-center gap-2">
          <User size={24} />
          <span className="text-sm font-normal">이름: {proposerName}</span>
        </div>
      )}

      {proposerMajor && (
        <div className="flex items-center gap-2">
          <BookA size={24} />
          <span className="text-sm font-normal">전공: {proposerMajor}</span>
        </div>
      )}

      {email && (
        <div className="flex items-center gap-2">
          <Mail size={24} />
          <span className="text-sm font-normal">이메일: {email}</span>
        </div>
      )}

      {/* {openChatLink && (
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
      )} */}
    </div>
  );
}
