import { Badge } from "../ui/badge";

interface ApplyStatueBadgeProps {
  status: "recruiting" | "closingSoon" | "closed";
}
export default function ApplyStatueBadge({ status }: ApplyStatueBadgeProps) {
  let badgeColor = "";
  let badgeText = "";
  if (status === "recruiting") {
    badgeColor = "bg-secondary-100";
    badgeText = "모집중";
  } else if (status === "closingSoon") {
    badgeColor = "bg-red-100";
    badgeText = "마감임박";
  } else {
    badgeColor = "bg-gray-300";
    badgeText = "모집마감";
  }
  return (
    <Badge
      className={`${badgeColor} w-[72px] h-7 font-medium text-sm rounded-3xl`}
    >
      {badgeText}
    </Badge>
  );
}
