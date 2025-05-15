"use client";
import { FileInput } from "@/components/Project/Create/FileInput";
import * as TagsInput from "@diceui/tags-input";
import { RefreshCcw, X } from "lucide-react";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";

type ProjectFormType = {
  title: string;
  introduction: string;
  background: string;
  methodology: string;
  goal: string;
  expectation: string;
  name: string;
  proposer: "professor" | "student" | "admin";
  password: string;
  majors: string;
  keywords: string[];
  files: File[];
};

export default function Create() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProjectFormType>({
    defaultValues: {
      keywords: [],
      files: [],
    },
  });

  function doFunction(data: ProjectFormType) {
    console.log("제출된 전체 데이터:", data);
    console.log("제출된 파일 배열:", data.files);
  }

  return (
    <form
      onSubmit={handleSubmit(doFunction)}
      className="pageWidth max-[1100px]:px-5 pb-16  flex flex-col mt-12 gap-5 justify-center w-full h-auto"
    >
      <div className=" mx-5 h-16  border-b-[1px] border-black">
        <input
          placeholder="제목을 입력하세요"
          className="text-4xl font-medium text-black w-full h-full p-1 py-5"
          {...register("title", {
            required: "제목을 입력해주세요",
          })}
        ></input>
      </div>

      <Controller
        name="files"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <FileInput value={field.value} onChange={field.onChange} />
        )}
      />
      <div className="w-full mt-5 flex justify-center">
        <div className="w-2/3 h-auto flex flex-col gap-5">
          <Controller
            name="keywords"
            control={control}
            rules={{ required: "키워드를 입력해주세요." }}
            render={({ field }) => (
              <TagsInput.Root
                value={field.value}
                onValueChange={field.onChange}
                className={`flex w-full flex-col gap-2`}
                editable
              >
                <TagsInput.Label className=" text-lg font-semibold  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  키워드
                </TagsInput.Label>
                <div
                  className={`flex min-h-10  flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm focus-within:ring-1 focus-within:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-within:ring-zinc-400`}
                >
                  {field.value.map((trick) => (
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
                  모두 지우기
                </TagsInput.Clear>
              </TagsInput.Root>
            )}
          />
          {[
            { name: "introduction", label: "프로젝트 소개*" },
            { name: "background", label: "프로젝트 추진배경*" },
            { name: "methodology", label: "프로젝트 실행방법*" },
            { name: "goal", label: "프로젝트 목표*" },
            { name: "expectation", label: "프로젝트 기대효과*" },
          ].map(({ name, label }) => (
            <div key={name}>
              <div className="text-lg font-semibold">{label}</div>
              <Controller
                name={name as keyof ProjectFormType}
                control={control}
                rules={{ required: `${label}을 입력해주세요.` }}
                render={({ field }) => (
                  <Textarea {...field} className="w-full resize-none h-10" />
                )}
              />
            </div>
          ))}
        </div>

        <div className="w-[30%] pl-5 text-lg font-semibold flex flex-col gap-5">
          <div>프로젝트 제안자</div>
          <div className="w-full p-5 flex flex-col gap-3 border rounded-lg h-auto">
            <div className="flex items-center">
              <span className="text-sm text-end font-semibold w-16 mr-3">
                이름
              </span>
              <Controller
                name="name"
                control={control}
                rules={{ required: "제안자 이름을 입력해주세요" }}
                render={({ field }) => <Input {...field} />}
              />
            </div>

            <div className="flex items-center">
              <span className="text-sm text-end font-semibold w-16 mr-3">
                구분
              </span>
              <Controller
                name="proposer"
                control={control}
                rules={{ required: "제안자 구분을 선택해주세요" }}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="w-full flex gap-4"
                  >
                    <div className="flex gap-1 items-center">
                      <RadioGroupItem
                        value="student"
                        className="rounded-full"
                      />
                      <span className="font-medium text-[14px]">학생</span>
                    </div>
                    <div className="flex gap-1 items-center">
                      <RadioGroupItem
                        value="professor"
                        className="rounded-full"
                      />
                      <span className="font-medium text-[14px]">교수</span>
                    </div>
                    <div className="flex gap-1 items-center">
                      <RadioGroupItem value="admin" className="rounded-full" />
                      <span className="font-medium text-[14px]">
                        성균융합원
                      </span>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            <div className="flex items-center">
              <span className="text-sm text-end font-semibold w-16 mr-3 whitespace-nowrap">
                비밀번호
              </span>
              <Controller
                name="password"
                control={control}
                rules={{ required: "비밀번호를 입력해주세요" }}
                render={({ field }) => <Input type="text" {...field} />}
              />
            </div>

            <div className="flex items-center">
              <span className="text-sm text-end font-semibold w-16 mr-3">
                전공
              </span>
              <Controller
                name="majors"
                control={control}
                rules={{ required: "전공을 입력해주세요" }}
                render={({ field }) => (
                  <Input {...field} className="w-full h-10" />
                )}
              />
            </div>
          </div>
          <div className="w-full flex gap-3 justify-center items-center">
            <Link
              href="/"
              className="w-[90px] h-10 justify-center text-base font-normal items-center flex bg-slate-200 rounded-[10px]"
            >
              취소
            </Link>
            <button
              type="submit"
              className="cursor-pointer text-white text-base font-normal w-[90px] h-10 flex justify-center items-center bg-secondary-100 rounded-[10px]"
            >
              등록
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
