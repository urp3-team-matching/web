import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectPageModeEnum } from "./constants";
import ProjectProposerForm from "@/components/Project/Form/ProjectProposerForm";
import ProjectForm from "@/components/Project/Form/ProjectForm";
import CancelAndSubmitButton from "@/components/Project/Form/CancelAndSubmitButton";
import ContactCard from "./ContactCard";
import MajorGraph from "./MajorGraph";
import Chat from "./RightPanel/Chat";
import { ProjectPageMode } from "../page";
import { ProjectInput } from "@/types/project";
import { Control } from "react-hook-form";
import {
  PublicApplicant,
  PublicProjectWithForeignKeys,
} from "@/lib/apiClientHelper";
import { ApplicantStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

interface MobileTabProps {
  className?: string;
  mode: ProjectPageMode;
  control: Control<ProjectInput>;
  onDelete: () => void;
  onToggleClose: () => void;
  onSubmit: () => void;
  loading?: boolean;
  project: PublicProjectWithForeignKeys;
  applicants?: PublicApplicant[];
  onApplicantStatusChange: (
    applicantId: number,
    status: ApplicantStatus
  ) => void;
}

export default function MobileTab({
  onDelete,
  onToggleClose,
  project,
  className,
  onApplicantStatusChange,
  loading,
  onSubmit,
  applicants,
  mode,
  control,
}: MobileTabProps) {
  return (
    <Tabs defaultValue="프로젝트 정보" className={cn("w-full", className)}>
      <TabsList className="w-full my-3" defaultValue="프로젝트 정보">
        <TabsTrigger className="w-1/2" value="프로젝트 정보">
          프로젝트 정보
        </TabsTrigger>
        <TabsTrigger className="w-1/2" value="신청현황">
          신청현황
        </TabsTrigger>
      </TabsList>

      {/* 프로젝트 정보(왼쪽 탭) */}

      <TabsContent value="프로젝트 정보" className="pb-14">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5">
            {mode === ProjectPageModeEnum.ADMIN && (
              <ProjectProposerForm variant="sm" control={control} />
            )}
            <ProjectForm
              className="w-full h-full flex flex-col gap-5"
              mode={mode}
              control={control}
              withoutProjectName={true}
            />
          </div>
          {mode === ProjectPageModeEnum.ADMIN && (
            <CancelAndSubmitButton
              onDelete={onDelete}
              onToggleClose={onToggleClose}
              onSubmit={onSubmit}
              loading={loading}
              isProjectClosed={project.status !== "RECRUITING"}
            />
          )}
        </div>
      </TabsContent>

      {/* 신청현황(오른쪽 탭) */}

      <TabsContent value="신청현황" className="pb-14">
        <div className="flex flex-col gap-3">
          {mode === null && (
            <ContactCard
              email={project.email || undefined}
              openChatLink={project.chatLink || undefined}
              proposerPhone={project.proposerPhone || undefined}
            />
          )}

          <MajorGraph applicants={applicants as PublicApplicant[]} />
          <Chat
            className="w-full text-sm font-medium flex flex-col shadow-md rounded-lg h-[500px]"
            project={project}
            mode={mode}
            applicants={applicants as PublicApplicant[]}
            onApplicantStatusChange={onApplicantStatusChange}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
