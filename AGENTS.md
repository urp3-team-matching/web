# Repository Guidelines

이 파일은 AI 코딩 에이전트(Claude Code, OpenAI Codex, Cursor, Aider, Sourcegraph Cody, Gemini CLI 등)가 이 레포지토리에서 작업할 때 참고할 가이드라인입니다.

**SSOT**: 본 `AGENTS.md`가 단일 진실의 원천. `CLAUDE.md`는 동일 파일을 가리키는 symlink (Claude Code가 `CLAUDE.md`를 우선 인식하므로 호환용). 수정은 항상 `AGENTS.md`에 — symlink 통해 자동 반영. 다른 도구도 같은 패턴으로 필요 시 추가 (`GEMINI.md`, `.cursor/rules/main.mdc` 등).

## 프로젝트 개요

성균관대학교 **URP Ⅲ형(융합연구학점제 / Undergraduate Research Program 3형) 팀 모집 플랫폼**의 웹 프론트엔드 + API. 운영 사이트는 [urp3team.vercel.app](https://urp3team.vercel.app), 공식 프로그램 안내는 [urp3.skku.edu](https://urp3.skku.edu/urp3/index.do).

### 도메인 요약 (코드 읽을 때 필요한 컨텍스트)

- **주체**: 학부생 3~4명 팀 + 지도교수 1~2명(전임교원 1명 이상). 운영은 **성균관대학교 성균융합원**(행정실 `urp3@skku.edu`) — 이게 코드의 `HOST`.
- **흐름**: 교수/학생/성균융합원(HOST) 중 하나가 프로젝트를 제안 → 다른 학생들이 지원(`Applicant`) → 모집 마감 시 `RECRUITING` → `CLOSED`.
- **결과물**: 한 학기 동안 자기주도 연구, 일반선택 3학점(학기당 1개, 최대 2개). 팀활동보고서 10회/중간/최종 + 성과보고회.
- **Prisma enum 매핑**:
  - `ProposerType` = PROFESSOR / STUDENT / HOST(URP3 운영 주체인 성균융합원 자체. "관리자가 직접 띄우는 프로젝트" 타입)
  - `ProjectStatus` = RECRUITING / CLOSED
  - `ApplicantStatus` = PENDING / APPROVED / REJECTED
- `Post`는 **성균융합원이 관리하는 공지/게시판**(일반 사용자 작성 불가), `Message`는 프로젝트 상세 페이지의 Q&A 채팅.

## 명령어

패키지 매니저는 **pnpm 10.17.1 고정**(`preinstall: only-allow pnpm`). npm/yarn은 거부됨.

```bash
# 개발
pnpm dev                          # NODE_ENV=development next dev --turbo
pnpm build                        # prisma generate + next build
pnpm lint                         # ESLint 9 flat config
pnpm lint:fix

# 로컬 Supabase 스택 (Docker 필요)
pnpm dev:setup                    # supabase start → db reset → migrate deploy → db push → seed
pnpm dev:reset                    # 기존 supabase 컨테이너에 db만 재구성

# Prisma
pnpm prisma:generate              # @prisma/client 재생성 (스키마 변경 후)
pnpm prisma:migrate:dev           # 새 마이그레이션 생성
pnpm prisma:studio                # GUI로 로컬 DB 조회
pnpm prisma:seed                  # prisma/seed.ts 실행 (faker로 더미 데이터)
```

테스트 러너/스위트는 현재 없음 — 신규 도입 시 사용자 합의 먼저.

### 로컬 환경 셋업

1. `cp .env.example .env`
2. `pnpm dev:setup` (Supabase CLI가 Docker로 Postgres + Auth 띄움)
3. `pnpm exec supabase status`로 출력된 `anon key`를 `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 붙여넣기
4. `pnpm dev`

`PROJECT_ENCRYPTION_KEY`(64자 hex)는 프로젝트 비밀번호 쿠키 AES 키 — 로컬에서도 [lib/encryption.ts](lib/encryption.ts)가 요구하니 임의의 hex 32byte 값 채울 것.

## 아키텍처

### 스택

Next.js 16 (App Router, Turbopack 개발) · React 19 · TypeScript strict · Tailwind 4 · shadcn/ui (New York, neutral) · Prisma 6 + Supabase Postgres · Supabase Auth (SSR 쿠키 흐름) · nuqs (URL state) · react-hook-form + zod · nodemailer (Gmail SMTP).

### 레이어드 구조 (요청 → DB)

```text
app/api/**/route.ts  (요청 검증 · 응답 매핑)
   ↓ zod 파싱은 lib/routeUtils.parseAndValidateRequestBody
services/{post,project,applicant}.ts  (Prisma 호출 + 트랜잭션 + 도메인 select)
   ↓
lib/prisma.ts  (글로벌 싱글톤, dev에서 쿼리 로깅)
   ↓
Supabase Postgres
```

- **`select`는 `types/{post,project,...}.ts`의 `*PublicSelection`에 모아둠** — 응답 모양을 라우트가 아니라 타입 파일에서 일원화.
- 에러는 [lib/errors.ts](lib/errors.ts)의 도메인 에러 클래스(`NotFoundError`, `BadRequestError`)로 throw → route에서 `instanceof`로 status 매핑.

### 인증 (두 갈래)

**주체별로 인증 방식이 분리**되어 있음. "사용자 = 로그인"이 아니라는 점에 주의.

1. **Supabase Auth — 성균융합원(관리자) 전용**
   - 일반 사용자는 회원가입/로그인 안 함. 관리자(성균융합원 운영진)만 Supabase에 계정을 가짐.
   - 보호 대상: 공지 게시판(`Post`) 작성/수정. 그래서 `proxy.ts` 매처가 `/posts/create`, `/posts/:id/edit`만 잡음 — 이 두 라우트가 사실상 "관리자 전용" 게이트.
   - 서버: [utils/supabase/server.ts](utils/supabase/server.ts) `getServerSupabase()` (RSC/Server Action용)
   - 브라우저: [utils/supabase/client.ts](utils/supabase/client.ts) `getClientSupabase()` (싱글톤)
   - 세션 갱신: [utils/supabase/middleware.ts](utils/supabase/middleware.ts) `updateSession()` ← `proxy.ts`에서 호출.
   - 로그인/회원가입/로그아웃 액션은 [actions/auth.ts](actions/auth.ts).
   - 새 관리자 전용 라우트 추가 시 → 반드시 `proxy.ts` 매처에 경로 추가해야 보호됨.

2. **프로젝트 비밀번호 — 일반 사용자(프로젝트 등록자) 본인 확인**
   - 학생/교수가 프로젝트를 등록할 때 직접 정한 비밀번호. 회원가입 없음, 프로젝트 단위로만 유효.
   - 등록 시 bcrypt 해시(`Project.passwordHash`)로 저장.
   - 클라이언트는 비밀번호를 [lib/projectPasswordManager.ts](lib/projectPasswordManager.ts)가 **AES-256-GCM으로 암호화한 HttpOnly 쿠키(`project_auth_<id>`)** 로 24h 보유, 수정/삭제·지원자 관리 요청 시 서버에서 복호화 → bcrypt 비교.
   - `PROJECT_ENCRYPTION_KEY`가 회전되면 모든 기존 쿠키 무효화됨(사용자는 비밀번호 재입력 필요).

### 디렉터리 컨벤션

- `app/<route>/_components/` — 해당 라우트 전용 클라이언트 컴포넌트(언더스코어 prefix로 라우팅 제외).
- `components/` — 라우트 간 재사용 컴포넌트(`Header`, `Footer`, `Home/*`, `Filter`, `Pagination`, `Project/*`, `Badge`).
- `components/ui/` — shadcn 원시 컴포넌트. `@/components`, `@/lib/utils`, `@/hooks` 별칭 사용 (`tsconfig.json` paths `@/*`).
- `services/` — DB 호출 + 도메인 로직. 라우트에서 Prisma 직접 호출 금지, 항상 services를 거침.
- `types/` — Prisma 모델 + zod 스키마 + 응답 `select` 묶음.
- `lib/` — 인프라성 헬퍼(Prisma, Supabase Storage, 이메일, 암호화, 에러, 경로 유틸).
- `hooks/` — `use-user`, `use-file`, `use-mobile` 같은 클라이언트 훅.
- `prisma/migrations/` — SQL 마이그레이션. 스키마 변경 시 항상 `prisma:migrate:dev`로 마이그레이션 파일 생성(push만 하지 말 것).

### 배포 환경

> ⚠️ **Preview와 Production이 같은 Supabase·Gmail 계정을 공유.** Vercel PR 프리뷰에서 만든 프로젝트/지원자/메일은 운영 데이터와 동일 인스턴스에 들어감. 파괴적 테스트는 반드시 로컬에서.

| 컴포넌트                      | 로컬 개발                                                                                                              | 프리뷰 (스테이징, PR 단위)                                              | 프로덕션 (main)                                                                                                                                                |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Web** (Next.js UI)          | `pnpm dev` → `http://localhost:3000`, Turbopack HMR                                                                    | Vercel preview deployment (PR마다 자동)                                 | Vercel production → [urp3team.vercel.app](https://urp3team.vercel.app)                                                                                         |
| **API** (Next route handlers) | 동일 프로세스 (`/api/*` on :3000)                                                                                      | 동일 배포의 `/api/*`                                                    | 동일 배포의 `/api/*`, OTel은 [instrumentation.ts](instrumentation.ts)가 자동 등록                                                                              |
| **DB** (Postgres)             | Supabase CLI(Docker) Postgres 17 @ `127.0.0.1:54322`, `pnpm dev:setup`이 reset+migrate+seed                            | **프로덕션 Supabase 공유**(project `obawzgmgtoqegrrpbzml`) ⚠️           | Supabase production (`obawzgmgtoqegrrpbzml`)                                                                                                                   |
| **Auth** (Supabase Auth)      | 로컬 Supabase Auth @ `:54321`, anon key는 `supabase status`로 매번 재발급                                              | 프로덕션 Supabase Auth 공유 ⚠️                                          | 프로덕션 Supabase Auth (성균융합원 관리자 계정 보관소)                                                                                                         |
| **Storage**                   | 로컬 Supabase Storage @ `:54321` ([lib/supabaseStorage.ts](lib/supabaseStorage.ts))                                    | 프로덕션 Storage 공유 ⚠️                                                | 프로덕션 Storage (첨부파일 영구 저장)                                                                                                                          |
| **Email** (Gmail SMTP)        | `.env.example` 더미 자격증명, [lib/email/index.ts](lib/email/index.ts)가 3회 재시도 후 `console.error`만 — 실제 발송 X | **프로덕션 Gmail 계정 공유** ⚠️ 프리뷰에서 흐름 트리거하면 실 메일 발송 | 동일 Gmail 계정, `ADMIN_EMAILS`로 keep-alive 실패 알림                                                                                                         |
| **Cron** (keep-alive)         | 안 돌아감                                                                                                              | 안 돌아감 (workflow가 production URL만 호출)                            | GitHub Actions `schedule: '0 * * * *'`가 매시 정각 production `/api/cron/keep-alive` 호출 ([supabase-keepalive.yml](.github/workflows/supabase-keepalive.yml)) |

Vercel project: `web` (team `upr3team`). MCP로 [.mcp.json](.mcp.json) 통해 세션에서 직접 조회 가능 (`mcp__vercel__*`, `mcp__supabase__*`).

### 외부 통합 / 운영

- **이메일**: [lib/email/index.ts](lib/email/index.ts) Gmail SMTP, 3회 재시도 후 `console.error`만 찍고 throw 안 함(앱 흐름은 계속됨). 템플릿은 [lib/email/templates.ts](lib/email/templates.ts).
- **Supabase keep-alive**: [.github/workflows/supabase-keepalive.yml](.github/workflows/supabase-keepalive.yml)가 매시 정각 [`/api/cron/keep-alive`](app/api/cron/keep-alive/route.ts) 호출, 실패 시 `ADMIN_EMAILS`로 알림. Supabase free tier inactive 방지용.
- **CI**: [.github/workflows/build-validation.yml](.github/workflows/build-validation.yml) — push/PR 시 `pnpm install --frozen-lockfile && prisma generate && next build`만 돌림(린트/테스트 X).
- **MCP**: [.mcp.json](.mcp.json)에 Supabase(project `obawzgmgtoqegrrpbzml`)와 Vercel(`upr3team/web`) HTTP MCP가 등록되어 있어 Claude Code 세션에서 즉시 사용 가능.

### ESLint 규칙 (커밋 전 통과 필수)

- Next 16 + ESLint 9 flat config(`eslint.config.mjs`).
- `import/order` 그룹 + 알파벳 정렬 강제, 그룹 간 빈 줄 필수.
- `react-hooks/exhaustive-deps`: **error** (warn 아님).
- `no-console`은 `warn`/`error`만 허용 — `console.log`는 lint 경고. `console.debug`/`console.error`로 쓰는 게 기존 패턴.
- 미사용 변수는 `_` prefix로만 무시 가능.
