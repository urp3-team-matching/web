import { ProposerType } from "@prisma/client";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface ProposalBadgeProps {
  proposerType: ProposerType;
}

export default function ProposalBadge({ proposerType }: ProposalBadgeProps) {
  let proposerText = "";
  let badgeColor = "";
  switch (proposerType) {
    case ProposerType.PROFESSOR:
      proposerText = "교수제안";
      badgeColor = "bg-third";
      break;
    case ProposerType.STUDENT:
      proposerText = "학생제안";
      badgeColor = "bg-teal-800";
      break;
    case ProposerType.HOST:
      proposerText = "융합원제안";
      badgeColor = "bg-indigo-800";
      break;
    default:
      proposerText = "제안자 없음";
      badgeColor = "bg-gray-400";
      break;
  }

  return (
    <Badge
      className={cn(
        "sm:w-[72px] sm:h-7 w-14 h-6 text-[11px] rounded-sm flex justify-center items-center sm:text-sm font-medium text-white",
        badgeColor
      )}
    >
      {proposerText}
    </Badge>
  );
}
