import { Link } from "react-router-dom";
import { MarkdownPage } from "../components/MarkdownPage";
import { getPage, getProjects } from "../lib/content";

export function ProjectsRoute() {
  const document = getPage("projects");
  const projects = getProjects();

  if (!document) {
    return null;
  }

  return (
    <MarkdownPage document={document}>
      <div className="callout-banner">
        현재 프로젝트 카드는 구조 시연용 초안입니다. 실제 작품명과 성과 수치는
        Markdown 교체만으로 바로 반영되도록 설계했습니다.
      </div>
      <div className="project-grid">
        {projects.map((project) => (
          <Link
            className="project-card"
            key={project.slug}
            to={`/projects/${project.slug}`}
          >
            <p className="project-card__meta">
              {project.frontmatter.period} / {project.frontmatter.role}
            </p>
            <h3>{project.frontmatter.title}</h3>
            <p>{project.frontmatter.summary}</p>
            <strong>{project.frontmatter.story_system_link}</strong>
          </Link>
        ))}
      </div>
    </MarkdownPage>
  );
}

