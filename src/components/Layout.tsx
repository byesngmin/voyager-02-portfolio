import { ReactNode, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

type LayoutProps = {
  children: ReactNode;
};

type NavItem = {
  to: string;
  label: string;
  subtle?: boolean;
};

const INTRO_KEY = 'futuremix-intro-seen';

const navItems: NavItem[] = [
  { to: "/", label: "지원 개요" },
  { to: "/resume", label: "이력서" },
  { to: "/self-intro", label: "자기소개서" },
  { to: "/projects", label: "프로젝트" },
  { to: "/game-history", label: "게임 이력" },
];

export function Layout({ children }: LayoutProps) {
  const [navOpen, setNavOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const handleReplayIntro = () => {
    try {
      sessionStorage.removeItem(INTRO_KEY);
    } catch {}

    window.location.reload();
  };

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

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="app-shell">
      <div className="app-shell__backdrop" aria-hidden="true" />
      <div className="cosmic-field" aria-hidden="true">
        <span className="cosmic-field__stars cosmic-field__stars--near" />
        <span className="cosmic-field__stars cosmic-field__stars--far" />
        <span className="cosmic-field__orbit" />
      </div>
      <header className="site-header">
        <div className="site-header__brand">
          <p className="site-header__eyebrow">
            <svg
              aria-hidden="true"
              fill="currentColor"
              height="1em"
              viewBox="0 0 24 24"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 11h3l2-6 3.5 13L15 8l2 6h4v2h-5.5L15 14l-3.5 10L8 11l-.5 2H3z" />
            </svg>
          </p>
          <div>
            <h1>VOYAGER-02</h1>
            <p>PATIMA 시스템·콘텐츠 기획 지원 · 황승민</p>
          </div>
          <div className="site-header__telemetry" aria-hidden="true">
            <span><i /> SIGNAL LOCKED</span>
            <span>PATIMA APPLICATION</span>
            <span>EARTH / SECTOR 02</span>
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
          <button
            className="intro-replay-btn"
            type="button"
            onClick={handleReplayIntro}
            aria-label="인트로 다시보기"
          >
            <span className="intro-replay-btn__icon" aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="site-layout">
        <main className="site-main">{children}</main>
        <aside className="site-sidebar">
          <div className="site-sidebar__panel">
            <p className="site-header__eyebrow">SIGNAL INDEX</p>
            <div className="sidebar-radar" aria-hidden="true">
              <span className="sidebar-radar__sweep" />
              <i />
            </div>
            <nav className="site-nav" aria-label="주요 메뉴">
              {navItems.map((item, index) => (
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
                  <span className="site-nav__number">{String(index + 1).padStart(2, "0")}</span>
                  <span>{item.label}</span>
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
        <p>HWANG SEUNGMIN · GAME CONTENT PLANNER</p>
        <p>SYSTEM × CONTENT × PLAYER EXPERIENCE</p>
      </footer>
      <button
        className={"back-to-top-btn" + (showTop ? " is-visible" : "")}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="맨 위로"
        type="button"
      >
        ↑
      </button>
    </div>
  );
}

