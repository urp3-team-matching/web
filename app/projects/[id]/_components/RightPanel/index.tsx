import ProjectApplyButton from "@/app/projects/[id]/_components/ApplyButton";
import { ProjectPageModeEnum } from "@/app/projects/[id]/_components/constants";
import MajorGraph from "@/app/projects/[id]/_components/MajorGraph";
import { ProjectPageMode } from "@/app/projects/[id]/page";
import CancelAndSubmitButton from "@/components/Project/Form/CancelAndSubmitButton";
import {
  PublicApplicant,
  PublicProjectWithForeignKeys,
} from "@/lib/apiClientHelper";
import { cn } from "@/lib/utils";
import { ApplicantStatus } from "@prisma/client";
import ApplicationStatusCard from "../ApplicationStatusCard";
import ContactCard from "../ContactCard";

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
          email={project.email || "이메일 정보 없음"}
          openChatLink={project.chatLink || "오픈채팅 정보 없음"}
        />
      )}

      {mode === null && (
        <ProjectApplyButton
          projectId={project.id}
          active={project.status === "RECRUITING"}
          onSuccess={onApplySuccess}
        />
      )}

      <MajorGraph applicants={applicants} />

      {/* 프로젝트 제안자 입력  
      {mode === ProjectPageModeEnum.ADMIN && (
        <ProjectProposerForm
          control={control}
          className="w-full p-5 flex flex-col gap-3 border rounded-lg h-auto"
        />
      )}
      */}

      {/* 프로젝트 대화방 및 모집관리 
      <Chat
        className="w-full text-sm font-medium flex flex-col shadow-md rounded-lg h-[500px]"
        project={project}
        mode={mode}
      />
      */}

      <ApplicationStatusCard
        projectId={project.id}
        mode={mode}
        applicants={applicants}
        onApplicantStatusChange={onApplicantStatusChange}
      />
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
