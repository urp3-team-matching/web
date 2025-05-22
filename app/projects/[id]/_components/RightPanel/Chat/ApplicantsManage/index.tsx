import ApplicantRow from "@/app/projects/[id]/_components/RightPanel/Chat/ApplicantsManage/ApplicantRow";
import { MAX_APPLICANTS } from "@/constants";
import { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { cn } from "@/lib/utils";

interface ManageApplicantsProps {
  className?: string;
  project: PublicProjectWithForeignKeys;
}

const ApplicantsManage = ({ className, project }: ManageApplicantsProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      {/* 섹션: 확정 인원 */}
      <div>
        <div className="py-2 px-1">
          확정{`(${project.applicants.length}/${MAX_APPLICANTS})`}
        </div>

        <div className="flex flex-col gap-y-1">
          {project.applicants.length === 0 && (
            <div className="w-full flex items-center justify-center text-gray-400">
              신청자가 없습니다.
            </div>
          )}
          {project.applicants.map((applicant) => (
            <ApplicantRow applicant={applicant} />
          ))}
        </div>
      </div>

      {/* 섹션: 대기 인원 */}
      {/* TODO: 백엔드에서 지원자 대기 상태 추가 후 연결 */}
      <div className="my-2">신청</div>
    </div>
  );
};

export default ApplicantsManage;
