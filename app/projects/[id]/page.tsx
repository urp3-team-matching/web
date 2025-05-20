"use client";

import ProjectBody from "@/app/projects/[id]/_components/Body";
import ProjectHeader from "@/app/projects/[id]/_components/Header";
import apiClient, { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { UpdateProjectInput } from "@/types/project";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Project({ params }: { params: { id: string } }) {
  const projectId = parseInt(params.id);
  const [project, setProject] = useState<PublicProjectWithForeignKeys>();
  useEffect(() => {
    (async () => {
      const response = await apiClient.getProjectById(projectId);
      if (response) {
        setProject(response);
      } else {
        console.error("Failed to fetch project data.");
      }
    })();
  }, [projectId]);

  const [adminMode, setAdminMode] = useState<boolean>(false);

  // 프로젝트 정보 폼
  const { handleSubmit: handleTextSubmit, control: projectFormControl } =
    useForm<UpdateProjectInput>({
      values: {
        name: project?.name,
        background: project?.background,
        method: project?.method,
        objective: project?.objective,
        result: project?.result,
        // TODO: 첨부파일 처리 로직 추가
        // attachments: project?.attachments,
        keywords: project?.keywords,
        currentPassword: "",
      },
    });

  function edit(data: UpdateProjectInput) {
    if (!data.attachments || data.attachments.length === 0) {
      console.log("첨부된 파일이 없습니다.");
      return;
    }
    // TODO: 첨부 파일 처리 로직 추가
  }

  function toggleAdminMode() {
    setAdminMode((prev) => !prev);
  }

  if (!project) {
    return <div>프로젝트를 찾을 수 없습니다!</div>;
  }

  return (
    <div className="w-full pageWidth h-auto">
      <form onSubmit={handleTextSubmit(edit)} className="my-12 px-5 w-full">
        <ProjectHeader
          project={project}
          adminMode={adminMode}
          toggleAdminMode={toggleAdminMode}
          projectFormControl={projectFormControl}
        />

        <ProjectBody
          project={project}
          adminMode={adminMode}
          toggleAdminMode={toggleAdminMode}
          projectFormControl={projectFormControl}
        />
      </form>
    </div>
  );
}
