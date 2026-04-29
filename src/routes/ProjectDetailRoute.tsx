import { Link, useParams } from "react-router-dom";
import { getProject } from "../lib/content";

function MediaPanel({
  media,
}: {
  media:
    | {
        type?: "video" | "game" | "note";
        title: string;
        caption?: string;
        embedUrl?: string;
        externalUrl?: string;
      }
    | undefined;
}) {
  if (!media) {
    return null;
  }

  return (
    <section className="media-shell">
      <div className="section-title">
        <p>MEDIA SLOT</p>
        <h3>{media.title}</h3>
      </div>
      {media.embedUrl ? (
        <iframe
          className="media-shell__frame"
          src={media.embedUrl}
          title={media.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="media-shell__placeholder">
          <p>{media.type === "game" ? "1분 웹게임" : "1분 영상"} 업로드 슬롯</p>
          <strong>{media.caption ?? "외부 임베드 또는 링크로 연결할 수 있습니다."}</strong>
          {media.externalUrl ? (
            <a href={media.externalUrl} rel="noreferrer" target="_blank">
              외부 링크 열기
            </a>
          ) : null}
        </div>
      )}
      {media.caption ? <p className="media-shell__caption">{media.caption}</p> : null}
    </section>
  );
}

export function ProjectDetailRoute() {
  const { slug } = useParams();
  const project = slug ? getProject(slug) : undefined;

  if (!project) {
    return (
      <section className="page-section">
        <header className="page-header">
          <p className="page-header__eyebrow">PROJECT NOT FOUND</p>
          <h2>해당 프로젝트를 찾을 수 없습니다.</h2>
        </header>
        <Link className="planet-card planet-card--inline" to="/projects">
          프로젝트 목록으로 돌아가기
        </Link>
      </section>
    );
  }

  return (
    <section className="page-section project-detail">
      <header className="page-header">
        <p className="page-header__eyebrow">{project.frontmatter.role}</p>
        <h2>{project.frontmatter.title}</h2>
        <p className="page-header__summary">{project.frontmatter.summary}</p>
      </header>

      <div className="project-detail__meta-card">
        <div className="project-detail__meta-item">
          <p className="project-detail__meta-label">역할</p>
          <p className="project-detail__meta-value">{project.frontmatter.role}</p>
        </div>
        <div className="project-detail__meta-item">
          <p className="project-detail__meta-label">기간</p>
          <p className="project-detail__meta-value">{project.frontmatter.period}</p>
        </div>
        <div className="project-detail__meta-item">
          <p className="project-detail__meta-label">핵심 경험</p>
          <p className="project-detail__meta-value">{project.frontmatter.core_experience}</p>
        </div>
      </div>

      <div className="data-grid">
        <article className="data-card">
          <p>핵심 경험</p>
          <strong>{project.frontmatter.core_experience}</strong>
        </article>
        <article className="data-card">
          <p>서사-시스템 연결</p>
          <strong>{project.frontmatter.story_system_link}</strong>
        </article>
        <article className="data-card">
          <p>기간</p>
          <strong>{project.frontmatter.period}</strong>
        </article>
      </div>

      <blockquote className="project-detail__story-link">
        {project.frontmatter.story_system_link}
      </blockquote>

      <section className="page-subsection">
        <div className="section-title">
          <p>CONTRIBUTION</p>
          <h3>무엇을 맡았고, 무엇을 남겼는가</h3>
        </div>
        <ul className="chip-list">
          {project.frontmatter.contribution.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <MediaPanel media={project.frontmatter.media} />

      <article
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: project.html }}
      />

      {project.frontmatter.links?.length ? (
        <section className="page-subsection">
          <div className="section-title">
            <p>LINKS</p>
            <h3>연결 자산</h3>
          </div>
          <div className="link-row">
            {project.frontmatter.links.map((link) => (
              <a href={link.href} key={link.href} rel="noreferrer" target="_blank">
                {link.label}
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <div className="project-detail__cta">
        <Link className="site-nav__link" to="/projects">
          모든 프로젝트 보기
        </Link>
        <Link className="site-nav__link site-nav__link--subtle" to="/records">
          기획/로그 보기
        </Link>
      </div>
    </section>
  );
}
