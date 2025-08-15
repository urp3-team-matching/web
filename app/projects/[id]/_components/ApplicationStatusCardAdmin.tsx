import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PublicApplicant } from "@/lib/apiClientHelper";
import { Check, User, X } from "lucide-react";

interface ApplicationStatusCardAdminProps {
  applicant: PublicApplicant;
  handleAccept: (applicantId: number) => void;
  handleReject: (applicantId: number) => void;
}

export default function ApplicationStatusCardAdmin({
  applicant,
  handleAccept,
  handleReject,
}: ApplicationStatusCardAdminProps) {
  return (
    <Dialog key={applicant.id}>
      <DialogTrigger asChild>
        <div className="hover:bg-neutral-200 hover:cursor-pointer transition-color duration-200 border flex justify-between p-3 rounded-sm items-center">
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
                size={24}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAccept(applicant.id);
                }}
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
        <DialogTitle className="text-2xl font-semibold">
          지원자 정보
        </DialogTitle>
        <DialogDescription className="flex flex-col gap-2 text-sm font-normal">
          <span>이름: {applicant.name}</span>
          <span>전공: {applicant.major}</span>
          <span>이메일: {applicant.email}</span>
          <span>전화번호: {applicant.phone}</span>
          <span>자기소개: {applicant.introduction}</span>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
