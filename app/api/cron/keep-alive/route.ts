import sendEmail from "@/lib/email";
import emailTemplates from "@/lib/email/templates";
import { getClientSupabase } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

/**
 * GitHub Actions Cron을 통해 Supabase 프로젝트 일시중지 방지
 *
 * 이 API는 정기적으로 호출되어 Supabase 데이터베이스에 가벼운 쿼리를 실행하여
 * 프리티어 비활성화 정책에 의한 일시중지를 방지합니다.
 *
 * GitHub Actions workflow에서 주기적으로 실행
 * 실패 시 환경 변수에 등록된 모든 관리자에게 즉시 이메일 알림 발송
 */
export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    const supabase = getClientSupabase();
    const startTime = Date.now();

    // 여러 테이블에 가벼운 쿼리 실행하여 데이터베이스 연결 유지
    const operations = await Promise.allSettled([
      // 프로젝트 개수 확인
      supabase
        .from("Project")
        .select("id", { count: "exact", head: true })
        .limit(1),

      // 최근 메시지 확인
      supabase
        .from("Message")
        .select("id")
        .limit(1)
        .order("createdDatetime", { ascending: false }),

      // 지원자 수 확인
      supabase
        .from("Applicant")
        .select("id", { count: "exact", head: true })
        .limit(1),
    ]);

    const endTime = Date.now();
    const duration = endTime - startTime;

    // 결과 분석
    const tableNames = ["Project", "Message", "Applicant"];
    const results = operations.map((op, index) => ({
      table: tableNames[index],
      status: op.status,
      success: op.status === "fulfilled" && !op.value.error,
      error:
        op.status === "rejected"
          ? op.reason
          : op.status === "fulfilled" && op.value.error
          ? op.value.error.message
          : null,
    }));

    const successCount = results.filter((r) => r.success).length;
    const isHealthy = successCount >= 2; // 최소 2개 테이블이 응답해야 건강한 상태

    const logData = {
      timestamp,
      healthy: isHealthy,
      duration: `${duration}ms`,
      successCount: `${successCount}/${operations.length}`,
      operations: results,
      environment: process.env.NODE_ENV,
    };

    // 실패 시 모든 관리자에게 즉시 알림 발송
    if (!isHealthy) {
      const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) =>
        email.trim()
      );

      if (adminEmails && adminEmails.length > 0) {
        const emailTemplate = emailTemplates.supabaseKeepAliveFailed({
          timestamp,
          successCount,
          totalOperations: operations.length,
          duration,
          results,
        });

        // 모든 관리자에게 병렬로 이메일 발송
        const emailPromises = adminEmails.map((email) =>
          sendEmail({
            to: email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
          }).catch((error) => {
            console.error(`Failed to send alert email to ${email}:`, error);
            return { email, error };
          })
        );

        try {
          await Promise.all(emailPromises);
          console.log(
            `✉️ Alert emails sent to ${adminEmails.length} administrator(s)`
          );
        } catch (emailError) {
          console.error("Failed to send alert emails:", emailError);
        }
      } else {
        console.warn(
          "⚠️ No admin emails configured. Set ADMIN_EMAILS environment variable."
        );
      }
    }

    if (isHealthy) {
      console.log("✅ Supabase keep-alive successful:", logData);
    } else {
      console.error("⚠️ Supabase keep-alive issues detected:", logData);
    }

    return NextResponse.json(
      {
        message: isHealthy
          ? "Supabase connection healthy"
          : "Supabase connection issues detected",
        timestamp,
        duration,
        healthy: isHealthy,
        operations: results,
      },
      {
        status: isHealthy ? 200 : 207, // 207 Multi-Status for partial success
      }
    );
  } catch (error) {
    console.error("❌ Keep-alive cron job error:", {
      timestamp,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: "Internal server error",
        timestamp,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
