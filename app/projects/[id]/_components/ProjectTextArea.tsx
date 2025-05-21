import { ProjectPageMode, ProjectPageModeEnum } from "@/app/projects/[id]/page";
import { Textarea } from "@/components/ui/textarea";
import { forwardRef } from "react";

interface ProjectTextAreaProps {
  title: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  mode?: ProjectPageMode;
}

const ProjectTextArea = forwardRef<HTMLTextAreaElement, ProjectTextAreaProps>(
  ({ title, value, onChange, mode = false }, ref) => {
    return (
      <div className="w-full h-auto">
        <div className="w-full text-lg font-semibold">{title}</div>
        <Textarea
          ref={ref}
          className={`w-full resize-none mt-2 border p-2 rounded  ${
            mode ? "bg-gray-100" : "bg-white"
          }`}
          value={value}
          onChange={mode === ProjectPageModeEnum.ADMIN ? onChange : undefined}
          readOnly={mode === null}
        />
      </div>
    );
  }
);

ProjectTextArea.displayName = "ProjectTextArea";

export default ProjectTextArea;
