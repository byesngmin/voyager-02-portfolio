import mermaid from "mermaid";
import { ReactNode, useEffect, useRef } from "react";
import { ContentDocument, PageFrontmatter } from "../lib/content";

mermaid.initialize({ startOnLoad: false, theme: "dark" });

type MarkdownPageProps = {
  document: ContentDocument<PageFrontmatter>;
  children?: ReactNode;
};

export function MarkdownPage({ document, children }: MarkdownPageProps) {
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nodes =
      articleRef.current?.querySelectorAll<HTMLElement>(
        ".mermaid:not([data-processed])",
      );

    if (nodes && nodes.length > 0) {
      void mermaid.run({ nodes: Array.from(nodes) });
    }
  }, [document.html]);

  return (
    <section className="page-section">
      <header className="page-header">
        {document.frontmatter.eyebrow ? (
          <p className="page-header__eyebrow">{document.frontmatter.eyebrow}</p>
        ) : null}
        <h2>{document.frontmatter.title}</h2>
        {document.frontmatter.summary ? (
          <p className="page-header__summary">{document.frontmatter.summary}</p>
        ) : null}
      </header>
      {children}
      <article
        ref={articleRef}
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: document.html }}
      />
    </section>
  );
}

