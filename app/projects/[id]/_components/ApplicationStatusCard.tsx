import apiClient, { PublicApplicant } from "@/lib/apiClientHelper";
import { User } from "lucide-react";
import { ProjectPageMode } from "../page";

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
    <div className="w-full h-auto border shadow-md rounded-lg p-5 flex flex-col gap-3">
      <span className="text-xl font-semibold">신청 현황</span>

      {mode === ProjectPageModeEnum.ADMIN
        ? applicants.map((applicant) => (
            <ApplicationStatusCardAdmin
              key={applicant.id}
              applicant={applicant}
              handleAccept={handleAccept}
              handleReject={handleReject}
            />
          ))
        : applicants
            .filter((applicant) => applicant.status === "PENDING")
            .map((applicant) => (
              <div
                key={applicant.id}
                className="border flex justify-between p-3 rounded-sm items-center"
              >
                <User size={24} />
                <span>{applicant.major}</span>
                <div />
              </div>
            ))}
    </div>
  );
}
