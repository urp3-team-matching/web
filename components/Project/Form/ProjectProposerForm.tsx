import ProjectProposerFormField from "@/components/Project/Form/ProjectProposerFormField";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
    <div className={cn({ className }, "border rounded-lg shadow-sm p-5")}>
      <span className="text-2xl font-semibold">작성자정보</span>
      <div
        className={cn(
          variant === "default" ? "grid-cols-2" : "grid-cols-1",
          "grid pt-6 justify-center gap-5"
        )}
      >
        <ProjectProposerFormField
          name="proposerName"
          control={control}
          label="이름"
          variant={variant}
        />
        <ProjectProposerFormField
          name="password"
          control={control}
          label="비밀번호"
          variant={variant}
          inputProps={{ type: "password" }}
        />
        <ProjectProposerFormField
          name="proposerPhone"
          control={control}
          label="연락처"
          variant={variant}
          inputProps={{ type: "tel" }}
        />
        <ProjectProposerFormField
          name="email"
          control={control}
          label="이메일"
          variant={variant}
          inputProps={{ type: "email" }}
        />
        <ProjectProposerFormField
          name="chatLink"
          control={control}
          label="채팅링크"
          variant={variant}
          inputProps={{ type: "url" }}
        />

        <Controller
          name="proposerType"
          control={control}
          render={({ field: proposerTypeField }) => (
            <div className="col-span-2 grid grid-cols-2 gap-5 h-9">
              <div
                className={cn(variant === "sm" && "my-2", "flex items-center")}
              >
                <label
                  htmlFor={proposerTypeField.name}
                  className={cn(
                    variant === "sm" ? "mr-3" : "",
                    "text-sm px-3 font-semibold w-14 text-center"
                  )}
                >
                  구분
                </label>
                <RadioGroup
                  value={proposerTypeField.value || null}
                  onValueChange={proposerTypeField.onChange}
                  onBlur={proposerTypeField.onBlur}
                  name={proposerTypeField.name}
                  className="w-full flex gap-4 px-4"
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
