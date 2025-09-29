import AdminSwitch from "@/app/projects/[id]/_components/Header/AdminSwitch";
import { ProjectPageMode } from "@/app/projects/[id]/page";
import ApplyStatueBadge from "@/components/Badge/ApplyStatueBadge";
import KeywordBadge from "@/components/Badge/KeywordBadge";
import ProposalBadge from "@/components/Badge/ProposalBadge";
import ProjectNameForm from "@/components/Project/Form/ProjectNameForm";
import { Button } from "@/components/ui/button";
import useUser from "@/hooks/use-user";
import { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { parseDate } from "@/lib/utils";
import { ProjectInput } from "@/types/project";
import { Calendar, Eye, Trash2 } from "lucide-react";
import { Control } from "react-hook-form";
import KeywordMenubar from "./KeywordMenubar";

interface ProjectDetailHeaderProps {
  project: PublicProjectWithForeignKeys;
  className?: string;
  control: Control<ProjectInput>;
  mode: ProjectPageMode;
  onDelete: () => void;
  toggleMode: () => void;
}

const ProjectDetailHeader = ({
  project,
  className,
  control,
  mode,
  onDelete,
  toggleMode,
}: ProjectDetailHeaderProps) => {
  const projectStatus = project.status;
  const user = useUser();

  const handleDelete = () => {
    if (window.confirm("정말로 이 프로젝트를 삭제하시겠습니까?")) {
      onDelete();
    }
  };

  return (
    <div className={className}>
      {/* 최상단: 프로젝트 뱃지, 키워드, 관리자 스위치 */}
      <div className="flex justify-between items-center">
        <div className="flex w-full gap-[8px] items-center h-7 ">
          <ApplyStatueBadge status={projectStatus} />
          {mode === null && (
            <ProposalBadge proposerType={project.proposerType} />
          )}
          {mode === null && (
            <div className="w-auto hidden h-full lg:flex gap-1 items-center">
              {project.keywords.map((keyword) => (
                <KeywordBadge key={keyword} keyword={keyword} />
              ))}
            </div>
          )}
          {mode === null && <KeywordMenubar mode={mode} project={project} />}
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex gap-x-2 items-center">
            <AdminSwitch
              mode={mode}
              toggleMode={toggleMode}
              projectId={project.id}
            />
            <span className="text-sm font-medium text-nowrap">관리자</span>
          </div>

          {mode === null && user && (
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="h-7"
            >
              <Trash2 className="size-4" />
              삭제
            </Button>
          )}
        </div>
      </div>

      {/* 메인: 프로젝트 제목 */}
      <ProjectNameForm
        className="h-10 md:h-12 lg:h-16 flex flex-col justify-end border-b-[1px] border-black"
        control={control}
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
