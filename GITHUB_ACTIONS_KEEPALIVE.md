# GitHub Actions로 Supabase 일시중지 방지

## 개요

Supabase 프리티어는 일정 기간 활동이 없으면 프로젝트가 자동으로 일시중지됩니다. 이를 방지하기 위해 **GitHub Actions**의 무료 Cron 기능을 사용하여 정기적으로 데이터베이스 연결을 유지합니다.

## 💰 비용

- **완전 무료!** GitHub Actions는 public repository에서 무료로 사용 가능
- Private repository도 월 2,000분 무료 제공
- 6시간마다 실행 시 한 달에 약 120회 실행 (각 1분 미만 = 월 120분 미만 사용)

## 설정 방법

### 1. 파일 구성

다음 파일들이 생성되었습니다:

- **`.github/workflows/supabase-keepalive.yml`**: GitHub Actions workflow 파일
- **`/app/api/cron/keep-alive/route.ts`**: Keep-alive API 엔드포인트
- **`.env.example`**: 환경 변수 예시

### 2. GitHub Secrets 설정

GitHub Repository에서 Secret을 추가해야 합니다:

1. GitHub 저장소 페이지로 이동
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret** 클릭
4. 다음 Secret 추가:

```
Name: VERCEL_DEPLOYMENT_URL
Value: https://your-app.vercel.app
```

**Value 확인 방법:**

- Vercel 대시보드에서 프로젝트의 Production 도메인 확인
- 예: `https://urp3-web.vercel.app`

### 3. 배포

```bash
# 변경사항 커밋 및 푸시
git add .
git commit -m "feat: Add GitHub Actions cron for Supabase keep-alive"
git push
```

푸시하면 GitHub Actions가 자동으로 설정됩니다!

## 동작 방식

### 스케줄

- **실행 주기**: 6시간마다 (`0 */6 * * *`)
- **실행 시간**: 00:00, 06:00, 12:00, 18:00 (UTC)
- **한국 시간**: 09:00, 15:00, 21:00, 03:00 (KST)

### 실행 내용

1. Vercel에 배포된 `/api/cron/keep-alive` 엔드포인트 호출
2. API에서 3개 테이블(Project, Message, Applicant) 조회
3. 응답 시간 및 상태 로깅
4. 성공/실패 여부 확인

## 모니터링

### GitHub Actions 로그 확인

1. GitHub 저장소 페이지로 이동
2. **Actions** 탭 클릭
3. **Supabase Keep-Alive** workflow 선택
4. 실행 기록 확인

### 로그 출력 예시

**성공 시:**

```
🚀 Calling keep-alive endpoint...
📊 Response Status: 200
📝 Response Body:
{
  "message": "Supabase connection healthy",
  "timestamp": "2025-10-16T12:00:00.000Z",
  "duration": 245,
  "healthy": true,
  "operations": [...]
}
✅ Keep-alive successful!
⏰ Execution time: 2025-10-16 21:00:00 KST
```

**실패 시:**

```
❌ Keep-alive failed with status 500
```

## 수동 실행

필요할 때 수동으로 workflow를 실행할 수 있습니다:

1. GitHub 저장소 → **Actions** 탭
2. **Supabase Keep-Alive** workflow 선택
3. **Run workflow** 버튼 클릭
4. **Run workflow** 확인

## 로컬 테스트

배포 전 로컬에서 API를 테스트할 수 있습니다:

```bash
# 개발 서버 실행
pnpm dev

# API 호출
curl http://localhost:3000/api/cron/keep-alive
```

배포 후 테스트:

```bash
curl https://your-app.vercel.app/api/cron/keep-alive
```

## 스케줄 변경

`.github/workflows/supabase-keepalive.yml`에서 스케줄을 변경할 수 있습니다:

```yaml
on:
  schedule:
    - cron: "0 */4 * * *" # 4시간마다
```

**추천 스케줄:**

- `'0 */4 * * *'` - 4시간마다 (더 안전)
- `'0 */6 * * *'` - 6시간마다 (권장) ⭐
- `'0 */12 * * *'` - 12시간마다 (최소)

## 문제 해결

### Workflow가 실행되지 않는 경우

1. `.github/workflows/supabase-keepalive.yml` 파일이 main 브랜치에 있는지 확인
2. GitHub Actions가 활성화되어 있는지 확인 (Settings → Actions → General)
3. Repository가 최소 1회 이상 push되었는지 확인

### 404 Not Found 오류

- `VERCEL_DEPLOYMENT_URL` Secret 값이 올바른지 확인
- Vercel에 API 라우트가 배포되었는지 확인
- URL에 trailing slash(/)가 없는지 확인

### 500 Internal Server Error

- Supabase 프로젝트가 활성 상태인지 확인
- `NEXT_PUBLIC_SUPABASE_URL` 및 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 환경 변수 확인
- Vercel 배포 로그에서 에러 확인

### Workflow가 지정된 시간에 실행되지 않음

- GitHub Actions의 scheduled workflow는 정확한 시간에 실행되지 않을 수 있음
- 리소스 가용성에 따라 최대 15분 정도 지연될 수 있음
- 이는 정상적인 동작이며, keep-alive 목적에는 문제없음

## 비교: Vercel Cron vs GitHub Actions

| 항목            | Vercel Cron            | GitHub Actions      |
| --------------- | ---------------------- | ------------------- |
| **비용**        | Pro 플랜 필요 ($20/월) | 완전 무료 ⭐        |
| **실행 안정성** | 매우 정확              | 최대 15분 지연 가능 |
| **설정 난이도** | 쉬움                   | 쉬움                |
| **모니터링**    | Vercel 대시보드        | GitHub Actions 탭   |

## 장점

✅ **완전 무료** - Public/Private 모두  
✅ **설정 간단** - Secret 하나만 추가  
✅ **안정적** - GitHub의 인프라 사용  
✅ **모니터링 용이** - GitHub Actions 탭에서 확인  
✅ **수동 실행 가능** - 필요시 즉시 실행

## 참고 자료

- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [GitHub Actions - Schedule 이벤트](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule)
- [Supabase 프리티어 정책](https://supabase.com/docs/guides/platform/pricing)
