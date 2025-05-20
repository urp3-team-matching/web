import * as TagsInput from "@diceui/tags-input";
import { RefreshCcw, X } from "lucide-react";

type KeywordInputProps = {
  value?: string[];
  onChange: (value: string[]) => void;
};

export function KeywordInput({ value, onChange }: KeywordInputProps) {
  return (
    <TagsInput.Root
      value={value}
      onValueChange={onChange}
      className="flex w-full flex-col gap-2"
      editable
    >
      <TagsInput.Label className="text-lg font-semibold">
        키워드
      </TagsInput.Label>
      <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm focus-within:ring-1 focus-within:ring-zinc-500">
        {value?.map((keyword) => (
          <TagsInput.Item
            key={keyword}
            value={keyword}
            className="inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-sm"
          >
            <TagsInput.ItemText className="truncate" />
            <TagsInput.ItemDelete className="h-4 w-4">
              <X className="h-3.5 w-3.5" />
            </TagsInput.ItemDelete>
          </TagsInput.Item>
        ))}
        <TagsInput.Input
          placeholder="키워드를 콤마로 구분하여 입력해주세요"
          className="flex-1 bg-transparent"
        />
      </div>
      <TagsInput.Clear className="flex h-9 items-center justify-center gap-2 rounded-sm border text-zinc-800 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900">
        <RefreshCcw className="h-4 w-4" />
        모두 지우기
      </TagsInput.Clear>
    </TagsInput.Root>
  );
}
