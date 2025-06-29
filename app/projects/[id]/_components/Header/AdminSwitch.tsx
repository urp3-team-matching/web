"use client";

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
import apiClient from "@/lib/apiClientHelper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

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
  const currentPasswordSchema = z.object({
    currentPassword: z.string().min(1, "비밀번호를 입력해주세요"),
  });
  const passwordForm = useForm<z.infer<typeof currentPasswordSchema>>({
    resolver: zodResolver(currentPasswordSchema),
    defaultValues: {
      currentPassword: "",
    },
  });
  const { control, handleSubmit } = passwordForm;

  async function onValid(data: z.infer<typeof currentPasswordSchema>) {
    const isVerified = await apiClient.verifyProjectPassword(
      projectId,
      data.currentPassword
    );
    if (!isVerified) {
      control.setError("currentPassword", {
        type: "manual",
        message: "비밀번호가 틀렸습니다.",
      });
      return;
    }
    localStorage.setItem(`currentPassword/${projectId}`, data.currentPassword);
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
            toggleMode();
          } else {
            const currentPassword = localStorage.getItem(
              `currentPassword/${projectId}`
            );
            if (currentPassword) {
              apiClient
                .verifyProjectPassword(projectId, currentPassword)
                .then((isVerified) => {
                  if (isVerified) {
                    toggleMode();
                    return;
                  } else {
                    // 저장된 비밀번호가 틀린 경우, 모달 열기
                    setOpen(true);
                  }
                });
            } else {
              // 비밀번호가 없는 경우, 모달 열기
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
              name="currentPassword"
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
