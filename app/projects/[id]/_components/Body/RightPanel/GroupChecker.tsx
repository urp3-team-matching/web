import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
      <div className="flex gap-1 items-center">
        <RadioGroupItem value="student" className="rounded-full" />
        <span className="font-medium text-[14px]">학생</span>
      </div>
      <div className="flex gap-1 items-center">
        <RadioGroupItem value="professor" className="rounded-full" />
        <span className="font-medium text-[14px]">교수</span>
      </div>
      <div className="flex gap-1 items-center">
        <RadioGroupItem value="admin" className="rounded-full" />
        <span className="font-medium text-[14px]">성균융합원</span>
      </div>
    </RadioGroup>
  );
}
