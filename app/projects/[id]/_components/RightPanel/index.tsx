import ProjectApplyButton from "@/app/projects/[id]/_components/ApplyButton";
import { ProjectPageModeEnum } from "@/app/projects/[id]/_components/constants";
import MajorGraph from "@/app/projects/[id]/_components/MajorGraph";
import Chat from "@/app/projects/[id]/_components/RightPanel/Chat";
import { ProjectPageMode } from "@/app/projects/[id]/page";
import CancelAndSubmitButton from "@/components/Project/Form/CancelAndSubmitButton";
import ProjectProposerForm from "@/components/Project/Form/ProjectProposerForm";
import { MAX_APPLICANTS } from "@/constants";
import {
  PublicApplicant,
  PublicProjectWithForeignKeys,
} from "@/lib/apiClientHelper";
import { cn } from "@/lib/utils";
import { ProjectInput } from "@/types/project";
import { Control } from "react-hook-form";
import ContactCard from "../ContactCard";
import ApplicationStatusCard from "../ApplicationStatusCard";

interface ProjectDetailRightPanelProps {
  className?: string;
  project: PublicProjectWithForeignKeys;
  mode: ProjectPageMode;
  control: Control<ProjectInput>;
  toggleMode: () => void;
  onSubmit: () => void;
  loading?: boolean;
  onApplySuccess: (project: PublicApplicant) => void;
}

const ProjectDetailRightPanel = ({
  className,
  project,
  mode,
  control,
  onSubmit,
  loading = false,
  onApplySuccess,
}: ProjectDetailRightPanelProps) => {
  const isProjectFull = project.applicants.length >= MAX_APPLICANTS;

  return (
    <div className={cn("flex flex-col gap-5 h-auto mt-12", className)}>
      {mode === null && (
        <ContactCard
          email="2000dudwn@naver.com"
          openChatLink="https://open.kakao.com"
        />
      )}

      {mode === null && (
        <ProjectApplyButton
          projectId={project.id}
          active={!isProjectFull}
          onSuccess={onApplySuccess}
        />
      )}

      <MajorGraph project={project} />

      {/* 프로젝트 제안자 입력   */}
      {mode === ProjectPageModeEnum.ADMIN && (
        <ProjectProposerForm
          control={control}
          className="w-full p-5 flex flex-col gap-3 border rounded-lg h-auto"
        />
      )}

      {/* 프로젝트 대화방 및 모집관리 
      <Chat
        className="w-full text-sm font-medium flex flex-col shadow-md rounded-lg h-[500px]"
        project={project}
        mode={mode}
      />
      */}
      {mode === ProjectPageModeEnum.ADMIN && (
        <ApplicationStatusCard project={project} />
      )}
      {/* 프로젝트 취소 및 저장 버튼 */}
      {mode === ProjectPageModeEnum.ADMIN && (
        <CancelAndSubmitButton onSubmit={onSubmit} loading={loading} />
      )}
      {mode === null && <ApplicationStatusCard project={project} />}
    </div>
  );
};

export default ProjectDetailRightPanel;
