import { Link, useSearchParams } from "react-router-dom";
import { getPage, getProjects } from "../lib/content";
import { getSignal } from "../lib/signals";

export function HomeRoute() {
  const [searchParams] = useSearchParams();
  const signalKey = searchParams.get("signal");
  const signal = getSignal(signalKey);
  const signalSearch = signal && signalKey ? `?signal=${encodeURIComponent(signalKey)}` : "";
  const document = getPage("home");
  const featuredProjects = getProjects().filter(
    (project) => project.frontmatter.featured,
  );

  if (!document) {
    return null;
  }

  const { frontmatter } = document;
  const withSignal = (href: string) =>
    signalSearch ? `${href}${signalSearch}` : href;

  return (
    <section className="home-page">
      <div className="home-hero">
        <div className="home-hero__copy">
          <p className="home-hero__eyebrow">{frontmatter.eyebrow}</p>
          <h2>{frontmatter.title}</h2>
          {signal ? (
            <p className="home-hero__signal-greeting">{signal.greeting}</p>
          ) : null}
          <p className="home-hero__summary">{frontmatter.summary}</p>
          {frontmatter.mission ? (
            <blockquote className="signal-quote">{frontmatter.mission}</blockquote>
          ) : null}
          <div
            className="home-hero__body markdown-body"
            dangerouslySetInnerHTML={{ __html: document.html }}
          />
        </div>
        <div className="voyager-panel" aria-hidden="true">
          <div className="voyager-panel__planet voyager-panel__planet--primary" />
          <div className="voyager-panel__planet voyager-panel__planet--secondary" />
          <div className="voyager-panel__ship">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      <section className="content-grid">
        {frontmatter.highlights?.map((highlight) => (
          <article className="signal-card" key={highlight.title}>
            <p className="signal-card__label">SIGNAL</p>
            <h3>{highlight.title}</h3>
            <p>{highlight.body}</p>
          </article>
        ))}
      </section>

      <section className="planet-grid">
        {frontmatter.quickLinks?.map((item) => (
          <Link className="planet-card" key={item.href} to={withSignal(item.href)}>
            <p className="planet-card__eyebrow">DESTINATION</p>
            <h3>{item.label}</h3>
            <p>{item.note}</p>
          </Link>
        ))}
      </section>

      <section className="featured-strip">
        <div className="section-title">
          <p>FEATURED LOGS</p>
          <h3>서사와 시스템의 연결을 먼저 보여주는 프로젝트 초안</h3>
        </div>
        <div className="project-grid">
          {featuredProjects.map((project) => (
            <Link
              className="project-card"
              key={project.slug}
              to={`/projects/${project.slug}`}
            >
              <p className="project-card__meta">{project.frontmatter.role}</p>
              <h4>{project.frontmatter.title}</h4>
              <p>{project.frontmatter.summary}</p>
              <strong>{project.frontmatter.core_experience}</strong>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
