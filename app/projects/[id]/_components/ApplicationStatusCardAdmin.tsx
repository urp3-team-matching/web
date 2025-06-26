import {
  Dialog,
  DialogContent,
  DialogHeader,
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
        <DialogHeader className="text-2xl font-semibold">
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
  );
}
