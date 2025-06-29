/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ProjectPageModeEnum } from "@/app/projects/[id]/_components/constants";
import ProjectDetailHeader from "@/app/projects/[id]/_components/Header";
import ProjectDetailRightPanel from "@/app/projects/[id]/_components/RightPanel";
import ProjectForm from "@/components/Project/Form/ProjectForm";
import ProjectProposerForm from "@/components/Project/Form/ProjectProposerForm";
import Spinner from "@/components/ui/spinner";
import apiClient, {
  PublicApplicant,
  PublicProjectWithForeignKeys,
} from "@/lib/apiClientHelper";
import { ProjectUpdateInput, ProjectUpdateSchema } from "@/types/project";
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
  const [applicants, setApplicants] = useState<PublicApplicant[]>();

  // 프로젝트 ID를 기반으로 프로젝트 데이터를 가져옵니다.
  useEffect(() => {
    (async () => {
      const resProject = await apiClient.getProjectById(projectId);
      const resApplicant = await apiClient.getApplicants(projectId);
      if (resProject) {
        setProject(resProject);
        setLoading(false);
      } else {
        console.error("Failed to fetch project data.");
      }
      if (resApplicant) {
        setApplicants(resApplicant);
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
          return;
        }
      }
      setmode(null);
    })();
  }, [projectId, setmode]);

  // 프로젝트 정보 폼
  const { handleSubmit, control, reset } = useForm<ProjectUpdateInput>({
    resolver: zodResolver(ProjectUpdateSchema),
    defaultValues: {
      name: "",
      background: "",
      method: "",
      objective: "",
      result: "",
      etc: "",
      attachments: [],
      keywords: [],
      password: "",
      currentPassword: "",
      proposerName: "",
      proposerType: "STUDENT",
      proposerMajor: "",
      proposerPhone: "",
      email: "",
      chatLink: "",
      status: "RECRUITING",
    },
  });

  // 프로젝트 데이터가 로드되면 폼을 초기화
  useEffect(() => {
    if (project) {
      reset({
        name: project.name || "",
        background: project.background || "",
        method: project.method || "",
        objective: project.objective || "",
        result: project.result || "",
        etc: project.etc || "",
        attachments: project.attachments || [],
        keywords: project.keywords || [],
        password: "",
        currentPassword:
          localStorage.getItem(`currentPassword/${projectId}`) || "",
        proposerName: project.proposerName || "",
        proposerType: project.proposerType || "STUDENT",
        proposerMajor: project.proposerMajor || "",
        proposerPhone: project.proposerPhone || "",
        email: project.email || "",
        chatLink: project.chatLink || "",
        status: project.status || "RECRUITING",
      });
    }
  }, [project, reset, projectId]);

  async function onSuccess(data: ProjectUpdateInput) {
    setLoading(true);
    try {
      const response = await apiClient.updateProject(projectId, data);
      setProject(response);
      reset({
        ...data,
        password: "", // 비밀번호는 다시 빈 값으로
      });
    } catch (error) {
      console.error("Error updating project:", error);
      alert("프로젝트 수정 실패!");
      return;
    } finally {
      setLoading(false);
    }

    router.push(`/projects/${projectId}`);
  }

  function onInvalidSubmit() {
    console.error(control._formState.errors);
    alert("프로젝트 수정 실패! 입력값을 확인해주세요.");
  }

  // TODO: 비밀번호 입력 받을건지 OR 바로 삭제가능하게 할 건지
  async function handleDelete() {
    setLoading(true);
    const currentPassword =
      localStorage.getItem(`currentPassword/${projectId}`) || "";

    try {
      await apiClient.deleteProject(projectId, currentPassword);
    } catch {
      alert("프로젝트 삭제 실패");
    }
    router.push("/");
    setLoading(false);
  }

  async function handleToggleClose() {
    setLoading(true);
    const currentPassword =
      localStorage.getItem(`currentPassword/${projectId}`) || "";

    try {
      let updatedProject;
      if (project?.status === "RECRUITING") {
        // 모집 마감
        updatedProject = await apiClient.closeProject(
          projectId,
          currentPassword
        );
      } else {
        // 재모집
        updatedProject = await apiClient.reopenProject(
          projectId,
          currentPassword
        );
      }
      setProject(updatedProject);
    } catch {
      alert("프로젝트 모집마감 실패");
    }
    router.push(`/projects/${projectId}`);
    setLoading(false);
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
    <form
      onSubmit={handleSubmit(onSuccess, onInvalidSubmit)}
      className="my-12 px-5 w-full"
    >
      {/* 헤더 */}
      <ProjectDetailHeader
        project={project}
        control={control as any}
        mode={mode}
        toggleMode={toggleMode}
      />

      {/* 본문 */}
      <div className="w-full pt-5 flex justify-between">
        {/* 좌측 */}
        <div className="w-[70%] pr-5 pt-5 flex flex-col gap-5">
          {mode === ProjectPageModeEnum.ADMIN && (
            <ProjectProposerForm control={control as any} />
          )}
          <ProjectForm
            className="w-full h-full flex flex-col gap-5"
            mode={mode}
            control={control as any}
          />
        </div>
        {/* 우측 */}
        <ProjectDetailRightPanel
          className="w-[30%]"
          project={project}
          onDelete={handleDelete}
          onToggleClose={handleToggleClose}
          mode={mode}
          toggleMode={toggleMode}
          onSubmit={handleSubmit(onSuccess, onInvalidSubmit)}
          loading={loading}
          onApplySuccess={(newApplicant) => {
            setProject((prev) => {
              if (!prev) return prev;

              // 기존 applicants 배열에 새로운 applicant 추가
              const updatedApplicants = [...prev.applicants, newApplicant];

              return {
                ...prev,
                applicants: updatedApplicants,
              };
            });

            // applicants 상태도 별도로 업데이트
            setApplicants((prev) => {
              if (!prev) return [newApplicant];
              return [...prev, newApplicant];
            });
          }}
          onApplicantStatusChange={(applicantId, status) => {
            setApplicants((prev) => {
              if (!prev) return prev;
              return prev.map((applicant) => {
                if (applicant.id === applicantId) {
                  return {
                    ...applicant,
                    status,
                  };
                }
                return applicant;
              });
            });
          }}
          applicants={applicants}
        />
      </div>
    </form>
  );
}
