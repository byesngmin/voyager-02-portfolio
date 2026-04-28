import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

type LayoutProps = {
  children: ReactNode;
};

const navItems = [
  { to: "/", label: "개요" },
  { to: "/resume", label: "이력서" },
  { to: "/self-intro", label: "자기소개서" },
  { to: "/projects", label: "프로젝트" },
  { to: "/game-history", label: "게임 이력" },
  { to: "/devlog", label: "개발 로그" },
  { to: "/site-plan", label: "사이트 기획서", subtle: true },
];

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app-shell">
      <div className="app-shell__backdrop" aria-hidden="true" />
      <header className="site-header">
        <div className="site-header__brand">
          <p className="site-header__eyebrow">VOYAGER 02</p>
          <div>
            <h1>게임 콘텐츠 기획자 포트폴리오</h1>
            <p>스토리텔링과 콘텐츠 결합으로 몰입감을 설계하는 항해 기록</p>
          </div>
        </div>
        <nav className="site-nav" aria-label="주요 메뉴">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                [
                  "site-nav__link",
                  item.subtle ? "site-nav__link--subtle" : "",
                  isActive ? "is-active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="site-main">{children}</main>

      <footer className="site-footer">
        <p>Voyager-02 Portfolio v1</p>
        <p>3일 x 4시간, 총 12시간을 기준으로 설계된 GitHub Pages SPA</p>
      </footer>
    </div>
  );
}

