import apiClient, { PublicApplicant } from "@/lib/apiClientHelper";
import { User } from "lucide-react";
import { ProjectPageMode } from "../page";

import { MAX_APPLICANT_MAJOR_COUNT, MAX_APPLICANTS } from "@/constants";
import { MaxApplicantsError } from "@/lib/authUtils";
import { ApplicantStatus } from "@prisma/client";
import ApplicationStatusCardAdmin from "./ApplicationStatusCardAdmin";
import { ProjectPageModeEnum } from "./constants";

interface ApplicationStatusCardProps {
  applicants: PublicApplicant[];
  mode: ProjectPageMode;
  projectId: number;
  onApplicantStatusChange: (
    applicantId: number,
    status: ApplicantStatus
  ) => void;
}

export default function ApplicationStatusCard({
  applicants,
  mode,
  projectId,
  onApplicantStatusChange,
}: ApplicationStatusCardProps) {
  const pendingApplicants = applicants.filter(
    (applicant) => applicant.status === "PENDING"
  );
  const pendingApplicantsByMajor: Record<string, PublicApplicant[]> = {};
  pendingApplicants.forEach((applicant) => {
    if (!pendingApplicantsByMajor[applicant.major]) {
      pendingApplicantsByMajor[applicant.major] = [];
    }
    pendingApplicantsByMajor[applicant.major].push(applicant);
  });

  async function handleAccept(applicantId: number) {
    try {
      await apiClient.acceptApplicant(projectId, applicantId);
      onApplicantStatusChange(applicantId, "APPROVED");
      alert("신청자 승인이 완료되었습니다");
    } catch (error) {
      if (error instanceof MaxApplicantsError) {
        alert(
          `승인 실패.\n최대 지원자 수(${MAX_APPLICANTS})를 초과했거나 해당 전공의 최대 지원자 수(${MAX_APPLICANT_MAJOR_COUNT})를 초과했습니다.`
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

  return (
    <div className="w-full h-auto border shadow-md rounded-lg p-5 flex flex-col gap-3">
      <span className="text-xl font-semibold">신청 현황</span>

      {/* 관리자 모드 */}
      {mode === ProjectPageModeEnum.ADMIN &&
        (applicants.length > 0 ? (
          applicants.map((applicant) => (
            <ApplicationStatusCardAdmin
              key={applicant.id}
              applicant={applicant}
              handleAccept={handleAccept}
              handleReject={handleReject}
            />
          ))
        ) : (
          <div className="text-gray-500">신청자가 없습니다.</div>
        ))}

      {/* 일반 모드 */}
      {mode !== ProjectPageModeEnum.ADMIN &&
        (Object.keys(pendingApplicantsByMajor).length > 0 ? (
          Object.entries(pendingApplicantsByMajor).map(
            ([major, applicants]) => (
              <div
                key={major}
                className="border flex justify-between p-3 rounded-sm items-center"
              >
                <User size={24} />
                <span>
                  {major}({applicants.length}명)
                </span>
                <div />
              </div>
            )
          )
        ) : (
          <div className="text-gray-500">신청자가 없습니다.</div>
        ))}
    </div>
  );
}
