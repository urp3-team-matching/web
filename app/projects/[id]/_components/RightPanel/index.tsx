import ProjectApplyButton from "@/app/projects/[id]/_components/ApplyButton";
import { ProjectPageModeEnum } from "@/app/projects/[id]/_components/constants";
// import MajorGraph from "@/app/projects/[id]/_components/MajorGraph";
// import Chat from "@/app/projects/[id]/_components/RightPanel/Chat";
import { ProjectPageMode } from "@/app/projects/[id]/page";
import CancelAndSubmitButton from "@/components/Project/Form/CancelAndSubmitButton";
import {
  PublicApplicant,
  PublicProjectWithForeignKeys,
} from "@/lib/apiClientHelper";
import { cn } from "@/lib/utils";
import { ApplicantStatus } from "@prisma/client";
import ContactCard from "../ContactCard";
import ApplicantsManage from "./Chat/ApplicantsManage";

interface ProjectDetailRightPanelProps {
  className?: string;
  project: PublicProjectWithForeignKeys;
  mode: ProjectPageMode;
  toggleMode: () => void;
  onSubmit: () => void;
  onDelete: () => void;
  onToggleClose: () => void;
  loading?: boolean;
  onApplySuccess: (applicant: PublicApplicant) => void;
  onApplicantStatusChange: (
    applicantId: number,
    status: ApplicantStatus
  ) => void;
  applicants?: PublicApplicant[];
}

const ProjectDetailRightPanel = ({
  className,
  project,
  mode,
  onDelete,
  onToggleClose,
  onSubmit,
  loading = false,
  onApplySuccess,
  onApplicantStatusChange,
  applicants = [],
}: ProjectDetailRightPanelProps) => {
  return (
    <div className={cn("flex flex-col gap-5 h-auto pt-5", className)}>
      {mode === null && (
        <ContactCard
          proposerMajor={project.proposerMajor || undefined}
          proposerName={project.proposerName || undefined}
          email={project.email || undefined}
          openChatLink={project.chatLink || undefined}
        />
      )}

      {mode === null && (
        <ProjectApplyButton
          projectId={project.id}
          active={project.status === "RECRUITING"}
          onSuccess={onApplySuccess}
        />
      )}

      {/* 신청 현황 */}
      <div className="w-full h-auto p-5 border shadow-md rounded-lg">
        <span className="text-lg lg:text-xl pb-3 font-semibold">신청 현황</span>
        <ApplicantsManage
          mode={mode}
          applicants={applicants}
          projectId={project.id}
          onApplicantStatusChange={onApplicantStatusChange}
        />
      </div>

      {/* 팀 현황 그래프(잠정적으로 제거) */}
      {/* <MajorGraph applicants={applicants} /> */}

      {/* 프로젝트 대화방 및 모집관리(잠정적으로 제거) */}
      {/* <Chat
        className="w-full text-sm font-medium flex flex-col shadow-md rounded-lg h-[500px]"
        project={project}
        mode={mode}
        applicants={applicants}
        onApplicantStatusChange={onApplicantStatusChange}
      /> */}

      {/* <ApplicationStatusCard
        projectId={project.id}
        mode={mode}
        applicants={applicants}
        onApplicantStatusChange={onApplicantStatusChange}
      /> */}

      {/* 프로젝트 삭제, 모집마감, 저장 버튼 */}
      {mode === ProjectPageModeEnum.ADMIN && (
        <CancelAndSubmitButton
          onDelete={onDelete}
          onToggleClose={onToggleClose}
          onSubmit={onSubmit}
          loading={loading}
          isProjectClosed={project.status !== "RECRUITING"}
        />
      )}
    </div>
  );
};

export default ProjectDetailRightPanel;
