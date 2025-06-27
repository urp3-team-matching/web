import ProjectProposerForm from "@/components/Project/Form/ProjectProposerForm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProjectInput } from "@/types/project";
import { useRouter } from "next/navigation";
import { Control } from "react-hook-form";

interface ProjectCreateRightPanelProps {
  control: Control<ProjectInput>;
  onSubmit: () => void;
  className?: string;
  loading?: boolean;
}

const ProjectCreateRightPanel = ({
  control,
  onSubmit,
  className,
}: ProjectCreateRightPanelProps) => {
  const router = useRouter();

  function onCancel() {
    router.push("/projects");
  }

  return (
    <div className={cn("text-lg font-semibold flex flex-col gap-5", className)}>
      <ProjectProposerForm
        className="w-full p-5 flex flex-col gap-3 border rounded-lg h-auto"
        control={control}
        variant="sm"
      />
      <div className="flex justify-between gap-3">
        <Button
          className="w-[30%] bg-slate-200 hover:bg-slate-300 text-black"
          onClick={onCancel}
        >
          취소
        </Button>
        <Button
          className="bg-green-400 w-[65%] hover:bg-green-500"
          onClick={onSubmit}
        >
          등록
        </Button>
      </div>
    </div>
  );
};

export default ProjectCreateRightPanel;
