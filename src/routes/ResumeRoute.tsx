import { getPage } from "../lib/content";

const CONTACT_ICONS: Record<string, React.ReactNode> = {
  email: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="16" height="12" rx="2" />
      <polyline points="2,4 10,11 18,4" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="16" height="15" rx="2" />
      <line x1="6" y1="1" x2="6" y2="5" />
      <line x1="14" y1="1" x2="14" y2="5" />
      <line x1="2" y1="8" x2="18" y2="8" />
    </svg>
  ),
  location: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2a6 6 0 0 1 6 6c0 4-6 10-6 10S4 12 4 8a6 6 0 0 1 6-6z" />
      <circle cx="10" cy="8" r="2" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2l7 3v5c0 4-3.5 7-7 8-3.5-1-7-4-7-8V5l7-3z" />
    </svg>
  ),
};

export function ResumeRoute() {
  const document = getPage("resume");
  if (!document) return null;

  const fm = document.frontmatter;
  const p = fm.profile;

  return (
    <article className="resume-page page-section">

      {/* ── Profile ── */}
      <section className="resume-profile">
        <div className="resume-profile__photo" aria-hidden="true">
          <span>{p?.name?.[0] ?? "?"}</span>
        </div>
        <div className="resume-profile__body">
          <div className="resume-profile__top">
            <h2 className="resume-name">{p?.name}</h2>
            <div className="resume-role-tags">
              {p?.role?.split(" ").map((tag, i) => (
                <span key={i} className="resume-role-tag">{tag}</span>
              ))}
            </div>
          </div>
          <p className="resume-tagline">{p?.tagline}</p>
          <p className="resume-bio">{p?.bio}</p>
          <div className="resume-contact-grid">
            {p?.contact?.map((c) => (
              <div key={c.label} className="resume-contact-item">
                <span className="resume-contact-item__icon">
                  {CONTACT_ICONS[c.icon ?? ""] ?? null}
                </span>
                <div>
                  <span className="resume-contact-item__label">{c.label}</span>
                  <span className="resume-contact-item__value">{c.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Two-column body ── */}
      <div className="resume-columns">

        {/* Left: 학력 + 자격증 */}
        <div className="resume-col">
          {fm.education && fm.education.length > 0 && (
            <section className="resume-section">
              <h3 className="resume-section__title">
                <span className="resume-section__icon" aria-hidden="true">◫</span>
                학력 및 교육
              </h3>
              <div className="edu-list">
                {fm.education.map((edu, i) => (
                  <div key={i} className="edu-item">
                    <div className="edu-item__marker" />
                    <div className="edu-item__content">
                      <h4 className="edu-item__school">{edu.school}</h4>
                      <p className="edu-item__period">{edu.period}</p>
                      {edu.description && (
                        <p className="edu-item__desc">{edu.description}</p>
                      )}
                      {edu.points && edu.points.length > 0 && (
                        <ul className="edu-item__points">
                          {edu.points.map((pt, j) => (
                            <li key={j}>{pt}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {fm.certifications && fm.certifications.length > 0 && (
            <section className="resume-section">
              <h3 className="resume-section__title">
                <span className="resume-section__icon" aria-hidden="true">◈</span>
                자격증
              </h3>
              <div className="cert-list">
                {fm.certifications.map((cert, i) => (
                  <div key={i} className="cert-item">
                    <strong>{cert.name}</strong>
                    {cert.score && (
                      <span className="cert-item__score">점수 {cert.score}</span>
                    )}
                    {cert.year && (
                      <span className="cert-item__year">취득 {cert.year}</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right: 프로젝트 경험 */}
        <div className="resume-col">
          {fm.projects_exp && fm.projects_exp.length > 0 && (
            <section className="resume-section">
              <h3 className="resume-section__title">
                <span className="resume-section__icon" aria-hidden="true">⬡</span>
                프로젝트 경험
              </h3>
              <div className="proj-list">
                {fm.projects_exp.map((proj, i) => (
                  <div key={i} className="proj-item">
                    <div className="proj-item__dot" />
                    {i < (fm.projects_exp?.length ?? 0) - 1 && (
                      <div className="proj-item__line" />
                    )}
                    <div className="proj-item__content">
                      <div className="proj-item__header">
                        <h4 className="proj-item__title">{proj.title}</h4>
                        <span className="proj-item__period">{proj.period}</span>
                      </div>
                      <div className="proj-role-tag">{proj.role}</div>
                      {proj.team && (
                        <div className="proj-team-chips">
                          {proj.team.split("/").map((t) => (
                            <span key={t} className="proj-team-chip">
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      {proj.points && proj.points.length > 0 && (
                        <ul className="proj-item__points">
                          {proj.points.map((pt, j) => (
                            <li key={j}>{pt}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* ── Skills / Tools ── */}
      {fm.tools && fm.tools.length > 0 && (
        <section className="resume-section resume-tools-section">
          <h3 className="resume-section__title">
            <span className="resume-section__icon" aria-hidden="true">⚙</span>
            기술 역량 및 도구
          </h3>
          <div className="tool-grid">
            {fm.tools.map((cat) => (
              <div key={cat.category} className="tool-category">
                <p className="tool-category__label">{cat.category}</p>
                {cat.items.map((tool) => (
                  <div key={tool.name} className="tool-item">
                    <div
                      className="tool-item__icon"
                      style={{ background: tool.color ?? "rgba(127,244,255,0.15)" }}
                    >
                      {tool.name[0]}
                    </div>
                    <div className="tool-item__body">
                      <strong>{tool.name}</strong>
                      <p>{tool.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

    </article>
  );
}
