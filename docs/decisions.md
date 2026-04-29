# 주요 결정 기록

## Day 1–2 결정 (기존)

- 기술 스택: React + Vite + TypeScript
- 배포: GitHub Pages Actions
- 라우터: BrowserRouter + 404 fallback
- 콘텐츠 저장 방식: Markdown + frontmatter
- 인트로: 첫 방문 1회, 1.6초
- 페이지 전환: 300ms 내외
- 사이트 기획서 노출: 상단 메뉴 고정, 중간 시인성 (`/records` 통합)

## Day 3 결정 (v2 디자인 인계 반영, 2026-04-29)

- **회사별 신호 쿼리**: `?signal=<slug>` 도입. hero greeting + ProjectsRoute 정렬 변동. 잘못된 slug → 무시 + warn. 내부 `<Link>` 쿼리 보존.
- **CSS 토큰 확장**: `--bg-deep/base/raise`, spacing scale 1–10, `--shadow-lift`, `--glow-accent`, `--ease-out/in-out`, `--dur-fast/base/slow/intro` 추가. 기존 변수 변경 금지.
- **반응형 사이드바**: `<960px`에서 햄버거 → `<dialog>` 풀스크린 시트. focus trap + ESC 닫기.
- **모바일 Hero**: `<640px`에서 voyager-panel 80×80 강등, CTA 버튼 풀폭 stack.
- **ProjectDetail 구조**: 본문 권장 6블록 (Overview → Story–System Link → Problem → Approach → Outcome → Learning). 상단 메타카드 + 하단 CTA.
- **SkillMatrix**: 이력서 페이지에 신규 도입. 5칸 모노스페이스 게이지 (`▰▰▰▰▱`). Resume frontmatter에 `skills[]` 슬롯 추가.
- **Toast + ContactBlock**: 이메일 클립보드 복사 + `role="status"` 토스트.
- **인쇄 스타일**: `@media print` 다크 배경 제거, 카드 흰 배경, 링크 URL 표시.
- **IntroGate a11y**: `aria-busy="true"` + main `inert`, 종료 시 H1 포커스.
- **라우트 변경 안내**: `<div role="status" aria-live="polite">` 스크린리더 안내 추가.
- **한국어 줄바꿈**: `word-break: keep-all; line-break: strict` 본문 전체 적용.
- **고유명사 마크업**: `<span class="proper-noun">` (기존 `<strong>` 패턴 대체).
- **reduced-motion 전역 가드**: `animation-duration/transition-duration: 0ms !important` 미디어쿼리 global.css 끝에 고정.
- **성능 예산**: FCP < 1.5s (3G fast), 이미지 WebP + lazy, `font-display: swap`.
