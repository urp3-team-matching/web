"use client";

import { ProjectPageModeEnum } from "@/app/projects/[id]/_components/constants";
import ProjectDetailHeader from "@/app/projects/[id]/_components/Header";
import ProjectDetailRightPanel from "@/app/projects/[id]/_components/RightPanel";
import Chat from "@/app/projects/[id]/_components/RightPanel/Chat";
import ProjectForm from "@/components/Project/Form/ProjectForm";
import ProjectProposerForm from "@/components/Project/Form/ProjectProposerForm";
import Spinner from "@/components/ui/spinner";
import {
  ProjectVerificationProvider,
  useProjectVerification,
} from "@/contexts/ProjectVerificationContext";
import apiClient, {
  PublicApplicant,
  PublicProjectWithForeignKeys,
} from "@/lib/apiClientHelper";
import { NotFoundError } from "@/lib/errors";
import { cn } from "@/lib/utils";
import { ProjectUpdateInput, ProjectUpdateSchema } from "@/types/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApplicantStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ProjectApplyButton from "./_components/ApplyButton";
import MobileTab from "./_components/MobileTab";

export type ProjectPageMode = ProjectPageModeEnum | null;

export default function Project({ params }: { params: { id: string } }) {
  const projectId = parseInt(params.id);

  return (
    <ProjectVerificationProvider projectId={projectId}>
      <ProjectContent params={params} />
    </ProjectVerificationProvider>
  );
}

function ProjectContent({ params }: { params: { id: string } }) {
  const { isVerified } = useProjectVerification();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const projectId = parseInt(params.id);
  const [project, setProject] = useState<PublicProjectWithForeignKeys>();
  const [applicants, setApplicants] = useState<PublicApplicant[]>();

  // 프로젝트 ID를 기반으로 프로젝트 데이터를 가져옵니다.
  useEffect(() => {
    (async () => {
      setLoading(true);
      let resProject;
      let resApplicant;
      try {
        resProject = await apiClient.getProjectById(projectId);
        resApplicant = await apiClient.getApplicants(projectId);
      } catch (error) {
        if (error instanceof NotFoundError) {
          resProject = null;
        }
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }

      if (resProject) {
        setProject(resProject);
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

  // 검증 결과에 따라 mode 설정
  useEffect(() => {
    if (isVerified === null) return; // 아직 검증 중

    if (isVerified) {
      setmode(ProjectPageModeEnum.ADMIN);
    } else {
      setmode(null);
    }
  }, [isVerified, setmode]);

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
      proposerName: "",
      proposerType: "STUDENT",
      proposerMajor: "",
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
        etc: project.etc || undefined,
        attachments: project.attachments || [],
        keywords: project.keywords || [],
        password: "",
        proposerName: project.proposerName || "",
        proposerType: project.proposerType || "STUDENT",
        proposerMajor: project.proposerMajor || "",
        email: project.email || undefined,
        chatLink: project.chatLink || undefined,
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
  }

  // TODO: 비밀번호 입력 받을건지 OR 바로 삭제가능하게 할 건지
  async function handleDelete() {
    setLoading(true);
    try {
      await apiClient.deleteProject(projectId);
    } catch {
      alert("프로젝트 삭제 실패");
    }
    router.push("/");
    setLoading(false);
  }

  async function handleToggleClose() {
    setLoading(true);

    try {
      let updatedProject;
      if (project?.status === "RECRUITING") {
        // 모집 마감
        updatedProject = await apiClient.closeProject(projectId);
      } else {
        // 재모집
        updatedProject = await apiClient.reopenProject(projectId);
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

  function handleApplicantStatusChange(
    applicantId: number,
    status: ApplicantStatus
  ) {
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
  }

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <Spinner />
      </div>
    );
  }
  if (project === undefined || project === null) {
    return <div>프로젝트를 찾을 수 없습니다!</div>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSuccess, onInvalidSubmit)}
      className="mx-auto max-w-96 my-6 lg:my-12 px-0 lg:px-5 lg:max-w-full w-full"
    >
      {/* 헤더 */}
      <ProjectDetailHeader
        project={project}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        control={control as any}
        mode={mode}
        onDelete={handleDelete}
        toggleMode={toggleMode}
      />

      {/* Desktop 본문 */}
      <div className="w-full pt-5 lg:flex hidden justify-between">
        {/* 좌측 */}
        <div className="w-[70%] pr-5 pt-5 flex flex-col gap-5">
          {mode === ProjectPageModeEnum.ADMIN && (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <ProjectProposerForm control={control as any} />
          )}
          <ProjectForm
            className="w-full h-full flex flex-col gap-5"
            mode={mode}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          onApplicantStatusChange={handleApplicantStatusChange}
          applicants={applicants}
        />
      </div>

      {/* Mobile 본문 */}
      <div
        className={cn(
          "pt-2 lg:hidden flex-col justify-between",
          mode === null && "pb-14"
        )}
      >
        <MobileTab
          onApplicantStatusChange={handleApplicantStatusChange}
          project={project}
          onSubmit={handleSubmit(onSuccess, onInvalidSubmit)}
          onToggleClose={handleToggleClose}
          onDelete={handleDelete}
          mode={mode}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          control={control as any}
          applicants={applicants as PublicApplicant[]}
        />
        {mode === null && (
          <ProjectApplyButton
            className="fixed bottom-2 w-[95%] max-w-96 left-1/2 -translate-x-1/2 z-50"
            projectId={project.id}
            active={project.status === "RECRUITING"}
            onSuccess={(newApplicant) => {
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
          />
        )}

        <Chat
          className="w-full text-sm font-medium flex flex-col shadow-md rounded-lg"
          project={project}
          applicants={applicants ?? []}
          onApplicantStatusChange={handleApplicantStatusChange}
        />
      </div>
    </form>
  );
}
