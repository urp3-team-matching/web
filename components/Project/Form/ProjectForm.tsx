"use client";

import ProjectTextArea from "@/app/projects/[id]/_components/ProjectTextArea";
import { ProjectPageMode } from "@/app/projects/[id]/page";
import { KeywordInput } from "@/components/Project/KeywordInput";
import { Controller } from "react-hook-form";

const fields = [
  { name: "background", label: "프로젝트 추진배경" },
  { name: "method", label: "프로젝트 실행방법" },
  { name: "objective", label: "프로젝트 목표" },
  { name: "result", label: "프로젝트 기대효과" },
] as const;

interface ProjectBodyProps {
  className?: string;
  mode?: ProjectPageMode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any; // TODO: FormControl 타입을 정의해야 함
}

const ProjectForm = ({ className, mode, control }: ProjectBodyProps) => {
  return (
    <div className={className}>
      {/* 필드: 키워드 */}
      {mode === undefined ||
        (mode !== undefined && mode && (
          <Controller
            name="keywords"
            control={control}
            render={({ field }) => (
              <KeywordInput {...field} onChange={field.onChange} />
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
