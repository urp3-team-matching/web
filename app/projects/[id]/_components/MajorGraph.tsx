import { MAX_APPLICANTS } from "@/constants";
import { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { cn } from "@/lib/utils";
import { CircleUser } from "lucide-react";

const majorBackgroundColor = [
  "bg-secondary",
  "bg-blue-300",
  "bg-yellow-300",
  "bg-fuchsia-400",
];
const majorTextColor = [
  "text-secondary",
  "text-blue-300",
  "text-yellow-300",
  "text-fuchsia-400",
];

function getMajorColor(
  major: string,
  uniqueMajors: string[],
  type: "bg" | "text" = "bg"
) {
  const uniqueMajorIndex = uniqueMajors.findIndex((m) => m === major);
  if (uniqueMajorIndex !== -1) {
    return type === "bg"
      ? majorBackgroundColor[uniqueMajorIndex]
      : majorTextColor[uniqueMajorIndex];
  }
  return "gray-300"; // 기본 색상
}

interface MajorGraphProps {
  project: PublicProjectWithForeignKeys;
  className?: string;
}

export default function MajorGraph({ project, className }: MajorGraphProps) {
  const majors = project.applicants.map((applicant) => applicant.major);
  const uniqueMajors = [...new Set(majors)];
  const restApplicantsCount = MAX_APPLICANTS - majors.length;
  const majorsCount = majors.reduce((acc, major) => {
    acc[major] = (acc[major] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const ObjectMajorsCount = Object.entries(majorsCount);

  return (
    <div
      className={cn(
        "w-full h-auto flex flex-col gap-3 shadow-md rounded-lg p-2",
        className
      )}
    >
      {/* 유저 아이콘 */}
      <div className="w-full justify-between flex">
        {ObjectMajorsCount.map(([major, count]) =>
          [...Array(count)].map((_, i) => (
            <CircleUser
              size={50}
              key={`${major}-${i}`}
              className={`text-black ${getMajorColor(
                major,
                uniqueMajors,
                "text"
              )} font-thin stroke-1`}
            />
          ))
        )}
        {[...Array(restApplicantsCount)].map((_, i) => (
          <CircleUser
            key={i}
            size={50}
            className="text-black font-thin stroke-1"
          />
        ))}
      </div>

      {/* 그래프 */}
      <div className="w-full h-4 rounded-2xl overflow-hidden flex ">
        {ObjectMajorsCount.map(([major, count]) =>
          [...Array(count)].map((_, i) => (
            <div
              key={`${major}-${i}`}
              className={`w-1/4 h-full ${getMajorColor(major, uniqueMajors)}`}
            ></div>
          ))
        )}
        {[...Array(restApplicantsCount)].map((_, i) => {
          return <div key={i} className="w-1/4 bg-gray-100 h-full"></div>;
        })}
      </div>

      {/* 전공 */}
      <div className="w-full flex flex-col gap-1 justify-center h-auto">
        {uniqueMajors.map((major, i) => (
          <div className="flex gap-x-1.5 items-center" key={i}>
            <div
              className={cn(
                "h-5 w-5 rounded-full",
                `${getMajorColor(major, uniqueMajors)}`
              )}
            />
            <div className="flex-1 text-xs font-normal">{major}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
