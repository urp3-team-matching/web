import { PrismaClient, ProposerType } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

// 랜덤 데이터 생성용 헬퍼 함수들
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 다양한 샘플 데이터
const projectNames = [
  "AI 기반 얼굴 인식 시스템",
  "블록체인 기술을 활용한 투명한 기부 플랫폼",
  "IoT 스마트홈 시스템",
  "자율주행 드론 개발",
  "AR/VR 교육 콘텐츠 개발",
  "친환경 에너지 저장 장치",
  "스마트 농업 시스템",
  "의료 데이터 분석 플랫폼",
  "재난 예측 AI 모델 개발",
  "3D 프린팅 건축 기술 연구",
  "양자 컴퓨팅 알고리즘 연구",
  "미세 플라스틱 제거 기술 개발",
  "사이버 보안 강화 시스템",
  "디지털 헬스케어 플랫폼",
  "친환경 재료 연구",
  "음성인식 기반 지능형 비서",
  "스마트시티 인프라 구축",
  "생체인증 보안 시스템",
  "인공지능 작곡 프로그램",
  "로봇 보조 수술 기술",
  "빅데이터 분석 도구 개발",
  "AR 기반 내비게이션",
  "지속가능한 패키징 연구",
  "신경망 기반 번역 시스템",
  "스마트 교통 관리 시스템",
];

const backgrounds = [
  "최근 기술의 발전으로 인한 새로운 가능성 탐색",
  "사회적 문제 해결을 위한 기술적 접근",
  "기존 시스템의 한계 극복을 위한 연구",
  "미래 사회를 대비한 선제적 기술 개발",
  "산업 현장의 요구에 대한 학술적 해결방안",
];

const methods = [
  "데이터 수집 및 분석을 통한 실증적 접근",
  "프로토타입 개발 및 테스트",
  "알고리즘 설계 및 최적화",
  "사용자 중심 설계 방법론 적용",
  "기존 연구의 메타분석 및 새로운 방향성 제시",
];

const objectives = [
  "혁신적인 기술 솔루션 개발",
  "기존 시스템의 효율성 및 성능 향상",
  "사용자 경험 개선을 통한 접근성 강화",
  "지속가능한 발전 모델 구축",
  "새로운 패러다임 제시를 통한 학술적 기여",
];

const results = [
  "실용적인 프로토타입 시스템 개발",
  "학술 논문 발표 및 특허 출원",
  "오픈소스 프로젝트로 커뮤니티 기여",
  "산업 현장 적용을 통한 검증",
  "후속 연구를 위한 기초 자료 확보",
];

const attachmentOptions = [
  ["/attachments/proposal.pdf", "/attachments/architecture.docx"],
  ["/attachments/research.pdf"],
  [
    "/attachments/diagram.png",
    "/attachments/budget.xlsx",
    "/attachments/timeline.pdf",
  ],
  [],
  ["/attachments/presentation.pptx"],
];

const keywordSets = [
  ["AI", "머신러닝", "데이터과학"],
  ["블록체인", "암호화", "분산시스템"],
  ["IoT", "스마트홈", "임베디드시스템"],
  ["AR", "VR", "메타버스"],
  ["신재생에너지", "지속가능성", "그린테크"],
  ["의료", "헬스케어", "바이오테크"],
  ["로봇공학", "자동화", "인공지능"],
  ["사이버보안", "해킹방지", "개인정보보호"],
  ["빅데이터", "분석", "시각화"],
];

const proposerNames = [
  "김교수",
  "이박사",
  "박연구",
  "정학생",
  "최교수",
  "신연구원",
  "한교수",
  "윤교수",
  "조연구원",
  "강교수",
];

const majors = [
  "컴퓨터 과학",
  "전자공학",
  "기계공학",
  "화학공학",
  "생명공학",
  "의학",
  "물리학",
  "인공지능",
  "로봇공학",
  "데이터사이언스",
];

const applicantFirstNames = [
  "지원",
  "영희",
  "철수",
  "민지",
  "준호",
  "소영",
  "태양",
  "하은",
  "민준",
  "지현",
  "예진",
  "성민",
  "유진",
  "도윤",
  "서연",
  "준영",
  "나연",
  "동현",
  "수빈",
  "재훈",
];

const applicantLastNames = [
  "김",
  "이",
  "박",
  "최",
  "정",
  "강",
  "조",
  "윤",
  "장",
  "임",
  "한",
  "오",
  "서",
  "신",
  "권",
  "황",
  "안",
  "송",
  "전",
  "홍",
];

const emails = [
  "student",
  "researcher",
  "dev",
  "engineer",
  "user",
  "contact",
  "pro",
  "team",
  "info",
  "help",
];

const emailDomains = [
  "gmail.com",
  "naver.com",
  "kakao.com",
  "skku.edu",
  "snu.ac.kr",
  "kaist.ac.kr",
  "yonsei.ac.kr",
  "korea.ac.kr",
];

const introductions = [
  "이 프로젝트에 참여하고 싶습니다.",
  "관련 분야에서 경험을 쌓고자 합니다.",
  "학부 과정에서 배운 지식을 실제로 적용해보고 싶습니다.",
  "이 분야에 대한 깊은 관심이 있습니다.",
  "다양한 배경을 가진 팀원들과 협업하고 싶습니다.",
  "새로운 기술을 배우고 적용하는 데 관심이 많습니다.",
  "연구 경험을 쌓아 대학원 진학을 준비하고 있습니다.",
  "실무 경험을 통해 이론과 실제의 차이를 배우고 싶습니다.",
  "창의적인 문제 해결 능력을 발휘하고 싶습니다.",
  "팀 프로젝트를 통해 커뮤니케이션 스킬을 향상시키고 싶습니다.",
];

