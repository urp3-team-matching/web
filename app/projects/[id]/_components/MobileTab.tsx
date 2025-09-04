import CancelAndSubmitButton from "@/components/Project/Form/CancelAndSubmitButton";
import ProjectForm from "@/components/Project/Form/ProjectForm";
import ProjectProposerForm from "@/components/Project/Form/ProjectProposerForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PublicApplicant,
  PublicProjectWithForeignKeys,
} from "@/lib/apiClientHelper";
import { cn } from "@/lib/utils";
import { ProjectInput } from "@/types/project";
import { ApplicantStatus } from "@prisma/client";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { Control } from "react-hook-form";
import { ProjectPageMode } from "../page";
import { ProjectPageModeEnum } from "./constants";
import ContactCard from "./ContactCard";
import ApplicantsManage from "./RightPanel/Chat/ApplicantsManage";

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

export const MOBILE_TAB_QUERY_KEY = "mobile-tab";
export enum MobileTabEnum {
  프로젝트정보 = "projectInfo",
  신청현황 = "applicantStatus",
}

export default function MobileTab({
  onDelete,
  onToggleClose,
  project,
  className,
  onApplicantStatusChange,
  loading,
  onSubmit,
  mode,
  control,
  applicants = [],
}: MobileTabProps) {
  const [selectedTab, setSelectedTab] = useQueryState(
    MOBILE_TAB_QUERY_KEY,
    parseAsStringEnum(Object.values(MobileTabEnum)).withDefault(
      MobileTabEnum.프로젝트정보
    )
  );

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(value) => setSelectedTab(value as MobileTabEnum)}
      className={cn("w-full", className)}
    >
      <TabsList className="w-full my-3">
        <TabsTrigger className="w-1/2" value={MobileTabEnum.프로젝트정보}>
          프로젝트 정보
        </TabsTrigger>
        <TabsTrigger className="w-1/2" value={MobileTabEnum.신청현황}>
          신청현황
        </TabsTrigger>
      </TabsList>

      {/* 프로젝트 정보(왼쪽 탭) */}
      <TabsContent value={MobileTabEnum.프로젝트정보} className="pb-14">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5">
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
      <TabsContent value={MobileTabEnum.신청현황} className="pb-14">
        <div className="flex flex-col gap-3">
          {mode === null && (
            <ContactCard
              proposerMajor={project.proposerMajor || undefined}
              proposerName={project.proposerName || undefined}
              email={project.email || undefined}
              openChatLink={project.chatLink || undefined}
            />
          )}
          {mode === ProjectPageModeEnum.ADMIN && (
            <ProjectProposerForm variant="sm" control={control} />
          )}
          <div className="w-full h-auto p-5 border shadow-md rounded-lg">
            <span className="text-lg lg:text-xl pb-3 font-semibold">
              신청 현황
            </span>
            <ApplicantsManage
              mode={mode}
              applicants={applicants}
              projectId={project.id}
              onApplicantStatusChange={onApplicantStatusChange}
            />
          </div>
          {/* 팀 현황 그래프와 채팅 (잠정적으로 제거) */}
          {/* <MajorGraph applicants={applicants as PublicApplicant[]} /> */}
          {/* <Chat
            className="w-full text-sm font-medium flex flex-col shadow-md rounded-lg h-[500px]"
            project={project}
            mode={mode}
            applicants={applicants as PublicApplicant[]}
            onApplicantStatusChange={onApplicantStatusChange}
          /> */}
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
    </Tabs>
  );
}
