"use client";

import ProjectTextArea from "@/app/projects/[id]/_components/ProjectTextArea";
import { ProjectPageMode } from "@/app/projects/[id]/page";
import { KeywordInput } from "@/components/Project/KeywordInput";
import { cn } from "@/lib/utils";
import { ProjectInput } from "@/types/project";
import { Control, Controller } from "react-hook-form";

const fields = [
  { name: "background", label: "프로젝트 추진배경" },
  { name: "method", label: "프로젝트 실행방법" },
  { name: "objective", label: "프로젝트 목표" },
  { name: "result", label: "프로젝트 기대효과" },
] as const;

interface ProjectBodyProps {
  className?: string;
  mode?: ProjectPageMode;
  control: Control<ProjectInput>;
}

const ProjectForm = ({ className, mode, control }: ProjectBodyProps) => {
  return (
    <div
      className={cn(
        { className },
        "border flex flex-col gap-5 rounded-lg shadow-sm p-5"
      )}
    >
      <span className="text-2xl font-semibold">프로젝트 정보</span>
      {/* 필드: 키워드 */}
      {mode === undefined ||
        (mode !== undefined && mode && (
          <Controller
            name="keywords"
            control={control}
            render={({ field }) => (
              <KeywordInput
                {...field}
                value={field.value || []}
                onChange={field.onChange}
              />
            )}
          />
        ))}

      {/* 필드: 나머지 */}
      {fields.map(({ name, label }) => (
        <Controller
          key={name}
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <ProjectTextArea
              {...field}
              value={field.value || ""}
              title={label}
              mode={mode}
              fieldState={fieldState}
            />
          )}
        />
      ))}
    </div>
  );
};
export default ProjectForm;
