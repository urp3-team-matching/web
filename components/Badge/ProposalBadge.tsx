import { ProposerType } from "@prisma/client";
import { Badge } from "../ui/badge";

interface ProposalBadgeProps {
  proposerType: ProposerType;
}

export default function ProposalBadge({ proposerType }: ProposalBadgeProps) {
  let proposerText = "";

  switch (proposerType) {
    case ProposerType.PROFESSOR:
      proposerText = "교수제안";
      break;
    case ProposerType.STUDENT:
      proposerText = "학생제안";
      break;
    case ProposerType.HOST:
      proposerText = "융합원제안";
      break;
    default:
      proposerText = "제안자 없음";
      break;
  }

  return (
    <Badge className="sm:w-[72px] sm:h-7 w-14 h-6 text-[11px] rounded-sm flex justify-center items-center bg-third sm:text-sm font-medium text-white">
      {proposerText}
    </Badge>
  );
}
