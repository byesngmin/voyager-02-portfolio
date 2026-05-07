# CSS/React 구현 패턴 리서치 — 우주 탐사 테마 자기소개 페이지

작성일: 2026-05-07

## 전제
- 현재 시스템 토큰은 이미 우주 톤에 가깝다: `--bg-deep: #03060f`, `--bg-base: #07101f`, `--surface: rgba(10, 18, 31, 0.78)`, `--surface-strong: rgba(8, 15, 27, 0.94)`, `--accent: #7ff4ff`, `--accent-warm: #ffca6f`.
- 아래 값들은 위 토큰에 맞춰 조정한 실전값이다. CSS 기능 자체는 공식 문서를 근거로 했고, 색/간격/강도 값은 현재 테마에 맞춘 적용안이다.
- 지원성 메모: 2026-05-07 기준 MDN은 `scroll-timeline`, `view-timeline`, `animation-range`를 `Limited availability`로 표시한다. 따라서 이 페이지는 `@supports (...)`로 네이티브 향상을 켜고, 기본 동작은 `IntersectionObserver` + JS 진행률로 두는 방식이 가장 안전하다.

## 1. CSS scroll-driven animation으로 챕터 진행 표현

### 1-1. 네이티브 향상 패턴: `scroll-timeline` + `view-timeline` + `animation-range`

핵심 포인트
- 문서 전체 진행률은 `scroll-timeline` 또는 `scroll()`에 연결한다.
- 챕터별 등장감은 `view-timeline` 또는 `view()`에 연결한다.
- 진행 바는 `height` 대신 `transform: scaleY()` 또는 `scaleX()`를 쓰는 편이 낫다.
- `animation` shorthand가 `animation-timeline`을 reset하므로 `animation-timeline`은 항상 `animation` 뒤에 적는다.

```css
/* 페이지 전체 진행률 */
@supports (scroll-timeline: --page block) {
  .story-shell {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 15rem;
    gap: clamp(1rem, 2vw, 2rem);
  }

  .story-scroll-root {
    scroll-timeline: --page block;
  }

  .chapter-rail {
    position: sticky;
    top: clamp(4.5rem, 10vh, 7rem);
    align-self: start;
  }

  .chapter-rail__meter {
    inline-size: 2px;
    block-size: min(52vh, 32rem);
    background: rgba(127, 244, 255, 0.12);
    overflow: hidden;
    border-radius: 999px;
  }

  .chapter-rail__fill {
    inline-size: 100%;
    block-size: 100%;
    transform-origin: 50% 0%;
    background: linear-gradient(
      180deg,
      rgba(127, 244, 255, 0.18) 0%,
      rgba(127, 244, 255, 0.95) 45%,
      rgba(255, 202, 111, 0.75) 100%
    );
    animation: chapter-rail-fill 1ms linear both;
    animation-timeline: --page;
  }

  .chapter {
    view-timeline: --chapter block;
    position: relative;
  }

  .chapter__heading,
  .chapter__eyebrow {
    animation: chapter-reveal 1ms linear both;
    animation-timeline: --chapter;
    animation-range: entry 15% cover 38%;
  }

  @keyframes chapter-rail-fill {
    from {
      transform: scaleY(0);
    }
    to {
      transform: scaleY(1);
    }
  }

  @keyframes chapter-reveal {
    0% {
      opacity: 0;
      transform: translateY(1.5rem);
      filter: blur(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
      filter: blur(0);
    }
  }
}
```

권장 적용 방식
- 문서 전체 progress는 `scroll-timeline: --page block`로 하나만 둔다.
- 챕터별 reveal은 각 `.chapter`에 `view-timeline: --chapter block`을 둔다.
- `animation-range: entry 15% cover 38%` 정도면 챕터 헤더가 화면 중상단에 들어왔을 때 자연스럽게 살아난다.

### 1-2. `IntersectionObserver` 기반 챕터 자동 감지 패턴

`scroll-timeline`을 못 쓰는 브라우저용 기본 패턴이다. 긴 서사형 페이지에서는 단순히 "현재 보이는 첫 섹션"보다, `intersectionRatio`가 가장 큰 섹션을 active로 잡는 편이 더 안정적이다.

