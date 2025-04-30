"use client";
import MajorGraph from "@/components/Project/ProjectField/MajorGraph";
import ProjectTextField from "@/components/Project/ProjectField/ProjectTextField";
import ProjectHeader from "@/components/Project/ProjectHeader";
import { fakeProjects, ProjectType } from "@/constants/fakeProject";
import { useState } from "react";

export default function Project({ params }: { params: { id: string } }) {
  const project = fakeProjects.find((project) => project.id === params.id);
  const [adminMode, setAdminMode] = useState<boolean>(false);
  console.log(adminMode);
  return (
    <div className="min-[1040px]:w-[1040px] mt-12 px-5 flex-col flex w-full h-auto ">
      <ProjectHeader
        adminMode={adminMode}
        setAdminMode={setAdminMode}
        project={project as ProjectType}
      />
      <div className="w-full flex h-96 justify-between ">
        <ProjectTextField
          adminMode={adminMode}
          project={project as ProjectType}
        />
        <div className="w-[280px] h-auto mt-12">
          <MajorGraph project={project as ProjectType}></MajorGraph>
          <button
            className={`w-full h-[50px] bg-blue-500 text-white flex ${
              adminMode ? "hidden" : "block"
            } justify-center cursor-pointer items-center mt-5 rounded-lg text-base font-medium`}
          >
            신청하기
          </button>
          <div
            className={`w-full ${
              adminMode ? "" : "hidden"
            } flex justify-center gap-2 mt-5 h-auto`}
          >
            <button
              onClick={() => setAdminMode(!adminMode)}
              className="text-black cursor-pointer text-base font-normal w-[90px] h-10 bg-slate-200 rounded-lg"
            >
              취소
            </button>
            <button className="text-white cursor-pointer text-base font-normal w-[90px] h-10 bg-blue-500 rounded-lg">
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
