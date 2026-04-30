import { ReactNode, useEffect, useMemo, useState } from "react";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

const INTRO_STORAGE_KEY = "voyager02-intro-seen";
const LOADING_DURATION_MS = 2500;

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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!shouldPlayIntro) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    let start = performance.now();
    let rAF: number;

    const frame = (time: number) => {
      let p = (time - start) / LOADING_DURATION_MS;
      if (p > 1) p = 1;
      
      const easeOutP = 1 - Math.pow(1 - p, 3);
      setProgress(Math.floor(easeOutP * 100));

      if (p < 1) {
        rAF = requestAnimationFrame(frame);
      }
    };
    rAF = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(rAF);
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

  const handleEnter = () => {
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
          aria-busy={progress < 100}
        >
          <div className="intro-gate__stars" aria-hidden="true" />
          
          <div className="intro-gate__content">
            <div className="intro-gate__copy" style={{ opacity: progress === 100 ? 1 : 0.4 }}>
              <p className="intro-gate__eyebrow">VOYAGER-02 / SIGNAL WAKE</p>
              <h1>서사와 콘텐츠가 맞물리는 항해를 시작합니다.</h1>
              <p>
                플레이어가 세계를 믿게 되는 순간을 설계하는 게임 콘텐츠 기획자
                포트폴리오입니다.
              </p>
            </div>
            
            <div className="intro-gate__voyager-area">
              <div 
                className="intro-gate__voyager-wrapper"
                style={{ 
                  left: `${progress * 0.5}%`, 
                  transform: `translateX(-50%) scale(${progress === 100 ? 1.2 : 1})`,
                  transition: progress === 100 ? 'transform 0.5s ease-out' : 'none'
                }}
              >
                <div className="intro-gate__ship" aria-hidden="true">
                  <span className="intro-gate__core" />
                </div>
                
                {progress === 100 && (
                  <button 
                    className="intro-gate__signal-btn" 
                    onClick={handleEnter} 
                    tabIndex={0} 
                    type="button"
                    aria-label="항해 시작하기"
                  >
                    <span className="intro-gate__signal-ring"></span>
                    <span className="intro-gate__signal-ring delay-1"></span>
                    <span className="intro-gate__signal-text">ENTER</span>
                  </button>
                )}

                {progress < 100 && (
                  <div className="intro-gate__loading-text">
                    LOADING... {progress}%
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
