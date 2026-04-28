import { MarkdownPage } from "../components/MarkdownPage";
import { getDevlogs, getPage } from "../lib/content";

export function DevlogRoute() {
  const document = getPage("devlog");
  const logs = getDevlogs();

  if (!document) {
    return null;
  }

  return (
    <MarkdownPage document={document}>
      <div className="timeline-list">
        {logs.map((log) => (
          <article className="timeline-card" key={log.slug}>
            <div className="timeline-card__header">
              <div>
                <p className="timeline-card__eyebrow">{log.frontmatter.topic}</p>
                <h3>{log.frontmatter.title}</h3>
              </div>
              <span>{log.frontmatter.date}</span>
            </div>
            <div className="devlog-grid">
              <div>
                <p>Decision</p>
                <strong>{log.frontmatter.decision}</strong>
              </div>
              <div>
                <p>Problem</p>
                <strong>{log.frontmatter.problem}</strong>
              </div>
              <div>
                <p>Resolution</p>
                <strong>{log.frontmatter.resolution}</strong>
              </div>
              <div>
                <p>Next Step</p>
                <strong>{log.frontmatter.next_step}</strong>
              </div>
            </div>
            <div
              className="timeline-card__body markdown-body"
              dangerouslySetInnerHTML={{ __html: log.html }}
            />
          </article>
        ))}
      </div>
    </MarkdownPage>
  );
}

