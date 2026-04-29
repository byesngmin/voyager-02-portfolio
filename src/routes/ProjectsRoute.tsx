import { Link, useSearchParams } from "react-router-dom";
import { MarkdownPage } from "../components/MarkdownPage";
import { getPage, getProjects } from "../lib/content";
import { getSignal } from "../lib/signals";

function hasSignalEmphasis(tags: string[] | undefined, emphasis: string[]) {
  return tags?.some((tag) => emphasis.includes(tag)) ?? false;
}

export function ProjectsRoute() {
  const [searchParams] = useSearchParams();
  const signalKey = searchParams.get("signal");
  const signal = getSignal(signalKey);
  const signalSearch = signal && signalKey ? `?signal=${encodeURIComponent(signalKey)}` : "";
  const document = getPage("projects");
  const baseProjects = getProjects();
  const projects = signal
    ? [...baseProjects].sort((left, right) => {
        const leftTags = (left.frontmatter as { tags?: string[] })
          .tags as string[] | undefined;
        const rightTags = (right.frontmatter as { tags?: string[] })
          .tags as string[] | undefined;
        const leftPriority = hasSignalEmphasis(leftTags, signal.emphasis) ? 0 : 1;
        const rightPriority = hasSignalEmphasis(rightTags, signal.emphasis) ? 0 : 1;

        return leftPriority - rightPriority;
      })
    : baseProjects;
  const withSignal = (href: string) =>
    signalSearch ? `${href}${signalSearch}` : href;

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
            to={withSignal(`/projects/${project.slug}`)}
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
