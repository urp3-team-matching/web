import { PrismaClient, ProposerType } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- 데이터 초기화 (기존 데이터 삭제) ---
  console.log("Deleting existing data...");
  await prisma.applicant.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.post.deleteMany({});
  console.log("Existing data deleted.");
  // --- 데이터 초기화 끝 ---

  // 비밀번호 해싱
  const passwordHash = await hash("password123", 10);
  console.log("Password hashed.");

  // 예제 프로젝트 생성 (수정된 스키마에 맞춤)
  console.log("Creating Project...");
  const project = await prisma.project.create({
    data: {
      name: "샘플 프로젝트",
      background: "프로젝트 연구 배경 설명",
      method: "프로젝트 연구 방법 설명",
      objective: "프로젝트 연구 목표 설명",
      result: "프로젝트 예상 결과 설명",
      attachments: ["/attachments/sample1.pdf", "/attachments/sample2.docx"],
      keywords: ["AI", "머신러닝", "데이터과학"],
      // 제안자 정보를 별도 모델이 아닌 직접 포함
      proposerName: "김교수",
      proposerType: ProposerType.PROFESSOR,
      proposerMajor: "컴퓨터 과학",
      passwordHash: passwordHash,
    },
  });
  console.log("Project created:", project);

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

  // 예제 게시글 생성
  console.log("Creating Post...");
  const post = await prisma.post.create({
    data: {
      title: "첫 번째 공지사항",
      content: "프로젝트 팀원을 모집합니다.",
      author: "관리자",
      attachments: [],
      passwordHash,
    },
  });
  console.log("Post created:", post);

  // 추가 지원자 생성 (다양한 데이터를 위해)
  console.log("Creating additional applicants...");
  const applicant2 = await prisma.applicant.create({
    data: {
      projectId: project.id,
      name: "이영희",
      email: "applicant2@example.com",
      major: "전자공학",
      phone: "010-9876-5432",
      introduction: "전자공학 전공자로 하드웨어 부분에 기여할 수 있습니다.",
      passwordHash: passwordHash,
    },
  });

  // 추가 프로젝트 생성
  console.log("Creating additional project...");
  const project2 = await prisma.project.create({
    data: {
      name: "IoT 스마트홈 시스템",
      background: "편리한 가정 환경을 위한 IoT 기술 접목",
      method: "라즈베리파이와 아두이노를 활용한 프로토타입 개발",
      objective: "저비용 고효율의 스마트홈 시스템 구축",
      result: "실용적인 스마트홈 제어 시스템 개발",
      attachments: ["/attachments/iot_proposal.pdf"],
      keywords: ["IoT", "스마트홈", "임베디드시스템"],
      proposerName: "이교수",
      proposerType: ProposerType.PROFESSOR,
      proposerMajor: "전자공학",
      passwordHash: passwordHash,
    },
  });

  console.log("Seeding finished successfully.");
  console.log({
    projects: [project, project2],
    applicants: [applicant, applicant2],
    posts: [post],
  });
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
