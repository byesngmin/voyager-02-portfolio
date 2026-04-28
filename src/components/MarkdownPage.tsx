import { ReactNode } from "react";
import { ContentDocument, PageFrontmatter } from "../lib/content";

type MarkdownPageProps = {
  document: ContentDocument<PageFrontmatter>;
  children?: ReactNode;
};

export function MarkdownPage({ document, children }: MarkdownPageProps) {
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
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: document.html }}
      />
    </section>
  );
}

