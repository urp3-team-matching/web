import { GroupChecker } from "@/app/projects/[id]/_components/RightPanel/GroupChecker";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";

interface ProposerFieldProps {
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any; // TODO: FormControl 타입을 정의해야 함
}

const ProjectProposerForm = ({ className, control }: ProposerFieldProps) => {
  return (
    <div className={className}>
      <div className="flex items-center">
        <span className="text-sm text-end font-semibold w-16 mr-3">이름</span>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input {...field} value={field.value || ""} />}
        />
      </div>

      <div className="flex items-center">
        <span className="text-sm text-end font-semibold w-16 mr-3">구분</span>
        <Controller
          name="proposer"
          control={control}
          render={({ field }) => (
            <GroupChecker value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="flex items-center">
        <span className="text-sm text-end font-semibold w-16 mr-3 whitespace-nowrap">
          비밀번호
        </span>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input type="password" {...field} value={field.value || ""} />
          )}
        />
      </div>

      <div className="flex items-center">
        <span className="text-sm text-end font-semibold w-16 mr-3">전공</span>
        <Controller
          name="majors"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              className="w-full h-10"
              value={field.value || ""}
            />
          )}
        />
      </div>
    </div>
  );
};

export default ProjectProposerForm;
