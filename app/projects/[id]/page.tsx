"use client";

import ProjectDetailHeader from "@/app/projects/[id]/_components/Header";
import ProjectDetailRightPanel from "@/app/projects/[id]/_components/RightPanel";
import ProjectForm from "@/components/Project/Form/ProjectForm";
import Spinner from "@/components/ui/spinner";
import apiClient, { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { ProjectInput, ProjectSchema } from "@/types/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export enum ProjectPageModeEnum {
  ADMIN = "admin",
}

export type ProjectPageMode = ProjectPageModeEnum | null;

export default function Project({ params }: { params: { id: string } }) {
  const router = useRouter();
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

  const [mode, setmode] = useQueryState(
    "mode",
    parseAsStringEnum<ProjectPageModeEnum>(Object.values(ProjectPageModeEnum))
  );

  // 프로젝트 정보 폼
  const { handleSubmit, control: projectFormControl } = useForm<ProjectInput>({
    resolver: zodResolver(ProjectSchema),
    values: {
      name: project?.name || "",
      background: project?.background || "",
      method: project?.method || "",
      objective: project?.objective || "",
      result: project?.result || "",
      // TODO: 첨부파일 처리 로직 추가
      // attachments: project?.attachments  || "",
      keywords: project?.keywords || [],
      password: "",
      proposerName: project?.proposerName || "",
      proposerType: project?.proposerType || "STUDENT",
      proposerMajor: project?.proposerMajor || "",
    },
  });

  async function onSuccess(data: ProjectInput) {
    setLoading(true);
    try {
      const response = await apiClient.updateProject(projectId, data);
      setProject(response);
    } catch (error) {
      console.error("Error updating project:", error);
      alert("프로젝트 수정 실패!");
      return;
    } finally {
      setLoading(false);
    }

    router.push(`/projects/${projectId}`);
  }

  function togglemode() {
    if (mode === ProjectPageModeEnum.ADMIN) {
      setmode(null);
      return;
    }
    setmode(ProjectPageModeEnum.ADMIN);
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
    <form onSubmit={handleSubmit(onSuccess)} className="my-12 px-5 w-full">
      {/* 헤더 */}
      <ProjectDetailHeader
        project={project}
        projectFormControl={projectFormControl}
        mode={mode}
        togglemode={togglemode}
      />

      {/* 본문 */}
      <div className="w-full flex justify-between">
        {/* 좌측 */}
        <ProjectForm
          className="w-2/3 h-full mt-9 flex flex-col gap-5"
          mode={mode}
          control={projectFormControl}
        />

        {/* 우측 */}
        <ProjectDetailRightPanel
          className="w-[30%]"
          project={project}
          mode={mode}
          control={projectFormControl}
          togglemode={togglemode}
          onSubmit={handleSubmit(onSuccess)}
          loading={loading}
          onApplySuccess={(newApplicant) => {
            setProject((prev) => {
              if (!prev) return;
              return {
                ...prev,
                applicants: [...prev.applicants, newApplicant],
              };
            });
          }}
        />
      </div>
    </form>
  );
}
