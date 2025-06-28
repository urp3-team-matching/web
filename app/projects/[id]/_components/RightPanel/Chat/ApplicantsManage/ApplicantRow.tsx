import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PublicApplicantForProject } from "@/lib/apiClientHelper";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

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
  applicant: PublicApplicantForProject;
}

const ApplicantRow = ({
  className,
  applicant,
  handleAccept,
  handleReject,
}: ApplicantRowProps) => {
  const applicantFields: ApplicantRowType[] = [
    { label: "이름", value: applicant.name },
    { label: "학과", value: applicant.major },
    { label: "전화번호", value: applicant.phone },
    { label: "이메일", value: applicant.email },
    { label: "자기소개", value: applicant.introduction },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={cn(
            "rounded-lg shadow-sm flex items-center justify-between px-3 w-full h-[45px] border cursor-pointer",
            "active:bg-gray-200 hover:bg-gray-100 transition-colors duration-200",
            className
          )}
        >
          <User className="size-6 mr-3" />
          <div className="flex-1">
            {applicant.name}({applicant.major})
          </div>
          <div>
            {handleAccept && handleReject && (
              <>
                <button
                  className="p-1 hover:cursor-pointer border rounded-md text-xs border-gray-300 bg-white hover:bg-white/80"
                  onClick={() => handleAccept(applicant.id)}
                >
                  수락
                </button>
                <button
                  className="p-1 hover:cursor-pointer rounded-md text-xs bg-destructive hover:bg-destructive/80 text-white"
                  onClick={() => handleReject(applicant.id)}
                >
                  거절
                </button>
              </>
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
      </DialogContent>
    </Dialog>
  );
};

export default ApplicantRow;
