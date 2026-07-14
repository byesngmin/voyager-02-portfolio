import { ReactNode, useEffect, useMemo, useState } from "react";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

const INTRO_STORAGE_KEY = "futuremix-intro-seen";
const LOADING_DURATION_MS = 1400;

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
            <div className="intro-gate__copy">
              <p className="intro-gate__eyebrow">VOYAGER-02 / SIGNAL CHECK</p>
              <h1>방향을 잃지 않고<br />끝내 도달하겠습니다.</h1>
              <p>
                밝은 신호를 따라 PATIMA의 시스템과 콘텐츠를 연결합니다.
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
                  <>
                    <button
                    className="intro-gate__signal-btn" 
                    onClick={handleEnter} 
                    tabIndex={0} 
                    type="button"
                    aria-label="포트폴리오 열기"
                  >
                    <span className="intro-gate__signal-ring"></span>
                    <span className="intro-gate__signal-ring delay-1"></span>
                    </button>
                    <span className="intro-gate__signal-text">ENTER</span>
                  </>
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
