import { Textarea } from "@/components/ui/textarea";

export default function ProjectTextArea({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="w-full h-auto">
      <div className="w-full text-lg font-semibold">{title}</div>
      <Textarea value={text} readOnly />
    </div>
  );
}
