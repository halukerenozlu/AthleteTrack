import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import TeamsPage from "./pages/TeamsPage";
import LoginPage from "./pages/LoginPage";
import TeamDetailsPage from "./pages/TeamDetailsPage";
import AthletesPage from "./pages/AthletesPage";
import TrainingsPage from "./pages/TrainingsPage";
import TrainingDetailsPage from "./pages/TrainingDetailsPage";
import InjuriesPage from "./pages/InjuriesPage";
import MatchesPage from "./pages/MatchesPage";
import MatchStatsPage from "./pages/MatchStatsPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import SettingsPage from "./pages/SettingsPage";
import FeaturesPage from "./pages/FeaturesPage";
import PricingPage from "./pages/PricingPage";
import FAQPage from "./pages/FAQPage";

import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <Router>
      <Routes>
        {/* Translated comment. */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Translated comment. */}
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/faq" element={<FAQPage />} />

        {/* Translated comment. */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="teams" element={<TeamsPage />} />
          {/* Translated comment. */}
          <Route path="teams/:id" element={<TeamDetailsPage />} />
          <Route path="athletes" element={<AthletesPage />} />
          <Route path="trainings" element={<TrainingsPage />} />
          <Route path="trainings/:id" element={<TrainingDetailsPage />} />
          <Route path="health" element={<InjuriesPage />} />
          <Route path="matches" element={<MatchesPage />} />
          <Route path="matches/:id/stats" element={<MatchStatsPage />} />
          {/* Translated comment. */}
        </Route>
      </Routes>
      <Toaster position="top-right" theme="dark" richColors />
    </Router>
  );
}

export default App;
