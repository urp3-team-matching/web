import ApplyStatueBadge from "@/components/Badge/ApplyStatueBadge";
import ProposalBadge from "@/components/Badge/ProposalBadge";
import { Badge } from "@/components/ui/badge";
import { MAX_APPLICANTS } from "@/constants";
import { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { cn, parseDate } from "@/lib/utils";
import { Calendar, Eye } from "lucide-react";
import KeywordBadge from "../Badge/KeywordBadge";

export interface ProjectCardProps {
  project: PublicProjectWithForeignKeys;
  className?: string;
}

export default function ProjectCard({ project, className }: ProjectCardProps) {
  const projectStatus = project.status;
  const approvedApplicantCount = project.applicants.filter(
    (applicant) => applicant.status === "APPROVED"
  ).length;

  return (
    <div
      className={cn(
        "w-full border-t-[1px] relative py-2.5 px-1 sm:px-2 md:px-3 lg:px-4 bg-white hover:bg-slate-50 transition-colors duration-200 ease-in-out",
        className
      )}
    >
      <div className="flex flex-col sm:gap-2 gap-1 justify-between h-full pt-1">
        {/* 헤더: 상태, 제안 타입, 신청 현황 */}
        <div className="flex justify-between items-center">
          {/* 상태, 제안 타입 */}
          <div className="flex items-center gap-1 sm:gap-2">
            <ApplyStatueBadge status={projectStatus} />
            <ProposalBadge proposerType={project.proposerType} />
          </div>
        </div>

        {/* 제목 */}
        <span className="sm:text-base text-[14px] sm:pr-0 pr-5 font-medium sm:pl-1 py-[1px]">
          {project.name}
        </span>

        {/* 하단: 작성자, 조회수, 생성일, 키워드 */}
        <div className="sm:gap-3 gap-1 flex sm:flex-row flex-col font-medium sm:text-sm text-xs">
          {/* 작성자, 조회수, 생성일 */}
          <div className="flex text-slate-500 *:items-center gap-[6px] sm:gap-3">
            <span className="flex ">{project.proposerName}</span>
            <div className="flex gap-1">
              <Eye className="sm:size-5 size-[14px] mt-0.5" />
              <span>{project.viewCount}</span>
            </div>

            <div className="flex items-center gap-1">
              <Calendar className="sm:size-5 size-[14px] mt-0.5" />
              <span>{parseDate(project.createdDatetime)}</span>
            </div>
          </div>

          {/*키워드*/}
          <div
            className={cn(
              "flex gap-1 my-[2px]",
              !project.keywords.length && "hidden"
            )}
          >
            {project.keywords.map((keyword, index) => (
              <KeywordBadge key={index} keyword={keyword} />
            ))}
          </div>
        </div>
      </div>
      {/* 신청 현황 */}
      <Badge className="bg-green-400 text-white font-black text-base absolute w-16 h-10 top-1/2 -translate-y-1/2 right-0">
        {approvedApplicantCount} / {MAX_APPLICANTS}
      </Badge>
    </div>
  );
}
