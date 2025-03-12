// 제안자(교수, 학생, 관리자), 제목, 이름, 날짜, 조회수를 fetch 해야 함

import { Calendar, Eye } from "lucide-react";
import ProposalBadge from "../Badge/ProposalBadge";

export interface TopicCardProps {
  id?: number;
  proposer: "professor" | "student" | "admin";
  title: string;
  name: string;
  date: Date;
  view: number;
  className?: string;
}

export default function TopicCard({
  proposer,
  title,
  name,
  date,
  view,
  className,
}: TopicCardProps) {
  const formattedDate: string = date.toLocaleDateString();
  return (
    <div
      className={`${className} w-[690px] border-2 h-[120px] p-5 shadow-lg bg-white rounded-md`}
    >
      <div className="flex flex-col gap-1">
        <ProposalBadge proposer={proposer} />
        <span className="text-base font-medium">{title}</span>
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
