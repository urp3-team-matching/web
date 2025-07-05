import AdminSwitch from "@/app/projects/[id]/_components/Header/AdminSwitch";
import { ProjectPageMode } from "@/app/projects/[id]/page";
import ApplyStatueBadge from "@/components/Badge/ApplyStatueBadge";
import KeywordBadge from "@/components/Badge/KeywordBadge";
import ProposalBadge from "@/components/Badge/ProposalBadge";
import ProjectNameForm from "@/components/Project/Form/ProjectNameForm";
import { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { parseDate } from "@/lib/utils";
import { ProjectInput } from "@/types/project";
import { Calendar, ChevronDown, Eye } from "lucide-react";
import { Control } from "react-hook-form";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Badge } from "@/components/ui/badge";

interface ProjectDetailHeaderProps {
  project: PublicProjectWithForeignKeys;
  className?: string;
  control: Control<ProjectInput>;
  mode: ProjectPageMode;
  toggleMode: () => void;
}

const ProjectDetailHeader = ({
  project,
  className,
  control,
  mode,
  toggleMode,
}: ProjectDetailHeaderProps) => {
  const projectStatus = project.status;
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
          {mode === null && (
            <Menubar className="lg:hidden h-full p-0 border-none bg-none shadow-none">
              <MenubarMenu>
                <MenubarTrigger className="w-full p-0 h-6 sm:h-7 border-none">
                  <Badge className="sm:w-[72px] bg-gray-200 text-black w-14 h-6 text-[11px] p-0 sm:h-7 font-medium sm:text-sm rounded-sm">
                    키워드
                    <ChevronDown size={16} />
                  </Badge>
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    {mode === null && (
                      <div className="w-auto h-full flex gap-1 items-center">
                        {project.keywords.map((keyword) => (
                          <KeywordBadge key={keyword} keyword={keyword} />
                        ))}
                      </div>
                    )}
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
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
