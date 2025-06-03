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
  });

  async function onSuccess(data: ProjectInput) {
    setLoading(true);
    try {
      const response = await apiClient.createProject(data);
      router.push(`/projects/${response.id}`);
    } catch {
      alert("프로젝트 생성 실패!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="px-5 pb-16 flex flex-col mt-12 gap-5 justify-center w-full">
      <ProjectNameForm
        control={control}
        mode={ProjectPageModeEnum.ADMIN}
        className="h-16 border-b-[1px] border-black"
      />

      {/* <Controller
        name="attachments"
        control={control}
        render={({ field }) => <FileInput className="px-5 w-full" {...field} />}
      /> */}
      <div className="w-full mt-5 flex justify-center">
        <div className="w-[70%] pr-5">
          <ProjectForm
            mode={ProjectPageModeEnum.ADMIN}
            className="h-full flex flex-col gap-5"
            control={control}
          />
        </div>
        <ProjectCreateRightPanel
          className="w-[30%]"
          control={control}
          onSubmit={handleSubmit(onSuccess)}
          loading={loading}
        />
      </div>
    </form>
  );
}
