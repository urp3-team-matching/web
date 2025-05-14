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
        className={`w-full resize-none mt-2 border p-2 rounded  ${
          adminMode ? " bg-gray-100" : "bg-white"
        }`}
        value={value}
        onChange={adminMode ? onChange : undefined}
        readOnly={!adminMode}
      />
    </div>
  );
}
