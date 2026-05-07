# 시각 언어 & 우주 레퍼런스 리서치 — 구현 디테일 중심

작성일: 2026-05-07

## 전제

- 이 문서는 웹에서 확인된 사실을 `[공개]`, 페이지/설명에서 읽히는 구조를 `[관측]`, 현재 저장소 스택에 맞춘 번역안을 `[제안]`으로 구분한다.
- NASA/ESA의 공개 앱 다수는 JS-heavy라 크롤링된 HTML에서 실제 CSS 토큰이 충분히 노출되지 않았다. 따라서 **정확한 헥스/폰트명이 공개 문서에 있는 경우만 측정값으로 적고**, 나머지는 재현 가능한 구현값으로 제안한다.
- 현재 저장소의 기존 토큰은 이미 우주 계열에 맞다.
  - `--bg-deep: #03060f`
  - `--bg-base: #07101f`
  - `--bg-raise: #0d1830`
  - `--surface: rgba(10, 18, 31, 0.78)`
  - `--surface-strong: rgba(8, 15, 27, 0.94)`
  - `--accent: #7ff4ff`
  - `--accent-warm: #ffca6f`
  - `--border: rgba(150, 198, 255, 0.20)`
  - `--font-display: "Orbitron", system-ui, sans-serif`
  - `--font-body: "Noto Sans KR", system-ui, sans-serif`

## 0. 결론 먼저

- NASA/ESA 계열 UI의 핵심은 "거대한 비주얼"이 아니라 `단일 시점의 시각화 + 고밀도 수치 패널 + 단계형 진행 구조`다.
- 공개 SF HUD UI의 핵심은 `1px~2px 선`, `작은 모노 레이블`, `절제된 2색 포인트`, `노치/대시/reticle` 조합이다.
- Active Theory, Resn 류 scrollytelling은 공개 근거상 **CSS scroll-driven animation보다 JS 오케스트레이션 쪽**이 더 강하다. 기본은 `IntersectionObserver`, 향상은 `@supports (scroll-timeline: ...)`가 안전하다.
- 이 저장소에 바로 맞추려면 `Orbitron`은 챕터 코드/eyebrow/숫자 헤드라인에만 쓰고, 본문은 계속 `Noto Sans KR`, 수치 패널은 `JetBrains Mono` 같은 모노를 보조로 쓰는 편이 안정적이다.

## 1. NASA / ESA 공식 미션 페이지의 시각 언어

### 1-1. 공식 소스에서 바로 확인되는 값

| 소스 | 확인 가능한 값 | 해석 |
| --- | --- | --- |
| NASA Brand Guidelines / Horizon Design System | `[공개]` Web apps에서 `Inter`(large display/headlines), `Public Sans`(body copy), `DM Mono`(large numbers, small UI labels) 사용 | 브랜드형 감성보다 **정보 위계**를 폰트만으로 분리한다. 숫자와 라벨을 별도 계층으로 다루는 점이 중요 |
| NASA DSN Now | `[공개]` 실시간 상태를 `5초`마다 갱신. `antenna / spacecraft / Earth`의 `3개 뷰` 제공 | 구조적으로는 "주 시각화 1개 + 토글 1열 + 보조 데이터 패널" 패턴 |
| NASA Eyes | `[공개]` 브라우저에서 태양계/우주선/위성 데이터를 3D 시뮬레이션으로 탐색 | 실시간/준실시간 데이터 시각화가 중심이며, 장식보다 위치 정보와 관측 상태가 우선 |
| JWST Where is Webb | `[공개]` 진행 표시를 `DAYS`와 `DISTANCE` 두 축으로 전환. `30 days` timeline, `29.5 days` 부근 L2 진입, 모바일 `500px` 미만에서는 temperature plots 숨김 | 같은 미션 진행을 `시간 축`과 `공간 축`으로 이중 표현하는 것이 핵심 |
| JPL Stellar | `[공개]` "information dense applications in spacecraft operations"용 웹 디자인 시스템 | 우주/관제 UI를 정적 웹으로 축약할 때 가장 직접적인 구현 참고점 |
| ESA Estrack / NOC | `[공개]` 코어 네트워크 `6 stations in 6 countries`, 연간 `15,000+` tracking hours, `99%+` availability, NOC `365 days/year` 교대 운영 | ESA 쪽은 NASA보다 더 운영실형이고, 정적 포트폴리오로 번역하면 패널 밀도와 상태 전환 규칙을 우선해야 함 |

