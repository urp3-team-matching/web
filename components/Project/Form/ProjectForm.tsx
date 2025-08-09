"use client";

import { ProjectPageModeEnum } from "@/app/projects/[id]/_components/constants";
import ProjectTextArea from "@/app/projects/[id]/_components/ProjectTextArea";
import { ProjectPageMode } from "@/app/projects/[id]/page";
import { KeywordInput } from "@/components/Project/KeywordInput";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ProjectInput } from "@/types/project";
import { Control, Controller } from "react-hook-form";

const fields = [
  { name: "background", label: "프로젝트 추진배경" },
  { name: "method", label: "프로젝트 실행방법" },
  { name: "objective", label: "프로젝트 목표" },
  { name: "result", label: "프로젝트 기대효과" },
  { name: "etc", label: "기타 전달사항" },
] as const;

interface ProjectBodyProps {
  className?: string;
  mode?: ProjectPageMode;
  control: Control<ProjectInput>;
  withoutProjectName?: boolean; // 모바일에선 폼에서의 프로젝트 제목 필요없음
}

const ProjectForm = ({
  className,
  mode,
  control,
  withoutProjectName = false,
}: ProjectBodyProps) => {
  return (
    <div
      className={cn(
        { className },
        "lg:border flex flex-col w-full gap-3 lg:gap-5 rounded-lg lg:shadow-sm lg:p-5"
      )}
    >
      <span
        className={cn("text-xl lg:text-2xl font-semibold", {
          hidden: withoutProjectName && mode !== ProjectPageModeEnum.ADMIN,
        })}
      >
        프로젝트 정보
      </span>
      <Separator
        className={cn("w-full lg:hidden", {
          hidden: withoutProjectName && mode !== ProjectPageModeEnum.ADMIN,
        })}
      />
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
