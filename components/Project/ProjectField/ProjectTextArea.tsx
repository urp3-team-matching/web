"use client";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function ProjectTextArea({
  title,
  text,
  adminMode,
}: {
  title: string;
  text: string;
  adminMode?: boolean;
}) {
  const [value, setValue] = useState(text);
  return (
    <div className="w-full h-auto">
      <div className="w-full text-lg font-semibold">{title}</div>
      <Textarea
        value={value}
        readOnly={!adminMode}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
