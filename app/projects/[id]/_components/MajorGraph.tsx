import { MAX_APPLICANTS } from "@/constants";
import { PublicApplicant } from "@/lib/apiClientHelper";
import { cn } from "@/lib/utils";
import { CircleUser } from "lucide-react";
import Image from "next/image";

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
  applicants: PublicApplicant[];
  className?: string;
  proposerMajor?: string;
}

export default function MajorGraph({
  applicants,
  className,
  proposerMajor,
}: MajorGraphProps) {
  const majors = [
    ...(proposerMajor ? [proposerMajor] : []),
    ...applicants
      .filter((applicant) => applicant.status === "APPROVED")
      .map((applicant) => applicant.major),
  ];
  const uniqueMajors = [...new Set(majors)];
  const restApplicantsCount = MAX_APPLICANTS - majors.length;
  const majorsCount = majors.reduce((acc, major) => {
    acc[major] = (acc[major] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const objectMajorsCount = Object.entries(majorsCount);

  return (
    <div
      className={cn(
        "w-full h-auto flex p-5 flex-col gap-3 shadow-md border rounded-lg",
        className
      )}
    >
      <span className="text-xl font-semibold">팀 현황</span>
      {/* 유저 아이콘 */}
      <div className="w-full justify-between flex">
        {majors.map((major, i) => (
          <Image
            key={i}
            src={
              i % 2 === 0
                ? "/skku/characters/myungryun.svg"
                : "/skku/characters/yuljeon.svg"
            }
            alt="명륜이"
            width={52}
            height={72}
          />
        ))}
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
        {objectMajorsCount.map(([major, count]) =>
          [...Array(count)].map((_, i) => (
            <div
              key={`${major}-${i}`}
              className={cn("w-1/4 h-full", getMajorColor(major, uniqueMajors))}
            />
          ))
        )}
        {[...Array(restApplicantsCount)].map((_, i) => (
          <div key={i} className="w-1/4 bg-gray-100 h-full"></div>
        ))}
      </div>

      {/* 전공 */}
      <div className="w-full flex flex-col gap-1 justify-center h-auto">
        {uniqueMajors.map((major, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="flex gap-x-1.5 items-center">
              <div
                className={cn(
                  "h-4 w-4 rounded-full",
                  `${getMajorColor(major, uniqueMajors)}`
                )}
              />
              <div className="flex-1 text-xs font-normal">{major}</div>
            </div>
            <div>
              <span className="text-xs font-normal">
                {majorsCount[major] || 0}명
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
