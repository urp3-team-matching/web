import { ProjectPageModeEnum } from "@/app/projects/[id]/_components/constants";
import { ProjectPageMode } from "@/app/projects/[id]/page";
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
    if (mode === null) {
      return (
        <section>
          <h3 className="w-full text-lg font-semibold">{title}</h3>
          <p className="w-full mt-2 whitespace-pre-wrap break-words text-base">
            {value || <span className="text-gray-400">—</span>}
          </p>
        </section>
      );
    }

    return (
      <div>
        <div className="w-full text-lg font-semibold">{title}</div>
        <Textarea
          ref={ref}
          className={cn(
            "w-full resize-none mt-2 border p-2 rounded",
            mode === ProjectPageModeEnum.ADMIN ? "bg-gray-100" : "bg-white",
            fieldState.error ? "border-destructive" : "border-gray-300"
          )}
          value={value}
          onChange={onChange}
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
