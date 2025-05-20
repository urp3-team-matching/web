"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CreateApplicantInput } from "@/types/applicant";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const applyFields = [
  { name: "name", title: "이름" },
  { name: "major", title: "학과" },
  { name: "phone", title: "전화번호" },
  { name: "email", title: "이메일" },
] as const;

interface ProjectApplyButtonProps {
  className?: string;
}

const ProjectApplyButton = ({ className }: ProjectApplyButtonProps) => {
  const [open, setOpen] = useState(false);

  const { handleSubmit: handleApplySubmit, control: applyFormControl } =
    useForm<CreateApplicantInput>();

  function onApply(data: CreateApplicantInput) {
    console.log("신청서 제출된 데이터:", data);
    alert("신청서가 제출되었습니다.");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          onClick={() => setOpen(false)}
          className={cn(
            `w-full h-[50px] bg-secondary-100 text-white flex justify-center cursor-pointer items-center rounded-lg text-base font-medium`,
            className
          )}
        >
          신청하기
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>신청서</DialogTitle>
          <DialogDescription>모든 필드를 작성해주세요.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleApplySubmit(onApply)}>
          {/* 필드: 나머지 */}
          {applyFields.map(({ name, title }) => (
            <div key={name} className="flex items-center my-3">
              <span className="text-sm text-end font-semibold w-16 mr-3 whitespace-nowrap">
                {title}
              </span>
              <Controller
                name={name}
                control={applyFormControl}
                rules={{ required: `${title}을 입력해주세요` }}
                render={({ field }) => <Input {...field} />}
              />
            </div>
          ))}

          {/* 필드: 자기소개 */}
          <div className="flex items-center my-3">
            <span className="text-sm text-end font-semibold w-16 mr-3 whitespace-nowrap">
              자기소개
            </span>
            <Controller
              name="introduction"
              control={applyFormControl}
              render={({ field }) => <Textarea className="h-32" {...field} />}
            />
          </div>

          {/* 취소 및 제출 버튼 */}
          <div className="w-full h-auto flex justify-end gap-2 mt-5">
            <DialogClose className="text-sm font-normal rounded-md hover:bg-gray-300 cursor-pointer bg-gray-200 border text-black w-[58px] h-11">
              취소
            </DialogClose>
            <button className="w-[58px] text-sm font-normal bg-secondary-100 rounded-lg text-white cursor-pointer h-11">
              제출
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectApplyButton;
