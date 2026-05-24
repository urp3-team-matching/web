import { Prisma } from "@prisma/client";
import { z } from "zod";

// status는 의도적으로 제외한다. 지원자 상태 전이는 accept/reject/pending
// 엔드포인트(verifyProjectPermission 보호)로만 가능해야 하며, 클라이언트가
// 생성/수정 요청 본문으로 status를 지정하지 못하게 한다.
export const ApplicantSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email format."),
  major: z.string().min(1, "Major is required."),
  introduction: z.string().min(1, "Introduction is required."),
});
export const ApplicantUpdateSchema = ApplicantSchema;
export type ApplicantInput = z.infer<typeof ApplicantSchema>;
export type ApplicantUpdateInput = z.infer<typeof ApplicantUpdateSchema>;

// Owner/admin 전용 — PII(email, introduction) 포함.
// verifyProjectPermission 통과한 호출자에게만 사용.
export const applicantAdminSelection = {
  id: true,
  name: true,
  email: true,
  major: true,
  introduction: true,
  status: true,
  projectId: true,
  createdDatetime: true,
  updatedDatetime: true,
} satisfies Prisma.ApplicantSelect;

// 공개 — PII(email, introduction) 제외.
// ApplicantRow는 mode !== null일 때만 Dialog를 열어 email/introduction을
// 표시하므로, mode === null(미인증) 컨텍스트에서는 이 두 필드가 UI에 필요 없다.
// 미인증 GET 응답은 이 select만 사용해야 한다.
export const applicantPublicSelection = {
  id: true,
  name: true,
  major: true,
  status: true,
  projectId: true,
  createdDatetime: true,
  updatedDatetime: true,
} satisfies Prisma.ApplicantSelect;

export type ApplicantPublic = Prisma.ApplicantGetPayload<{
  select: typeof applicantPublicSelection;
}>;
export type ApplicantAdmin = Prisma.ApplicantGetPayload<{
  select: typeof applicantAdminSelection;
}>;
