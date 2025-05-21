import { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { User } from "lucide-react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import ChatField from "./ChatField";

enum Tab {
  모집관리 = "manageChat",
}

interface ChatProps {
  className?: string;
  project: PublicProjectWithForeignKeys;
  adminMode: boolean;
}

const Chat = ({ className, project, adminMode }: ChatProps) => {
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringEnum<Tab>(Object.values(Tab))
  );

  const MAX_APPLICANTS = 4;

  return (
    <div className={className}>
      {/* 헤더 */}
      <div className="w-full *:w-16 *:text-center *:cursor-pointer border-b-2 flex justify-center gap-5 h-10 items-center">
        <button
          onClick={() => setTab(null)}
          type="button"
          className={adminMode && tab === null ? "text-secondary" : ""}
        >
          대화방
        </button>
        {adminMode && (
          <button
            onClick={() => setTab(Tab.모집관리)}
            type="button"
            className={
              adminMode && tab === Tab.모집관리 ? "text-secondary" : ""
            }
          >
            모집 관리
          </button>
        )}
      </div>

      {tab === null && (
        <div className="relative w-full h-[460px]">
          <ChatField />
        </div>
      )}

      {adminMode && tab === Tab.모집관리 && (
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
