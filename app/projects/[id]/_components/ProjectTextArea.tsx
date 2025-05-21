import { Textarea } from "@/components/ui/textarea";
import { forwardRef } from "react";

interface ProjectTextAreaProps {
  title: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  adminMode?: boolean;
}

const ProjectTextArea = forwardRef<HTMLTextAreaElement, ProjectTextAreaProps>(
  ({ title, value, onChange, adminMode = false }, ref) => {
    return (
      <div className="w-full h-auto">
        <div className="w-full text-lg font-semibold">{title}</div>
        <Textarea
          ref={ref}
          className={`w-full resize-none mt-2 border p-2 rounded  ${
            adminMode ? "bg-gray-100" : "bg-white"
          }`}
          value={value}
          onChange={adminMode ? onChange : undefined}
          readOnly={!adminMode}
        />
      </div>
    );
  }
);

ProjectTextArea.displayName = "ProjectTextArea";

export default ProjectTextArea;
