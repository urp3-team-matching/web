import { GroupChecker } from "@/app/projects/[id]/_components/Body/RightPanel/GroupChecker";
import { Input } from "@/components/ui/input";
import { CreateProposerInput } from "@/types/proposer";
import { Controller, useForm } from "react-hook-form";

interface ProposerFieldProps {
  className?: string;
}

const ProposerField = ({ className }: ProposerFieldProps) => {
  const { handleSubmit, control } = useForm<CreateProposerInput>();

  return (
    <div className={className}>
      <div className="flex items-center">
        <span className="text-sm text-end font-semibold w-16 mr-3">이름</span>
        <Controller
          name="name"
          control={control}
          rules={{ required: "제안자 이름을 입력해주세요" }}
          render={({ field }) => <Input {...field} />}
        />
      </div>

      <div className="flex items-center">
        <span className="text-sm text-end font-semibold w-16 mr-3">구분</span>
        <Controller
          name="proposer"
          control={control}
          rules={{ required: "제안자 구분을 선택해주세요" }}
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
          rules={{ required: "비밀번호를 입력해주세요" }}
          render={({ field }) => <Input type="text" {...field} />}
        />
      </div>

      <div className="flex items-center">
        <span className="text-sm text-end font-semibold w-16 mr-3">전공</span>
        <Controller
          name="majors"
          control={control}
          rules={{ required: "전공을 입력해주세요" }}
          render={({ field }) => <Input {...field} className="w-full h-10" />}
        />
      </div>
    </div>
  );
};

export default ProposerField;
