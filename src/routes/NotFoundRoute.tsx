import { Link } from "react-router-dom";

export function NotFoundRoute() {
  return (
    <section className="page-section">
      <header className="page-header">
        <p className="page-header__eyebrow">LOST SIGNAL</p>
        <h2>이 좌표에는 페이지가 없습니다.</h2>
        <p className="page-header__summary">
          탐사 경로를 다시 맞추면 항해 기록으로 복귀할 수 있습니다.
        </p>
      </header>
      <Link className="planet-card planet-card--inline" to="/">
        메인 허브로 돌아가기
      </Link>
    </section>
  );
}

