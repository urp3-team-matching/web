import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProjectInput, UpdateProjectInput } from "@/types/project";
import { ProposerType } from "@prisma/client";
import { Control, Controller } from "react-hook-form";

const proposerTypes: { label: string; value: ProposerType }[] = [
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

interface ProposerFieldProps {
  className?: string;
  control: Control<ProjectInput | UpdateProjectInput>;
  isCreatePage: boolean;
}

const ProjectProposerForm = ({
  className,
  control,
  isCreatePage,
}: ProposerFieldProps) => {
  return (
    <div className={className}>
      <div className="flex items-center">
        <span className="text-sm text-end font-semibold w-16 mr-3">이름</span>
        <div>
          <Controller
            name="proposer.name"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                value={field.value || ""}
                fieldState={fieldState}
              />
            )}
          />
        </div>
      </div>

      <div className="flex items-center">
        <span className="text-sm text-end font-semibold w-16 mr-3">구분</span>
        <div>
          <Controller
            name="proposer.type"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value || ProposerType.STUDENT}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                className="w-full flex gap-4"
              >
                {proposerTypes.map((proposerType) => (
                  <div
                    key={proposerType.value}
                    className="flex gap-1 items-center"
                  >
                    <RadioGroupItem
                      value={proposerType.value}
                      className="rounded-full"
                    />
                    <Label className="font-medium text-[14px]">
                      {proposerType.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </div>
      </div>

      <div className="flex items-center">
        <span className="text-sm text-end font-semibold w-16 mr-3 whitespace-nowrap">
          비밀번호
        </span>
        <div>
          <Controller
            name={isCreatePage ? "password" : "currentPassword"}
            control={control}
            render={({ field, fieldState }) => (
              <Input
                type="password"
                {...field}
                value={field.value || ""}
                fieldState={fieldState}
              />
            )}
          />
        </div>
      </div>

      {control._formValues.proposer?.type === ProposerType.STUDENT && (
        <div className="flex items-center">
          <span className="text-sm text-end font-semibold w-16 mr-3">전공</span>
          <div>
            <Controller
              name="proposer.major"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  className="w-full h-10"
                  value={field.value || ""}
                  fieldState={fieldState}
                />
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectProposerForm;
