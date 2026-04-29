import { Link } from "react-router-dom";
import { getPage, getProjects } from "../lib/content";

const ICONS: Record<string, React.ReactNode> = {
  target: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="8" height="8" rx="1.5" />
      <rect x="14" y="2" width="8" height="8" rx="1.5" />
      <rect x="8" y="14" width="8" height="8" rx="1.5" />
      <line x1="6" y1="10" x2="6" y2="14" />
      <line x1="18" y1="10" x2="12" y2="14" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  file: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

export function HomeRoute() {
  const document = getPage("home");
  const featuredProjects = getProjects().filter(
    (project) => project.frontmatter.featured,
  );

  if (!document) return null;

  const { frontmatter: fm } = document;

  return (
    <section className="home-page">

      {/* ── Hero ── */}
      <section className="home-hero-v2">
        <p className="home-hero__eyebrow">{fm.eyebrow}</p>
        <h2 className="home-headline">
          <span>{fm.hero_line1}</span>
          <span className="home-headline__accent">{fm.hero_line2}</span>
        </h2>
        <p className="home-mission">{fm.mission}</p>

        {fm.stats && fm.stats.length > 0 && (
          <div className="stats-bar">
            {fm.stats.map((s) => (
              <div className="stat-item" key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {fm.cta && fm.cta.length > 0 && (
          <div className="hero-cta">
            {fm.cta.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`cta-btn${item.primary ? " cta-btn--primary" : ""}`}
              >
                {item.label} →
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── 기획 방식 ── */}
      {fm.process && fm.process.length > 0 && (
        <section className="home-section">
          <div className="home-section__header">
            <p className="home-section__eyebrow">HOW I WORK</p>
            <h3>기획 방식</h3>
          </div>
          <div className="process-grid">
            {fm.process.map((item, i) => (
              <article className="process-card" key={item.title} data-index={i}>
                <div className="process-card__icon">
                  {ICONS[item.icon] ?? null}
                </div>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── 대표 프로젝트 ── */}
      {featuredProjects.length > 0 && (
        <section className="home-section">
          <div className="home-section__header home-section__header--row">
            <div>
              <p className="home-section__eyebrow">FEATURED LOGS</p>
              <h3>대표 프로젝트</h3>
            </div>
            <Link className="section-more-link" to="/projects">
              전체 보기 →
            </Link>
          </div>
          <div className="featured-list">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                className="featured-card"
                to={`/projects/${project.slug}`}
              >
                <div className="featured-card__media" aria-hidden="true">
                  <span>{project.frontmatter.title}</span>
                </div>
                <div className="featured-card__content">
                  <p className="featured-card__role">{project.frontmatter.role}</p>
                  <h4>{project.frontmatter.title}</h4>
                  <p>{project.frontmatter.summary}</p>
                  <strong>{project.frontmatter.core_experience}</strong>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Contact CTA ── */}
      {fm.contact && (
        <section className="contact-strip">
          <div>
            <h3>{fm.contact.headline}</h3>
            <p>{fm.contact.body}</p>
          </div>
          <Link className="cta-btn cta-btn--outline" to={fm.contact.href}>
            {fm.contact.label}
          </Link>
        </section>
      )}

    </section>
  );
}
