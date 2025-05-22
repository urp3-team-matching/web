import ManageApplicants from "@/app/projects/[id]/_components/RightPanel/Chat/ApplicantsManage";
import ChatHeader from "@/app/projects/[id]/_components/RightPanel/Chat/Header";
import { ProjectPageMode, ProjectPageModeEnum } from "@/app/projects/[id]/page";
import { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { useEffect } from "react";
import ChatField from "./ChatField";

export enum Tab {
  모집관리 = "manageChat",
}

interface ChatProps {
  className?: string;
  project: PublicProjectWithForeignKeys;
  mode: ProjectPageMode;
}

const Chat = ({ className, project, mode }: ChatProps) => {
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringEnum<Tab>(Object.values(Tab))
  );
  useEffect(() => {
    if (mode !== ProjectPageModeEnum.ADMIN && tab !== null) {
      setTab(null);
    }
  }, [mode, tab, setTab]);

  return (
    <div className={className}>
      {/* 헤더 */}
      <ChatHeader tab={tab} setTab={setTab} mode={mode} />

      {/* 탭: 대화방 */}
      {tab === null && <ChatField projectId={project.id} />}

      {/* 탭: 모집 관리 */}
      {mode === ProjectPageModeEnum.ADMIN && tab === Tab.모집관리 && (
        <ManageApplicants className="px-2" project={project} />
      )}
    </div>
  );
};

export default Chat;
