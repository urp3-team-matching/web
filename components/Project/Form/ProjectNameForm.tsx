import { ProjectPageMode, ProjectPageModeEnum } from "@/app/projects/[id]/page";
import { cn } from "@/lib/utils";
import { CreateProjectInput, UpdateProjectInput } from "@/types/project";
import { Control, Controller } from "react-hook-form";

interface ProjectNameFormProps {
  className?: string;
  control: Control<CreateProjectInput | UpdateProjectInput>;
  mode: ProjectPageMode;
}

const ProjectNameForm = ({
  className,
  control,
  mode,
}: ProjectNameFormProps) => {
  return (
    <Controller
      name="name"
      control={control}
      render={({ field, fieldState }) => (
        <input
          {...field}
          value={field.value || ""}
          readOnly={mode === null}
          className={cn(
            "text-4xl font-medium text-black w-full h-14 p-1 py-1",
            mode === ProjectPageModeEnum.ADMIN && "bg-gray-100",
            className,
            fieldState.error && "border-b-destructive"
          )}
        />
      )}
    />
  );
};

export default ProjectNameForm;
