import ProjectProposerFormField from "@/components/Project/Form/ProjectProposerFormField";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ProjectInput } from "@/types/project";
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

interface ProjectProposerFormProps {
  className?: string;
  control: Control<ProjectInput>;
  variant?: "default" | "sm";
}

const ProjectProposerForm = ({
  className,
  control,
  variant = "default",
}: ProjectProposerFormProps) => {
  return (
    <div
      className={cn("border p-5 rounded-lg shadow-md lg:shadow-sm", className)}
    >
      <h3 className="text-xl lg:text-2xl font-semibold mb-3 lg:mb-6">제안자</h3>
      <Separator className="lg:hidden mb-6" />
      <div
        className={cn(
          "grid",
          variant === "default" ? "grid-cols-2 gap-5" : "grid-cols-1 gap-2"
        )}
      >
        <ProjectProposerFormField
          name="proposerName"
          control={control}
          label="이름"
          inputProps={{ placeholder: "김학생" }}
        />
        <ProjectProposerFormField
          name="proposerMajor"
          control={control}
          label="전공"
          inputProps={{ placeholder: "예: 전자전기공학부" }}
        />
        <ProjectProposerFormField
          name="password"
          control={control}
          label="비밀번호"
          inputProps={{ type: "password", placeholder: "비밀번호(6자 이상)" }}
        />
        <ProjectProposerFormField
          name="email"
          control={control}
          label="이메일"
          inputProps={{ type: "email", placeholder: "example@domain.com" }}
        />
        <ProjectProposerFormField
          name="chatLink"
          control={control}
          label="오픈채팅(선택)"
          inputProps={{
            type: "url",
            placeholder: "https://open.kakao.com/o/example",
          }}
        />
        <Controller
          name="proposerType"
          control={control}
          render={({ field: proposerTypeField }) => (
            <div
              className={cn(
                variant === "default"
                  ? "col-span-2 grid grid-cols-2 gap-5"
                  : "col-span-1 flex flex-col gap-2",
                "h-auto"
              )}
            >
              <div
                className={cn(variant === "sm" && "my-2", "flex items-center")}
              >
                <label
                  htmlFor={proposerTypeField.name}
                  className={cn("text-sm font-semibold w-20")}
                >
                  구분
                </label>
                <RadioGroup
                  value={proposerTypeField.value || null}
                  onValueChange={proposerTypeField.onChange}
                  onBlur={proposerTypeField.onBlur}
                  name={proposerTypeField.name}
                  className="w-full flex gap-4"
                  ref={proposerTypeField.ref}
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
              </div>

              {proposerTypeField.value === ProposerType.STUDENT && (
                <ProjectProposerFormField
                  name="proposerMajor"
                  control={control}
                  label="전공"
                  inputProps={{
                    placeholder: "예: 컴퓨터공학과",
                  }}
                />
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default ProjectProposerForm;
