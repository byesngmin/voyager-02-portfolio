# Voyager-02 포트폴리오 — Claude Design 인계문서 v2

> **작성일** 2026-04-29 · **버전** v2.0 (v1 디자인 시스템 연구 + Voyager-02 Day 1–2 기획 통합본)
> **대상** Codex (소스 파일 편집), claude-code (오케스트레이터), 사용자 검토
>
> **이 문서의 위치** — Voyager-02 프로젝트는 이미 React 19 + Vite 7 + TypeScript 스택 위에서 라우트·콘텐츠 로더·인트로 게이트까지 구현되었습니다. 본 문서는 그 위에 *Day 3에서 마감해야 하는 디자인 결정*을 채우는 명세입니다. 기존 결정은 존중하고, 미정/미완 영역에만 새로운 명세를 추가했습니다.

---

## 0. 통합 매핑 (v1 연구 ↔ Voyager-02 기존 결정)

| 영역 | Voyager-02 기존 | v1 연구 보강 | v2 최종 |
|---|---|---|---|
| 콘셉트 | 보이저 2호 메타포, 우주 탐사 로그 | 회사별 인사말 컨텍스트(`?company=`) | **메타포 유지** + `?signal=` 쿼리 도입 (회사별 미션 로그 어조) |
| 스택 | React 19 / Vite / TS / RR7 | (Vanilla 가정 폐기) | **기존 그대로** |
| 라우팅 | `/`, `/resume`, `/self-intro`, `/projects`, `/projects/:slug`, `/game-history`, `/records` | 단일 페이지 + 해시 (폐기) | **기존 라우트 유지** |
| 컬러 | 다크, `#7ff4ff`/`#ffca6f`/`#ff8760` 액센트 | 라이트 톤 (폐기) | **다크 유지** + 토큰 명세화 + 라이트 폴백은 인쇄용에만 |
| 타이포 | Orbitron + Noto Sans KR | Pretendard + Inter (폐기) | **기존 유지**, 스케일 토큰만 명문화 |
| 모션 | 인트로 1.6s, 라우트 300ms | 강도 4/10, reduced-motion | **기존 + 모션 예산표 추가** |
| 케이스 스터디 | `core_experience` / `story_system_link` / `contribution[]` | 5단(Problem→Outcome→Learning) | **기존 frontmatter 유지** + 본문 권장 6블록 정의 |
| 명세 | (산재) | 컴포넌트 명세 / 토큰 / 와이어 | **본 문서로 통합** |

---

## 1. 디자인 원칙 (Voyager-02 Edition)

| # | 원칙 | 의미 |
|---|---|---|
| P1 | **서사가 시스템을 끈다** | 모든 화면은 "왜 이 콘텐츠가 여기 있는가"의 짧은 문장(eyebrow/lead)을 먼저 보여줌. 카드는 미끼, 본문이 본체. |
| P2 | **우주 탐사는 메타포지 장식이 아니다** | 행성·신호·궤도 같은 어휘는 *정보 위계의 이름*으로만 사용. 별 반짝임·우주선 SVG 같은 장식은 hero 1구간에만 절제 사용. |
| P3 | **다크는 깊이로 만든다** | 단일 검정이 아니라 deep-navy → ink → black의 3단 그라디언트 + radial 성운. 카드는 항상 +1 단계 밝은 surface. |
| P4 | **타이포가 80% 한다** | Orbitron은 헤딩·라벨·EYEBROW에만. 본문은 항상 Noto Sans KR. 헤드라인은 clamp로 반응형. |
| P5 | **회사별 신호 (`?signal=`)** | 쿼리로 hero 인사말·featured 프로젝트 정렬·미션 카피 변동. 미파라미터 시 default. |
| P6 | **모션은 안내, 장식 아님** | 인트로 1.6s 1회, 라우트 300ms pulse, hover 미세 lift. reduced-motion 시 모두 0ms. |
| P7 | **모든 정보는 행동 가능** | 메일·전화·외부링크는 한 클릭. 케이스 스터디 끝에는 항상 다음 행동 (다른 프로젝트 / 연락 / 레코드). |
| P8 | **인쇄에서도 살아남는다** | hero 장식·인트로·다크배경 모두 인쇄 시 제거. 본문은 흰 배경 검정 글씨로 폴백. |

---

## 2. 정보 아키텍처

### 2.1 라우트 (기존 + 보강)

