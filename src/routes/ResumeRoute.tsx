import { MarkdownPage } from "../components/MarkdownPage";
import { getPage } from "../lib/content";

export function ResumeRoute() {
  const document = getPage("resume");

  if (!document) {
    return null;
  }

  return <MarkdownPage document={document} />;
}

