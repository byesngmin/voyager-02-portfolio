import mermaid from "mermaid";
import { useEffect, useRef } from "react";
import { ContentDocument, PageFrontmatter } from "../lib/content";

mermaid.initialize({ startOnLoad: false, theme: "dark" });

type SelfIntroPageProps = {
  document: ContentDocument<PageFrontmatter>;
};

export function SelfIntroPage({ document }: SelfIntroPageProps) {
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nodes =
      articleRef.current?.querySelectorAll<HTMLElement>(
        ".mermaid:not([data-processed])",
      ) ?? [];

    if (nodes.length > 0) {
      void mermaid.run({ nodes: Array.from(nodes) });
    }
  }, [document.html]);

  return (
    <section className="page-section si-page">
      <header className="page-header">
        {document.frontmatter.eyebrow ? (
          <p className="page-header__eyebrow">{document.frontmatter.eyebrow}</p>
        ) : null}
        <h2>{document.frontmatter.title}</h2>
        {document.frontmatter.summary ? (
          <p className="page-header__summary">{document.frontmatter.summary}</p>
        ) : null}
      </header>

      <article
        ref={articleRef}
        className="si-body markdown-body"
        dangerouslySetInnerHTML={{ __html: document.html }}
      />
    </section>
  );
}
