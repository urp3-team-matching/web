import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ProjectInput } from "@/types/project";
import { Control, Controller } from "react-hook-form";

interface ProposerFieldProps {
  className?: string;
  name: keyof ProjectInput;
  label: string;
  control: Control<ProjectInput>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const ProjectProposerFormField = ({
  className,
  name,
  label,
  control,
  inputProps,
}: ProposerFieldProps) => {
  return (
    <div className={cn("flex items-center", className)}>
      <label htmlFor={name} className={cn("text-sm font-semibold w-20")}>
        {label}
      </label>
      <div>
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              value={field.value || ""}
              fieldState={fieldState}
              {...inputProps}
            />
          )}
        />
      </div>
    </div>
  );
};

export default ProjectProposerFormField;
