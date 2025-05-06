// 제안자(교수, 학생, 관리자), 제목, 이름, 날짜, 조회수를 fetch 해야 함

import { Calendar, Eye } from "lucide-react";
import ProposalBadge from "../Badge/ProposalBadge";
import ApplyStatueBadge from "../Badge/ApplyStatueBadge";
import KeywordBadge from "../Badge/KeywordBadge";

export interface ProjectCardProps {
  id: string;
  proposer: "professor" | "student" | "admin";
  title: string;
  name: string;
  date: Date;
  view: number;
  className?: string;
  keywords: string[];
  status: "recruiting" | "closingSoon" | "closed";
}

export default function ProjectCard({
  id,
  proposer,
  title,
  name,
  date,
  view,
  className,
  status,
  keywords,
}: ProjectCardProps) {
  const formattedDate: string = date.toLocaleDateString();
  return (
    <div
      id={id}
      className={`${className} w-full border-[1px] min-h-[126px] my-[1px] py-[10px] px-[17px] shadow-[0px_4px_4px_0px_rgba(174,174,174,0.25)] bg-white rounded-[6px]`}
    >
      <div className="flex flex-col justify-between h-full pt-1">
        <div className="flex gap-[10px]">
          <ApplyStatueBadge status={status} />
          <ProposalBadge proposer={proposer} />
        </div>
        <span className="text-base font-medium pl-1 py-[1px]">{title}</span>
        <div className="flex gap-1 my-[2px]">
          {keywords.map((word, index) => (
            <KeywordBadge key={index} keyword={word} />
          ))}
        </div>
        <div className="gap-3 flex  font-medium text-xs">
          <span className="text-slate-500 flex items-center">{name}</span>
          <div className="flex items-center gap-1">
            <Eye className="size-5 mt-0.5" />
            <span>{view}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="size-5 mt-0.5" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
