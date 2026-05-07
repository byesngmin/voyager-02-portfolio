import { ReactNode, useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";

type LayoutProps = {
  children: ReactNode;
};

type NavItem = {
  to: string;
  label: string;
  subtle?: boolean;
};

const INTRO_KEY = 'voyager02-intro-seen';

const navItems: NavItem[] = [
  { to: "/", label: "개요" },
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
              <path d="M19.59 3l-8.6 8.6a5.867 5.867 0 0 1 1.117 2.285l2.513-2.513 1.768 1.768-2.535 2.535a5.88 5.88 0 0 1-1.294 6.618L11.013 21.25a5.875 5.875 0 0 1-8.31-8.31l1.015-1.015a5.88 5.88 0 0 1 6.618-1.294l2.535-2.535 1.768 1.768-2.513 2.513a5.867 5.867 0 0 1 2.285 1.117l8.6-8.6L19.59 3zm-9.94 8.94a3.875 3.875 0 1 0-5.48 5.48 3.875 3.875 0 0 0 5.48-5.48z" />
            </svg>
          </p>
          <div>
            <h1>게임 콘텐츠 기획자 포트폴리오</h1>
            <p>스토리텔링과 콘텐츠 결합으로 몰입감을 설계하는 항해 일지</p>
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
            <span className="intro-replay-btn__label">인트로 다시보기</span>
          </button>
          <Link className="devlog-shortcut-btn" to="/records" aria-label="개발 로그">
            <span className="devlog-shortcut-btn__icon" aria-hidden="true" />
            <span className="devlog-shortcut-btn__label">개발 로그</span>
          </Link>
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