```tsx
import { useEffect, useEffectEvent, useRef, useState } from "react";

type ChapterMeta = {
  id: string;
  label: string;
};

export function useActiveChapter(selector = "[data-chapter]") {
  const ratiosRef = useRef(new Map<string, number>());
  const [chapters, setChapters] = useState<ChapterMeta[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const onIntersect = useEffectEvent((entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      const node = entry.target as HTMLElement;
      ratiosRef.current.set(node.id, entry.isIntersecting ? entry.intersectionRatio : 0);
    }

    const next = [...ratiosRef.current.entries()]
      .sort((a, b) => b[1] - a[1])[0];

    if (next && next[1] > 0) {
      setActiveId(next[0]);
    }
  });

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector));
    setChapters(
      nodes.map((node) => ({
        id: node.id,
        label: node.dataset.chapterTitle ?? node.textContent?.trim() ?? node.id,
      })),
    );

    if (!nodes.length) {
      return;
    }

    if (!activeId) {
      setActiveId(nodes[0].id);
    }

    const observer = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: "-18% 0px -52% 0px",
      threshold: [0, 0.15, 0.35, 0.55, 0.75, 1],
    });

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [selector]);

  return { chapters, activeId };
}
```

조정 기준
- `rootMargin: "-18% 0px -52% 0px"`: active 영역을 화면 중상단 중심으로 압축한다.
- `threshold: [0, 0.15, 0.35, 0.55, 0.75, 1]`: threshold를 촘촘하게 주면 긴 섹션에서도 active 전환이 덜 튄다.
- `useEffectEvent`를 써서 observer 재구독 없이 최신 state/logic을 읽는 패턴이 React 19 기준에 잘 맞는다.

### 1-3. 스크롤 위치 기반 사이드바 진행 표시기

문서 전체 진행률은 `scrollTop`, `scrollHeight`, `clientHeight` 조합으로 계산하면 된다. MDN 기준 `scrollTop`은 소수점을 가질 수 있고, Safari 오버스크롤 상황에서는 음수도 가능하므로 clamp가 필요하다.

```tsx
import { CSSProperties, useEffect, useEffectEvent, useState } from "react";

export function useScrollProgress(target?: HTMLElement | null) {
  const [progress, setProgress] = useState(0);

  const update = useEffectEvent(() => {
    const root = target ?? document.documentElement;
    const rawTop = target ? root.scrollTop : window.scrollY;
    const top = Math.max(0, rawTop);
    const max = Math.max(1, root.scrollHeight - root.clientHeight);
    setProgress(Math.min(1, top / max));
  });

  useEffect(() => {
    update();

    const scroller: EventTarget = target ?? window;
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      scroller.removeEventListener("scroll", update as EventListener);
      window.removeEventListener("resize", update);
    };
  }, [target]);

  return progress;
}

type ChapterRailProps = {
  chapters: { id: string; label: string }[];
  activeId: string | null;
  progress: number;
};

export function ChapterRail({ chapters, activeId, progress }: ChapterRailProps) {
  return (
    <aside className="chapter-rail" aria-label="문서 진행">
      <div className="chapter-rail__meter">
        <div
          className="chapter-rail__fill"
          style={{ "--progress": progress } as CSSProperties}
        />
      </div>
      <ol className="chapter-rail__list">
        {chapters.map((chapter, index) => (
          <li key={chapter.id}>
            <a
              href={`#${chapter.id}`}
              aria-current={chapter.id === activeId ? "location" : undefined}
              data-active={chapter.id === activeId}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>{chapter.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
```

```css
.chapter-rail {
  position: sticky;
  top: clamp(4.5rem, 10vh, 7rem);
  display: grid;
  grid-template-columns: 0.25rem 1fr;
  gap: 1rem;
  align-self: start;
}

.chapter-rail__meter {
  position: relative;
  inline-size: 2px;
  block-size: min(52vh, 32rem);
  background: rgba(127, 244, 255, 0.12);
  border-radius: 999px;
  overflow: hidden;
}

.chapter-rail__fill {
  inline-size: 100%;
  block-size: 100%;
  transform-origin: 50% 0%;
  transform: scaleY(var(--progress, 0));
  background: linear-gradient(180deg, #7ff4ff 0%, rgba(255, 202, 111, 0.9) 100%);
  box-shadow: 0 0 18px rgba(127, 244, 255, 0.45);
}

.chapter-rail__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.chapter-rail__list a {
  display: grid;
  gap: 0.15rem;
  color: rgba(230, 238, 246, 0.55);
  transition:
    color 180ms ease,
    transform 180ms ease;
}

.chapter-rail__list a[data-active="true"] {
  color: #e9fdff;
  transform: translateX(0.2rem);
  text-shadow: 0 0 0.45rem rgba(127, 244, 255, 0.3);
}
```

## 2. CSS만으로 구현하는 우주/SF 감성 효과

### 2-1. 권장 테마 토큰

```css
:root {
  --space-bg-deep: #03060f;
  --space-bg-base: #07101f;
  --space-surface: rgba(10, 18, 31, 0.78);
  --space-surface-strong: rgba(8, 15, 27, 0.94);
  --space-line: rgba(127, 244, 255, 0.28);
  --space-line-strong: rgba(127, 244, 255, 0.52);
  --space-accent: #7ff4ff;
  --space-accent-warm: #ffca6f;
  --space-text: #f4f6f8;
  --space-text-muted: rgba(230, 238, 246, 0.72);
}
```

### 2-2. Scan line 효과

`::before`와 `::after`로 겹치면 HTML을 늘리지 않고도 CRT/HUD 느낌을 만들 수 있다.

```css
.console-skin {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.console-skin::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.42;
  mix-blend-mode: screen;
  background: repeating-linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0) 2px,
    rgba(127, 244, 255, 0.055) 3px,
    rgba(127, 244, 255, 0.055) 4px
  );
}

