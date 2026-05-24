import { ProjectPageModeEnum } from "@/app/projects/[id]/_components/constants";
import { ProjectPageMode } from "@/app/projects/[id]/page";
import { cn } from "@/lib/utils";
import { ProjectInput } from "@/types/project";
import { Control, Controller } from "react-hook-form";

interface ProjectNameFormProps {
  className?: string;
  control: Control<ProjectInput>;
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
      render={({ field, fieldState }) => {
        if (mode === null) {
          return (
            <h1
              className={cn(
                "text-2xl md:text-3xl lg:text-4xl font-medium text-black w-full h-14 p-1 py-1 break-words",
                className
              )}
            >
              {field.value || (
                <span className="text-gray-400">프로젝트 제목</span>
              )}
            </h1>
          );
        }
        return (
          <input
            {...field}
            value={field.value || ""}
            placeholder="프로젝트 제목"
            className={cn(
              "text-2xl md:text-3xl lg:text-4xl font-medium text-black w-full h-14 p-1 py-1",
              mode === ProjectPageModeEnum.ADMIN && "bg-gray-100",
              className,
              fieldState.error && "border-b-destructive"
            )}
          />
        );
      }}
    />
  );
};

export default ProjectNameForm;
