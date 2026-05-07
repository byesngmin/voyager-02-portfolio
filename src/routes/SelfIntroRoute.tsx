import { SelfIntroPage } from "../components/SelfIntroPage";
import { getPage } from "../lib/content";

export function SelfIntroRoute() {
  const document = getPage("self-intro");
  if (!document) return null;
  return <SelfIntroPage document={document} />;
}