.console-skin::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(127, 244, 255, 0.05) 46%,
    transparent 54%
  );
  animation: scan-sweep 8s linear infinite;
}

@keyframes scan-sweep {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(100%);
  }
}
```

권장값
- scan line 간격: `4px` 주기
- 라인 컬러: `rgba(127, 244, 255, 0.055)`
- sweep opacity: `0.05` 내외

### 2-3. Orbitron에 맞는 글로우 텍스트

Orbitron은 획이 각지고 공간감이 커서, X/Y offset을 거의 주지 않고 blur 레이어를 여러 겹 쌓는 편이 잘 맞는다.

```css
.telemetry-title {
  font-family: "Orbitron", system-ui, sans-serif;
  letter-spacing: 0.12em;
  color: #e9fdff;
  text-shadow:
    0 0 0.04em rgba(255, 255, 255, 0.92),
    0 0 0.12em rgba(127, 244, 255, 0.95),
    0 0 0.42em rgba(127, 244, 255, 0.52),
    0 0 1.1em rgba(127, 244, 255, 0.22);
}

.telemetry-title--hero {
  text-shadow:
    0 0 0.06em rgba(255, 255, 255, 0.95),
    0 0 0.2em rgba(127, 244, 255, 0.92),
    0 0 0.65em rgba(127, 244, 255, 0.48),
    0 0 1.6em rgba(127, 244, 255, 0.18);
}

.telemetry-title--warm {
  text-shadow:
    0 0 0.04em rgba(255, 255, 255, 0.88),
    0 0 0.12em rgba(255, 202, 111, 0.95),
    0 0 0.42em rgba(255, 202, 111, 0.45),
    0 0 1.1em rgba(255, 202, 111, 0.18);
}
```

추천 범위
- eyebrow / label: blur 최대 `0.42em`
- hero headline: blur 최대 `1.6em`
- 본문에는 glow를 거의 쓰지 않고 label, 수치, 챕터 타이틀에만 제한적으로 쓴다

### 2-4. 텔레메트리 데이터 패널

`border`, `clip-path`, `::before` 조합으로 "패널 외곽 노치 + 내부 프레임 + HUD 배경"을 만든다.

```css
.telemetry-panel {
  position: relative;
  padding: 1.25rem 1.25rem 1.1rem;
  background:
    linear-gradient(180deg, rgba(127, 244, 255, 0.06), transparent 45%),
    rgba(8, 15, 27, 0.92);
  border: 1px dashed rgba(127, 244, 255, 0.28);
  clip-path: polygon(
    0 0,
    calc(100% - 18px) 0,
    100% 18px,
    100% 100%,
    18px 100%,
    0 calc(100% - 18px)
  );
  box-shadow:
    inset 0 0 0 1px rgba(127, 244, 255, 0.1),
    0 0 36px rgba(2, 12, 26, 0.65);
}

