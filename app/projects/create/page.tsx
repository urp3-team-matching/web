"use client";

import { ProjectPageModeEnum } from "@/app/projects/[id]/page";
import ProjectCreateRightPanel from "@/app/projects/create/_components/RightPanel";
import ProjectForm from "@/components/Project/Form/ProjectForm";
import ProjectNameForm from "@/components/Project/Form/ProjectNameForm";
import { CreateProjectInput } from "@/types/project";
import { useForm } from "react-hook-form";

export default function Create() {
  const { handleSubmit, control } = useForm<CreateProjectInput>();

  function onSuccess(data: CreateProjectInput) {
    alert("프로젝트 생성이 완료되었습니다");
    console.log("제출된 전체 데이터:", data);
    console.log("제출된 파일 배열:", data.attachments);
  }

  return (
    <form
      onSubmit={handleSubmit(onSuccess)}
      className="max-[1100px]:px-5 pb-16  flex flex-col mt-12 gap-5 justify-center w-full h-auto"
    >
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
          control={control}
          onSubmit={handleSubmit(onSuccess)}
        />
      </div>
    </form>
  );
}
