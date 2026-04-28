import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { IntroGate } from "../components/IntroGate";
import { Layout } from "../components/Layout";
import { RouteTransition } from "../components/RouteTransition";
import { GameHistoryRoute } from "../routes/GameHistoryRoute";
import { HomeRoute } from "../routes/HomeRoute";
import { NotFoundRoute } from "../routes/NotFoundRoute";
import { ProjectDetailRoute } from "../routes/ProjectDetailRoute";
import { ProjectsRoute } from "../routes/ProjectsRoute";
import { RecordsRoute } from "../routes/RecordsRoute";
import { ResumeRoute } from "../routes/ResumeRoute";
import { SelfIntroRoute } from "../routes/SelfIntroRoute";

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
              <Route path="/records" element={<RecordsRoute />} />
              <Route path="/site-plan" element={<Navigate to="/records" replace />} />
              <Route path="/devlog" element={<Navigate to="/records" replace />} />
              <Route path="*" element={<NotFoundRoute />} />
            </Routes>
          </RouteTransition>
        </Layout>
      </IntroGate>
    </BrowserRouter>
  );
}

