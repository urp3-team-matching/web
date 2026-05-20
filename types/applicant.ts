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

export const applicantPublicSelection: Prisma.ApplicantSelect = {
  id: true,
  name: true,
  email: true,
  major: true,
  introduction: true,
  status: true,
  projectId: true, // 어떤 프로젝트의 지원자인지 표시
  createdDatetime: true,
  updatedDatetime: true,
};
