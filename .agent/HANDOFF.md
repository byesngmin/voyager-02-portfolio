# Voyager-02 인수인계 문서 (HANDOFF)

> 다른 Windows PC에서 GitHub Desktop으로 이 저장소를 받아 즉시 이어 작업하기 위한 문서.
> 작업 재개 전 반드시 `git status`, `git log -5`로 최신 상태를 먼저 확인할 것 (이 문서에 커밋 해시를 고정하지 않음).

## 1. 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 이름 | Voyager-02 |
| 목적 | TRICKCAL PATIMA 시스템·콘텐츠 기획 지원 포트폴리오 (SPA) |
| 저장소 | https://github.com/byesngmin/voyager-02-portfolio.git |
| 작업 브랜치 | `ver-epid` |
| 배포 브랜치 | `master` |
| 공개 URL | https://byesngmin.github.io/voyager-02-portfolio/ |

## 2. 기술 스택

- React 19, React Router 7, Vite 7, TypeScript 5.8
- 콘텐츠: Markdown(`marked`) + YAML
- 배포: GitHub Pages (`.github/workflows/deploy.yml`, Node 24 기준 빌드)

## 3. GitHub Desktop 인수 절차

1. Clone (또는 로컬에 이미 있으면 File > Add Local Repository)
2. Repository > Fetch origin
3. Current Branch에서 `ver-epid` checkout
4. Repository > Pull origin
5. 변경사항 0건(clean) 확인
6. Repository > Open in Terminal
7. 터미널에서:
   ```
   npm ci
   npm run dev      # 로컬 확인 (http://localhost:5173/)
   npm run build     # tsc -b && vite build
   ```

## 4. 배포 절차

1. `ver-epid`에서 작업 → commit → push
2. GitHub Desktop에서 `master`로 checkout
3. Branch > Merge into current branch → `ver-epid` 선택
4. `master` push
5. GitHub Actions **"Deploy Portfolio"** 워크플로 성공(초록 체크) 확인
6. 충돌 발생 시 **강제 push 금지** — 충돌을 먼저 해결하거나 사용자에게 보고

## 5. 핵심 파일 및 역할

| 파일 | 역할 |
|---|---|
| `src/app/App.tsx` | 라우터/앱 루트 |
| `src/components/Layout.tsx` | 전체 레이아웃(헤더/네비/푸터) |
| `src/components/IntroGate.tsx` | 인트로(다시보기 포함) 게이트 |
| `src/routes/HomeRoute.tsx` | 홈 |
| `src/routes/ResumeRoute.tsx` | 이력서 |
| `src/components/SelfIntroPage.tsx` | 자기소개서 렌더링 |
| `src/routes/SelfIntroRoute.tsx` | 자기소개서 라우트 |
| `src/routes/ProjectsRoute.tsx` / `ProjectDetailRoute.tsx` | 프로젝트 목록/상세 |
| `src/routes/GameHistoryRoute.tsx` | 게임 이력 페이지 |
| `src/components/MarkdownPage.tsx`, `src/lib/content.ts` | 마크다운/YAML 콘텐츠 로딩 |
| `src/styles/global.css` | 전역 스타일(디자인 시스템) |
| `src/content/pages/*.md`, `src/content/projects/*.md` | 실제 콘텐츠 소스 |
| `.github/workflows/deploy.yml` | GitHub Pages 배포 워크플로 |

## 6. 현재 디자인 시스템

**VOYAGER MISSION UI** — 밝은 sky/ice 톤 + deep navy hero 대비.

- 포인트 컬러: cyan / violet / magenta / lime
- 모티프: radar, orbit, probe, waveform
- `prefers-reduced-motion` 대응 포함

## 7. 최근 반영된 상태 (최신 커밋 기준)

- 실제 이력서 사진 적용: `public/images/profile-hwang-seungmin.jpg`
- 개발 로그 공개 페이지와 진입점 제거, `/records`·`/devlog`·`/site-plan`은 홈으로 redirect (게임 이력은 유지됨)
- 인트로 다시보기 버튼 icon-only, 최소 2.25rem 이상 크기로 조정
- 자기소개서에 키워드 해시태그 추가

## 8. 콘텐츠 제약 (반드시 준수)

- "보이저 2호" 컨셉/제목 유지
- 서사 구조: 좌절 → 극복/성공
- 실제 경험만 사용 — **가상/허구 프로젝트 추가 금지**
- 이력서에 별점(역량 등급 별표시) 사용 금지
- AI 활용 역량 서술 시 반드시 "문제 정의 → 활용 → 검수 → 산출물" 흐름으로 기술
- 개인정보(이름, 사진 등)는 이미 공개 사이트에 게시되어 있음을 인지하고 다룰 것

## 9. 필수 QA 체크리스트

- [ ] `npm run build` 성공 (타입 에러 없음)
- [ ] 의도한 파일만 변경되었는지 diff 확인
- [ ] `/`, `/resume`, `/self-intro`, `/projects`, 프로젝트 상세 페이지 정상 렌더링
- [ ] `/records` → home redirect 동작 확인
- [ ] 데스크탑/모바일 반응형 확인
- [ ] 브라우저 콘솔 에러 0건
- [ ] 텍스트/배경 대비(contrast) 확인
- [ ] 이미지 정상 로드 확인 (특히 프로필 사진)

## 10. 알려진 경고 (Known Warnings)

- Mermaid 관련 large chunk 경고: 현재 빌드를 막지 않음 (비차단)
- `deploy.yml`의 앱 빌드는 Node 24 기준이지만, 일부 GitHub Actions가 Node 20 deprecation annotation을 낼 수 있음 — 현재 배포는 비차단

## 11. 금지 사항

- Credential / token / API key를 문서나 커밋에 기록하지 말 것
- `git push --force` 금지
- 이 저장소 외 다른 프로필/전역 설정 수정 금지
