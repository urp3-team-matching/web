import CancelAndSubmitButton from "@/components/Project/Form/CancelAndSubmitButton";
import ProjectProposerForm from "@/components/Project/Form/ProjectProposerForm";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ProjectCreateRightPanelProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any; // TODO: FormControl 타입을 정의해야 함
  className?: string;
}

const ProjectCreateRightPanel = ({
  control,
  className,
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
      />

      <CancelAndSubmitButton onCancel={onCancel} />
    </div>
  );
};

export default ProjectCreateRightPanel;