async function main() {
  // --- 데이터 초기화 (기존 데이터 삭제) ---
  console.log("Deleting existing data...");
  await prisma.applicant.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.post.deleteMany({});
  console.log("Existing data deleted.");

  // 비밀번호 해싱 (모든 엔티티에 동일한 비밀번호 사용)
  const passwordHash = await hash("password123", 10);
  console.log("Password hashed.");

  // 프로젝트 생성 데이터 준비
  console.log("Preparing project data...");
  const projectsData = Array.from({ length: 25 }, (_, index) => ({
    name: projectNames[index] || `프로젝트 ${index + 1}`,
    background: getRandomItem(backgrounds) + ` (프로젝트 ${index + 1})`,
    method: getRandomItem(methods),
    objective: getRandomItem(objectives),
    result: getRandomItem(results),
    attachments: getRandomItem(attachmentOptions),
    keywords: getRandomItem(keywordSets),
    proposerName: getRandomItem(proposerNames),
    proposerType: getRandomItem([
      ProposerType.PROFESSOR,
      ProposerType.STUDENT,
      ProposerType.HOST,
    ]),
    proposerMajor: getRandomItem(majors),
    passwordHash: passwordHash,
    viewCount: getRandomInt(100, 100000), // 조회수 100~100000 사이 랜덤 설정
  }));

  // createMany를 사용해 프로젝트 일괄 생성
  console.log("Creating projects in bulk...");
  await prisma.project.createMany({
    data: projectsData,
  });

  // 생성된 모든 프로젝트 조회
  const allProjects = await prisma.project.findMany({
    select: {
      id: true,
    },
  });
  console.log(`Created ${allProjects.length} projects.`);

  // 지원자 생성 데이터 준비
  console.log("Preparing applicant data...");
  const applicantsData: any[] = [];

  for (const project of allProjects) {
    // 각 프로젝트당 0~4명의 지원자 랜덤 생성
    const applicantCount = getRandomInt(0, 4);

    for (let i = 0; i < applicantCount; i++) {
      const firstName = getRandomItem(applicantFirstNames);
      const lastName = getRandomItem(applicantLastNames);
      const name = lastName + firstName;

      // 이메일 생성 (중복 방지를 위해 프로젝트 ID와 인덱스 추가)
      const emailPrefix = getRandomItem(emails);
      const emailDomain = getRandomItem(emailDomains);
      const email = `${emailPrefix}${project.id}_${i}@${emailDomain}`;

      applicantsData.push({
        projectId: project.id,
        name: name,
        email: email,
        major: getRandomItem(majors),
        phone: `010-${getRandomInt(1000, 9999)}-${getRandomInt(1000, 9999)}`,
        introduction: getRandomItem(introductions),
        passwordHash: passwordHash,
      });
    }
  }

  // createMany를 사용해 지원자 일괄 생성
  console.log("Creating applicants in bulk...");
  if (applicantsData.length > 0) {
    await prisma.applicant.createMany({
      data: applicantsData,
    });
  }

  // 생성된 지원자 수 확인
  const totalApplicants = await prisma.applicant.count();
  console.log(`Created ${totalApplicants} applicants.`);

  // 샘플 게시글 생성
  console.log("Creating sample posts...");
  const postsData = [
    {
      title: "프로젝트 팀원 모집 안내",
      content:
        "다양한 프로젝트의 참여자를 모집합니다. 관심 있는 프로젝트에 지원해 주세요.",
      author: "관리자",
      attachments: [],
      passwordHash,
      viewCount: getRandomInt(100, 100000), // 조회수 100~100000 사이 랜덤 설정
    },
    {
      title: "프로젝트 제안 가이드라인",
      content: "프로젝트 제안서 작성 방법과 주의사항에 대한 안내입니다.",
      author: "시스템 관리자",
      attachments: ["/attachments/guideline.pdf"],
      passwordHash,
      viewCount: getRandomInt(100, 100000), // 조회수 100~100000 사이 랜덤 설정
    },
    {
      title: "플랫폼 이용 안내",
      content: "프로젝트 참여 및 제안에 관한 플랫폼 이용 방법을 안내합니다.",
      author: "헬프센터",
      attachments: [],
      passwordHash,
      viewCount: getRandomInt(100, 100000), // 조회수 100~100000 사이 랜덤 설정
    },
  ];

  await prisma.post.createMany({
    data: postsData,
  });

  console.log("Seeding completed successfully!");

  // 통계 정보 출력
  const projectStats = await prisma.project.groupBy({
    by: ["proposerType"],
    _count: {
      id: true,
    },
  });

  // 평균 조회수 계산을 위한 쿼리 추가
  const avgViewCount = await prisma.project.aggregate({
    _avg: {
      viewCount: true,
    },
  });

  console.log("\n=== 시드 데이터 통계 ===");
  console.log(`총 프로젝트 수: ${allProjects.length}`);
  console.log(`총 지원자 수: ${totalApplicants}`);
  console.log(
    `프로젝트 평균 조회수: ${Math.round(avgViewCount._avg.viewCount || 0)}`
  );
  console.log("프로젝트 제안자 유형 분포:", projectStats);

  // 조회수가 가장 많은 프로젝트 추가
  const mostViewedProjects = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      viewCount: true,
    },
    orderBy: {
      viewCount: "desc",
    },
    take: 3,
  });

  console.log(
    "조회수가 가장 많은 프로젝트(상위 3개):",
    mostViewedProjects.map(
      (p) => `${p.name}: ${p.viewCount.toLocaleString()}회`
    )
  );
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
