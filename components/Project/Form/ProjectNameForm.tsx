import { ProjectPageMode, ProjectPageModeEnum } from "@/app/projects/[id]/page";
import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";

interface ProjectNameFormProps {
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any; // TODO: FormControl 타입을 정의해야 함
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
      // TODO: 에러 처리 로직 추가
      render={({ field }) => (
        <input
          {...field}
          value={field.value || ""}
          readOnly={mode === null}
          className={cn(
            "text-4xl font-medium text-black w-full h-14 p-1 py-1",
            mode === ProjectPageModeEnum.ADMIN && "bg-gray-100",
            className
          )}
        />
      )}
    />
  );
};

export default ProjectNameForm;