```
/                  HomeRoute        Hero + Featured 프로젝트 + 하이라이트 + 퀵링크
/resume            ResumeRoute      이력서 (Markdown)
/self-intro        SelfIntroRoute   자기소개서 (Markdown)
/projects          ProjectsRoute    카드 그리드 (필터: 전체/내러티브/시스템/라이브)
/projects/:slug    ProjectDetail    케이스 스터디 (Markdown + frontmatter)
/game-history      GameHistoryRoute 영향받은 게임 타임라인
/records           RecordsRoute     사이트 기획서 + 개발 로그 통합
/site-plan         → /records (기존 리다이렉트 유지)
/devlog            → /records (기존 리다이렉트 유지)
*                  NotFoundRoute    "이 좌표에는 신호가 없습니다"
```

### 2.2 쿼리 컨벤션 — `?signal=<slug>`

기존 v1 연구의 `?company=`를 Voyager 어휘로 번역.

```ts
// src/lib/signals.ts (신규)
export const SIGNALS = {
  webzen:  { name: '웹젠',   greeting: '웹젠 미션 컨트롤로부터 신호를 수신했습니다',   emphasis: ['narrative','liveops'] },
  ncsoft:  { name: 'NCSOFT', greeting: 'NCSOFT 미션 컨트롤로부터 신호를 수신했습니다', emphasis: ['system','rpg'] },
} as const;
```

- 동작: hero greeting 교체, ProjectsRoute 정렬에서 emphasis 태그 가진 프로젝트 우선
- 잘못된 slug → 무시 + `console.warn`, 모든 내부 `<Link>`는 useSearchParams로 쿼리 보존
- URL 예: `/?signal=webzen` → `/projects?signal=webzen` 클릭 시 쿼리 유지

### 2.3 화면 흐름 (HomeRoute 수직 위계)

```
┌─ IntroGate (1.6s, 첫 방문 1회만) ─────────────────────────┐
└────────────────────────────────────────────────────────────┘
┌─ Hero (≥80vh) ────────────────────────────────────────────┐
│  EYEBROW: TRANSMISSION 042 · 2026                         │
│  H1: 스토리텔링과 시스템으로 몰입을 설계합니다              │
│  Lead: <signal greeting | default>                        │
│  Voyager-panel (행성/궤도 SVG)                            │
│  CTA: [프로젝트 탐사 →] [이력서 다운로드]                  │
└────────────────────────────────────────────────────────────┘
┌─ Mission Quote (signal-quote) ────────────────────────────┐
┌─ Highlights (signal-card × 3) ────────────────────────────┐
┌─ Featured Projects (project-card × 1–3, featured:true) ──┐
┌─ Quick Links (planet-card × 4) ───────────────────────────┐
```

---

## 3. 디자인 토큰 — `src/styles/global.css`

기존 변수 체계 유지하고 누락분 추가. **수정/추가 항목만** 표시.

### 3.1 컬러 (기존 + 보강)

```css
:root {
  /* 기존 유지 */
  --accent: #7ff4ff; --accent-warm: #ffca6f; --accent-hot: #ff8760;
  --text: #e6eef6; --text-muted: rgba(230,238,246,0.72);
  --border: rgba(150,198,255,0.20); --surface: rgba(10,18,31,0.78);
  --surface-strong: rgba(8,15,27,0.94);

  /* v2 신규 */
  --bg-deep:       #03060f;
  --bg-base:       #07101f;
  --bg-raise:      #0d1830;
  --text-faint:    rgba(230,238,246,0.45);
  --border-strong: rgba(150,198,255,0.36);
  --focus:         var(--accent);
  --link:          var(--accent);
  --danger:        var(--accent-hot);
  --success:       #7be8a4;
}
```

### 3.2 타이포 (기존 유지 + 추가)

```css
:root {
  /* 기존 clamp 스케일 유지 */
  --lh-tight: 1.1; --lh-snug: 1.25; --lh-base: 1.6; --lh-loose: 1.8;
  --ls-eye: 0.2em; --ls-tight: -0.02em;
  --font-display: 'Orbitron', system-ui, sans-serif;
  --font-body:    'Noto Sans KR', system-ui, -apple-system, sans-serif;
  --font-mono:    'JetBrains Mono', ui-monospace, monospace;
}
```

### 3.3 간격 / 라운딩 / 그림자 / 이징

