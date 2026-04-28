import { MarkdownPage } from "../components/MarkdownPage";
import { getPage } from "../lib/content";

export function SitePlanRoute() {
  const document = getPage("site-plan");

  if (!document) {
    return null;
  }

  return (
    <MarkdownPage document={document}>
      <div className="callout-banner">
        이 문서는 메뉴에만 고정된 항목입니다. 프로젝트 설명과 분리해 사이트 설계
        자체를 독립 자산으로 보이도록 구성했습니다.
      </div>
    </MarkdownPage>
  );
}

