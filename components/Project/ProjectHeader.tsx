import { ProjectType } from "@/constants/fakeProject";
import ApplyStatueBadge from "../Badge/ApplyStatueBadge";
import KeywordBadge from "../Badge/KeywordBadge";
import ProposalBadge from "../Badge/ProposalBadge";
import { Calendar, Eye } from "lucide-react";
import { Switch } from "../ui/switch";

interface ProjectHeaderProps {
  adminMode: boolean;
  setAdminMode: React.Dispatch<React.SetStateAction<boolean>>;
  project: ProjectType;
}

export default function ProjectHeader({
  adminMode,
  setAdminMode,
  project,
}: ProjectHeaderProps) {
  return (
    <div className="w-full h-auto flex flex-col relative">
      <div className="absolute flex gap-1 items-center right-0 top-0">
        <Switch checked={adminMode} onCheckedChange={setAdminMode}></Switch>
        <span className="text-sm font-medium -translate-y-[1px]">관리자</span>
      </div>
      <div className="flex  w-full gap-[10px] items-center h-7 ">
        <ApplyStatueBadge status={project.status} />
        <ProposalBadge proposer={project.proposer} />
        {project.keywords.map((keyword, index) => {
          return <KeywordBadge keyword={keyword} key={index} />;
        })}
      </div>
      <div className="text-4xl font-medium mb-2">{project.title}</div>
      <div className="w-full h-[1px] bg-black"></div>
      <div className="gap-3 flex h-7 items-center font-medium text-xs">
        <span className="text-slate-500 flex items-center">{project.name}</span>
        <div className="flex items-center gap-1">
          <Eye className="size-5 mt-0.5" />
          <span>{project.view}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="size-5 mt-0.5" />
          <span>{project.date.toLocaleDateString("ko-KR")}</span>
        </div>
      </div>
    </div>
  );
}
