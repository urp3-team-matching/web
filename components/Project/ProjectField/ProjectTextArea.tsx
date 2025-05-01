import { Textarea } from "@/components/ui/textarea";

interface ProjectTextAreaProps {
  title: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  adminMode?: boolean;
}

export default function ProjectTextArea({
  title,
  value,
  onChange,
  adminMode = false,
}: ProjectTextAreaProps) {
  return (
    <div className="w-full h-auto">
      <div className="w-full text-lg font-semibold">{title}</div>
      <Textarea
        className={`w-full mt-2 border p-2 rounded ${
          adminMode ? "bg-white" : "bg-gray-100"
        }`}
        value={value}
        onChange={adminMode ? onChange : undefined}
        readOnly={!adminMode}
      />
    </div>
  );
}
