import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import TeamsPage from "./pages/TeamsPage";
import LoginPage from "./pages/LoginPage";
import TeamDetailsPage from "./pages/TeamDetailsPage";
import AthletesPage from "./pages/AthletesPage";
import TrainingsPage from "./pages/TrainingsPage";
import TrainingDetailsPage from "./pages/TrainingDetailsPage";
import InjuriesPage from "./pages/InjuriesPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import SettingsPage from "./pages/SettingsPage";
import FeaturesPage from "./pages/FeaturesPage";
import PricingPage from "./pages/PricingPage";
import FAQPage from "./pages/FAQPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Footer Pages */}
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/faq" element={<FAQPage />} />

        {/* Protected Routes (Dashboard) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="teams" element={<TeamsPage />} />
          {/* YENİ ROTA: :id kısmı değişkendir */}
          <Route path="teams/:id" element={<TeamDetailsPage />} />
          <Route path="athletes" element={<AthletesPage />} />
          <Route path="trainings" element={<TrainingsPage />} />
          <Route path="trainings/:id" element={<TrainingDetailsPage />} />
          <Route path="health" element={<InjuriesPage />} />
          {/* Gelecek sayfalar buraya... */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
