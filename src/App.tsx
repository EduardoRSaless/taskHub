import { BrowserRouter as Router, Routes, Route } from "react-router";
import AuthPage from "./pages/AuthPages/AuthPage";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Teams from "./pages/Teams";
import Projects from "./pages/Projects";
import Settings from "./pages/Settings";
import Permissions from "./pages/Permissions";
import ProtectedRoute from "./layout/ProtectedRoute";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Rotas Protegidas (Dashboard) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />

              {/* Others Page */}
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/permissions" element={<Permissions />} />
            </Route>
          </Route>

          {/* Auth Layout (Público) */}
          <Route path="/signin" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