```css
:root {
  --sp-1:0.25rem; --sp-2:0.5rem; --sp-3:0.75rem; --sp-4:1rem;
  --sp-5:1.5rem;  --sp-6:2rem;   --sp-7:3rem;    --sp-8:4rem;
  --sp-9:6rem;    --sp-10:9rem;

  --r-sm:0.5rem; --r-md:1rem; --r-lg:1.5rem; --r-pill:999px;

  --shadow:      0 24px 60px -28px rgba(0,0,0,0.8), 0 8px 24px -12px rgba(0,0,0,0.5);
  --shadow-lift: 0 36px 80px -28px rgba(0,0,0,0.9), 0 12px 32px -10px rgba(0,0,0,0.6);
  --glow-accent: 0 0 0 1px rgba(127,244,255,0.35), 0 0 24px -4px rgba(127,244,255,0.45);

  --ease-out:    cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-fast: 150ms; --dur-base: 300ms; --dur-slow: 600ms; --dur-intro: 1600ms;
}
```

### 3.4 컨테이너·브레이크포인트

```
sm  <640    1열
md  640–960  2열
lg  ≥960    본문 + 사이드바 (clamp(14rem,20vw,17rem))
```

---

## 4. 컴포넌트 명세

### 4.1 IntroGate (기존 + 보강)
- 1600ms, sessionStorage 1회, reduced-motion 즉시 dismiss
- **추가**: `aria-busy="true"` 동안 main `inert`, 종료 시 H1 포커스 이동

### 4.2 Layout
- **사이드바**: `<lg`에서 햄버거 → `<dialog>` 풀스크린 시트, focus trap, ESC 닫기
- `NavLink` → `aria-current="page"`, `.is-active`

### 4.3 RouteTransition (기존 + 보강)
- `<div role="status" aria-live="polite" class="sr-only">` 라우트 변경 안내 추가

### 4.4 HeroBlock (`.home-hero`)
- 구조: `[eyebrow][h1][lead(signal-aware)][voyager-panel][CTA×2]`
- 모션: 텍스트 줄별 stagger fade-up (60ms 간격, 600ms ease-out)
- `<md`: voyager-panel 80×80 작은 SVG로 강등, CTA 풀폭 stack

### 4.5 SignalCard (`.signal-card`)
- Props: `index, title, description, tags?, accent?`
- hover: `translateY(-2px)` + `--border-strong` + glow
- 그리드: lg=3열, md=2열, sm=1열

### 4.6 PlanetCard (`.planet-card`)
- lg=4열, md=2열, sm=1열

### 4.7 ProjectCard (`.project-card`)
- Featured 카드: lg에서 가로 2배 expand
- 표시: thumbnail → badge → title → core_experience(강조) → role · period

### 4.8 ProjectDetail — 권장 6블록

```md
## Overview
## Story–System Link   <!-- frontmatter story_system_link 강조 인용 -->
## Problem
## Approach
## Outcome
## Learning
```

상단 메타 카드: `role · period · core_experience`. 하단 CTA: 다음 프로젝트 / 목록 / Records.

### 4.9 TimelineCard (`.timeline-card`)
- 좌측 세로 라인 + dot + [year — title — influence + tags]

### 4.10 SkillMatrix (신규 — Resume 페이지)
- 게이지: 모노스페이스 5칸 `▰▰▰▰▱`

### 4.11 공통 프리미티브

| 클래스 | 용도 |
|---|---|
| `.btn`, `.btn--primary`, `.btn--ghost` | 버튼 3종 |
| `.tag` | pill 칩 |
| `.badge` | 카테고리 표시 |
| `.toast` | `role="status"` 우상단 슬라이드인 |

---

## 5. 모션 예산 (강도 4/10)

| 트리거 | 효과 | 시간 | 토큰 |
|---|---|---|---|
| IntroGate | 페이드 아웃 | 1600ms | --dur-intro |
| 라우트 전환 | scroll + pulse | 300ms | --dur-base |
| 섹션 진입 | fade + 8px translateY | 400ms | — |
| 카드 hover | translateY(-2px) + shadow-lift | 200ms | --dur-fast |
| 썸네일 hover | scale(1.03) | 300ms | --dur-base |
| reduced-motion | 모두 0ms | — | — |

---

## 6. 반응형 마감 (Day 3 우선과제)

### 그리드 단계

