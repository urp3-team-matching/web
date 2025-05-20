"use client";

import ProjectTextArea from "@/app/projects/[id]/_components/Body/ProjectTextArea";
import RightPanel from "@/app/projects/[id]/_components/Body/RightPanel";
import { FileInput } from "@/components/Project/FileInput";
import { KeywordInput } from "@/components/Project/KeywordInput";
import { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { Controller } from "react-hook-form";

const fields = [
  { name: "background", label: "프로젝트 추진배경" },
  { name: "method", label: "프로젝트 실행방법" },
  { name: "objective", label: "프로젝트 목표" },
  { name: "result", label: "프로젝트 기대효과" },
] as const;

interface ProjectBodyProps {
  project: PublicProjectWithForeignKeys;
  adminMode: boolean;
  toggleAdminMode: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projectFormControl: any; // TODO: FormControl 타입을 정의해야 함
}

const ProjectBody = ({
  project,
  adminMode,
  toggleAdminMode,
  projectFormControl,
}: ProjectBodyProps) => {
  return (
    <div className="w-full flex flex-col h-auto justify-between">
      {/* 첨부파일 */}
      {adminMode && (
        <div className="w-full h-auto mt-5">
          <Controller
            name="attachments"
            control={projectFormControl}
            render={({ field }) => (
              <FileInput {...field} value={field.value || []} />
            )}
          />
        </div>
      )}

      <div className="w-full h-auto flex justify-between">
        <div className="w-2/3 h-full mt-9 flex flex-col gap-5">
          {/* 필드: 키워드 */}
          {adminMode && (
            <Controller
              name="keywords"
              control={projectFormControl}
              render={({ field }) => (
                <KeywordInput
                  {...field}
                  value={field.value || []}
                  onChange={field.onChange}
                />
              )}
            />
          )}

          {/* 필드: 나머지 */}
          {fields.map(({ name, label }) => (
            <Controller
              key={name}
              name={name}
              control={projectFormControl}
              render={({ field }) => (
                <ProjectTextArea
                  {...field}
                  value={field.value || ""}
                  title={label}
                  adminMode={adminMode}
                />
              )}
            />
          ))}
        </div>

        {/* 프로젝트 필드 우측 부분 */}
        <RightPanel
          className="w-[30%]"
          project={project}
          adminMode={adminMode}
          toggleAdminMode={toggleAdminMode}
        />
      </div>
    </div>
  );
};
export default ProjectBody;
