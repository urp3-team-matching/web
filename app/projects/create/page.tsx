"use client";

import { ProjectPageModeEnum } from "@/app/projects/[id]/page";
import ProjectCreateRightPanel from "@/app/projects/create/_components/RightPanel";
import ProjectForm from "@/components/Project/Form/ProjectForm";
import ProjectNameForm from "@/components/Project/Form/ProjectNameForm";
import apiClient from "@/lib/apiClientHelper";
import { CreateProjectSchema, ProjectInput } from "@/types/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function Create() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { handleSubmit, control } = useForm<ProjectInput>({
    resolver: zodResolver(CreateProjectSchema),
  });

  async function onSuccess(data: ProjectInput) {
    console.log("Form data:", data);
    setLoading(true);
    try {
      const response = await apiClient.createProject(data);
      router.push(`/projects/${response.id}`);
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("프로젝트 생성 실패!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="max-[1100px]:px-5 pb-16 flex flex-col mt-12 gap-5 justify-center w-full">
      <ProjectNameForm
        control={control}
        mode={ProjectPageModeEnum.ADMIN}
        className="mx-5 h-16 border-b-[1px] border-black"
      />

      {/* <Controller
        name="attachments"
        control={control}
        render={({ field }) => <FileInput className="px-5 w-full" {...field} />}
      /> */}
      <div className="w-full mt-5 flex justify-center">
        <ProjectForm
          className="w-2/3 h-full flex flex-col gap-5"
          control={control}
        />
        <ProjectCreateRightPanel
          className="w-[30%] pl-5"
          isCreatePage={true}
          control={control}
          onSubmit={() => {
            console.log("Form submitted2");
            handleSubmit(onSuccess, (data) => {
              console.log("Form error:", data);
              alert("프로젝트 생성 실패!");
            })();
          }}
        />
      </div>
    </form>
  );
}