.telemetry-panel::before {
  content: "";
  position: absolute;
  inset: 10px;
  border: 1px solid rgba(127, 244, 255, 0.12);
  pointer-events: none;
}

.telemetry-panel::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(90deg, rgba(127, 244, 255, 0.06), transparent 25%),
    repeating-linear-gradient(
      to right,
      transparent 0,
      transparent 23px,
      rgba(127, 244, 255, 0.03) 24px
    );
  opacity: 0.65;
}

.telemetry-panel__label {
  margin: 0 0 0.5rem;
  font: 700 0.68rem/1 "Orbitron", system-ui, sans-serif;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(127, 244, 255, 0.82);
}
```

### 2-5. JS 없이 만드는 별 배경

여러 개의 `radial-gradient()` 레이어를 다른 `background-size`로 겹치면 고정된 성운 + 먼 별 + 밝은 별 느낌을 만들 수 있다.

```css
.starfield {
  position: relative;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.82) 0 1px, transparent 1.3px),
    radial-gradient(circle at 80% 15%, rgba(127, 244, 255, 0.72) 0 1.2px, transparent 1.6px),
    radial-gradient(circle at 60% 70%, rgba(255, 202, 111, 0.45) 0 0.9px, transparent 1.4px),
    radial-gradient(circle at 10% 80%, rgba(255, 255, 255, 0.45) 0 0.8px, transparent 1.2px),
    linear-gradient(180deg, #030817 0%, #07101f 52%, #03060f 100%);
  background-size: 16rem 16rem, 24rem 24rem, 28rem 28rem, 18rem 18rem, 100% 100%;
  background-position: 0 0, 4rem 2rem, -3rem 1rem, 7rem -5rem, 0 0;
}

.starfield::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.7;
  background:
    radial-gradient(circle at 25% 40%, rgba(255, 255, 255, 0.35) 0 0.7px, transparent 1px),
    radial-gradient(circle at 70% 55%, rgba(127, 244, 255, 0.22) 0 0.7px, transparent 1px),
    radial-gradient(circle at 50% 10%, rgba(255, 255, 255, 0.3) 0 0.6px, transparent 0.9px);
  background-size: 12rem 12rem, 14rem 14rem, 10rem 10rem;
}
```

## 3. React 컴포넌트 패턴

### 3-1. 긴 글 페이지에서 챕터를 자동 감지하는 훅

`IntersectionObserver`는 "active chapter"와 "chapter list"를 동시에 뽑는 용도에 적합하다. 이 저장소처럼 HTML을 주입하는 구조에서는 ref 배열보다 `querySelectorAll("[data-chapter]")`가 구현이 단순하다.

```tsx
type UseChaptersResult = {
  chapters: { id: string; label: string }[];
  activeId: string | null;
};

export function useChapterNavigation(root: HTMLElement | null): UseChaptersResult {
  const [chapters, setChapters] = useState<{ id: string; label: string }[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const ratiosRef = useRef(new Map<string, number>());

  const onIntersect = useEffectEvent((entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      const node = entry.target as HTMLElement;
      ratiosRef.current.set(node.id, entry.isIntersecting ? entry.intersectionRatio : 0);
    }

    const best = [...ratiosRef.current.entries()]
      .sort((a, b) => b[1] - a[1])[0];

    if (best && best[1] > 0) {
      setActiveId(best[0]);
    }
  });

  useEffect(() => {
    if (!root) {
      return;
    }

    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-chapter]"));
    setChapters(
      nodes.map((node) => ({
        id: node.id,
        label: node.dataset.chapterTitle ?? node.textContent?.trim() ?? node.id,
      })),
    );

    const observer = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: "-18% 0px -52% 0px",
      threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
    });

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [root]);

  return { chapters, activeId };
}
```

### 3-2. 마크다운 섹션에 커스텀 래퍼 컴포넌트를 삽입하는 패턴

#### A. 현재 저장소(`marked` + `dangerouslySetInnerHTML`)에 바로 맞는 패턴

현재 코드베이스는 `marked`로 HTML을 만들고 `article`에 주입한다. 가장 덜 깨지는 패턴은 "렌더 단계에서 챕터 마커를 심고" -> "주입 후 DOM을 섹션 단위로 묶는 것"이다.

```ts
import { marked } from "marked";