### 1-2. 페이지별 구조 문법

#### NASA Eyes on the Solar System

- `[공개]` Eyes는 미션을 3D 공간에서 위치, 궤도, 카메라 시점 중심으로 보여준다.
- `[관측]` 이 UI의 핵심은 "패널"보다 `캔버스 우선 구조`다.
  - 중심: full-viewport 3D scene
  - 주변: 최소 조작 패널
  - 하단/측면: 객체 선택, 시점/시간 변경
- `[제안]` 정적 포트폴리오로 줄일 때는 3D를 그대로 들고 오지 말고 아래 4개만 남기면 된다.
  1. 큰 메인 비주얼 1개
  2. 현재 챕터의 좌표/시점/날짜 3종 KPI
  3. 궤적 line 또는 node rail 1개
  4. 좌우 패널 대신 카드 2~3개

#### JWST Tracker / Where is Webb

- `[공개]` 공식 페이지는 진행을 `DAYS`와 `DISTANCE` 기준으로 전환한다.
- `[관측]` 이건 스토리 챕터 UI에 거의 그대로 번역 가능하다.
  - `DAYS` = 서사 시간
  - `DISTANCE` = 성취 누적량 또는 프로젝트 범위
- `[관측]` 페이지는 "현재 상태 1개"를 크게 보여주고, 나머지는 수치/단계/설명으로 보조한다.
- `[제안]` 포트폴리오에서는 `MODE: TIME / ROUTE` 토글로 바꾸면 된다.
  - `TIME`: 입사 준비 여정, 프로젝트 기간, 학습 곡선
  - `ROUTE`: 문제 정의 -> 설계 -> 구현 -> 운영 -> 회고

#### NASA DSN Now

- `[공개]` `5초` 갱신과 `3개 뷰`라는 숫자가 중요하다.
- `[관측]` 이 UI의 리듬은 실시간성보다 `운영실 모니터`에 가깝다.
  - 크고 화려한 영웅 이미지가 아니라
  - 좁은 패널, 짧은 라벨, 빠른 시선 이동이 핵심
- `[제안]` 챕터 진행 UI에 적용할 때는 아래 구조가 적합하다.
  - 상단: 현재 챕터 코드 + 상태 텍스트
  - 좌측: progress rail
  - 우측: 현재 챕터의 KPI 3개
  - 하단: event log 4~6줄

#### ESA Operations

- `[공개]` 이번 검색에서는 `operations.esoc.esa.int` 계열 UI의 실제 CSS 토큰은 공개 HTML에서 확보하지 못했다.
- `[공개]` 다만 공개 설명만으로도 구조적 수치는 충분히 잡힌다.
  - Estrack core network: `6 stations in 6 countries`
  - typical support: `15,000+ hours/year`
  - service availability: `99%+`
  - deep-space antennas: `35 m`
  - Network Operations Centre: `365 days/year` shift operation
- `[관측]` 즉 ESA 톤은 "미래 감성"보다 "고신뢰 운용실" 쪽에 가깝다.
- `[제안]` NASA보다 더 절제된 방향으로 가져가는 편이 맞다.
  - 광원 효과/글로우를 줄이고
  - 선 두께는 `1px`
  - 강조색은 청록 1색 + 경고색 1색으로 제한

### 1-3. 이 언어를 정적 웹 UI로 축약할 때 남겨야 할 것

#### 남겨야 할 핵심

- `단일 주 시각화`
  - 행성/우주선 자체보다 "현재 위치"나 "진행률"이 읽히는 이미지가 낫다.
- `작은 숫자 패널`
  - 카드 3개면 충분하다.
  - 예: `CHAPTERS`, `YEARS`, `SYSTEMS`, `DEPLOYMENTS`
- `단계형 rail`
  - 원형 orbit보다 세로 rail이 반응형과 접근성에서 낫다.
- `짧은 레이블`
  - `MISSION`, `STATUS`, `SIGNAL`, `ROUTE`, `WINDOW` 같은 1단어 라벨이 어울린다.

#### 버려도 되는 것

- 실시간 3D 카메라 조작
- 과도한 parallax
- 장식성 grid overpaint
- 텍스트보다 앞서는 particle layer

### 1-4. 현재 스택용 번역 규격

- `[제안]` 폰트 역할 분리
  - `Orbitron`: 챕터 코드, KPI 제목, eyebrow
  - `Noto Sans KR`: 본문, 설명, 긴 문장
  - `JetBrains Mono` 또는 시스템 모노: 수치, 좌표, 짧은 telemetry
