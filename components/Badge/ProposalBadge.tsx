import { Badge } from "../ui/badge";

export interface ProposalBadgeProps {
  proposer: "professor" | "student" | "admin";
}

export default function ProposalBadge({ proposer }: ProposalBadgeProps) {
  let proposerText = "";

  if (proposer === "professor") {
    proposerText = "교수제안";
  } else if (proposer === "student") {
    proposerText = "학생제안";
  } else {
    proposerText = "성균융합원";
  }

  return (
    <Badge className="w-[72px] h-7 rounded-3xl flex justify-center items-center bg-third-100 text-sm font-medium text-white">
      {proposerText}
    </Badge>
  );
}
