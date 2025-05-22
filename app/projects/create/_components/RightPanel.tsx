import CancelAndSubmitButton from "@/components/Project/Form/CancelAndSubmitButton";
import ProjectProposerForm from "@/components/Project/Form/ProjectProposerForm";
import { cn } from "@/lib/utils";
import { ProjectInput, UpdateProjectInput } from "@/types/project";
import { useRouter } from "next/navigation";
import { Control } from "react-hook-form";

interface ProjectCreateRightPanelProps {
  control: Control<ProjectInput | UpdateProjectInput>;
  onSubmit: () => void;
  className?: string;
  isCreatePage?: boolean;
}

const ProjectCreateRightPanel = ({
  control,
  onSubmit,
  className,
  isCreatePage = false,
}: ProjectCreateRightPanelProps) => {
  const router = useRouter();

  function onCancel() {
    router.push("/projects");
  }
  return (
    <div className={cn("text-lg font-semibold flex flex-col gap-5", className)}>
      <div>프로젝트 제안자</div>

      <ProjectProposerForm
        className="w-full p-5 flex flex-col gap-3 border rounded-lg h-auto"
        control={control}
        isCreatePage={isCreatePage}
      />

      <CancelAndSubmitButton onCancel={onCancel} onSubmit={onSubmit} />
    </div>
  );
};

export default ProjectCreateRightPanel;
