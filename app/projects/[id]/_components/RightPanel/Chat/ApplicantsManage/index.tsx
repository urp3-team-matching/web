import ApplicantRow from "@/app/projects/[id]/_components/RightPanel/Chat/ApplicantsManage/ApplicantRow";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MAX_APPLICANT_MAJOR_COUNT, MAX_APPLICANTS } from "@/constants";
import apiClient, { PublicApplicant } from "@/lib/apiClientHelper";
import { MaxApplicantsError } from "@/lib/authUtils";
import { ApplicantStatus } from "@prisma/client";

interface ApplicantGroupProps {
  projectId: number;
  status: ApplicantStatus;
  applicants: PublicApplicant[];
  onApplicantStatusChange: (
    applicantId: number,
    status: ApplicantStatus
  ) => void;
}

const ApplicantGroup = ({
  projectId,
  status,
  applicants,
  onApplicantStatusChange,
}: ApplicantGroupProps) => {
  async function handleAccept(applicantId: number) {
    try {
      await apiClient.acceptApplicant(projectId, applicantId);
      onApplicantStatusChange(applicantId, "APPROVED");
    } catch (error) {
      if (error instanceof MaxApplicantsError) {
        alert(
          `최대 지원자 수(${MAX_APPLICANTS})를 초과했거나 해당 전공의 최대 지원자 수(${MAX_APPLICANT_MAJOR_COUNT})를 초과했습니다. 신청자를 승인할 수 없습니다.`
        );
        return;
      }
      alert("신청자 승인 요청에 실패했습니다" + error);
      return;
    }
  }

  async function handleReject(applicantId: number) {
    try {
      await apiClient.rejectApplicant(projectId, applicantId);
      onApplicantStatusChange(applicantId, "REJECTED");
      alert("신청자 거절이 완료되었습니다");
    } catch (error) {
      alert("신청자 거절 요청에 실패했습니다" + error);
      return;
    }
  }

  async function handlePending(applicantId: number) {
    try {
      await apiClient.pendingApplicant(projectId, applicantId);
      onApplicantStatusChange(applicantId, "PENDING");
    } catch (error) {
      alert("신청자 상태 변경 요청에 실패했습니다" + error);
      return;
    }
  }

  const groupAsKorean = {
    APPROVED: "확정",
    PENDING: "대기",
    REJECTED: "거절",
  };

  return (
    <AccordionItem value={status}>
      <AccordionTrigger className="hover:cursor-pointer">
        {groupAsKorean[status]}
        {status === "APPROVED"
          ? `(${applicants.length}/${MAX_APPLICANTS})`
          : `(${applicants.length})`}
      </AccordionTrigger>

      <AccordionContent className="flex flex-col gap-y-1">
        {applicants.length > 0 ? (
          applicants.map((applicant) => (
            <ApplicantRow
              key={applicant.id}
              applicant={applicant}
              projectId={projectId}
              handleAccept={status === "PENDING" ? handleAccept : undefined}
              handleReject={status === "PENDING" ? handleReject : undefined}
              handlePending={
                status === "REJECTED" || status === "APPROVED"
                  ? handlePending
                  : undefined
              }
            />
          ))
        ) : (
          <div className="w-full flex items-center justify-center text-gray-400">
            없음
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

interface ManageApplicantsProps {
  className?: string;
  projectId: number;
  onApplicantStatusChange: (
    applicantId: number,
    status: ApplicantStatus
  ) => void;
  applicants: PublicApplicant[];
}

const ApplicantsManage = ({
  className,
  applicants,
  projectId,
  onApplicantStatusChange,
}: ManageApplicantsProps) => {
  const approvedApplicants = applicants.filter(
    (applicant) => applicant.status === "APPROVED"
  );
  const pendingApplicants = applicants.filter(
    (applicant) => applicant.status === "PENDING"
  );
  const rejectedApplicants = applicants.filter(
    (applicant) => applicant.status === "REJECTED"
  );

  return (
    <Accordion
      type="multiple"
      defaultValue={["APPROVED", "PENDING", "REJECTED"]}
      className={className}
    >
      {Object.entries({
        APPROVED: approvedApplicants,
        PENDING: pendingApplicants,
        REJECTED: rejectedApplicants,
      }).map(([status, applicants]) => (
        <ApplicantGroup
          key={status}
          projectId={projectId}
          status={status as ApplicantStatus}
          applicants={applicants}
          onApplicantStatusChange={onApplicantStatusChange}
        />
      ))}
    </Accordion>
  );
};

export default ApplicantsManage;
