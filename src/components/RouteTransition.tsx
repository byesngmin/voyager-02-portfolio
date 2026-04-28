import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

type RouteTransitionProps = {
  children: ReactNode;
};

export function RouteTransition({ children }: RouteTransitionProps) {
  const location = useLocation();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }, [location.pathname, reducedMotion]);

  return (
    <div className="route-transition">
      {reducedMotion ? null : (
        <div
          className="route-transition__pulse"
          key={location.pathname}
          aria-hidden="true"
        />
      )}
      <div className="route-transition__panel" key={location.pathname}>
        {children}
      </div>
    </div>
  );
}

