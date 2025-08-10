import { ApplicantStatus, Project, ProjectStatus } from "@prisma/client";

type EmailTemplate = {
  subject: string;
  html: string;
};

const projectStatusAsVerboseKorean = (status: ProjectStatus | "DELETED") => {
  switch (status) {
    case ProjectStatus.RECRUITING:
      return "모집 중";
    case ProjectStatus.CLOSED:
      return "마감";
    case "DELETED":
      return "삭제됨";
    default:
      return "알 수 없음";
  }
};

const applicantStatusAsVerboseKorean = (status: ApplicantStatus) => {
  switch (status) {
    case ApplicantStatus.APPROVED:
      return "승인";
    case ApplicantStatus.REJECTED:
      return "반려";
    case ApplicantStatus.PENDING:
      return "대기 중";
  }
};

/**
 * 새로운 프로젝트가 생성되었을 때 알림
 */
const newProjectCreated = (newProject: Project): EmailTemplate => {
  const {
    id,
    name,
    background,
    method,
    objective,
    result,
    etc,
    keywords,
    proposerName,
    proposerType,
    proposerMajor,
  } = newProject;
  const now = new Date().toLocaleString("ko-KR");
  const link = `${process.env.VERCEL_URL}/projects/${id}`;

  return {
    subject: `신규 프로젝트 생성: ${name}`,
    html: `새로운 프로젝트가 생성되었습니다.<br><br>
    - 키워드: ${keywords.join(", ")}<br>
    - 제안자: ${proposerName} (${proposerType})${
      proposerMajor ? `, ${proposerMajor}` : ""
    }<br>
    - 생성일: ${now}<br>
    - 프로젝트 링크: <a href="${link}">${link}</a><br>
    - 추진배경: ${background}<br>
    - 실행방: ${method}<br>
    - 목표: ${objective}<br>
    - 기대효과: ${result}<br>
    - 기타 전달사항: ${etc}
    `,
  };
};

/**
 * 신청자가 프로젝트에 지원했을 때 알림
 */
const applicantApplied = (
  project: Project,
  applicantName: string
): EmailTemplate => {
  const projectLink = `${process.env.VERCEL_URL}/projects/${project.id}`;
  const now = new Date().toLocaleString("ko-KR");

  return {
    subject: `프로젝트 지원 알림: ${project.name}`,
    html: `지원자 ${applicantName}님이 프로젝트에 지원했습니다.<br><br>
    - 프로젝트 링크: <a href="${projectLink}">${projectLink}</a><br>
    - 지원일: ${now}
    `,
  };
};

/**
 * 신청자의 신청 상태가 변경됐을 때 알림
 */
const applicantStatusChanged = (
  project: Project,
  applicantName: string,
  prev: ApplicantStatus,
  curr: ApplicantStatus
): EmailTemplate => {
  const projectLink = `${process.env.VERCEL_URL}/projects/${project.id}`;
  const now = new Date().toLocaleString("ko-KR");

  return {
    subject: `프로젝트 지원 상태 변경: ${project.name}`,
    html: `지원자 ${applicantName}님의 지원 상태가 변경되었습니다.<br><br>
    - 이전 상태: ${applicantStatusAsVerboseKorean(prev)}<br>
    - 현재 상태: ${applicantStatusAsVerboseKorean(curr)}<br>
    - 프로젝트 링크: <a href="${projectLink}">${projectLink}</a><br>
    - 변경일: ${now}
    `,
  };
};

/**
 * 프로젝트 상태 변경 알림
 */
const projectStatusChanged = (
  project: Project,
  prev: ProjectStatus,
  curr: ProjectStatus | "DELETED"
) => {
  const projectLink = `${process.env.VERCEL_URL}/projects/${project.id}`;
  const now = new Date().toLocaleString("ko-KR");

  return {
    subject: `프로젝트 상태 변경: ${project.name}`,
    html: `프로젝트 ${project.name}의 상태가 변경되었습니다.<br><br>
    - 이전 상태: ${projectStatusAsVerboseKorean(prev)}<br>
    - 현재 상태: ${projectStatusAsVerboseKorean(curr)}<br>
    - 프로젝트 링크: <a href="${projectLink}">${projectLink}</a><br>
    - 변경일: ${now}
    `,
  };
};

const emailTemplates = {
  newProjectCreated,
  applicantApplied,
  applicantStatusChanged,
  projectStatusChanged,
};

export default emailTemplates;
