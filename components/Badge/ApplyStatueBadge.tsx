import { cn } from "@/lib/utils";
import { ProjectStatus } from "@prisma/client";
import { Badge } from "../ui/badge";

export interface ApplyStatueBadgeProps {
  status: ProjectStatus;
}

export default function ApplyStatueBadge({ status }: ApplyStatueBadgeProps) {
  let badgeColor = "";
  let badgeText = "";
  if (status === ProjectStatus.RECRUITING) {
    badgeColor = "bg-secondary";
    badgeText = "모집중";
  } else {
    badgeColor = "bg-gray-400";
    badgeText = "모집마감";
  }
  return (
    <Badge
      className={cn(
        badgeColor,
        "sm:w-[72px] w-14 h-6 text-[11px] sm:h-7 font-medium sm:text-sm rounded-sm"
      )}
    >
      {badgeText}
    </Badge>
  );
}
