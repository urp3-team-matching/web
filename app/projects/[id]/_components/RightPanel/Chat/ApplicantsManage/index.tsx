import ApplicantRow from "@/app/projects/[id]/_components/RightPanel/Chat/ApplicantsManage/ApplicantRow";
import { MAX_APPLICANTS } from "@/constants";
import apiClient, { PublicApplicant } from "@/lib/apiClientHelper";
import { cn } from "@/lib/utils";
import { ApplicantStatus } from "@prisma/client";

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

  async function handleAccept(applicantId: number) {
    try {
      await apiClient.acceptApplicant(projectId, applicantId);
      onApplicantStatusChange(applicantId, "APPROVED");
      alert("신청자 승인이 완료되었습니다");
    } catch (error) {
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

  return (
    <div className={cn("space-y-3", className)}>
      {/* 섹션: 확정 인원 */}
      <div>
        <div className="py-2 px-1">
          확정{`(${approvedApplicants.length}/${MAX_APPLICANTS})`}
        </div>

        <div className="flex flex-col gap-y-1">
          {approvedApplicants.length === 0 && (
            <div className="w-full flex items-center justify-center text-gray-400">
              신청자가 없습니다.
            </div>
          )}
          {approvedApplicants.map((applicant) => (
            <ApplicantRow
              key={applicant.id}
              applicant={applicant}
              projectId={projectId}
            />
          ))}
        </div>
      </div>

      {/* 섹션: 대기 인원 */}
      <div>
        <div className="py-2 px-1">
          대기{`(${pendingApplicants.length}/${MAX_APPLICANTS})`}
        </div>

        <div className="flex flex-col gap-y-1">
          {pendingApplicants.length === 0 && (
            <div className="w-full flex items-center justify-center text-gray-400">
              신청자가 없습니다.
            </div>
          )}
          {pendingApplicants.map((applicant) => (
            <ApplicantRow
              key={applicant.id}
              applicant={applicant}
              projectId={projectId}
              handleAccept={handleAccept}
              handleReject={handleReject}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicantsManage;
