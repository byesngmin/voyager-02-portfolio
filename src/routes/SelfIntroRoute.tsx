import { MarkdownPage } from "../components/MarkdownPage";
import { getPage } from "../lib/content";

export function SelfIntroRoute() {
  const document = getPage("self-intro");

  if (!document) {
    return null;
  }

  return <MarkdownPage document={document} />;
}

