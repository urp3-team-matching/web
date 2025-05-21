import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProposerType } from "@prisma/client";

const GroupCheckers: { label: string; value: ProposerType }[] = [
  {
    label: "학생",
    value: ProposerType.STUDENT,
  },
  {
    label: "교수",
    value: ProposerType.PROFESSOR,
  },
  {
    label: "성균융합원",
    value: ProposerType.HOST,
  },
];

type GroupCheckerProps = {
  value: string;
  onChange: (value: string) => void;
};

export function GroupChecker({ value, onChange }: GroupCheckerProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className="w-full flex gap-4"
    >
      {GroupCheckers.map((group) => (
        <div key={group.value} className="flex gap-1 items-center">
          <RadioGroupItem value={group.value} className="rounded-full" />
          <span className="font-medium text-[14px]">{group.label}</span>
        </div>
      ))}
    </RadioGroup>
  );
}
