import { MarkdownPage } from "../components/MarkdownPage";
import { getPage } from "../lib/content";

export function ResumeRoute() {
  const document = getPage("resume");

  if (!document) {
    return null;
  }

  const skills = document.frontmatter.skills;

  const getGauge = (level: number) => {
    const normalizedLevel = Math.max(0, Math.min(5, Math.floor(level)));

    return "\u25B0".repeat(normalizedLevel) + "\u25B1".repeat(5 - normalizedLevel);
  };

  return (
    <>
      <MarkdownPage document={document} />
      {skills?.length ? (
        <section className="page-subsection">
          <div className="section-title">
            <p>SKILL SIGNALS</p>
            <h3>\uC5ED\uB7C9 \uC2A4\uD399\uD2B8\uB7FC</h3>
          </div>
          <div className="skill-matrix">
            {skills.map((category) => (
              <div key={category.category}>
                <p className="skill-matrix__category-label">{category.category}</p>
                {category.items.map((item) => (
                  <div className="skill-matrix__item" key={item.label}>
                    <span className="skill-matrix__label">{item.label}</span>
                    <span className="skill-matrix__gauge">
                      {getGauge(item.level)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
