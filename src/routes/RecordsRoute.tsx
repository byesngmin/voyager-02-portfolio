import { getDevlogs, getPage } from "../lib/content";

export function RecordsRoute() {
  const hub = getPage("records");
  const plan = getPage("site-plan");
  const devlog = getPage("devlog");
  const logs = getDevlogs();

  if (!hub || !plan || !devlog) {
    return null;
  }

  return (
    <section className="page-section document-hub">
      <header className="page-header">
        {hub.frontmatter.eyebrow ? (
          <p className="page-header__eyebrow">{hub.frontmatter.eyebrow}</p>
        ) : null}
        <h2>{hub.frontmatter.title}</h2>
        {hub.frontmatter.summary ? (
          <p className="page-header__summary">{hub.frontmatter.summary}</p>
        ) : null}
      </header>

      <article
        className="callout-banner markdown-body"
        dangerouslySetInnerHTML={{ __html: hub.html }}
      />

      <div className="document-brief">
        <article className="data-card">
          <p className="signal-card__label">Plan First</p>
          <strong>기획의 10요소와 구조 기준을 먼저 고정하고, 실제 구현을 그 아래에 누적합니다.</strong>
        </article>
        <article className="data-card">
          <p className="signal-card__label">Build Trace</p>
          <strong>개발 로그는 일정 기록이 아니라 선택 이유와 수정 근거를 남기는 제작 추적선입니다.</strong>
        </article>
        <article className="data-card">
          <p className="signal-card__label">One Hub</p>
          <strong>문서를 한 화면에 묶어 설계 의도와 결과물이 분리되지 않도록 읽기 흐름을 통합합니다.</strong>
        </article>
      </div>

      <div className="document-shell">
        <section className="document-section">
          <header className="document-section__header">
            {plan.frontmatter.eyebrow ? (
              <p className="page-header__eyebrow">{plan.frontmatter.eyebrow}</p>
            ) : null}
            <h3>{plan.frontmatter.title}</h3>
            {plan.frontmatter.summary ? <p>{plan.frontmatter.summary}</p> : null}
          </header>
          <article
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: plan.html }}
          />
        </section>

        <section className="document-section">
          <header className="document-section__header">
            {devlog.frontmatter.eyebrow ? (
              <p className="page-header__eyebrow">{devlog.frontmatter.eyebrow}</p>
            ) : null}
            <h3>{devlog.frontmatter.title}</h3>
            {devlog.frontmatter.summary ? <p>{devlog.frontmatter.summary}</p> : null}
          </header>

          <article
            className="markdown-body document-section__intro"
            dangerouslySetInnerHTML={{ __html: devlog.html }}
          />

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
        </section>
      </div>
    </section>
  );
}
