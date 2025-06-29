import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ProjectInput } from "@/types/project";
import { Control, Controller } from "react-hook-form";

interface ProposerFieldProps {
  className?: string;
  name: keyof ProjectInput;
  label: string;
  control: Control<ProjectInput>;
  variant?: "default" | "sm";
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const ProjectProposerFormField = ({
  className,
  name,
  label,
  control,
  variant,
  inputProps,
}: ProposerFieldProps) => {
  return (
    <div className={cn("flex items-center", className)}>
      <label
        htmlFor={name}
        className={cn(
          variant === "sm" && "mr-3",
          "text-sm whitespace-nowrap w-16 font-semibold"
        )}
      >
        {label}
      </label>
      <div className="flex-1">
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              value={field.value || ""}
              fieldState={fieldState}
              className="w-full"
              {...inputProps}
            />
          )}
        />
      </div>
    </div>
  );
};

export default ProjectProposerFormField;
