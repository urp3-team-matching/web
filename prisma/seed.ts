import { PrismaClient, ProposerType } from "@prisma/client"; // Prisma 추가 임포트
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- 데이터 초기화 (선택 사항, 시드 실행 시 일관성 유지 목적) ---
  console.log("Deleting existing data...");
  await prisma.applicant.deleteMany({});
  await prisma.post.deleteMany({});
  try {
    // Project가 Proposer를 참조하므로 Project를 먼저 삭제 시도
    await prisma.project.deleteMany({});
    await prisma.proposer.deleteMany({});
  } catch (error) {
    console.warn(
      "Deletion order might need adjustment based on constraints:",
      error
    );
    // Fallback: Proposer 먼저 삭제
    await prisma.proposer.deleteMany({});
    await prisma.project.deleteMany({});
  }
  console.log("Existing data deleted.");
  // --- 데이터 초기화 끝 ---

  // 비밀번호 해싱
  const passwordHash = await hash("password123", 10);
  console.log("Password hashed.");

  // 예제 프로젝트와 제안자를 중첩된 쓰기로 동시에 생성 (create 사용)
  console.log("Creating Project with nested Proposer...");
  // Prisma.ProjectGetPayload 타입을 사용하여 반환 타입 명시
  const createdProject = await prisma.project.create({
    data: {
      // Project 데이터
      name: "샘플 프로젝트",
      background: "프로젝트 연구 배경 설명",
      method: "프로젝트 연구 방법 설명",
      objective: "프로젝트 연구 목표 설명",
      result: "프로젝트 예상 결과 설명",
      attachments: ["/attachments/sample1.pdf", "/attachments/sample2.docx"],
      tags: ["AI", "머신러닝", "데이터과학"],
      passwordHash: passwordHash,
      proposer: {
        create: {
          // Proposer 데이터
          type: ProposerType.PROFESSOR,
          name: "김교수",
          email: "professor.kim@example.com",
          major: "컴퓨터 과학",
          phone: "010-1111-2222",
          introduction: "AI 연구 전문가입니다.",
          passwordHash: passwordHash,
        },
      },
    },
    include: {
      proposer: true,
    },
  });
  console.log("Project and Proposer created:", createdProject);

  // 생성된 Project와 Proposer 객체 가져오기
  // Prisma.ProjectGetPayload 타입을 사용했으므로 타입이 정확함
  const project = createdProject;
  const proposer = createdProject.proposer; // proposer는 null이 아님 (include: true)

  // 예제 지원자 생성
  console.log("Creating Applicant...");
  const applicant = await prisma.applicant.create({
    data: {
      projectId: project.id,
      name: "박지원",
      email: "applicant1@example.com",
      major: "소프트웨어 공학",
      phone: "010-1234-5678",
      introduction: "이 프로젝트에 참여하고 싶습니다.",
      passwordHash: passwordHash,
    },
  });
  console.log("Applicant created:", applicant);

  // 예제 게시글 생성 (선택 사항)
  console.log("Creating Post...");
  const post = await prisma.post.create({
    data: {
      title: "첫 번째 공지사항",
      content: "프로젝트 팀원을 모집합니다.",
      author: "관리자",
      attachments: [],
    },
  });
  console.log("Post created:", post);

  console.log("Seeding finished successfully.");
  console.log({ project, proposer, applicant, post });
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Prisma client disconnected.");
  });
