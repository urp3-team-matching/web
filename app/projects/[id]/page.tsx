"use client";

import { ProjectPageModeEnum } from "@/app/projects/[id]/_components/constants";
import ProjectDetailHeader from "@/app/projects/[id]/_components/Header";
import ProjectDetailRightPanel from "@/app/projects/[id]/_components/RightPanel";
import ProjectForm from "@/components/Project/Form/ProjectForm";
import ProjectProposerForm from "@/components/Project/Form/ProjectProposerForm";
import Spinner from "@/components/ui/spinner";
import apiClient, { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { ProjectInput, ProjectSchema } from "@/types/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export type ProjectPageMode = ProjectPageModeEnum | null;

export default function Project({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const projectId = parseInt(params.id);
  const [project, setProject] = useState<PublicProjectWithForeignKeys>();

  // 프로젝트 ID를 기반으로 프로젝트 데이터를 가져옵니다.
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
  // 페이지가 로드될 때, 현재 프로젝트의 비밀번호를 로컬 스토리지에서 가져옵니다.
  useEffect(() => {
    (async () => {
      const currentPassword = localStorage.getItem(
        `currentPassword/${projectId}`
      );
      if (currentPassword) {
        const isVerified = await apiClient.verifyProjectPassword(
          projectId,
          currentPassword
        );
        if (isVerified) {
          setmode(ProjectPageModeEnum.ADMIN);
        }
      }
    })();
  }, [projectId, setmode]);

  // 프로젝트 정보 폼
  const {
    handleSubmit,
    control: projectFormControl,
    getValues,
  } = useForm<ProjectInput>({
    resolver: zodResolver(ProjectSchema),
    values: {
      name: project?.name || "",
      background: project?.background || "",
      method: project?.method || "",
      objective: project?.objective || "",
      result: project?.result || "",
      attachments: project?.attachments || [],
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
      const currentPassword = localStorage.getItem(
        `currentPassword/${projectId}`
      );
      if (currentPassword === null) {
        alert("비밀번호를 입력해주세요.");
        setmode(null);
        setLoading(false);
        return;
      }
      const response = await apiClient.updateProject(projectId, {
        ...data,
        currentPassword,
      });
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

  // TODO: 비밀번호 입력 받을건지 OR 바로 삭제가능하게 할 건지
  async function handleDelete() {
    setLoading(true);
    let currentPassword =
      localStorage.getItem(`currentPassword/${projectId}`) || "";
    if (currentPassword === "") {
      currentPassword = getValues("password");
    }
    try {
      await apiClient.deleteProject(projectId, currentPassword);
      alert("프로젝트 삭제 완료");
      router.push("/");
    } catch (error) {
      console.log("Error deleting project:", error);
      if (currentPassword === "") {
        alert("비밀번호를 입력해주세요.");
        return;
      }
      alert("프로젝트 삭제 실패");
    } finally {
      setLoading(false);
    }
  }

  // TODO: 모집마감 상태 백엔드에서 추가되면 작업 시작하기
  {
    /*
  async function onCloseRecruit() {
    if (!project) {
      alert("프로젝트 정보가 없습니다.");
      return;
    }
    setLoading(true);
    try {
      const updatedProject = await apiClient.updateProject(projectId, {
        ...project,
        isClosed: true,
      });
      setProject(updatedProject);
      alert("모집이 마감되었습니다.");
    } catch (error) {
      console.error("Error closing recruitment:", error);
      alert("모집 마감 실패");
    } finally {
      setLoading(false);
    }
  } */
  }

  function toggleMode() {
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
        toggleMode={toggleMode}
      />

      {/* 본문 */}
      <div className="w-full pt-5 flex justify-between">
        {/* 좌측 */}
        <div className="w-[70%] pr-5 pt-5 flex flex-col gap-5">
          {mode === ProjectPageModeEnum.ADMIN && (
            <ProjectProposerForm control={projectFormControl} />
          )}
          <ProjectForm
            className="w-full h-full flex flex-col gap-5"
            mode={mode}
            control={projectFormControl}
          />
        </div>
        {/* 우측 */}
        <ProjectDetailRightPanel
          className="w-[30%]"
          project={project}
          onDelete={handleDelete}
          mode={mode}
          toggleMode={toggleMode}
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
