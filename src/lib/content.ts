import { marked } from "marked";
import { parse as parseYaml } from "yaml";

marked.setOptions({
  breaks: true,
  gfm: true,
});

type BaseFrontmatter = {
  title: string;
  slug?: string;
  order?: number;
};

export type PageFrontmatter = BaseFrontmatter & {
  eyebrow?: string;
  summary?: string;
  mission?: string;
  signature?: string;
  hero_line1?: string;
  hero_line2?: string;
  stats?: { value: string; label: string }[];
  cta?: { label: string; href: string; primary?: boolean }[];
  process?: { icon: string; title: string; body: string }[];
  contact?: { headline: string; body: string; href: string; label: string };
  highlights?: { title: string; body: string }[];
  quickLinks?: { label: string; href: string; note: string }[];
  skills?: {
    category: string;
    items: { label: string; level: number }[];
  }[];
  profile?: {
    name?: string;
    role?: string;
    tagline?: string;
    bio?: string;
    contact?: { label: string; value: string; icon?: string }[];
  };
  education?: {
    school: string;
    period: string;
    description?: string;
    points?: string[];
  }[];
  certifications?: {
    name: string;
    score?: string;
    year?: string;
  }[];
  projects_exp?: {
    title: string;
    period: string;
    role: string;
    team?: string;
    points?: string[];
  }[];
  tools?: {
    category: string;
    items: { name: string; color?: string; description: string }[];
  }[];
};

export type ProjectFrontmatter = BaseFrontmatter & {
  summary: string;
  role: string;
  period: string;
  core_experience: string;
  story_system_link: string;
  contribution: string[];
  featured?: boolean;
  media?: {
    type?: "video" | "game" | "note";
    title: string;
    caption?: string;
    embedUrl?: string;
    externalUrl?: string;
  };
  links?: { label: string; href: string }[];
};

export type GameHistoryFrontmatter = BaseFrontmatter & {
  platform: string;
  genre: string;
  play_period: string;
  why_it_matters: string;
  tags: string[];
};

export type DevlogFrontmatter = BaseFrontmatter & {
  date: string;
  topic: string;
  decision: string;
  problem: string;
  resolution: string;
  next_step: string;
};

export type ContentDocument<T extends BaseFrontmatter> = {
  slug: string;
  frontmatter: T;
  html: string;
  raw: string;
};

function createDocument<T extends BaseFrontmatter>(
  path: string,
  raw: string,
): ContentDocument<T> {
  const normalized = raw.replace(/\r\n/g, "\n");
  const fileSlug = path.split("/").pop()?.replace(".md", "") ?? "untitled";
  let frontmatter = {} as T;
  let content = normalized;

  if (normalized.startsWith("---\n")) {
    const boundaryIndex = normalized.indexOf("\n---\n", 4);

    if (boundaryIndex !== -1) {
      const frontmatterBlock = normalized.slice(4, boundaryIndex);
      content = normalized.slice(boundaryIndex + 5);
      frontmatter = parseYaml(frontmatterBlock) as T;
    }
  }

  const slug = frontmatter.slug ?? fileSlug;

  return {
    slug,
    frontmatter,
    html: marked.parse(content) as string,
    raw: content,
  };
}

function loadCollection<T extends BaseFrontmatter>(
  modules: Record<string, string>,
): ContentDocument<T>[] {
  return Object.entries(modules)
    .map(([path, raw]) => createDocument<T>(path, raw))
    .sort(
      (left, right) =>
        (left.frontmatter.order ?? 999) - (right.frontmatter.order ?? 999),
    );
}

const pageModules = import.meta.glob("../content/pages/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

const projectModules = import.meta.glob("../content/projects/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

const gameModules = import.meta.glob("../content/game-history/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

const devlogModules = import.meta.glob("../content/devlog/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

const pages = loadCollection<PageFrontmatter>(pageModules);
const projects = loadCollection<ProjectFrontmatter>(projectModules);
const gameEntries = loadCollection<GameHistoryFrontmatter>(gameModules);
const devlogs = loadCollection<DevlogFrontmatter>(devlogModules).sort((a, b) =>
  a.frontmatter.date < b.frontmatter.date ? 1 : -1,
);

export function getPage(slug: string) {
  return pages.find((page) => page.slug === slug);
}

export function getProjects() {
  return [...projects].sort((a, b) => {
    const leftFeatured = a.frontmatter.featured ? 0 : 1;
    const rightFeatured = b.frontmatter.featured ? 0 : 1;

    return leftFeatured - rightFeatured;
  });
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getGameEntries() {
  return gameEntries;
}

export function getDevlogs() {
  return devlogs;
}
