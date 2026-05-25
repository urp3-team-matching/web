# URP3 팀 모집 플랫폼

성균관대학교 **URP Ⅲ형(융합연구학점제 / Undergraduate Research Program 3형)** 팀 모집 플랫폼 웹 프론트엔드 + API.

- 운영 사이트: [urp3team.vercel.app](https://urp3team.vercel.app)
- 프로그램 안내: [urp3.skku.edu](https://urp3.skku.edu/urp3/index.do)
- 운영: 성균관대학교 성균융합원 (`urp3@skku.edu`)

## 시작하기

```bash
cp .env.example .env
pnpm dev:setup   # Docker로 로컬 Supabase 스택 기동 + DB 초기화 + 시드
pnpm dev         # http://localhost:3000
```

자세한 셋업(anon key 발급, `PROJECT_ENCRYPTION_KEY` 등)은 [AGENTS.md → 로컬 환경 셋업](AGENTS.md#로컬-환경-셋업) 참고.

## 운영 메모

- **Supabase keep-alive**: GitHub Actions가 매시 정각 `/api/cron/keep-alive`를 호출해 Supabase 프로젝트가 inactive 되는 것을 방지. 실패 시 `ADMIN_EMAILS`(쉼표 구분)로 메일 알림. 수동 테스트는 Actions 탭 → "Supabase Keep-Alive" → "Run workflow" → "Debug mode" 체크 후 실행.
- **배포 환경**: Vercel preview는 production Supabase·Gmail 계정을 공유하므로 파괴적 테스트는 로컬에서만. 상세 매트릭스는 [AGENTS.md → 배포 환경](AGENTS.md#배포-환경).

## 기여

아키텍처, 도메인 모델, 인증 흐름, 디렉터리 컨벤션, ESLint 규칙 등 전체 가이드라인은 **[AGENTS.md](AGENTS.md)** 단일 문서에 정리되어 있습니다. 이 파일은 사람 기여자와 AI 코딩 에이전트(Claude Code, OpenAI Codex, Cursor 등) 모두가 참고합니다.
