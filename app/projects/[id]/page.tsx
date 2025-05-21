"use client";

import ProjectDetailHeader from "@/app/projects/[id]/_components/Header";
import ProjectDetailRightPanel from "@/app/projects/[id]/_components/RightPanel";
import ProjectForm from "@/components/Project/Form/ProjectForm";
import Spinner from "@/components/ui/spinner";
import apiClient, { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { UpdateProjectInput } from "@/types/project";
import { UpdateProposerInput } from "@/types/proposer";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Project({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const projectId = parseInt(params.id);
  const [project, setProject] = useState<PublicProjectWithForeignKeys>();
  useEffect(() => {
    (async () => {
      const response = await apiClient.getProjectById(projectId);
      if (response) {
        setProject(response);
        setLoading(false);
      } else {
        console.error("Failed to fetch project data.");
      }
    })();
  }, [projectId]);

  const [adminMode, setAdminMode] = useState<boolean>(false);

  // 프로젝트 정보 폼
  const { handleSubmit: handleTextSubmit, control: projectFormControl } =
    useForm<UpdateProjectInput & UpdateProposerInput>({
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
        proposer: {
          name: project?.proposer.name,
          type: project?.proposer.type,
          major: project?.proposer.major,
        },
      },
    });

  function onSuccess(data: UpdateProjectInput & UpdateProposerInput) {
    if (!data.attachments || data.attachments.length === 0) {
      console.log("첨부된 파일이 없습니다.");
      return;
    }
    // TODO: 첨부 파일 처리 로직 추가
  }

  function toggleAdminMode() {
    setAdminMode((prev) => !prev);
  }

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <Spinner />
      </div>
    );
  }
  if (project === undefined) {
    return <div>프로젝트를 찾을 수 없습니다!</div>;
  }

  return (
    <form onSubmit={handleTextSubmit(onSuccess)} className="my-12 px-5 w-full">
      {/* 헤더 */}
      <ProjectDetailHeader
        project={project}
        projectFormControl={projectFormControl}
        adminMode={adminMode}
        toggleAdminMode={toggleAdminMode}
      />

      {/* 본문 */}
      <div className="w-full flex justify-between">
        {/* 좌측 */}
        <ProjectForm
          className="w-2/3 h-full mt-9 flex flex-col gap-5"
          adminMode={adminMode}
          control={projectFormControl}
        />

        {/* 우측 */}
        <ProjectDetailRightPanel
          className="w-[30%]"
          project={project}
          adminMode={adminMode}
          control={projectFormControl}
          toggleAdminMode={toggleAdminMode}
        />
      </div>
    </form>
  );
}
