import ProjectApplyButton from "@/app/projects/[id]/_components/ApplyButton";
import MajorGraph from "@/app/projects/[id]/_components/MajorGraph";
import Chat from "@/app/projects/[id]/_components/RightPanel/Chat";
import { ProjectPageMode, ProjectPageModeEnum } from "@/app/projects/[id]/page";
import CancelAndSubmitButton from "@/components/Project/Form/CancelAndSubmitButton";
import ProjectProposerForm from "@/components/Project/Form/ProjectProposerForm";
import { MAX_APPLICANTS } from "@/constants";
import { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { cn } from "@/lib/utils";

interface ProjectDetailRightPanelProps {
  className?: string;
  project: PublicProjectWithForeignKeys;
  mode: ProjectPageMode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any; // TODO: FormControl 타입을 정의해야 함
  togglemode: () => void;
  onSubmit: () => void;
}

const ProjectDetailRightPanel = ({
  className,
  project,
  mode,
  control,
  togglemode,
  onSubmit,
}: ProjectDetailRightPanelProps) => {
  const isProjectFull = project.applicants.length >= MAX_APPLICANTS;

  return (
    <div className={cn("flex flex-col gap-5 h-auto mt-12", className)}>
      {mode === null && <MajorGraph project={project} />}

      {/* 프로젝트 제안자 입력 */}
      {mode === ProjectPageModeEnum.ADMIN && (
        <ProjectProposerForm
          control={control}
          className="w-full p-5 flex flex-col gap-3 border rounded-lg h-auto"
        />
      )}

      {/* 프로젝트 대화방 및 모집관리 */}
      <Chat
        className="w-full text-sm font-medium flex flex-col shadow-md rounded-lg  h-[500px]"
        project={project}
        mode={mode}
      />
      {mode === null && (
        <ProjectApplyButton projectId={project.id} active={!isProjectFull} />
      )}

      {/* 프로젝트 취소 및 저장 버튼 */}
      {mode === ProjectPageModeEnum.ADMIN && (
        <CancelAndSubmitButton onCancel={togglemode} onSubmit={onSubmit} />
      )}
    </div>
  );
};

export default ProjectDetailRightPanel;
