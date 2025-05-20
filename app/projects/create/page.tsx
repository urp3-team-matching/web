"use client";

import ProposerField from "@/app/projects/[id]/_components/Body/RightPanel/ProposerField";
import { KeywordInput } from "@/components/Project/KeywordInput";
import { Textarea } from "@/components/ui/textarea";
import { CreateProjectInput } from "@/types/project";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";

export default function Create() {
  const createField = [
    { name: "background", label: "프로젝트 추진배경" },
    { name: "method", label: "프로젝트 실행방법" },
    { name: "objective", label: "프로젝트 목표" },
    { name: "result", label: "프로젝트 기대효과" },
  ] as const;

  const { handleSubmit, control } = useForm<CreateProjectInput>();

  function onSuccess(data: CreateProjectInput) {
    alert("프로젝트 생성이 완료되었습니다");
    console.log("제출된 전체 데이터:", data);
    console.log("제출된 파일 배열:", data.attachments);
  }

  return (
    <form
      onSubmit={handleSubmit(onSuccess)}
      className="pageWidth max-[1100px]:px-5 pb-16  flex flex-col mt-12 gap-5 justify-center w-full h-auto"
    >
      <div className=" mx-5 h-16  border-b-[1px] border-black">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="text-4xl font-medium text-black w-full h-full p-1 py-5"
            />
          )}
        />
      </div>

      {/* <Controller
        name="attachments"
        control={control}
        render={({ field }) => <FileInput className="px-5 w-full" {...field} />}
      /> */}
      <div className="w-full mt-5 flex justify-center">
        <div className="w-2/3 h-auto flex flex-col gap-5">
          <Controller
            name="keywords"
            control={control}
            render={({ field }) => <KeywordInput {...field} />}
          />
          {createField.map(({ name, label }) => (
            <div key={name}>
              <div className="text-lg font-semibold">{label}</div>
              <Controller
                name={name}
                control={control}
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
            <ProposerField />
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