| 영역 | lg | md | sm |
|---|---|---|---|
| signal-card | 3열 | 2열 | 1열 |
| planet-card | 4열 | 2열 | 1열 |
| project-card | 3열(featured 2칸) | 2열(featured 2칸) | 1열 |
| timeline-card | 1열 좌측 라인 | 1열 | 1열 |

- 터치 타깃: 모든 인터랙티브 ≥44×44, 사이드바 링크 ≥48 높이

---

## 7. 콘텐츠 데이터 모델 (frontmatter 표준)

### 7.1 Project (기존 확장)

```yaml
tags:     [narrative, system, puzzle]   # 신규 optional
```

### 7.2 GameHistory (기존 확장)

```yaml
year:     2019
hours:    42                            # 신규 optional
influence: 한 줄 설명
tags:     [narrative, exploration]      # 신규 optional
```

### 7.3 Devlog (기존 확장)

```yaml
day:     3                              # 신규 optional
summary: 한 줄                          # 신규 optional
tags:    [release, motion]              # 신규 optional
```

### 7.4 Resume (신규 제안)

```yaml
profile:
  name: 홍길동
  role: 게임 콘텐츠 기획자
  yearsOfExp: 5
  location: 서울
contact:
  email: name@example.com
  links:
    - { label: GitHub, href: https://... }
skills:
  - category: 내러티브
    items:
      - { label: 인터랙티브 스토리, level: 5 }
experience:
  - period: { start: '2023-05', end: null }
    company: 스튜디오 A
    role: 시니어 콘텐츠 기획자
    bullets: ['…']
    tags:    [narrative, liveops]
education:
  - { year: 2018, name: OO대학교 게임공학과 }
awards:
  - { year: 2024, name: 사내 우수 기획자상, issuer: 스튜디오 A }
```

---

## 8. 규약 — `agentmanager/conventions-design.md` 참조

§8 전체 내용은 `agentmanager/conventions-design.md`에 분리 보관.

---

## 9. Day 3 실행 시퀀스 (Codex 위임 순서)

각 단계는 `agentmanager/taskboard.md` Pending에 등록됨. 배치 ID `B-20260429-01` 기준.

| Worker | Task | 파일 |
|---|---|---|
| B-01 | CSS 토큰 보강 (§3.1 §3.3) | `src/styles/global.css` |
| B-02 | 반응형 사이드바 (햄버거 + dialog) | `src/components/Layout.tsx`, `src/styles/global.css` |
| B-03 | 그리드 반응형 §6 | `src/styles/global.css` |
| B-04 | Hero 반응형 (panel 강등, CTA stack) | `src/styles/global.css`, `src/routes/HomeRoute.tsx` |
| B-05 | IntroGate a11y (aria-busy, inert, focus) | `src/components/IntroGate.tsx` |
| B-06 | `?signal=` 시스템 | `src/lib/signals.ts` (신규), `src/routes/HomeRoute.tsx`, `src/routes/ProjectsRoute.tsx` |
| B-07 | Resume frontmatter 확장 + SkillMatrix | `src/content/pages/resume.md`, `src/routes/ResumeRoute.tsx`, `src/styles/global.css` |
| B-08 | ProjectDetail 6블록 렌더 + 메타카드 + CTA | `src/routes/ProjectDetailRoute.tsx`, `src/styles/global.css` |
| B-09 | Toast + ContactBlock (이메일 복사) | `src/components/Toast.tsx` (신규), `src/components/ContactBlock.tsx` (신규), `src/styles/global.css` |
| B-10 | 인쇄 스타일 (@media print) | `src/styles/global.css` |
| B-11 | reduced-motion 가드 전체 검토 | `src/styles/global.css`, `src/components/IntroGate.tsx` |
| B-12 | 최종 QA (키보드, 색대비, 모바일, 라이트하우스) | — |

---

## 10. 미정 / 사용자 결정 필요

- [ ] 실제 이름·연락처·외부 링크
- [ ] `?signal=` 회사 slug 목록 확정
- [ ] 프로젝트 미디어 실제 URL
- [ ] 이력서 실제 경력 데이터
- [ ] OG 이미지 1장 (1200×630)
- [ ] voyager-panel SVG — 신규 제작 or placeholder 유지

---

*v2.0 · 2026-04-29 · v1 디자인 연구 + Voyager-02 Day 1–2 결정 통합본*
