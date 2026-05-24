"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useProjectVerification } from "@/contexts/ProjectVerificationContext";
import apiClient from "@/lib/apiClientHelper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface PasswordGateProps {
  projectId: number;
  onCancel: () => void;
}

const passwordSchema = z.object({
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

type PasswordInput = z.infer<typeof passwordSchema>;

export default function PasswordGate({
  projectId,
  onCancel,
}: PasswordGateProps) {
  const { setVerified } = useProjectVerification();

  const { control, handleSubmit } = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "" },
  });

  async function onValid(data: PasswordInput) {
    const ok = await apiClient.verifyProjectPassword(projectId, data.password);
    if (!ok) {
      control.setError("password", {
        type: "manual",
        message: "비밀번호가 틀렸습니다.",
      });
      return;
    }
    setVerified(true);
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>비밀번호 입력</DialogTitle>
          <DialogDescription>
            프로젝트를 편집하려면 생성 시 설정한 비밀번호를 입력해주세요.
          </DialogDescription>
        </DialogHeader>
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
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              취소
            </Button>
            <Button type="submit">확인</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
