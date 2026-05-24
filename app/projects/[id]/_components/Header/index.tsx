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
import { Calendar, Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Control } from "react-hook-form";

interface ProjectDetailHeaderProps {
  project: PublicProjectWithForeignKeys;
  className?: string;
  control: Control<ProjectInput>;
  mode: ProjectPageMode;
  onDelete: () => void;
}

const ProjectDetailHeader = ({
  project,
  className,
  control,
  mode,
  onDelete,
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
      {/* 최상단: 프로젝트 뱃지, 관리자 스위치 */}
      <div className="flex justify-between items-center">
        <div className="flex w-full gap-2 items-center">
          <ApplyStatueBadge
            status={projectStatus}
            className="w-[72px] h-8 text-sm"
          />
          {mode === null && (
            <ProposalBadge
              proposerType={project.proposerType}
              className="w-[72px] h-8 text-sm"
            />
          )}
        </div>

        <div className="flex gap-4 items-center">
          {mode === null ? (
            <Button asChild type="button" variant="outline" className="h-7">
              <Link href={`/projects/${project.id}/edit`}>
                <Pencil className="size-4" />
                프로젝트 수정
              </Link>
            </Button>
          ) : (
            <Button asChild type="button" variant="ghost" className="h-7">
              <Link href={`/projects/${project.id}`}>조회로 돌아가기</Link>
            </Button>
          )}

          {mode === null && user && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              type="button"
              variant="destructive"
              className="h-7"
            >
              <Trash2 className="size-4" />
              삭제
            </Button>
          )}
        </div>
      </div>

      {/* 키워드 (모든 뷰포트에서 풀어서 표시) */}
      {mode === null && project.keywords.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1 items-center">
          {project.keywords.map((keyword) => (
            <KeywordBadge key={keyword} keyword={keyword} />
          ))}
        </div>
      )}

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
