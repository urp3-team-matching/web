import { ProjectType } from "@/constants/fakeProject";
import { CircleUser } from "lucide-react";

interface MajorGraphProps {
  project: ProjectType;
}

export default function MajorGraph({ project }: MajorGraphProps) {
  const majorNumber = project.majors.length;
  const majorColor = [
    "bg-secondary-100",
    "bg-blue-300",
    "bg-yellow-300",
    "bg-fuchsia-400",
  ];
  return (
    <div className="w-full h-auto flex flex-col gap-3 shadow-md rounded-lg p-1">
      <div className="w-full h-auto justify-between flex">
        {[...Array(majorNumber)].map((_, index) => (
          <CircleUser
            key={index}
            size={50}
            className="text-secondary-100 stroke-1"
          />
        ))}
        {[...Array(4 - majorNumber)].map((_, index) => (
          <CircleUser
            key={index}
            size={50}
            className="text-black font-thin stroke-1"
          />
        ))}
      </div>
      <div className="w-full h-4 rounded-2xl relative justify-between ">
        <div className="w-1/4 left-0  absolute z-40 h-full bg-secondary-100 rounded-2xl"></div>
        <div
          className={`${
            majorNumber >= 2 ? `` : `hidden`
          }  w-1/2 left-0 absolute z-30 h-full bg-blue-300 rounded-2xl`}
        ></div>
        <div
          className={` ${
            majorNumber >= 3 ? `` : ` hidden`
          } w-3/4 left-0 absolute z-20 h-full bg-yellow-300 rounded-2xl`}
        ></div>
        <div
          className={` ${
            majorNumber == 4 ? `` : `hidden`
          }  w-full h-full z-10 bg-fuchsia-400  rounded-2xl`}
        ></div>
        <div className="w-full h-full top-0 left-0  -z-10 bg-gray-100 absolute"></div>
      </div>
      <div className="w-full flex flex-col gap-1 justify-center h-auto">
        {project.majors.map((major, i) => (
          <div className="flex gap-1 items-center" key={i}>
            <div className={`size-5 rounded-full ${majorColor[i]}`}></div>
            <div className="w-full text-xs font-normal">{major}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