- `[제안]` 권장 수치
  - eyebrow: `11px ~ 12px`, `letter-spacing: 0.18em ~ 0.22em`, `text-transform: uppercase`
  - KPI 숫자: `20px ~ 28px`, `font-weight: 700`
  - 카드 padding: `16px ~ 20px`
  - 카드 gap: `8px ~ 12px`
  - 패널 border: `1px solid rgba(150, 198, 255, 0.20)`
  - 강한 border: `1px solid rgba(150, 198, 255, 0.36)`

## 2. No Man's Sky Galactic Atlas / SpaceX ISS Simulator 계열 SF HUD UI

### 2-1. SpaceX ISS Docking Simulator에서 읽히는 구현 포인트

- `[공개]` 공식 가이드에서 확인되는 수치/의미
  - `TRANSLATE`는 좌측 조작
  - `ROTATE`는 우측 조작
  - 초록 숫자는 `required corrections`
  - 파란 숫자는 `rate`
  - 도킹 정렬 기준은 각 축 `less than 0.2`
  - 거리 `5m` 이하에서는 `RATE < -0.2 m/s`
- `[관측]` 이 UI는 "중앙 reticle + 양측 조작 패널 + 상단 계기 + 상태색"으로 작동한다.
- `[관측]` 즉, SF HUD 느낌의 절반은 복잡한 3D보다 **정렬 기준을 숫자/색으로 설명하는 방식**에서 온다.

### 2-2. No Man's Sky Galactic Atlas 계열에서 읽을 수 있는 공용 패턴

- `[공개]` Hello Games는 `NEXT` 시점에 Galactic Atlas를 공식 웹으로 열었다.
- `[관측]` Galactic Atlas 계열 UI는 보통 아래 문법을 공유한다.
  - 어두운 우주 배경 위에 밝은 node/route
  - faction, economy, 발견 상태를 작은 라벨로 병기
  - 전체 지도와 현재 선택 패널을 분리
  - "행성 이미지"보다 "좌표/발견 상태/연결 관계"를 더 강조
- `[제안]` 챕터 진행 UI로 옮길 때는 "섹션 간 연결선"을 route처럼 다루면 된다.

### 2-3. 재현 가능한 CSS 패턴

#### 1. clip-path 노치 패널

```css
.hud-panel {
  --notch: 12px;
  position: relative;
  padding: 18px;
  background: var(--surface-strong);
  border: 1px solid rgba(127, 244, 255, 0.24);
  clip-path: polygon(
    0 0,
    calc(100% - var(--notch)) 0,
    100% var(--notch),
    100% 100%,
    var(--notch) 100%,
    0 calc(100% - var(--notch))
  );
}

.hud-panel::before {
  content: "";
  position: absolute;
  inset: 6px;
  border: 1px solid rgba(127, 244, 255, 0.14);
  pointer-events: none;
  clip-path: inherit;
}
```

- `[제안]` 노치 크기는 `10px ~ 14px`가 가장 무난하다.
- `[제안]` 모바일에서는 `8px`까지 줄이지 않으면 텍스트 면적이 과하게 깎인다.

#### 2. dashed / segmented border

```css
.hud-panel--dashed {
  border: 1px dashed rgba(127, 244, 255, 0.28);
}

.hud-divider {
  height: 1px;
  background:
    repeating-linear-gradient(
      90deg,
      rgba(127, 244, 255, 0.36) 0 8px,
      transparent 8px 14px
    );
}
```

- `[관측]` SF HUD는 종종 실선 하나보다 "끊긴 선"이 더 기계적으로 보인다.
- `[제안]` dashed는 border 전체보다 `divider`, `meter`, `reticle ring`에 쓰는 편이 덜 촌스럽다.

#### 3. 모노스페이스 라벨 배치

```css
.hud-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font: 700 11px/1 "Orbitron", system-ui, sans-serif;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
}

.hud-value {
  font: 600 14px/1.2 var(--font-mono, "JetBrains Mono", ui-monospace, monospace);
  color: var(--text);
}

.hud-kpi {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 6px 12px;
}
```

- `[제안]` `Orbitron`을 본문까지 늘리지 말고 라벨까지만 자르는 것이 중요하다.
- `[제안]` 수치 문자열은 고정폭이 훨씬 잘 읽힌다.

### 2-4. React + CSS custom properties 환경에서 특히 잘 맞는 패턴

