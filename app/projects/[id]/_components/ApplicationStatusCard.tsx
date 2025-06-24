import apiClient, { PublicApplicant } from "@/lib/apiClientHelper";
import { ProjectPageMode } from "../page";
import { Check, User, X } from "lucide-react";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { ProjectPageModeEnum } from "./constants";

interface ApplicationStatusCardProps {
  applicants: PublicApplicant[];
  mode: ProjectPageMode;
  projectId: number;
}

export default function ApplicationStatusCard({
  applicants,
  mode,
  projectId,
}: ApplicationStatusCardProps) {
  async function handleAccept(applicantId: number) {
    try {
      await apiClient.acceptApplicant(projectId, applicantId);
      alert("신청자 승인이 완료되었습니다");
      window.location.reload();
    } catch (error) {
      alert("신청자 승인 요청에 실패했습니다" + error);
      return;
    }
  }

  async function handleReject(applicantId: number) {
    try {
      await apiClient.rejectApplicant(projectId, applicantId);
      alert("신청자 거절이 완료되었습니다");
      window.location.reload();
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
            <Dialog key={applicant.id}>
              <DialogTrigger asChild>
                <div className="border flex justify-between p-3 rounded-sm items-center">
                  <User size={24} />
                  <div className="flex gap-2">
                    <span>{applicant.major}</span>
                    <span>{applicant.name}</span>
                  </div>
                  {applicant.status === "APPROVED" ? (
                    <span>확정</span>
                  ) : applicant.status === "REJECTED" ? (
                    <span>거절</span>
                  ) : (
                    <div className="flex gap-2">
                      <Check
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAccept(applicant.id);
                        }}
                        size={24}
                      />
                      <X
                        className="cursor-pointer"
                        size={24}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(applicant.id);
                        }}
                      />
                    </div>
                  )}
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="text-2xl text-semibold">
                  지원자 정보
                </DialogHeader>
                <div className="flex flex-col gap-2 text-sm font-normal">
                  <div>이름: {applicant.name}</div>
                  <div>전공: {applicant.major}</div>
                  <div>이메일: {applicant.email}</div>
                  <div>전화번호: {applicant.phone}</div>
                  <div>자기소개: {applicant.introduction}</div>
                </div>
              </DialogContent>
            </Dialog>
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
