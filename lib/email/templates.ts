import { getCurrentKoreanDate } from "@/lib/utils";
import { ApplicantStatus, Project, ProjectStatus } from "@prisma/client";

const VERCEL_URL = process.env.VERCEL_URL || "http://localhost:3000";

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
  const now = getCurrentKoreanDate();
  const link = `${VERCEL_URL}/projects/${id}`;

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
  const projectLink = `${VERCEL_URL}/projects/${project.id}`;
  const now = getCurrentKoreanDate();

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
  const projectLink = `${VERCEL_URL}/projects/${project.id}`;
  const now = getCurrentKoreanDate();

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
  const projectLink = `${VERCEL_URL}/projects/${project.id}`;
  const now = getCurrentKoreanDate();

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

/**
 * Supabase Keep-Alive 실패 알림
 */
const supabaseKeepAliveFailed = (data: {
  timestamp: string;
  successCount: number;
  totalOperations: number;
  duration: number;
  results: Array<{
    table: string;
    success: boolean;
    error: string | null;
  }>;
}): EmailTemplate => {
  const { timestamp, successCount, totalOperations, duration, results } = data;
  const kstTime = new Date(timestamp).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return {
    subject: "🚨 [긴급] Supabase Keep-Alive 실패 알림",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #d32f2f; color: white; padding: 15px; border-radius: 5px; }
          .content { background-color: #f5f5f5; padding: 20px; margin-top: 20px; border-radius: 5px; }
          .info-row { margin: 10px 0; }
          .label { font-weight: bold; color: #555; }
          .status-list { list-style: none; padding: 0; }
          .status-item { padding: 10px; margin: 5px 0; border-radius: 3px; }
          .status-success { background-color: #e8f5e9; color: #2e7d32; }
          .status-failed { background-color: #ffebee; color: #c62828; }
          .alert { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">⚠️ Supabase 연결 상태 문제 감지</h2>
          </div>
          
          <div class="content">
            <div class="info-row">
              <span class="label">발생 시간:</span> ${kstTime}
            </div>
            <div class="info-row">
              <span class="label">성공률:</span> ${successCount}/${totalOperations} 작업
            </div>
            <div class="info-row">
              <span class="label">응답 시간:</span> ${duration}ms
            </div>
            
            <h3>상세 내역:</h3>
            <ul class="status-list">
              ${results
                .map(
                  (r) => `
                <li class="status-item ${
                  r.success ? "status-success" : "status-failed"
                }">
                  <strong>${r.table}:</strong> 
                  ${
                    r.success
                      ? "✅ 성공"
                      : `❌ 실패 - ${r.error || "알 수 없는 오류"}`
                  }
                </li>
              `
                )
                .join("")}
            </ul>
            
            <div class="alert">
              <strong>⚠️ 조치 필요:</strong>
              <p>즉시 Supabase 프로젝트 상태를 확인해주세요.</p>
              <ul>
                <li>Supabase 대시보드에서 프로젝트 상태 확인</li>
                <li>데이터베이스 연결 및 권한 확인</li>
                <li>필요시 프로젝트 재시작 고려</li>
              </ul>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

const emailTemplates = {
  newProjectCreated,
  applicantApplied,
  applicantStatusChanged,
  projectStatusChanged,
  supabaseKeepAliveFailed,
};

export default emailTemplates;
