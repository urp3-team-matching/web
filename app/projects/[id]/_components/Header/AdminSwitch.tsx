"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { ProjectPageModeEnum } from "@/app/projects/[id]/_components/constants";
import { ProjectPageMode } from "@/app/projects/[id]/page";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useProjectVerification } from "@/contexts/ProjectVerificationContext";
import apiClient from "@/lib/apiClientHelper";

interface AdminSwitchProps {
  className?: string;
  mode: ProjectPageMode;
  toggleMode: () => void;
  projectId: number;
}

const AdminSwitch = ({
  mode,
  toggleMode,
  className,
  projectId,
}: AdminSwitchProps) => {
  const [open, setOpen] = useState(false);
  const { isVerified, setVerified } = useProjectVerification(); // 🔹 컨텍스트에서 검증 상태 가져오기

  const passwordSchema = z.object({
    password: z.string().min(1, "비밀번호를 입력해주세요"),
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });
  const { control, handleSubmit } = passwordForm;

  async function onValid(data: z.infer<typeof passwordSchema>) {
    const isPasswordValid = await apiClient.verifyProjectPassword(
      projectId,
      data.password
    );

    if (!isPasswordValid) {
      control.setError("password", {
        type: "manual",
        message: "비밀번호가 틀렸습니다.",
      });
      return;
    }

    setVerified(true);
    setOpen(false);
    toggleMode();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Switch
        className={className}
        checked={mode === ProjectPageModeEnum.ADMIN}
        onClick={() => {
          if (mode === ProjectPageModeEnum.ADMIN) {
            // 🔹 관리자 모드 해제 (검증 불필요)
            toggleMode();
          } else {
            // 🔹 관리자 모드 활성화 시도
            if (isVerified === true) {
              // 이미 검증됨 (쿠키에 올바른 비밀번호 저장됨)
              toggleMode();
            } else {
              // 검증되지 않음 또는 검증 중 - 비밀번호 입력 모달 열기
              setOpen(true);
            }
          }
        }}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>비밀번호 입력</DialogTitle>
          <DialogDescription>
            해당 프로젝트를 편집하기 위해서는 생성시 설정한 비밀번호를 입력해야
            합니다.
          </DialogDescription>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit(onValid)(e);
            }}
          >
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  {...field}
                  fieldState={fieldState}
                />
              )}
            />
            <Button type="submit" className="mt-4">
              확인
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

AdminSwitch.displayName = "AdminSwitch";
export default AdminSwitch;
