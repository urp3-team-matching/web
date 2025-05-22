import { Badge } from "../ui/badge";

export default function ApplyBadge({ active }: { active: boolean }) {
  return (
    <Badge
      className={`${
        active ? "bg-primary" : "bg-gray-500"
      } w-[100px] h-[50px] text-base font-medium`}
    >
      신청하기
    </Badge>
  );
}
