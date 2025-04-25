import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 비밀번호 해싱
  const passwordHash = await hash("password123", 10);

  // 예제 토픽 생성
  const project = await prisma.project.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "샘플 주제",
      content: "이것은 샘플 주제입니다.",
      proposerType: "PROFESSOR",
      proposerName: "김교수",
      passwordHash: passwordHash,
    },
  });

  // 예제 팀 생성
  const team = await prisma.team.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "샘플 팀",
      leaderName: "이학생",
      passwordHash: passwordHash,
      projectId: project.id,
      content: {
        create: {
          background: "연구 배경",
          objective: "연구 목적",
          method: "연구 방법",
          result: "예상 결과",
        },
      },
    },
  });

  // 예제 지원자 생성
  const applicant = await prisma.applicant.upsert({
    where: { id: 1 },
    update: {},
    create: {
      teamId: team.id,
      nickName: "지원자1",
      email: "applicant1@example.com",
      phone: "010-1234-5678",
      content: "지원 동기",
      profileImage: "/profile/default.png",
      passwordHash: passwordHash,
    },
  });

  console.log({ project, team, applicant });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
