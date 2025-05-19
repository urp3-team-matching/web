"use client";

import ApplyStatueBadge from "@/components/Badge/ApplyStatueBadge";
import KeywordBadge from "@/components/Badge/KeywordBadge";
import ProposalBadge from "@/components/Badge/ProposalBadge";
import ChatField from "@/components/Project/Chat/ChatField";
import { FileInput } from "@/components/Project/FileInput";
import { KeywordInput } from "@/components/Project/KeywordInput";
import MajorGraph from "@/components/Project/MajorGraph";
import ProjectTextArea from "@/components/Project/ProjectTextArea";
import ProposerField from "@/components/Project/ProposerField";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import apiClient, { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { Switch } from "@radix-ui/react-switch";
import { Calendar, Eye, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type ProjectTextFieldType = {
  name: string;
  proposer: "professor" | "student" | "admin";
  password: string;
  majors: string;
  keywords: string[];
  title: string;
  introduction: string;
  background: string;
  method: string;
  objective: string;
  result: string;
};

type ProjectApplyType = {
  name: string;
  majors: string;
  phone: string;
  email: string;
  introduction: string;
};

const fields = [
  { name: "introduction", title: "프로젝트 소개" },
  { name: "background", title: "프로젝트 추진배경" },
  { name: "methodology", title: "프로젝트 실행방법" },
  { name: "goal", title: "프로젝트 목표" },
  { name: "expectation", title: "프로젝트 기대효과" },
] as const;

const applyFields = [
  { name: "name", title: "이름" },
  { name: "majors", title: "학과" },
  { name: "phone", title: "전화번호" },
  { name: "email", title: "이메일" },
  { name: "introduction", title: "자기소개" },
] as const;

export default function Project({ params }: { params: { id: string } }) {
  const projectId = parseInt(params.id);
  const [project, setProject] = useState<PublicProjectWithForeignKeys>();
  useEffect(() => {
    async function fetchProject() {
      const response = await apiClient.getProjectById(projectId);
      if (response) {
        setProject(response);
      } else {
        console.error("Failed to fetch project data.");
      }
    }
    fetchProject();
  }, [projectId]);

  const [adminMode, setAdminMode] = useState<boolean>(false);
  const [isManagingRecruitment, setIsManagingRecruitment] = useState(false);
  const [applyOn, setApplyOn] = useState(false);

  // 프로젝트 정보 폼
  const {
    register: registerText,
    handleSubmit: handleTextSubmit,
    control: controlText,
    formState: { errors: errorsText },
    reset: resetText,
  } = useForm<ProjectTextFieldType>();

  // 신청 폼
  const {
    handleSubmit: handleApplySubmit,
    control: controlApply,
    formState: { errors: errorsApply },
  } = useForm<ProjectApplyType>();

  function edit(data: ProjectTextFieldType) {
    if (!applyOn) {
      console.log("첨부된 파일:");
      if (data.attachments.length === 0) {
        console.log("  (첨부된 파일이 없습니다)");
      } else {
        data.attachments.forEach((f, i) => {
          console.log(
            `  ${i + 1}. ${f.name} (${(f.size / 1024).toFixed(1)} KB)`
          );
        });
      }
      console.log("🔍 전체 데이터 객체:", data);
      alert("저장되었습니다.");
      window.location.reload();
    }
  }

  // 프로젝트 지원 시 호출 함수
  function apply(data: ProjectApplyType) {
    console.log("신청서 제출된 데이터:", data);
    setApplyOn(false);
    alert("신청서가 제출되었습니다.");
  }

  useEffect(() => {
    if (!adminMode) {
      setIsManagingRecruitment(false);
    } else {
      setIsManagingRecruitment(true);
    }
  }, [adminMode]);

  useEffect(() => {}, []);

  if (!project) {
    return <div>프로젝트를 찾을 수 없습니다!</div>;
  }

  return (
    <div className="w-full pageWidth h-auto relative">
      <form
        id="project-form"
        onSubmit={handleTextSubmit(edit)}
        className=" my-12 px-5 flex-col flex w-full h-auto"
      >
        {/* 프로젝트 머리 부분 */}

        <div className="w-full h-auto flex flex-col relative">
          <div className="absolute flex gap-1 items-center right-0 top-0">
            <Switch
              checked={adminMode}
              onClick={() => {
                if (adminMode) {
                  resetProjectText();
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
            <ApplyStatueBadge
              status={project?.status as "recruiting" | "closed"}
            />
            <ProposalBadge
              proposer={project?.proposer as "professor" | "student" | "admin"}
            />
            <div
              className={`${
                adminMode ? "hidden" : ""
              } w-auto h-full flex gap-1 items-center`}
            >
              {project?.keywords.map((keyword, index) => {
                return <KeywordBadge keyword={keyword} key={index} />;
              })}
            </div>
          </div>

          <div className="h-16 flex flex-col justify-end border-b-[1px] border-black">
            <input
              defaultValue={project?.title}
              readOnly={!adminMode}
              placeholder="제목을 입력하세요"
              className={`text-4xl ${
                adminMode ? "bg-gray-100" : ""
              } font-medium  text-black w-full h-14   p-1 py-1`}
              {...registerText("title", {
                required: "제목을 입력해주세요",
              })}
            ></input>
          </div>
          <div className="gap-3 flex h-7 items-center font-medium text-xs">
            <span className="text-slate-500 flex items-center">
              {project?.name}
            </span>
            <div className="flex items-center gap-1">
              <Eye className="size-5 mt-0.5" />
              <span>{project.viewCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="size-5 mt-0.5" />
              <span>{project.createdDatetime}</span>
            </div>
          </div>
        </div>

        {/* 프로젝트 필드 부분 */}

        <div className="w-full flex flex-col h-auto justify-between">
          {/* 프로젝트 필드 좌측 부분 */}
          <div className={`${adminMode ? "" : "hidden"} w-full h-auto`}>
            <Controller
              name="attachments"
              control={controlText}
              defaultValue={project?.attachments ?? []} // nullish 병합으로 안전하게
              render={({ field }) => (
                <FileInput
                  className="mt-5"
                  value={field.value}
                  onChange={(attachments) => {
                    console.log("파일 변경됨", attachments); // 로그 꼭 찍어보기
                    field.onChange(attachments); // 직접 연결
                  }}
                />
              )}
            />
          </div>
          <div className="w-full h-auto flex justify-between">
            <div className="w-2/3 h-full mt-9 flex flex-col gap-5">
              <div className={`${adminMode ? "" : "hidden"}`}>
                <Controller
                  name="keywords"
                  control={controlText}
                  defaultValue={project?.keywords || []}
                  rules={{ required: "키워드를 입력해주세요." }}
                  render={({ field }) => (
                    <KeywordInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
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

            {/* 프로젝트 필드 우측 부분 */}
            <div className="w-[30%] flex flex-col gap-5 h-auto mt-12">
              <MajorGraph
                className={`${adminMode ? "hidden" : ""}`}
                project={project}
              />
              {/* 프로젝트 제안자 입력 */}
              <div
                className={`w-full p-5 flex flex-col gap-3 border rounded-lg h-auto ${
                  adminMode ? "" : "hidden"
                }`}
              >
                <ProposerField control={controlText}></ProposerField>
              </div>
              {/* 프로젝트 대화방 및 모집관리 */}
              <div className="w-full text-sm font-medium flex flex-col shadow-md rounded-lg  h-[500px]">
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
                  } relative w-full h-[460px]`}
                >
                  <ChatField></ChatField>
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
              {/* 프로젝트 신청 버튼 */}
              <Dialog open={applyOn} onOpenChange={setApplyOn}>
                <DialogTrigger asChild>
                  <div
                    onClick={() => setApplyOn(true)}
                    className={`w-full h-[50px] bg-secondary-100 text-white flex ${
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
                  <form id="apply-form" onSubmit={handleApplySubmit(apply)}>
                    {applyFields.map(({ name, title }, i) => (
                      <div key={name} className="flex items-center my-3">
                        <span className="text-sm text-end   font-semibold w-16 mr-3 whitespace-nowrap">
                          {title}
                        </span>
                        <Controller
                          name={name}
                          control={controlApply}
                          rules={{ required: `${title}을 입력해주세요` }}
                          render={({ field }) => (
                            <Input
                              className={`${
                                i === applyFields.length - 1 ? "h-32" : ""
                              }`}
                              type="text"
                              {...field}
                            />
                          )}
                        />
                      </div>
                    ))}
                    <div className="w-full h-auto flex justify-end gap-2 mt-5">
                      <DialogClose className="text-sm font-normal rounded-md hover:bg-gray-300 cursor-pointer bg-gray-200 border text-black w-[58px] h-11">
                        취소
                      </DialogClose>
                      <button className="w-[58px] text-sm font-normal bg-secondary-100 rounded-lg text-white cursor-pointer h-11">
                        확인
                      </button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              {/* 프로젝트 저장 및 취소 버튼 */}
              <div
                className={`w-full ${
                  adminMode ? "" : "hidden"
                } flex justify-center gap-2 h-auto`}
              >
                <button
                  onClick={() => {
                    resetProjectText();
                    setAdminMode(false);
                  }}
                  type="button"
                  className="text-black cursor-pointer text-base font-normal w-[100px] h-10 bg-slate-200 rounded-lg"
                >
                  취소
                </button>
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="text-white flex justify-center items-center cursor-pointer text-base font-normal w-[280px] h-10 bg-secondary-100 rounded-lg">
                      저장
                    </div>
                  </DialogTrigger>
                  <DialogContent className="w-56">
                    <DialogTitle>저장하시겠습니까?</DialogTitle>
                    <DialogDescription></DialogDescription>
                    <div className="flex ml-16">
                      <DialogClose className="button bg-white text-black">
                        취소
                      </DialogClose>
                      <button
                        className="button bg-black text-white"
                        onClick={
                          () =>
                            document
                              .getElementById("project-form")
                              ?.requestSubmit() // form 태그 안에 들어가 있는 것처럼 보이지만, DOM 상에서는 form 태그 밖에 있는 상태여서 어쩔 수 없이 사용
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
        </div>
      </form>
    </div>
  );
}