marked.use({
  renderer: {
    heading(token) {
      const text = this.parser.parseInline(token.tokens);
      const slug = text
        .replace(/<[^>]+>/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^\w가-힣]+/g, "-")
        .replace(/^-+|-+$/g, "");

      if (token.depth === 2) {
        return `<h2 id="${slug}" data-chapter data-chapter-title="${text}">${text}</h2>`;
      }

      return `<h${token.depth}>${text}</h${token.depth}>`;
    },

    blockquote(token) {
      return `<blockquote class="signal-quote">${this.parser.parse(token.tokens)}</blockquote>`;
    },
  },
});
```

```tsx
function wrapChapters(root: HTMLElement) {
  const headings = Array.from(
    root.querySelectorAll<HTMLElement>("h2[data-chapter]"),
  );

  for (const heading of headings) {
    if (heading.parentElement?.classList.contains("chapter")) {
      continue;
    }

    const section = document.createElement("section");
    section.className = "chapter telemetry-panel console-skin";
    section.dataset.chapter = heading.id;

    heading.before(section);
    section.append(heading);

    let cursor = section.nextElementSibling;
    while (cursor && !cursor.matches("h2[data-chapter]")) {
      const next = cursor.nextElementSibling;
      section.append(cursor);
      cursor = next;
    }
  }
}
```

이 패턴이 맞는 이유
- 기존 `marked` 구조를 갈아엎지 않는다.
- 챕터 인디케이터용 `data-chapter`를 바로 얻는다.
- `blockquote`, `code`, `table` 같은 개별 블록은 renderer 단계에서 class를 미리 심기 쉽다.

주의
- `marked` 공식 문서는 출력 HTML을 sanitize하지 않는다고 명시한다. 외부 입력 마크다운을 받을 경우 sanitize가 선행되어야 한다.

#### B. `react-markdown` 패턴

`react-markdown`은 노드 단위 컴포넌트 교체에 강하다. `blockquote`, `pre`, `code`, `h2` 같은 개별 요소를 React 컴포넌트로 치환하는 용도에 적합하다.

```tsx
import Markdown from "react-markdown";

<Markdown
  components={{
    h2(props) {
      return <h2 data-chapter className="chapter__heading" {...props} />;
    },
    blockquote(props) {
      return <SignalQuote {...props} />;
    },
    pre(props) {
      return <TelemetryCodeBlock {...props} />;
    },
  }}
>
  {markdown}
</Markdown>;
```

메모
- 공식 문서상 각 컴포넌트는 `node`를 받는다.
- 다만 "한 heading 아래의 형제 노드 전체를 하나의 section으로 묶기"는 element override만으로는 부족하다.
- 진짜 챕터 grouping이 필요하면 parse 전 전처리나 MDX가 더 깔끔하다.

#### C. MDX 패턴

MDX는 wrapper와 layout 패턴이 명확하다. 문서 전체 wrapper나 공용 컴포넌트 삽입이 필요하면 가장 구조적이다.

```mdx
export default function Layout({children}) {
  return <article className="telemetry-article">{children}</article>;
}

# Launch Window

<ChapterWaypoint code="WP-01" title="Earth Departure" />

본문...
```

```tsx
import Post from "./self-intro.mdx";

<Post
  components={{
    wrapper: StoryShell,
    blockquote: SignalQuote,
  }}
/>;
```

판단
- 현재 저장소가 이미 `marked`를 쓰고 있으므로 바로 적용은 `marked` 패턴이 가장 현실적이다.
- 향후 "마크다운 안에 실제 React 컴포넌트"를 더 넣고 싶다면 MDX 전환이 더 낫다.

### 3-3. 스크롤 진행률 기반 사이드 인디케이터 컴포넌트

```tsx
type StoryNavProps = {
  chapters: { id: string; label: string }[];
  activeId: string | null;
  progress: number;
};

