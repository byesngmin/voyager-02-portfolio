import { BrowserRouter, Route, Routes } from "react-router-dom";
import { IntroGate } from "../components/IntroGate";
import { Layout } from "../components/Layout";
import { RouteTransition } from "../components/RouteTransition";
import { DevlogRoute } from "../routes/DevlogRoute";
import { GameHistoryRoute } from "../routes/GameHistoryRoute";
import { HomeRoute } from "../routes/HomeRoute";
import { NotFoundRoute } from "../routes/NotFoundRoute";
import { ProjectDetailRoute } from "../routes/ProjectDetailRoute";
import { ProjectsRoute } from "../routes/ProjectsRoute";
import { ResumeRoute } from "../routes/ResumeRoute";
import { SelfIntroRoute } from "../routes/SelfIntroRoute";
import { SitePlanRoute } from "../routes/SitePlanRoute";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <IntroGate>
        <Layout>
          <RouteTransition>
            <Routes>
              <Route path="/" element={<HomeRoute />} />
              <Route path="/resume" element={<ResumeRoute />} />
              <Route path="/self-intro" element={<SelfIntroRoute />} />
              <Route path="/projects" element={<ProjectsRoute />} />
              <Route path="/projects/:slug" element={<ProjectDetailRoute />} />
              <Route path="/game-history" element={<GameHistoryRoute />} />
              <Route path="/site-plan" element={<SitePlanRoute />} />
              <Route path="/devlog" element={<DevlogRoute />} />
              <Route path="*" element={<NotFoundRoute />} />
            </Routes>
          </RouteTransition>
        </Layout>
      </IntroGate>
    </BrowserRouter>
  );
}

