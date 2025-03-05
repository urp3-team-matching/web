import { Calendar, Eye } from "lucide-react";
import ApplyBadge from "../Badge/ApplyBadge";
import ApplyStatueBadge from "../Badge/ApplyStatueBadge";

export interface ApplyCardProps {
  id?: string;
  status: "recruiting" | "closingSoon" | "closed";
  title: string;
  active: boolean;
  name: string;
  view: number;
  date: Date;
  description: string;
}

export default function ApplyCard({
  id,
  status,
  title,
  active,
  name,
  view,
  date,
  description,
}: ApplyCardProps) {
  return (
    <div
      id={id}
      className=" relative px-6  border-2 rounded-md w-full h-[120px] flex flex-col bg-white shadow-lg"
    >
      <div className="flex gap-3 mt-5 mb-1">
        <ApplyStatueBadge status={status} />
        <span className="text-base font-medium flex items-center">{title}</span>
      </div>
      <span className="text-sm font-medium">{description}</span>
      <div className="gap-3 flex  font-medium text-xs">
        <span className="text-slate-500 flex items-center">{name}</span>
        <div className="flex items-center gap-1">
          <Eye className="size-5 mt-0.5" />
          <span>{view}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="size-5 mt-0.5" />
          <span>{date.toLocaleDateString()}</span>
        </div>
      </div>
      <div className="absolute right-5 flex h-full items-center">
        <ApplyBadge active={active} />
      </div>
    </div>
  );
}
