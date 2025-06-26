"use client";

import { Button } from "@/components/ui/button";
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
import apiClient, { PublicApplicant } from "@/lib/apiClientHelper";
import { MaxApplicantsError } from "@/lib/authUtils";
import { cn } from "@/lib/utils";
import { ApplicantInput, ApplicantSchema } from "@/types/applicant";
import { zodResolver } from "@hookform/resolvers/zod";
import { HTMLInputTypeAttribute, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const applyFields: {
  name: keyof (typeof ApplicantSchema)["shape"];
  label: string;
  type: HTMLInputTypeAttribute;
}[] = [
  { name: "name", label: "이름", type: "text" },
  { name: "major", label: "학과", type: "text" },
  { name: "phone", label: "전화번호", type: "tel" },
  { name: "email", label: "이메일", type: "email" },
] as const;

interface ProjectApplyButtonProps {
  className?: string;
  projectId: number;
  active: boolean;
  onSuccess: (project: PublicApplicant) => void;
}

const ProjectApplyButton = ({
  className,
  projectId,
  active,
  onSuccess,
}: ProjectApplyButtonProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    control: applyFormControl,
    reset,
  } = useForm<ApplicantInput>({
    resolver: zodResolver(ApplicantSchema),
  });

  async function onApply(data: ApplicantInput) {
    try {
      setIsSubmitting(true);
      const response = await apiClient.applyToProject(projectId, data);
      onSuccess(response);
      reset(); // 폼 초기화
      setOpen(false);
      alert("신청서가 성공적으로 제출되었습니다.");
    } catch (error) {
      if (error instanceof MaxApplicantsError) {
        alert("신청자가 최대 인원에 도달했습니다.");
        return;
      }
      alert("신청서 제출에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) reset(); // 다이얼로그가 닫힐 때 폼 초기화
      }}
    >
      <DialogTrigger asChild>
        <Button
          disabled={!active}
          variant="default"
          className={cn(
            `w-full h-[50px] hover:bg-green-400 bg-green-400`,
            className
          )}
        >
          {active ? "신청하기" : "신청 마감"}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>신청서</DialogTitle>
          <DialogDescription>모든 필드를 작성해주세요.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit(onApply)();
          }}
        >
          {/* 기본 필드들 */}
          {applyFields.map(({ name, label }) => (
            <div key={name} className="flex items-center my-3">
              <span className="text-sm text-end font-semibold w-16 mr-3 whitespace-nowrap">
                {label}
              </span>
              <div className="w-full">
                <Controller
                  name={name}
                  control={applyFormControl}
                  render={({ field, fieldState }) => (
                    <>
                      <Input {...field} aria-invalid={fieldState.invalid} />
                      {fieldState.error && (
                        <p className="text-xs text-destructive mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          ))}

          {/* 비밀번호 필드 */}
          <div className="flex items-center my-3">
            <span className="text-sm text-end font-semibold w-16 mr-3 whitespace-nowrap">
              비밀번호
            </span>
            <div className="w-full">
              <Controller
                name="password"
                control={applyFormControl}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      type="password"
                      {...field}
                      className={cn(fieldState.error && "border-destructive")}
                    />
                    {fieldState.error && (
                      <p className="text-xs text-destructive mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* 자기소개 필드 */}
          <div className="flex items-center my-3">
            <span className="text-sm text-end font-semibold w-16 mr-3 whitespace-nowrap">
              자기소개
            </span>
            <div className="w-full">
              <Controller
                name="introduction"
                control={applyFormControl}
                render={({ field, fieldState }) => (
                  <>
                    <Textarea
                      className={cn(
                        "h-32",
                        fieldState.error && "border-destructive"
                      )}
                      {...field}
                    />
                    {fieldState.error && (
                      <p className="text-xs text-destructive mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* 취소 및 제출 버튼 */}
          <div className="w-full h-11 flex justify-end gap-2 mt-5">
            <DialogClose asChild>
              <Button type="button" variant="ghost" className="h-full">
                취소
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="w-[58px] text-sm h-full bg-third hover:bg-third/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "제출중..." : "제출"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectApplyButton;
