import { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { User } from "lucide-react";

interface ApplicationStatusCardProps {
  project: PublicProjectWithForeignKeys;
}
export default function ApplicationStatusCard({
  project,
}: ApplicationStatusCardProps) {
  const majors = project.applicants.map((applicant) => applicant.major);
  const majorsCount = majors.reduce((acc, major) => {
    acc[major] = (acc[major] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const objectMajorsCount = Object.entries(majorsCount);
  return (
    <div className="w-full h-auto border shadow-md rounded-lg p-5 flex flex-col gap-3">
      <span className="text-xl font-semibold">신청 현황</span>
      {objectMajorsCount.map(([major, count]) => (
        <div
          className="w-full flex items-center justify-between px-4 h-9 rounded-sm border text-sm font-normal"
          key={major}
        >
          <User size={24} />
          <span>{major}</span>
          <span>{count}명</span>
        </div>
      ))}
    </div>
  );
}
