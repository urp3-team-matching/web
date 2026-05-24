import { ApplicantStatus, Project, ProjectStatus } from "@prisma/client";

import { getCurrentKoreanDate } from "@/lib/utils";

// projectAdminSelection / projectPublicSelection 모두 passwordHash를 제외하고
// 반환하므로, 이메일 템플릿은 그 narrowed shape을 받을 수 있어야 한다.
// 두 select 모두 admin/public이 사용하는 필드 superset을 포함한다.
type ProjectForEmail = Omit<Project, "passwordHash">;

const VERCEL_URL = process.env.VERCEL_URL || "http://localhost:3000";

// 사용자 입력을 이메일 HTML 본문에 안전하게 보간하기 위한 HTML 이스케이프.
// 미인증 라우트(POST /api/projects, /apply 등)에서 흘러들어온 사용자 입력이
// 관리자/프로젝트 소유자 메일함에 그대로 렌더되는 것을 막는다.
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Subject는 메일 헤더라, 개행 문자가 끼면 RFC 5322 header injection이
// 가능해진다. CR/LF를 공백으로 치환.
function escapeHeader(s: string): string {
  return s.replace(/[\r\n]+/g, " ");
}

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
const newProjectCreated = (newProject: ProjectForEmail): EmailTemplate => {
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
    subject: escapeHeader(`신규 프로젝트 생성: ${name}`),
    html: `새로운 프로젝트가 생성되었습니다.<br><br>
    - 키워드: ${keywords.map(escapeHtml).join(", ")}<br>
    - 제안자: ${escapeHtml(proposerName)} (${proposerType})${
      proposerMajor ? `, ${escapeHtml(proposerMajor)}` : ""
    }<br>
    - 생성일: ${now}<br>
    - 프로젝트 링크: <a href="${link}">${link}</a><br>
    - 추진배경: ${escapeHtml(background)}<br>
    - 실행방: ${escapeHtml(method)}<br>
    - 목표: ${escapeHtml(objective)}<br>
    - 기대효과: ${escapeHtml(result)}<br>
    - 기타 전달사항: ${etc ? escapeHtml(etc) : ""}
    `,
  };
};

/**
 * 신청자가 프로젝트에 지원했을 때 알림
 */
const applicantApplied = (
  project: ProjectForEmail,
  applicantName: string
): EmailTemplate => {
  const projectLink = `${VERCEL_URL}/projects/${project.id}`;
  const now = getCurrentKoreanDate();

  return {
    subject: escapeHeader(`프로젝트 지원 알림: ${project.name}`),
    html: `지원자 ${escapeHtml(applicantName)}님이 프로젝트에 지원했습니다.<br><br>
    - 프로젝트 링크: <a href="${projectLink}">${projectLink}</a><br>
    - 지원일: ${now}
    `,
  };
};

/**
 * 신청자의 신청 상태가 변경됐을 때 알림
 */
const applicantStatusChanged = (
  project: ProjectForEmail,
  applicantName: string,
  prev: ApplicantStatus,
  curr: ApplicantStatus
): EmailTemplate => {
  const projectLink = `${VERCEL_URL}/projects/${project.id}`;
  const now = getCurrentKoreanDate();

  return {
    subject: escapeHeader(`프로젝트 지원 상태 변경: ${project.name}`),
    html: `지원자 ${escapeHtml(applicantName)}님의 지원 상태가 변경되었습니다.<br><br>
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
  project: ProjectForEmail,
  prev: ProjectStatus,
  curr: ProjectStatus | "DELETED"
) => {
  const projectLink = `${VERCEL_URL}/projects/${project.id}`;
  const now = getCurrentKoreanDate();

  return {
    subject: escapeHeader(`프로젝트 상태 변경: ${project.name}`),
    html: `프로젝트 ${escapeHtml(project.name)}의 상태가 변경되었습니다.<br><br>
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
  isDebugMode?: boolean;
}): EmailTemplate => {
  const {
    timestamp,
    successCount,
    totalOperations,
    duration,
    results,
    isDebugMode = false,
  } = data;
  const kstTime = new Date(timestamp).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const isHealthy = successCount >= 2; // 최소 2개 테이블이 응답해야 건강한 상태
  const headerColor = isHealthy ? "#4caf50" : "#d32f2f";
  const headerEmoji = isHealthy ? "✅" : "⚠️";
  const headerTitle = isHealthy
    ? "Supabase 연결 정상 (디버그 모드)"
    : "Supabase 연결 상태 문제 감지";

  return {
    subject: isDebugMode
      ? `🐛 [테스트] Supabase Keep-Alive ${isHealthy ? "성공" : "실패"} 알림`
      : "🚨 [긴급] Supabase Keep-Alive 실패 알림",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: ${headerColor}; color: white; padding: 15px; border-radius: 5px; }
          .content { background-color: #f5f5f5; padding: 20px; margin-top: 20px; border-radius: 5px; }
          .info-row { margin: 10px 0; }
          .label { font-weight: bold; color: #555; }
          .status-list { list-style: none; padding: 0; }
          .status-item { padding: 10px; margin: 5px 0; border-radius: 3px; }
          .status-success { background-color: #e8f5e9; color: #2e7d32; }
          .status-failed { background-color: #ffebee; color: #c62828; }
          .alert { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin-top: 20px; }
          .debug-badge { background-color: #9c27b0; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">
              ${headerEmoji} ${headerTitle}
              ${
                isDebugMode
                  ? '<span class="debug-badge">🐛 디버그 모드</span>'
                  : ""
              }
            </h2>
          </div>
          
          <div class="content">
            ${
              isDebugMode
                ? '<div style="background-color: #f3e5f5; padding: 10px; border-radius: 5px; margin-bottom: 15px;"><strong>ℹ️ 테스트 알림:</strong> 이 메일은 디버그 모드로 발송된 테스트 알림입니다.</div>'
                : ""
            }
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
            
            ${
              !isHealthy && !isDebugMode
                ? `
            <div class="alert">
              <strong>⚠️ 조치 필요:</strong>
              <p>즉시 Supabase 프로젝트 상태를 확인해주세요.</p>
              <ul>
                <li>Supabase 대시보드에서 프로젝트 상태 확인</li>
                <li>데이터베이스 연결 및 권한 확인</li>
                <li>필요시 프로젝트 재시작 고려</li>
              </ul>
            </div>
            `
                : isHealthy && isDebugMode
                ? `
            <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 12px; margin-top: 20px;">
              <strong>✅ 연결 상태 정상:</strong>
              <p>모든 시스템이 정상적으로 작동하고 있습니다. (테스트 모드)</p>
            </div>
            `
                : ""
            }
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
