import ProjectApplyButton from "@/app/projects/[id]/_components/ApplyButton";
import MajorGraph from "@/app/projects/[id]/_components/MajorGraph";
import Chat from "@/app/projects/[id]/_components/RightPanel/Chat";
import CancelAndSubmitButton from "@/components/Project/Form/CancelAndSubmitButton";
import ProjectProposerForm from "@/components/Project/Form/ProjectProposerForm";
import { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { cn } from "@/lib/utils";

interface ProjectDetailRightPanelProps {
  className?: string;
  project: PublicProjectWithForeignKeys;
  adminMode: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any; // TODO: FormControl 타입을 정의해야 함
  toggleAdminMode: () => void;
  onSubmit: () => void;
}

const ProjectDetailRightPanel = ({
  className,
  project,
  adminMode,
  control,
  toggleAdminMode,
  onSubmit,
}: ProjectDetailRightPanelProps) => {
  return (
    <div className={cn("flex flex-col gap-5 h-auto mt-12", className)}>
      {!adminMode && <MajorGraph project={project} />}

      {/* 프로젝트 제안자 입력 */}
      {adminMode && (
        <ProjectProposerForm
          control={control}
          className="w-full p-5 flex flex-col gap-3 border rounded-lg h-auto"
        />
      )}

      {/* 프로젝트 대화방 및 모집관리 */}
      <Chat
        className="w-full text-sm font-medium flex flex-col shadow-md rounded-lg  h-[500px]"
        project={project}
        adminMode={adminMode}
      />
      {!adminMode && <ProjectApplyButton />}

      {/* 프로젝트 취소 및 저장 버튼 */}
      {adminMode && (
        <CancelAndSubmitButton onCancel={toggleAdminMode} onSubmit={onSubmit} />
      )}
    </div>
  );
};

export default ProjectDetailRightPanel;
