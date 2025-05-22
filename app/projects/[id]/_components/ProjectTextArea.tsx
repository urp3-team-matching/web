import { ProjectPageMode, ProjectPageModeEnum } from "@/app/projects/[id]/page";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { ControllerFieldState } from "react-hook-form";

interface ProjectTextAreaProps {
  title: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  mode?: ProjectPageMode;
  fieldState: ControllerFieldState;
}

const ProjectTextArea = forwardRef<HTMLTextAreaElement, ProjectTextAreaProps>(
  ({ title, value, onChange, mode, fieldState }, ref) => {
    return (
      <div>
        <div className="w-full text-lg font-semibold">{title}</div>
        <Textarea
          ref={ref}
          className={cn(
            "w-full resize-none mt-2 border p-2 rounded",
            mode === ProjectPageModeEnum.ADMIN ? "bg-gray-100" : "bg-white",
            fieldState.error ? "border-destructive" : "border-gray-300",
            mode === null ? "cursor-not-allowed" : "cursor-text"
          )}
          value={value}
          onChange={onChange}
          readOnly={mode === null}
        />
        {fieldState.error && (
          <p className="text-xs text-destructive mt-1">
            {fieldState.error.message}
          </p>
        )}
      </div>
    );
  }
);

ProjectTextArea.displayName = "ProjectTextArea";

export default ProjectTextArea;