- `theme-by-chapter`
  - 섹션 루트에 `data-theme="cyan|amber|warning"`를 주고 CSS 변수만 바꾼다.
- `reticle / route / meter`
  - DOM보다 `SVG stroke-dasharray`가 유리하다.
- `panel density control`
  - `--panel-padding`, `--panel-border`, `--panel-glow-alpha` 같은 밀도 변수를 두면 A/B 조정이 쉽다.

```css
:root {
  --hud-cyan: #7ff4ff;
  --hud-amber: #ffca6f;
  --hud-success: #7be8a4;
  --hud-blue: #78a6ff;
  --hud-line: rgba(127, 244, 255, 0.24);
  --hud-line-strong: rgba(127, 244, 255, 0.44);
  --hud-glow: 0 0 20px rgba(127, 244, 255, 0.18);
}
```

- `[제안]` 위 값은 현재 저장소 토큰과 충돌 없이 바로 얹을 수 있는 최소 확장이다.

## 3. Active Theory / Resn 류 scrollytelling의 구현 방식

### 3-1. 찾은 근거

#### Active Theory

- `[공개]` refs.gallery 분석 기준
  - 배경색 `#0B0B0B`
  - `Monument Grotesk` 계열 XXL 타이포
  - `12-column grid`
  - 포인트 컬러 `#A970FF`
  - hover 시 인접 타일이 `2px` 내려가며 trailer가 bloom
  - video는 lazy-load, `requestIdleCallback` 이후 초기화
  - `prefers-reduced-motion` 지원
- `[공개]` WebGPU showcase 기준
  - Hydra 위에서 빌드
  - 실시간 파티클
  - Draco 압축 mesh
  - LCP 약 `1.3s` desktop
- `[관측]` 공개 근거상 이들은 CSS `scroll-timeline`보다는 JS state + WebGL 연출에 훨씬 무게가 있다.

#### Resn

- `[공개]` refs.gallery 분석 기준
  - deep-ink 배경
  - GSAP easing
  - PJAX-style 전환
  - WebGL shader smear
  - texture / shader boot는 지연 로딩
  - `prefers-reduced-motion`과 키보드 탐색 고려
- `[관측]` Resn도 공개 정보상 CSS scroll-driven animation보다 JS orchestration 흔적이 강하다.

### 3-2. scroll-driven animation 사용 여부 판단

- `[관측]` 이번 검색에서 Active Theory / Resn이 `scroll-timeline`, `view-timeline`, `animation-range`를 실제 프로덕션에 쓴다는 1차 근거는 찾지 못했다.
- `[관측]` 반대로, 공개된 기술 설명은 `WebGL`, `GSAP`, `lazy loading`, `idle callback`, `routing transition`에 집중되어 있다.
- `[결론]` 이 계열은 현재도 대체로 아래 순서로 보는 것이 맞다.
  1. 섹션 감지: `IntersectionObserver`
  2. 전환 orchestration: JS state / animation lib
  3. 성능 최적화: lazy load, idle work, reduced motion
  4. 가능할 때만 CSS scroll-driven enhancement

### 3-3. 챕터 전환 시 색상 / 타이포그래피 변화 처리

- `[관측]` 이 계열 사이트는 "스크롤마다 모든 속성을 바꾸는" 식보다, **챕터가 바뀌는 순간 전역 변수 세트**를 교체하는 편에 가깝다.
- `[제안]` 구현은 아래 구조가 가장 안전하다.
  - 현재 active chapter를 `IntersectionObserver`로 잡는다.
  - chapter metadata에 `theme`, `accent`, `ink`, `eyebrow`를 넣는다.
  - 루트에 `data-theme`를 심고 CSS 변수만 바꾼다.

```tsx
type ChapterTheme = "deep" | "signal" | "burn";

type ChapterMeta = {
  id: string;
  theme: ChapterTheme;
};

const THEMES: Record<ChapterTheme, Record<string, string>> = {
  deep: {
    "--chapter-bg": "#03060f",
    "--chapter-accent": "#7ff4ff",
    "--chapter-text": "#e6eef6",
  },
  signal: {
    "--chapter-bg": "#07101f",
    "--chapter-accent": "#ffca6f",
    "--chapter-text": "#f4f6f8",
  },
  burn: {
    "--chapter-bg": "#140d08",
    "--chapter-accent": "#ff8760",
    "--chapter-text": "#fff1e8",
  },
};
```

