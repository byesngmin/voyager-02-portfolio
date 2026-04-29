import { ReactNode, useEffect, useMemo, useState } from "react";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

const INTRO_STORAGE_KEY = "voyager02-intro-seen";
const INTRO_DURATION_MS = 1600;

type IntroGateProps = {
  children: ReactNode;
};

function hasSeenIntro() {
  try {
    return window.sessionStorage.getItem(INTRO_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markIntroSeen() {
  try {
    window.sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
  } catch {
    // Ignore storage errors for private browsing or disabled storage.
  }
}

export function IntroGate({ children }: IntroGateProps) {
  const reducedMotion = usePrefersReducedMotion();
  const shouldPlayIntro = useMemo(
    () => !reducedMotion && !hasSeenIntro(),
    [reducedMotion],
  );
  const [isVisible, setIsVisible] = useState(shouldPlayIntro);

  useEffect(() => {
    if (!shouldPlayIntro) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    const timer = window.setTimeout(() => {
      markIntroSeen();
      setIsVisible(false);
    }, INTRO_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [shouldPlayIntro]);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    if (isVisible) {
      main.setAttribute("inert", "");
    } else {
      main.removeAttribute("inert");
    }

    return () => {
      main.removeAttribute("inert");
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) {
      const heading = document.querySelector("h1, h2") as HTMLElement | null;
      heading?.focus();
    }
  }, [isVisible]);

  const handleSkip = () => {
    markIntroSeen();
    setIsVisible(false);
  };

  return (
    <>
      {children}
      {isVisible ? (
        <div
          className="intro-gate"
          role="dialog"
          aria-label="인트로 애니메이션"
          aria-busy={isVisible}
        >
          <div className="intro-gate__stars" aria-hidden="true" />
          <div className="intro-gate__ship" aria-hidden="true">
            <span className="intro-gate__orbit" />
            <span className="intro-gate__core" />
          </div>
          <div className="intro-gate__copy">
            <p className="intro-gate__eyebrow">VOYAGER-02 / SIGNAL WAKE</p>
            <h1>서사와 콘텐츠가 맞물리는 항해를 시작합니다.</h1>
            <p>
              플레이어가 세계를 믿게 되는 순간을 설계하는 게임 콘텐츠 기획자
              포트폴리오입니다.
            </p>
          </div>
          <button className="intro-gate__skip" onClick={handleSkip} tabIndex={0} type="button">
            건너뛰기
          </button>
        </div>
      ) : null}
    </>
  );
}
