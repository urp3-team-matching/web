import { ProjectPageModeEnum } from "@/app/projects/[id]/_components/constants";
import ManageApplicants from "@/app/projects/[id]/_components/RightPanel/Chat/ApplicantsManage";
import ChatHeader from "@/app/projects/[id]/_components/RightPanel/Chat/Header";
import { ProjectPageMode } from "@/app/projects/[id]/page";
import {
  PublicApplicant,
  PublicProjectWithForeignKeys,
} from "@/lib/apiClientHelper";
import { ApplicantStatus } from "@prisma/client";
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
  applicants: PublicApplicant[];
  onApplicantStatusChange: (
    applicantId: number,
    status: ApplicantStatus
  ) => void;
}

const Chat = ({
  className,
  project,
  mode,
  applicants,
  onApplicantStatusChange,
}: ChatProps) => {
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
      {tab === null && <ChatField project={project} />}

      {/* 탭: 모집 관리 */}
      {mode === ProjectPageModeEnum.ADMIN && tab === Tab.모집관리 && (
        <ManageApplicants
          mode={mode}
          className="px-2"
          applicants={applicants}
          projectId={project.id}
          onApplicantStatusChange={onApplicantStatusChange}
        />
      )}
    </div>
  );
};

export default Chat;
