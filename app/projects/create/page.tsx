"use client";
import { FileInput } from "@/components/Project/Create/FileInput";
import { KeywordInput } from "@/components/Project/KeywordInput";
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
  } = useForm<ProjectFormType>();

  function doFunction(data: ProjectFormType) {
    console.log(data);
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

      <FileInput></FileInput>
      <div className="w-full mt-5 flex justify-center">
        <div className="w-2/3 h-auto flex flex-col gap-5">
          <KeywordInput title="키워드*"></KeywordInput>
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
                  <Textarea {...field} className="w-full h-10" />
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
