"use client";

import * as TagsInput from "@diceui/tags-input";
import { RefreshCcw, X } from "lucide-react";
import * as React from "react";


export function KeywordInput({
  className,
  title,
  keywords,
  onChange,
}: {
  className?: string;
  title?: string;
  keywords?: string[];
  onChange?: (value: string[]) => void;
}) {
  const [tricks, setTricks] = React.useState<string[]>(keywords || []);

  return (
    <TagsInput.Root
      value={tricks}
      onValueChange={setTricks}
      className={`flex w-full flex-col gap-2`}
      editable
    >
      <TagsInput.Label className=" text-lg font-semibold  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {title}
      </TagsInput.Label>
      <div
        className={`flex min-h-10 ${className} flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm focus-within:ring-1 focus-within:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-within:ring-zinc-400`}
      >
        {tricks.map((trick) => (
          <TagsInput.Item
            key={trick}
            value={trick}
            className="inline-flex max-w-[calc(100%-8px)] items-center gap-1.5 rounded border bg-transparent px-2.5 py-1 text-sm focus:outline-hidden data-disabled:cursor-not-allowed data-editable:select-none data-editing:bg-transparent data-disabled:opacity-50 data-editing:ring-1 data-editing:ring-zinc-500 dark:data-editing:ring-zinc-400 [&:not([data-editing])]:pr-1.5 [&[data-highlighted]:not([data-editing])]:bg-zinc-200 [&[data-highlighted]:not([data-editing])]:text-black dark:[&[data-highlighted]:not([data-editing])]:bg-zinc-800 dark:[&[data-highlighted]:not([data-editing])]:text-white"
          >
            <TagsInput.ItemText className="truncate" />
            <TagsInput.ItemDelete className="h-4 w-4 shrink-0 rounded-sm opacity-70 ring-offset-zinc-950 transition-opacity hover:opacity-100">
              <X className="h-3.5 w-3.5" />
            </TagsInput.ItemDelete>
          </TagsInput.Item>
        ))}
        <TagsInput.Input
          placeholder="키워드를 콤마로 구분하여 입력해주세요"
          className="flex-1 bg-transparent outline-hidden placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-zinc-400"
        />
      </div>
      <TagsInput.Clear className="flex h-9 items-center justify-center gap-2 rounded-sm border border-input bg-transparent text-zinc-800 shadow-xs hover:bg-zinc-100/80 dark:text-zinc-300 dark:hover:bg-zinc-900/80">
        <RefreshCcw className="h-4 w-4" />
        Clear
      </TagsInput.Clear>
    </TagsInput.Root>
  );
}
