"use client";

import { ProjectPageModeEnum } from "@/app/projects/[id]/_components/constants";
import ProjectCreateRightPanel from "@/app/projects/create/_components/RightPanel";
import ProjectForm from "@/components/Project/Form/ProjectForm";
import ProjectNameForm from "@/components/Project/Form/ProjectNameForm";
import apiClient from "@/lib/apiClientHelper";
import { ProjectInput, ProjectSchema } from "@/types/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function Create() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { handleSubmit, control } = useForm<ProjectInput>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      status: "RECRUITING",
    },
  });

  async function onSuccess(data: ProjectInput) {
    setLoading(true);
    try {
      const response = await apiClient.createProject(data);
      localStorage.setItem(`currentPassword/${response.id}`, data.password);
      router.push(`/projects/${response.id}`);
    } catch {
      alert("프로젝트 생성 실패!");
    } finally {
      setLoading(false);
    }
  }

  function onInvalidSubmit() {
    console.error(control._formState.errors);
    alert("프로젝트 생성 실패! 입력값을 확인해주세요.");
  }

  return (
    <form className="px-1 lg:px-5 pb-16 flex mx-auto flex-col mt-8 lg:mt-12 gap-5 justify-center max-w-96 lg:max-w-none">
      <ProjectNameForm
        control={control}
        mode={ProjectPageModeEnum.ADMIN}
        className="h-10 text-lg lg:text-3xl lg:h-16 border-b-[1px] border-black"
      />

      {/* <Controller
        name="attachments"
        control={control}
        render={({ field }) => <FileInput className="px-5 w-full" {...field} />}
      /> */}
      <div className="w-full lg:mt-5 flex-col lg:flex-row gap-6 lg:gap-0 flex justify-center">
        <div className="w-full lg:w-[70%] lg:pr-5">
          <ProjectForm
            mode={ProjectPageModeEnum.ADMIN}
            className="h-full flex flex-col gap-5"
            control={control}
          />
        </div>
        <ProjectCreateRightPanel
          className="w-full lg:w-[30%]"
          control={control}
          onSubmit={handleSubmit(onSuccess, onInvalidSubmit)}
          loading={loading}
        />
      </div>
    </form>
  );
}
