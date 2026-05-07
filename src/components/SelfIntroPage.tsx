import mermaid from "mermaid";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { ContentDocument, PageFrontmatter } from "../lib/content";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

mermaid.initialize({ startOnLoad: false, theme: "dark" });

const CHAPTER_META = [
  { code: "CH.01", waypoint: "LAUNCH", theme: "deep" },
  { code: "CH.02", waypoint: "ORIGIN", theme: "deep" },
  { code: "CH.03", waypoint: "SYSTEM", theme: "signal" },
  { code: "CH.04", waypoint: "ORBIT", theme: "signal" },
  { code: "CH.05", waypoint: "UPTIME", theme: "burn" },
  { code: "CH.06", waypoint: "ARCHIVE", theme: "deep" },
];

type SIChapter = {
  id: string;
  code: string;
  waypoint: string;
  label: string;
  theme: string;
};

type SelfIntroPageProps = {
  document: ContentDocument<PageFrontmatter>;
};

export function SelfIntroPage({ document }: SelfIntroPageProps) {
  const articleRef = useRef<HTMLElement>(null);
  const [chapters, setChapters] = useState<SIChapter[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const nodes =
      articleRef.current?.querySelectorAll<HTMLElement>(
        ".mermaid:not([data-processed])",
      ) ?? [];

    if (nodes.length > 0) {
      void mermaid.run({ nodes: Array.from(nodes) });
    }
  }, [document.html]);

  useEffect(() => {
    const nodes = Array.from(
      articleRef.current?.querySelectorAll<HTMLElement>("[data-chapter]") ?? [],
    );
    const extracted: SIChapter[] = nodes.map((node, index) => ({
      id: node.id,
      code: CHAPTER_META[index]?.code ?? `CH.0${index + 1}`,
      waypoint: CHAPTER_META[index]?.waypoint ?? "WP",
      label:
        node.dataset.chapterTitle ?? node.textContent?.trim() ?? node.id,
      theme: CHAPTER_META[index]?.theme ?? "deep",
    }));

    setChapters(extracted);
    setActiveId((current) => {
      if (extracted.length === 0) {
        return null;
      }

      if (current && extracted.some((chapter) => chapter.id === current)) {
        return current;
      }

      return extracted[0].id;
    });
  }, [document.html]);

  useEffect(() => {
    if (!articleRef.current || chapters.length === 0) {
      return;
    }

    const nodes = Array.from(
      articleRef.current.querySelectorAll<HTMLElement>("[data-chapter]"),
    );
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(
            (entry.target as HTMLElement).id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        }

        const best = [...ratios.entries()].sort((a, b) => b[1] - a[1])[0];

        if (best && best[1] > 0) {
          setActiveId(best[0]);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [chapters]);

  useEffect(() => {
    const update = () => {
      const top = Math.max(0, window.scrollY);
      const max = Math.max(
        1,
        window.document.documentElement.scrollHeight - window.innerHeight,
      );

      setProgress(Math.min(1, top / max));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const activeChapter = chapters.find((chapter) => chapter.id === activeId);

  return (
    <section
      className="page-section si-page"
      data-si-theme={activeChapter?.theme ?? "deep"}
    >
      <header className="page-header">
        {document.frontmatter.eyebrow ? (
          <p className="page-header__eyebrow">{document.frontmatter.eyebrow}</p>
        ) : null}
        <h2>{document.frontmatter.title}</h2>
        {document.frontmatter.summary ? (
          <p className="page-header__summary">{document.frontmatter.summary}</p>
        ) : null}
      </header>

      <div className="si-shell">
        <article
          ref={articleRef}
          className="si-body markdown-body"
          dangerouslySetInnerHTML={{ __html: document.html }}
        />

        {chapters.length > 0 ? (
          <aside className="si-rail" aria-label="챕터 목차">
            <div className="si-track" aria-hidden="true">
              <div
                className="si-track__fill"
                style={
                  reduced
                    ? undefined
                    : ({ "--si-progress": progress } as CSSProperties)
                }
              />
              {chapters.map((chapter, index) => (
                <span
                  key={chapter.id}
                  className="si-track__dot"
                  data-active={chapter.id === activeId}
                  style={
                    {
                      "--si-dot-pos": `${
                        (index / Math.max(1, chapters.length - 1)) * 100
                      }%`,
                    } as CSSProperties
                  }
                  aria-hidden="true"
                />
              ))}
            </div>

            <ol className="si-chapter-list">
              {chapters.map((chapter) => (
                <li key={chapter.id}>
                  <a
                    href={`#${chapter.id}`}
                    className="si-chapter-item"
                    data-active={chapter.id === activeId}
                    aria-current={
                      chapter.id === activeId ? "location" : undefined
                    }
                  >
                    <span className="si-chapter-item__code">
                      {chapter.code}
                    </span>
                    <span className="si-chapter-item__wp">
                      {chapter.waypoint}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
