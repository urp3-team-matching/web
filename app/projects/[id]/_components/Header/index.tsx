import AdminSwitch from "@/app/projects/[id]/_components/Header/AdminSwitch";
import { ProjectPageMode } from "@/app/projects/[id]/page";
import ApplyStatueBadge from "@/components/Badge/ApplyStatueBadge";
import KeywordBadge from "@/components/Badge/KeywordBadge";
import ProposalBadge from "@/components/Badge/ProposalBadge";
import ProjectNameForm from "@/components/Project/Form/ProjectNameForm";
import {
  PublicApplicant,
  PublicProjectWithForeignKeys,
} from "@/lib/apiClientHelper";
import { getProjectStatus, parseDate } from "@/lib/utils";
import { ProjectInput } from "@/types/project";
import { Calendar, Eye } from "lucide-react";
import { Control } from "react-hook-form";

interface ProjectDetailHeaderProps {
  project: PublicProjectWithForeignKeys;
  className?: string;
  projectFormControl: Control<ProjectInput>;
  mode: ProjectPageMode;
  applicants: PublicApplicant[];
  toggleMode: () => void;
}

const ProjectDetailHeader = ({
  project,
  className,
  projectFormControl,
  mode,
  toggleMode,
}: ProjectDetailHeaderProps) => {
  const projectStatus = getProjectStatus(project);
  return (
    <div className={className}>
      {/* 최상단: 프로젝트 뱃지, 키워드, 관리자 스위치 */}
      <div className="flex justify-between items-center">
        <div className="flex w-full gap-[10px] items-center h-7 ">
          <ApplyStatueBadge status={projectStatus} />
          {mode === null && (
            <ProposalBadge proposerType={project.proposerType} />
          )}
          {mode === null && (
            <div className="w-auto h-full flex gap-1 items-center">
              {project.keywords.map((keyword) => (
                <KeywordBadge key={keyword} keyword={keyword} />
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-x-2 items-center">
          <AdminSwitch
            mode={mode}
            toggleMode={toggleMode}
            projectId={project.id}
          />
          <span className="text-sm font-medium text-nowrap">관리자</span>
        </div>
      </div>

      {/* 메인: 프로젝트 제목 */}
      <ProjectNameForm
        className="h-16 flex flex-col justify-end border-b-[1px] border-black"
        control={projectFormControl}
        mode={mode}
      />

      {/* 하단: 프로젝트 조회수, 생성 일시 */}
      <div className="gap-3 flex h-7 items-center font-medium text-xs">
        <div className="flex items-center gap-1">
          <Eye className="size-5 mt-0.5" />
          <span>{project.viewCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="size-5 mt-0.5" />
          <span>{parseDate(project.createdDatetime)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailHeader;