export function StoryNav({ chapters, activeId, progress }: StoryNavProps) {
  return (
    <aside className="chapter-rail">
      <div className="chapter-rail__meter" aria-hidden="true">
        <div
          className="chapter-rail__fill"
          style={{ "--progress": progress } as CSSProperties}
        />
      </div>

      <ol className="chapter-rail__list">
        {chapters.map((chapter, index) => (
          <li key={chapter.id}>
            <a
              href={`#${chapter.id}`}
              data-active={chapter.id === activeId}
              aria-current={chapter.id === activeId ? "location" : undefined}
            >
              <span className="chapter-rail__index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="chapter-rail__label">{chapter.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
```

추천 시각값
- rail thickness: `2px`
- sticky top: `clamp(4.5rem, 10vh, 7rem)`
- active label shift: `translateX(0.2rem)`
- active glow: `0 0 0.45rem rgba(127, 244, 255, 0.3)`

## 4. 탐사 로그 / 텔레메트리 스타일 UI 컴포넌트

### 4-1. 챕터 웨이포인트

```tsx
<li className="waypoint">
  <span className="waypoint__vector" aria-hidden="true" />
  <div className="waypoint__body">
    <p className="waypoint__index">WP-03 / EUROPA APPROACH</p>
    <h3>연료 재분배와 항법 보정</h3>
    <p>중력 도움 항로에 맞춰 추진기 출력과 관측 순서를 재구성했다.</p>
  </div>
</li>
```

```css
.waypoint {
  position: relative;
  display: grid;
  grid-template-columns: 4.5rem minmax(0, 1fr);
  gap: 1rem;
  padding-block: 1.4rem;
}

.waypoint::before {
  content: "";
  position: absolute;
  left: 2.2rem;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(
    180deg,
    transparent,
    rgba(127, 244, 255, 0.45) 12%,
    rgba(127, 244, 255, 0.12) 88%,
    transparent
  );
}

.waypoint__vector {
  width: 4.5rem;
  height: 4.5rem;
  display: grid;
  place-items: center;
  border: 1px dashed rgba(127, 244, 255, 0.42);
  clip-path: polygon(
    50% 0%,
    88% 22%,
    100% 50%,
    88% 78%,
    50% 100%,
    12% 78%,
    0% 50%,
    12% 22%
  );
  background: radial-gradient(circle, rgba(127, 244, 255, 0.14), rgba(127, 244, 255, 0.02));
  box-shadow:
    0 0 0 1px rgba(127, 244, 255, 0.12),
    inset 0 0 24px rgba(127, 244, 255, 0.08);
}

.waypoint__vector::after {
  content: "";
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: #7ff4ff;
  box-shadow: 0 0 18px rgba(127, 244, 255, 0.9);
}

.waypoint__index {
  margin: 0 0 0.35rem;
  font: 700 0.68rem/1 "Orbitron", system-ui, sans-serif;
  letter-spacing: 0.22em;
  color: rgba(127, 244, 255, 0.8);
}
```

### 4-2. 성과 수치를 데이터 리딩 방식으로 보여주는 카드

```tsx
<article className="reading-card telemetry-panel">
  <p className="reading-card__label">MISSION UPTIME</p>
  <strong className="reading-card__value">99.2%</strong>
  <p className="reading-card__delta">+12.4% / previous orbit</p>
</article>
```

```css
.reading-card {
  display: grid;
  gap: 0.45rem;
  min-height: 11rem;
}

.reading-card__label {
  margin: 0;
  font: 700 0.72rem/1 "Orbitron", system-ui, sans-serif;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(127, 244, 255, 0.78);
}

.reading-card__value {
  display: inline-block;
  font-family: "Orbitron", system-ui, sans-serif;
  font-size: clamp(1.8rem, 5vw, 3.4rem);
  line-height: 0.95;
  color: #e8fdff;
  text-shadow:
    0 0 0.05em rgba(255, 255, 255, 0.95),
    0 0 0.35em rgba(127, 244, 255, 0.48);
}

.reading-card__value::after {
  content: "";
  display: block;
  margin-top: 0.6rem;
  height: 2px;
  background: linear-gradient(90deg, #7ff4ff, transparent);
}

.reading-card__delta {
  margin: 0;
  font-family: var(--font-mono, ui-monospace, monospace);
  color: rgba(230, 238, 246, 0.72);
}
```

추천 데이터 표현 방식
- label은 `Orbitron` + `0.22em` letter spacing
- 실제 수치는 큰 display 숫자
- 변화량은 mono font
- 아래쪽 2px rule로 센서 출력 느낌을 추가

### 4-3. 강조 인용구를 "신호 수신" 형태로 표현하는 blockquote

```html
<blockquote class="signal-quote">
  <p>정답보다 중요한 건, 다음 실험을 계속 설계할 수 있는 상태를 유지하는 일이다.</p>
  <cite>TRANSMISSION / SELF-INTRO</cite>
</blockquote>
```

```css
.signal-quote {
  position: relative;
  margin: 2rem 0;
  padding: 1.25rem 1.5rem 1.25rem 4rem;
  border-left: 1px solid rgba(127, 244, 255, 0.4);
  background:
    linear-gradient(90deg, rgba(127, 244, 255, 0.12), transparent 30%),
    rgba(6, 16, 31, 0.72);
  box-shadow: inset 0 0 0 1px rgba(127, 244, 255, 0.08);
}

.signal-quote::before {
  content: "SIGNAL / RX";
  position: absolute;
  left: 0.9rem;
  top: 0.95rem;
  font: 700 0.62rem/1 "Orbitron", system-ui, sans-serif;
  letter-spacing: 0.22em;
  color: rgba(127, 244, 255, 0.8);
  writing-mode: vertical-rl;
}

.signal-quote::after {
  content: "";
  position: absolute;
  inset: 8px;
  border: 1px dashed rgba(127, 244, 255, 0.18);
  pointer-events: none;
}

.signal-quote p {
  margin: 0;
  color: #effbff;
}

.signal-quote cite {
  display: block;
  margin-top: 0.85rem;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-style: normal;
  color: rgba(127, 244, 255, 0.72);
}
```

## 5. 이 저장소 기준 추천 적용 순서

1. `marked` renderer에서 `h2`에 `data-chapter`와 `id`를 심는다.
2. `MarkdownPage` 렌더 후 `wrapChapters(articleRef.current)`로 챕터 section을 만든다.
3. `useChapterNavigation()`과 `useScrollProgress()`를 붙여 sticky chapter rail을 만든다.
4. `.chapter`, `.telemetry-panel`, `.signal-quote`, `.reading-card`, `.waypoint` 스타일을 추가한다.
5. 마지막으로 `@supports (scroll-timeline: --page block)` 안에서 CSS scroll-driven enhancement를 켠다.

## 6. 접근성 / 안정성 체크

```css
@media (prefers-reduced-motion: reduce) {
  .chapter-rail__fill,
  .chapter__heading,
  .chapter__eyebrow,
  .console-skin::after {
    animation: none !important;
    animation-timeline: none !important;
    transform: none !important;
    filter: none !important;
  }
}
```

체크 포인트
- sticky rail은 본문보다 시선이 세지 않게 active 상태 외에는 채도를 낮춘다.
- glow는 챕터 제목/수치/eyebrow에만 집중시키고 본문 텍스트에는 쓰지 않는다.
- `marked` 출력은 신뢰 가능한 콘텐츠에만 그대로 주입한다.

## 레퍼런스

### Scroll-driven animation / progress
- MDN, Scroll-driven animation timelines: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations/Timelines
- MDN, `scroll-timeline`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-timeline
- MDN, `animation-range`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-range
- Chrome for Developers, Scroll-driven animations: https://developer.chrome.com/docs/css-ui/scroll-driven-animations

### IntersectionObserver / scroll metrics
- MDN, Intersection Observer API: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- MDN, `IntersectionObserver.rootMargin`: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin
- MDN, `IntersectionObserver.thresholds`: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds
- MDN, `Element.scrollHeight`: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight
- MDN, `Element.clientHeight`: https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight
- MDN, `Element.scrollTop`: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop
- MDN, `position: sticky`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position

### CSS effects
- MDN, pseudo-elements: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Pseudo-elements
- MDN, `repeating-linear-gradient()`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/repeating-linear-gradient
- MDN, `radial-gradient()`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/radial-gradient
- MDN, `text-shadow`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-shadow
- MDN, `clip-path`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/clip-path
- MDN, `border`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border

### React / markdown component patterns
- React, `useEffect`: https://react.dev/reference/react/useEffect
- React, `useEffectEvent`: https://react.dev/reference/react/useEffectEvent
- React, `useRef`: https://react.dev/reference/react/useRef
- `react-markdown` official docs: https://github.com/remarkjs/react-markdown
- MDX, Using MDX: https://mdxjs.com/docs/using-mdx/
- MDX, Components table: https://mdxjs.com/table-of-components/
- MDX, Injecting components: https://mdxjs.com/guides/injecting-components/

### 현재 저장소와 직접 맞닿는 markdown parser 레퍼런스
- Marked Documentation: https://marked.js.org/
- Marked extensibility (`renderer`, `walkTokens`): https://marked.js.org/using_pro