```css
.story-shell {
  background: var(--chapter-bg, var(--bg-deep));
  color: var(--chapter-text, var(--text));
  transition:
    background-color 480ms var(--ease-out),
    color 320ms var(--ease-out);
}

.story-shell [data-eyebrow] {
  color: var(--chapter-accent, var(--accent));
  transition: color 320ms var(--ease-out);
}
```

- `[제안]` 포인트는 "요소마다 class를 갈아끼우는 것"보다 "루트 변수만 바꾸는 것"이다.

### 3-4. 현재 저장소에서 현실적인 구현 우선순위

1. `marked`가 뱉은 `h2`에 `data-chapter`와 `id`를 심는다.
2. `IntersectionObserver`로 active chapter를 잡는다.
3. 오른쪽 rail과 상단 KPI를 active chapter 기준으로 갱신한다.
4. 마지막에만 `@supports (scroll-timeline: --page block)`를 써서 rail fill, heading reveal 정도를 향상한다.

```ts
import { marked } from "marked";

marked.use({
  renderer: {
    heading({ tokens, depth }) {
      const html = this.parser.parseInline(tokens);
      const plain = html.replace(/<[^>]+>/g, "").trim();
      const id = plain.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

      if (depth === 2) {
        return `<h2 id="${id}" data-chapter data-chapter-title="${plain}">${html}</h2>`;
      }

      return `<h${depth}>${html}</h${depth}>`;
    },
  },
});
```

- `[제안]` 이 정도만 넣어도 JSX에서 하드코딩한 챕터 목록 없이 `querySelectorAll("[data-chapter]")`로 rail과 active state를 구축할 수 있다.

## 4. "보이저 2호의 항법 궤적" 서사를 챕터 UI로 표현하는 구체 사례

### 4-1. 이번 검색에서 찾은 가장 가까운 공개 사례

#### 사례 A. Joey Purkis space portfolio

- `[공개]` 3D space navigation, 행성 기반 portfolio nav, classic mode fallback 제공
- `[관측]` "콘텐츠 목록"을 메뉴로 두지 않고 **우주 오브젝트를 chapter selector로 치환**했다는 점이 중요하다.
- `[적용 포인트]`
  - 챕터 = 행성/웨이포인트
  - 선택 상태 = orbit ring / label glow
  - classic mode = 일반 리스트 fallback

#### 사례 B. JWST Where is Webb

- `[공개]` `DAYS / DISTANCE` 전환
- `[관측]` 보이저 내러티브에서도 `TIME / ROUTE` 이중축이 매우 잘 맞는다.
  - `TIME`: 경력/프로젝트 기간
  - `ROUTE`: 발사 -> 순항 -> 플라이바이 -> 인터스텔라

#### 사례 C. JPL Basics of Space Flight

- `[공개]` 항법 관련 챕터가 `reference trajectory`, `orbit determination`, `maneuvers`, `gravity-assist navigation` 같은 용어를 제공
- `[관측]` 이 단어들은 단순 SF 무드보다 훨씬 설득력 있는 챕터 라벨 소스다.

### 4-2. 이 저장소에서 바로 쓸 수 있는 구현안

#### 챕터 모델

```ts
type TrajectoryChapter = {
  id: string;
  code: string;
  label: string;
  routeLabel: string;
};

const chapters: TrajectoryChapter[] = [
  { id: "launch", code: "CH.01", label: "Launch Window", routeLabel: "EARTH" },
  { id: "cruise", code: "CH.02", label: "Cruise Phase", routeLabel: "TCM-1" },
  { id: "jupiter", code: "CH.03", label: "Gravity Assist", routeLabel: "JUPITER" },
  { id: "saturn", code: "CH.04", label: "Outer Systems", routeLabel: "SATURN" },
  { id: "heliopause", code: "CH.05", label: "Boundary Crossing", routeLabel: "HELIOPAUSE" },
  { id: "archive", code: "CH.06", label: "Interstellar Record", routeLabel: "ARCHIVE" },
];
```

#### SVG trajectory rail

```tsx
const PATH_LENGTH = 1000;
const progress = activeIndex / Math.max(1, chapters.length - 1);
const dashOffset = PATH_LENGTH * (1 - progress);

<svg viewBox="0 0 240 1200" className="trajectory-rail" aria-hidden="true">
  <path
    d="M120 40 C 180 160, 70 260, 140 380 S 180 640, 110 760 S 70 1000, 150 1160"
    pathLength={PATH_LENGTH}
    className="trajectory-rail__base"
  />
  <path
    d="M120 40 C 180 160, 70 260, 140 380 S 180 640, 110 760 S 70 1000, 150 1160"
    pathLength={PATH_LENGTH}
    className="trajectory-rail__active"
    style={{ strokeDasharray: PATH_LENGTH, strokeDashoffset: dashOffset }}
  />
</svg>
```

