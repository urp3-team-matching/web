import ApplyStatueBadge from "@/components/Badge/ApplyStatueBadge";
import KeywordBadge from "@/components/Badge/KeywordBadge";
import ProposalBadge from "@/components/Badge/ProposalBadge";
import { Switch } from "@/components/ui/switch";
import { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { getProjectStatus } from "@/lib/utils";
import { Calendar, Eye } from "lucide-react";
import { Controller } from "react-hook-form";

interface ProjectHeaderProps {
  project: PublicProjectWithForeignKeys;
  adminMode: boolean;
  toggleAdminMode: () => void;
  // TODO: FormControl 타입을 정의해야 함
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projectFormControl: any;
}

const ProjectHeader = ({
  project,
  adminMode,
  toggleAdminMode,
  projectFormControl,
}: ProjectHeaderProps) => {
  const projectStatus = getProjectStatus(project);

  return (
    <div>
      {/* 최상단 헤더: 프로젝트 뱃지, 키워드, 관리자 스위치 */}
      <div className="flex justify-between items-center">
        <div className="flex w-full gap-[10px] items-center h-7 ">
          <ApplyStatueBadge status={projectStatus} />
          <ProposalBadge proposerType={project.proposer.type} />
          {!adminMode && (
            <div className="w-auto h-full flex gap-1 items-center">
              {project.keywords.map((keyword) => (
                <KeywordBadge key={keyword} keyword={keyword} />
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-x-2 items-center">
          <Switch checked={adminMode} onClick={toggleAdminMode} />
          <span className="text-sm font-medium text-nowrap">관리자</span>
        </div>
      </div>

      {/* 메인 헤더: 프로젝트 제목 */}
      <div className="h-16 flex flex-col justify-end border-b-[1px] border-black">
        <Controller
          name="name"
          control={projectFormControl}
          render={({ field }) => (
            <input
              {...field}
              readOnly={!adminMode}
              className={`text-4xl ${
                adminMode ? "bg-gray-100" : ""
              } font-medium text-black w-full h-14 p-1 py-1`}
            />
          )}
        />
      </div>

      {/* 하단 헤더: 프로젝트 조회수, 생성 일시 */}
      <div className="gap-3 flex h-7 items-center font-medium text-xs">
        <div className="flex items-center gap-1">
          <Eye className="size-5 mt-0.5" />
          <span>{project.viewCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="size-5 mt-0.5" />
          <span>{project.createdDatetime}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
