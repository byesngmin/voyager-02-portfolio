# Design Conventions (Voyager-02)

디자인·UI 관련 규약. `conventions.md`가 300줄 초과로 분리.

> 위임 경계, 위임 템플릿, 에스컬레이션 프로토콜 → `conventions.md` 참조

---

## 코드 규약

| 규칙 | 내용 |
|------|------|
| CSS 단일 파일 | 모든 스타일은 `src/styles/global.css`에 유지. 컴포넌트별 CSS 파일 생성 금지. |
| 클래스 네임스페이스 | 기존 단일 클래스 패턴 유지 (`.signal-card`, `.planet-card` 등). 신규 컴포넌트도 동일 컨벤션. |
| 상태 변형 | modifier 클래스 (`.btn--primary`) 또는 `.is-active` 사용. |
| 데이터 속성 | `data-state="loading|ready"` 형태로 통일. |
| CSS 변수 우선 | 하드코딩 색상·크기 금지 — `:root` 변수 사용. |
| 신규 토큰 도입 | `:root`에 추가 후 컴포넌트에서 참조. 기존 변수 이름 변경 금지. |

---

## 콘텐츠 규약

| 규칙 | 내용 |
|------|------|
| 한국어 줄바꿈 | `word-break: keep-all; line-break: strict;` — 모든 한국어 본문 영역에 적용. |
| 연도 표기 | 4자리 (`2026`). 기간은 `YYYY.MM` 통일. 진행 중 → `– 현재`. |
| 고유명사 마크업 | 제품명·게임명은 `<strong>` 대신 `<span class="proper-noun">` (스타일: `text-underline-offset:4px`만). |
| 언어 | `<html lang="ko">` 고정. 영어는 고유명사·기술 용어에만 혼용. |

---

## 모션 규약

| 트리거 | 효과 | 시간 |
|---|---|---|
| IntroGate | 풀스크린 → 페이드 아웃 | `--dur-intro` (1600ms) |
| 라우트 전환 | scroll reset + pulse | `--dur-base` (300ms) |
| 섹션 진입 | fade + 8px translateY | 400ms |
| 카드 hover | translateY(-2px) + shadow-lift | `--dur-fast` (150ms) |
| 썸네일 hover | scale(1.03) | `--dur-base` |
| reduced-motion | 모든 duration 0ms | — |

```css
/* 반드시 global.css 끝에 유지 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0ms !important;
    transition-duration: 0ms !important;
  }
}
```

---

## SEO · 메타

```html
<meta name="description" content="Voyager-02 — 스토리텔링과 시스템으로 몰입을 설계하는 게임 콘텐츠 기획자 포트폴리오">
<meta property="og:title"  content="Voyager-02 Portfolio">
<meta property="og:image"  content="/og.png">  <!-- 1200×630 -->
<link rel="canonical"      href="https://<user>.github.io/voyager-02/">
```

- `?signal=` 별 OG는 정적 한계로 default 1장만 지원.

---

## 인쇄 (@media print)

```css
@media print {
  body { background: #fff !important; color: #000 !important; }
  .intro-gate, .site-sidebar, .site-header__actions,
  .voyager-panel, .signal-quote::before { display: none !important; }
  .signal-card, .project-card, .timeline-card {
    background: #fff; border: 1px solid #888;
    box-shadow: none; break-inside: avoid; color: #000;
  }
  a::after { content: " (" attr(href) ")"; font-size: 9pt; color: #555; }
}
```

---

## 성능 예산

| 지표 | 기준 |
|------|------|
| 첫 페인트 (FCP) | < 1.5s (3G fast) |
| IntroGate 재생 | sessionStorage로 1회만 |
| 이미지 포맷 | WebP + `loading="lazy"` + `width/height` 명시 |
| 폰트 | Google Fonts CDN (`font-display: swap`) |

---

## 접근성 체크리스트

- 모달(`<dialog>`) focus trap + ESC 닫기
- IntroGate: `aria-busy="true"` 동안 main `inert`, 종료 시 H1 포커스 이동
- 모든 `<img>` alt, 장식 `alt=""`
- 색 대비: 본문 ≥7:1, UI ≥4.5:1
- 포커스 링: `outline: 2px solid var(--focus); outline-offset: 2px;`
- 스킵 링크: `<a class="sr-only-focus" href="#main">본문으로 건너뛰기</a>`
- 라우트 변경 시 `<div role="status" aria-live="polite" class="sr-only">` 안내
