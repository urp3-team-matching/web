import { Badge } from "../ui/badge";
export interface ApplyStatueBadgeProps {
  status: "recruiting" | "closed";
}

export default function ApplyStatueBadge({ status }: ApplyStatueBadgeProps) {
  let badgeColor = "";
  let badgeText = "";
  if (status === "recruiting") {
    badgeColor = "bg-secondary";
    badgeText = "모집중";
  } else {
    badgeColor = "bg-gray-400";
    badgeText = "모집마감";
  }
  return (
    <Badge
      className={`${badgeColor} w-[72px] max-sm:w-14 max-sm:h-6 max-sm:text-[11px] h-7 font-medium text-sm rounded-sm`}
    >
      {badgeText}
    </Badge>
  );
}
