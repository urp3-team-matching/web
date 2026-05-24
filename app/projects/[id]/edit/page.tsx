"use client";

import { ProjectPageModeEnum } from "@/app/projects/[id]/_components/constants";
import ProjectDetailHeader from "@/app/projects/[id]/_components/Header";
import ProjectDetailRightPanel from "@/app/projects/[id]/_components/RightPanel";
import Chat from "@/app/projects/[id]/_components/RightPanel/Chat";
import PasswordGate from "@/app/projects/[id]/_components/PasswordGate";
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
import { ProjectUpdateInput, ProjectUpdateSchema } from "@/types/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApplicantStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { useForm } from "react-hook-form";
import MobileTab from "../_components/MobileTab";

const noop = () => {};

export default function ProjectEdit(props: {
  params: Promise<{ id: string }>;
}) {
  const params = use(props.params);
  const projectId = parseInt(params.id);

  return (
    <ProjectVerificationProvider projectId={projectId}>
      <ProjectEditContent projectId={projectId} />
    </ProjectVerificationProvider>
  );
}

function ProjectEditContent({ projectId }: { projectId: number }) {
  const { isVerified } = useProjectVerification();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<PublicProjectWithForeignKeys>();
  const [applicants, setApplicants] = useState<PublicApplicant[]>();

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
      reset({ ...data, password: "" });
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

  async function handleDelete() {
    if (!window.confirm("정말로 이 프로젝트를 삭제하시겠습니까?")) return;
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
        updatedProject = await apiClient.closeProject(projectId);
      } else {
        updatedProject = await apiClient.reopenProject(projectId);
      }
      setProject(updatedProject);
    } catch {
      alert("프로젝트 모집마감 실패");
    }
    router.push(`/projects/${projectId}/edit`);
    setLoading(false);
  }

  function handleApplicantStatusChange(
    applicantId: number,
    status: ApplicantStatus
  ) {
    setApplicants((prev) => {
      if (!prev) return prev;
      return prev.map((applicant) =>
        applicant.id === applicantId ? { ...applicant, status } : applicant
      );
    });
  }

  // 검증 미통과: 비밀번호 게이트 표시 (취소 시 view로 복귀)
  if (isVerified === false) {
    return (
      <PasswordGate
        projectId={projectId}
        onCancel={() => router.push(`/projects/${projectId}`)}
      />
    );
  }

  // 검증 진행 중 or 데이터 로딩 중
  if (isVerified === null || loading) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <Spinner />
      </div>
    );
  }

  if (project === undefined || project === null) {
    return <div>프로젝트를 찾을 수 없습니다!</div>;
  }

  const mode = ProjectPageModeEnum.ADMIN;

  return (
    <form
      onSubmit={handleSubmit(onSuccess, onInvalidSubmit)}
      className="mx-auto max-w-96 my-6 lg:my-12 px-0 lg:px-5 lg:max-w-full w-full"
    >
      <ProjectDetailHeader
        project={project}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        control={control as any}
        mode={mode}
        onDelete={handleDelete}
      />
      {/* Desktop 본문 */}
      <div className="w-full pt-5 lg:flex hidden justify-between">
        <div className="w-[70%] pr-5 pt-5 flex flex-col gap-5">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <ProjectProposerForm control={control as any} />
          <ProjectForm
            className="w-full h-full flex flex-col gap-5"
            mode={mode}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            control={control as any}
          />
        </div>
        <ProjectDetailRightPanel
          className="w-[30%]"
          project={project}
          onDelete={handleDelete}
          onToggleClose={handleToggleClose}
          mode={mode}
          toggleMode={noop}
          onSubmit={handleSubmit(onSuccess, onInvalidSubmit)}
          loading={loading}
          onApplySuccess={() => {}}
          onApplicantStatusChange={handleApplicantStatusChange}
          applicants={applicants}
        />
      </div>
      {/* Mobile 본문 */}
      <div className="pt-2 lg:hidden flex-col justify-between">
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
