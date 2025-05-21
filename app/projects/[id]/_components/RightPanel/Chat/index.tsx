import { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { User } from "lucide-react";
import { useState } from "react";
import ChatField from "./ChatField";

type Tab = "대화방" | "모집관리";

interface ChatProps {
  className?: string;
  project: PublicProjectWithForeignKeys;
  adminMode: boolean;
}

const Chat = ({ className, project, adminMode }: ChatProps) => {
  const [tab, setTab] = useState<Tab>("대화방");
  const MAX_APPLICANTS = 4;

  return (
    <div className={className}>
      {/* 헤더 */}
      <div className="w-full *:w-16 *:text-center *:cursor-pointer border-b-2 flex justify-center gap-5 h-10 items-center">
        <button onClick={() => setTab("대화방")} type="button">
          대화방
        </button>
        {adminMode && (
          <button onClick={() => setTab("모집관리")} type="button">
            모집 관리
          </button>
        )}
      </div>

      {tab === "대화방" && (
        <div className="relative w-full h-[460px]">
          <ChatField />
        </div>
      )}

      {adminMode && tab === "모집관리" && (
        <div className="flex flex-col px-2">
          <div className="my-2">
            확정{`(${project.applicants.length}/${MAX_APPLICANTS})`}
          </div>
          {project.applicants.map((applicant) => (
            <div
              key={applicant.id}
              className="rounded-lg flex items-center px-3 shadow-md w-full h-[45px] border"
            >
              <User className="size-6 mr-3" />
              <span>Profile ({applicant.major})</span>
            </div>
          ))}
          <div className="my-2">신청</div>
        </div>
      )}
    </div>
  );
};

export default Chat;
