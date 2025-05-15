"use client";
import { FileInput } from "@/components/Project/FileInput";
import * as React from "react";

import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { KeywordInput } from "@/components/Project/KeywordInput";
import ProposerField from "@/components/Project/ProposerField";

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
  const createField = [
    { name: "introduction", label: "프로젝트 소개*" },
    { name: "background", label: "프로젝트 추진배경*" },
    { name: "methodology", label: "프로젝트 실행방법*" },
    { name: "goal", label: "프로젝트 목표*" },
    { name: "expectation", label: "프로젝트 기대효과*" },
  ] as const;

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

  function onError(errors: any) {
    console.error("유효성 검사 에러 발생:", errors);
  }

  function doFunction(data: ProjectFormType) {
    alert("프로젝트 생성이 완료되었습니다");
    console.log("제출된 전체 데이터:", data);
    console.log("제출된 파일 배열:", data.files);
  }

  return (
    <form
      onSubmit={handleSubmit(doFunction, onError)}
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
          <FileInput
            className="px-5 w-full"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <div className="w-full mt-5 flex justify-center">
        <div className="w-2/3 h-auto flex flex-col gap-5">
          <Controller
            name="keywords"
            control={control}
            rules={{ required: "키워드를 입력해주세요." }}
            render={({ field }) => (
              <KeywordInput
                value={field.value}
                onChange={field.onChange}
              ></KeywordInput>
            )}
          />
          {createField.map(({ name, label }) => (
            <div key={name}>
              <div className="text-lg font-semibold">{label}</div>
              <Controller
                name={name}
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
            <ProposerField control={control}></ProposerField>
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