```css
.trajectory-rail__base {
  fill: none;
  stroke: rgba(127, 244, 255, 0.16);
  stroke-width: 2;
}

.trajectory-rail__active {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2.5;
  filter: drop-shadow(0 0 8px rgba(127, 244, 255, 0.45));
  transition: stroke-dashoffset 420ms var(--ease-out);
}
```

### 4-3. 왜 이 방식이 보이저 2호 서사에 맞는가

- 원형 orbit보다 **불규칙 곡선 path**가 더 "항법"처럼 보인다.
- progress bar보다 **waypoint + path reveal**이 더 "탐사선 로그"처럼 읽힌다.
- `CH.03 / JUPITER / Gravity Assist` 같은 이중 라벨은
  - Orbitron에 잘 맞고
  - 내용 요약과 분위기 설명을 동시에 수행한다.

## 5. 바로 적용 가능한 디자인 규칙

### 5-1. 토큰 추가

```css
:root {
  --telemetry-blue: #78a6ff;
  --telemetry-green: #7be8a4;
  --telemetry-line: rgba(127, 244, 255, 0.24);
  --telemetry-line-strong: rgba(127, 244, 255, 0.44);
  --telemetry-panel: rgba(8, 15, 27, 0.94);
  --telemetry-panel-soft: rgba(10, 18, 31, 0.78);
}
```

### 5-2. 타이포 운용

- `Orbitron`은 아래까지만
  - `CH.01`
  - eyebrow
  - KPI title
  - short status
- `Noto Sans KR`은 아래 전부
  - body copy
  - project description
  - long captions
- 가능하면 `font-mono`를 추가로 써서 수치를 고정폭 처리

### 5-3. 패널 밀도

- panel padding: `18px`
- inner frame inset: `6px`
- section gap: `24px ~ 32px`
- label gap: `8px`
- divider dash: `8px on / 6px off`
- notch: `12px`

### 5-4. 모션 우선순위

1. chapter active 전환
2. trajectory path fill
3. KPI 숫자 갱신
4. 마지막에만 background glow

## 6. 추천 구현 순서

1. `marked` 출력의 `h2`를 챕터 anchor로 승격
2. 오른쪽 trajectory rail 구현
3. 상단 KPI strip 구현
4. chapter별 CSS 변수 교체
5. HUD 패널에 notch / dashed divider 적용
6. 마지막에만 scroll-driven enhancement 추가

## Sources

### 공식 / 1차

- NASA Brand Guidelines: https://www.nasa.gov/nasa-brand-center/brand-guidelines/
- NASA Eyes: https://science.nasa.gov/eyes/
- NASA DSN Now: https://eyes.nasa.gov/apps/dsn-now/dsn.html
- NASA Deep Space Network overview: https://science.nasa.gov/mission/dsn/
- NASA Webb "Where is Webb": https://webb.nasa.gov/content/webbLaunch/whereIsWebb.html
- NASA Software Catalog, Stellar: https://software.nasa.gov/software/NPO-52220-1
- JPL Basics of Space Flight: https://science.nasa.gov/learn/basics-of-space-flight/
- ESA Operations: https://www.esa.int/Enabling_Support/Operations
- ESA Estrack ground stations: https://www.esa.int/Enabling_Support/Operations/ESA_Ground_Stations/Estrack_ground_stations
- ESA Network Operations Centre: https://www.esa.int/Enabling_Support/Operations/ESA_Ground_Stations/Network_Operations_Centre
- ESA SpaceCreator repository: https://gitlab.esa.int/taste/spacecreator
- SpaceX ISS Docking Simulator: https://iss-sim.spacex.com/

### 공개 레퍼런스 / 분석

- No Man's Sky official site: https://www.nomanssky.com/
- Hello Games NEXT update announcement mentioning Galactic Atlas: https://www.nomanssky.com/en/next-update/
- refs.gallery, Active Theory: https://refs.gallery/projects/active-theory
- WebGPU Community showcase, Active Theory: https://www.webgpu.com/showcase/active-theory-portfolio/
- refs.gallery, Resn: https://refs.gallery/projects/resn
- Scrollama: https://github.com/russellsamora/scrollama
- Joey Purkis portfolio: https://joeypurkis.com/
