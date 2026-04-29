import { ReactNode, useEffect, useRef, useState } from "react";
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
  { to: "/records", label: "사이트 기획과 개발 로그", subtle: true },
];

export function Layout({ children }: LayoutProps) {
  const [navOpen, setNavOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (navOpen) {
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = "";
      };
    }

    document.body.style.overflow = "";

    return undefined;
  }, [navOpen]);

  useEffect(() => {
    if (!navOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNavOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return undefined;
    }

    if (navOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }

    return undefined;
  }, [navOpen]);

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
          <button
            aria-expanded={navOpen}
            aria-label="메뉴 열기"
            className="site-header__menu-btn"
            onClick={() => setNavOpen(true)}
            type="button"
          >
            <span aria-hidden="true">☰</span>
            <span>메뉴</span>
          </button>
        </div>
      </header>

      <div className="site-layout">
        <main className="site-main">{children}</main>
        <aside className="site-sidebar">
          <div className="site-sidebar__panel">
            <p className="site-header__eyebrow">Orbital Map</p>
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
          </div>
        </aside>
        <dialog
          aria-label="사이트 내비게이션"
          className="nav-dialog"
          ref={dialogRef}
        >
          <button
            aria-label="메뉴 닫기"
            className="nav-dialog__close"
            onClick={() => setNavOpen(false)}
            type="button"
          >
            ✕ 닫기
          </button>
          <nav className="site-nav" aria-label="모바일 메뉴">
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
                onClick={() => setNavOpen(false)}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </dialog>
      </div>

      <footer className="site-footer">
        <p>Voyager-02 Portfolio v1</p>
        <p>3일 x 4시간, 총 12시간을 기준으로 설계된 GitHub Pages SPA</p>
      </footer>
    </div>
  );
}

