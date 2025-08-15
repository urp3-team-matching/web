import { ProjectPageMode } from "@/app/projects/[id]/page";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PublicApplicantForProject } from "@/lib/apiClientHelper";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { useState } from "react";

type ApplicantRowType = {
  className?: string;
  label: string;
  value: string;
};

interface ApplicantRowProps {
  className?: string;
  projectId: number;
  handleAccept?: (applicantId: number) => void;
  handleReject?: (applicantId: number) => void;
  handlePending?: (applicantId: number) => void;
  applicant: PublicApplicantForProject;
  mode: ProjectPageMode;
}

const ApplicantRow = ({
  className,
  applicant,
  handleAccept,
  handleReject,
  handlePending,
  mode,
}: ApplicantRowProps) => {
  const [open, setOpen] = useState(false);

  const applicantFields: ApplicantRowType[] = [
    { label: "이름", value: applicant.name },
    { label: "학과", value: applicant.major },
    { label: "전화번호", value: applicant.phone },
    { label: "이메일", value: applicant.email },
    { label: "자기소개", value: applicant.introduction },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          onClick={(e) => {
            if (mode === null) {
              e.preventDefault(); // Dialog 열림 차단
              e.stopPropagation(); // 추가 이벤트 전파 차단
            }
          }}
          className={cn(
            "rounded-lg shadow-sm flex items-center justify-between px-3 w-full h-[45px] border",
            "active:bg-gray-200 hover:bg-gray-100 transition-colors duration-200",
            mode === null ? "cursor-default" : "cursor-pointer",
            className
          )}
        >
          <User className="size-6 mr-3" />
          <div className="flex-1">
            {applicant.name}({applicant.major})
          </div>
          <div className={cn("flex gap-x-1", mode === null ? "hidden" : "")}>
            {handleAccept && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleAccept(applicant.id);
                  // focus 방지
                  (e.target as HTMLButtonElement).blur();
                }}
                size="sm"
                variant="secondary"
              >
                승인
              </Button>
            )}
            {handleReject && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleReject(applicant.id);
                  // focus 방지
                  (e.target as HTMLButtonElement).blur();
                }}
                size="sm"
                variant="destructive"
              >
                반려
              </Button>
            )}
            {handlePending && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handlePending(applicant.id);
                  // focus 방지
                  (e.target as HTMLButtonElement).blur();
                }}
                size="sm"
                variant="destructive"
              >
                취소
              </Button>
            )}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>지원자 정보</DialogTitle>
          <DialogDescription asChild className="text-normal mt-2">
            <div className="flex flex-col gap-y-2">
              {applicantFields.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <span className="text-gray-500">{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-x-2">
          {handleAccept && (
            <Button
              variant="secondary"
              onClick={() => {
                handleAccept(applicant.id);
                setOpen(false);
              }}
              onFocus={(e) => e.target.blur()} // focus 방지
            >
              승인
            </Button>
          )}
          {handleReject && (
            <Button
              variant="destructive"
              onClick={() => {
                handleReject(applicant.id);
                setOpen(false);
              }}
              onFocus={(e) => e.target.blur()} // focus 방지
            >
              반려
            </Button>
          )}
          {handlePending && (
            <Button
              variant="secondary"
              onClick={() => {
                handlePending(applicant.id);
                setOpen(false);
              }}
              onFocus={(e) => e.target.blur()} // focus 방지
            >
              대기
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicantRow;
