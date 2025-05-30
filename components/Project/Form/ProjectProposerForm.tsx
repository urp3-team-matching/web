import { Input } from "@/components/ui/input";
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

interface ProposerFieldProps {
  className?: string;
  control: Control<ProjectInput>;
}

const ProjectProposerForm = ({ className, control }: ProposerFieldProps) => {
  return (
    <div className={cn({ className }, "border rounded-lg shadow-sm p-5")}>
      <span className="text-2xl font-semibold">작성자정보</span>
      <div className="w-full grid grid-cols-2 grid-rows-2 pt-6 justify-center gap-3">
        <div className="flex items-center">
          <span className="text-sm whitespace-nowrap w-14 text-center font-semibold">
            이름
          </span>
          <div className="w-2/3">
            <Controller
              name="proposerName"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  value={field.value || ""}
                  fieldState={fieldState}
                  className="w-full"
                />
              )}
            />
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-sm font-semibold w-14 text-center mr-3 whitespace-nowrap">
            비밀번호
          </span>
          <div className="w-2/3">
            <Controller
              name="password"
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

        <Controller
          name="proposerType"
          control={control}
          render={({ field: proposerTypeField }) => (
            <>
              <div className="flex items-center">
                <span className="text-sm px-3 font-semibold w-14 text-center">
                  구분
                </span>
                <div>
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
              </div>

              {proposerTypeField.value === ProposerType.STUDENT && (
                <div className="flex items-center">
                  <span className="text-sm font-semibold w-14 text-start mr-3">
                    전공
                  </span>
                  <div className="w-2/3">
                    <Controller
                      name="proposerMajor"
                      control={control}
                      render={({ field: proposerMajorField, fieldState }) => (
                        <Input
                          {...proposerMajorField}
                          className="w-full h-10"
                          value={proposerMajorField.value || ""}
                          fieldState={fieldState}
                        />
                      )}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
};

export default ProjectProposerForm;
