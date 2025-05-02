"use client";
import ApplyStatueBadge from "@/components/Badge/ApplyStatueBadge";
import KeywordBadge from "@/components/Badge/KeywordBadge";
import ProposalBadge from "@/components/Badge/ProposalBadge";
import MajorGraph from "@/components/Project/ProjectField/MajorGraph";
import ProjectTextArea from "@/components/Project/ProjectField/ProjectTextArea";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { fakeProjects, ProjectType } from "@/constants/fakeProject";
import { Calendar, Eye, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProjectTextFieldType = {
  introduction: string;
  background: string;
  methodology: string;
  goal: string;
  expectation: string;
};

type ProjectApplyType = {
  name: string;
  majors: string;
  phone: string;
  email: string;
  introduction: string;
};

export default function Project({ params }: { params: { id: string } }) {
  const project = fakeProjects.find((project) => project.id === params.id);
  const [adminMode, setAdminMode] = useState<boolean>(false);
  const [isManagingRecruitment, setIsManagingRecruitment] = useState(false);

  // 프로젝트 정보 폼
  const {
    handleSubmit: handleTextSubmit,
    control: controlText,
    formState: { errors: errorsText },
    reset: resetText,
  } = useForm<ProjectTextFieldType>({
    defaultValues: {
      introduction: project?.introduction || "",
      background: project?.background || "",
      methodology: project?.methodology || "",
      goal: project?.goal || "",
      expectation: project?.expectation || "",
    },
  });

  // 신청 폼
  const {
    handleSubmit: handleApplySubmit,
    control: controlApply,
    formState: { errors: errorsApply },
  } = useForm<ProjectApplyType>();

  function delay(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  async function edit(data: ProjectTextFieldType) {
    console.log("제출된 데이터:", data);
    await delay(1000);
    window.location.reload();
  }

  const fields = [
    { name: "introduction", title: "프로젝트 소개" },
    { name: "background", title: "프로젝트 추진배경" },
    { name: "methodology", title: "프로젝트 실행방법" },
    { name: "goal", title: "프로젝트 목표" },
    { name: "expectation", title: "프로젝트 기대효과" },
  ] as const;

  useEffect(() => {
    if (!adminMode) {
      setIsManagingRecruitment(false);
    } else {
      setIsManagingRecruitment(true);
    }
  }, [adminMode]);

  useEffect(() => {}, []);

  return (
    <div className="w-auto h-auto relative">
      <form
        id="project-form"
        onSubmit={handleTextSubmit(edit)}
        className="min-[1040px]:w-[1040px] my-12 px-5 flex-col flex w-full h-auto"
      >
        <div className="w-full h-auto flex flex-col relative">
          <div className="absolute flex gap-1 items-center right-0 top-0">
            <Switch
              checked={adminMode}
              onClick={() => {
                if (adminMode) {
                  resetText({
                    introduction: project?.introduction || "",
                    background: project?.background || "",
                    methodology: project?.methodology || "",
                    goal: project?.goal || "",
                    expectation: project?.expectation || "",
                  });
                  setAdminMode(false);
                }
              }}
              onCheckedChange={setAdminMode}
            ></Switch>
            <span className="text-sm font-medium -translate-y-[1px]">
              관리자
            </span>
          </div>
          <div className="flex  w-full gap-[10px] items-center h-7 ">
            <ApplyStatueBadge status={project?.status} />
            <ProposalBadge proposer={project?.proposer} />
            {project?.keywords.map((keyword, index) => {
              return <KeywordBadge keyword={keyword} key={index} />;
            })}
          </div>
          <div className="text-4xl font-medium mb-2">{project?.title}</div>
          <div className="w-full h-[1px] bg-black"></div>
          <div className="gap-3 flex h-7 items-center font-medium text-xs">
            <span className="text-slate-500 flex items-center">
              {project?.name}
            </span>
            <div className="flex items-center gap-1">
              <Eye className="size-5 mt-0.5" />
              <span>{project?.view}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="size-5 mt-0.5" />
              <span>{project?.date.toLocaleDateString("ko-KR")}</span>
            </div>
          </div>
        </div>
        <div className="w-full flex  h-auto justify-between">
          <div className="w-[690px] h-full mt-9 flex flex-col gap-5">
            {fields.map(({ name, title }) => (
              <Controller
                key={name}
                name={name}
                control={controlText}
                rules={{ required: `${title}을 입력해주세요.` }}
                render={({ field }) => (
                  <ProjectTextArea
                    title={title}
                    value={field.value}
                    onChange={field.onChange}
                    adminMode={adminMode}
                  />
                )}
              />
            ))}
          </div>

          <div className="w-[280px] flex flex-col gap-5 h-auto mt-12">
            <MajorGraph project={project as ProjectType} />
            <div className="w-full text-sm font-medium flex flex-col shadow-md rounded-lg  h-[400px]">
              <div className="w-full *:w-16 *:text-center *:cursor-pointer border-b-2 flex justify-center gap-5 h-10 items-center">
                <div onClick={() => setIsManagingRecruitment(false)}>
                  대화방
                </div>
                <div
                  onClick={() => setIsManagingRecruitment(true)}
                  className={`${adminMode ? "" : "hidden"}`}
                >
                  모집 관리
                </div>
              </div>
              <div
                className={`${
                  isManagingRecruitment ? "hidden" : ""
                } relative w-full h-[360px] `}
              >
                <div className="bottom-0 p-1 absolute w-full flex items-center h-[80px] border-t-2">
                  <Textarea className="w-3/4 resize-none h-full text-gray-500 font-medium"></Textarea>
                </div>
              </div>
              <div
                className={`${
                  isManagingRecruitment ? "" : "hidden"
                } flex flex-col px-2`}
              >
                <div className="my-2 ">
                  확정{`(${project?.majors.length}/4)`}
                </div>
                {[...Array(project?.majors.length)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg flex items-center px-3 shadow-md w-full h-[45px] border"
                  >
                    <User className="size-6 mr-3" />
                    <span>Profile ({project?.majors[i]})</span>
                  </div>
                ))}
                <div className="my-2">신청</div>
              </div>
            </div>
            <div
              className={`w-full ${
                adminMode ? "" : "hidden"
              } flex justify-center gap-2 h-auto`}
            >
              <button
                onClick={() => {
                  resetText({
                    introduction: project?.introduction || "",
                    background: project?.background || "",
                    methodology: project?.methodology || "",
                    goal: project?.goal || "",
                    expectation: project?.expectation || "",
                  });
                  setAdminMode(false);
                }}
                type="button"
                className="text-black cursor-pointer text-base font-normal w-[90px] h-10 bg-slate-200 rounded-lg"
              >
                취소
              </button>
              <Dialog>
                <DialogTrigger asChild>
                  <div className="text-white flex justify-center items-center cursor-pointer text-base font-normal w-[90px] h-10 bg-blue-500 rounded-lg">
                    저장
                  </div>
                </DialogTrigger>
                <DialogContent className="w-56">
                  <DialogTitle>저장하시겠습니까?</DialogTitle>
                  <DialogDescription></DialogDescription>
                  <div className="flex ml-16">
                    <button className="button bg-white text-black">취소</button>
                    <button
                      className="button bg-black text-white"
                      onClick={() =>
                        document.getElementById("project-form")?.requestSubmit()
                      }
                    >
                      확인
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </form>
      <div className="h-auto w-auto right-5 absolute top-[825px] ">
        <Dialog>
          <DialogTrigger asChild>
            <div
              className={`w-[280px] h-[50px] bg-blue-500 text-white flex ${
                adminMode ? "hidden" : "block"
              } justify-center cursor-pointer items-center rounded-lg text-base font-medium`}
            >
              신청하기
            </div>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>신청서</DialogTitle>
              <DialogDescription className="mt-3">
                모든 필드를 작성해주세요.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleApplySubmit((data) => console.log(data))}>
              <div className="flex items-center">
                <span className="text-sm text-end font-semibold w-16 mr-3 whitespace-nowrap">
                  이름
                </span>
                <Controller
                  name="name"
                  control={controlApply}
                  rules={{ required: "이름을 입력해주세요" }}
                  render={({ field }) => <Input type="text" {...field} />}
                />
              </div>
              <div className="flex items-center">
                <span className="text-sm text-end font-semibold w-16 mr-3 whitespace-nowrap">
                  학과
                </span>
                <Controller
                  name="majors"
                  control={controlApply}
                  rules={{ required: "학과를 입력해주세요" }}
                  render={({ field }) => <Input type="text" {...field} />}
                />
              </div>
              <div className="flex items-center">
                <span className="text-sm text-end font-semibold w-16 mr-3 whitespace-nowrap">
                  전화번호
                </span>
                <Controller
                  name="phone"
                  control={controlApply}
                  rules={{ required: "전화번호를 입력해주세요" }}
                  render={({ field }) => <Input type="text" {...field} />}
                />
              </div>
              <div className="flex items-center">
                <span className="text-sm text-end font-semibold w-16 mr-3 whitespace-nowrap">
                  이메일
                </span>
                <Controller
                  name="email"
                  control={controlApply}
                  rules={{ required: "이메일을 입력해주세요" }}
                  render={({ field }) => <Input type="text" {...field} />}
                />
              </div>
              <div className="flex items-center">
                <span className="text-sm text-end font-semibold w-16 mr-3 whitespace-nowrap">
                  자기소개
                </span>
                <Controller
                  name="introduction"
                  control={controlApply}
                  rules={{ required: "자기소개를 입력해주세요" }}
                  render={({ field }) => <Input type="text" {...field} />}
                />
              </div>
              <Button className="text-sm font-normal hover:bg-gray-300 cursor-pointer bg-gray-200 border text-black w-[58px] h-11">
                취소
              </Button>
              <button
                type="submit"
                className="w-[58px] text-sm font-normal bg-black rounded-lg text-white cursor-pointer h-11"
              >
                확인
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
