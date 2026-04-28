import { MarkdownPage } from "../components/MarkdownPage";
import { getGameEntries, getPage } from "../lib/content";

export function GameHistoryRoute() {
  const document = getPage("game-history");
  const games = getGameEntries();

  if (!document) {
    return null;
  }

  return (
    <MarkdownPage document={document}>
      <div className="timeline-list">
        {games.map((game) => (
          <article className="timeline-card" key={game.slug}>
            <div className="timeline-card__header">
              <div>
                <p className="timeline-card__eyebrow">
                  {game.frontmatter.platform} / {game.frontmatter.genre}
                </p>
                <h3>{game.frontmatter.title}</h3>
              </div>
              <span>{game.frontmatter.play_period}</span>
            </div>
            <p>{game.frontmatter.why_it_matters}</p>
            <ul className="chip-list">
              {game.frontmatter.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <div
              className="timeline-card__body markdown-body"
              dangerouslySetInnerHTML={{ __html: game.html }}
            />
          </article>
        ))}
      </div>
    </MarkdownPage>
  );
}

