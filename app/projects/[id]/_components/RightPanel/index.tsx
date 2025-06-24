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
import ContactCard from "../ContactCard";
import ApplicationStatusCard from "../ApplicationStatusCard";

interface ProjectDetailRightPanelProps {
  className?: string;
  project: PublicProjectWithForeignKeys;
  mode: ProjectPageMode;
  toggleMode: () => void;
  onSubmit: () => void;
  onDelete: () => void;
  onClose: () => void;
  loading?: boolean;
  onApplySuccess: (project: PublicApplicant) => void;
  applicants?: PublicApplicant[];
}

const ProjectDetailRightPanel = ({
  className,
  project,
  mode,
  onDelete,
  onClose,
  onSubmit,
  loading = false,
  onApplySuccess,
  applicants = [],
}: ProjectDetailRightPanelProps) => {
  return (
    <div className={cn("flex flex-col gap-5 h-auto pt-5", className)}>
      {mode === null && (
        <ContactCard
          email="2000dudwn@naver.com"
          openChatLink="https://open.kakao.com"
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
      />
      {/* 프로젝트 삭제, 모집마감, 저장 버튼 */}
      {mode === ProjectPageModeEnum.ADMIN && (
        <CancelAndSubmitButton
          onDelete={onDelete}
          onClose={onClose}
          onSubmit={onSubmit}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ProjectDetailRightPanel;
