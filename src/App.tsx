import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Public pages
import LandingPage from './pages/public/LandingPage'
import AssessPage from './pages/public/AssessPage'
import QuestionsPage from './pages/public/QuestionsPage'
import EmailGatePage from './pages/public/EmailGatePage'
import ResultsPage from './pages/public/ResultsPage'
import PricingPage from './pages/public/PricingPage'
import SchoolsPage from './pages/public/SchoolsPage'
import PortfolioPage from './pages/public/PortfolioPage'

// Auth pages
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import OnboardingPage from './pages/auth/OnboardingPage'

// Kid pages
import DashboardPage from './pages/kid/DashboardPage'
import CreatePage from './pages/kid/CreatePage'
import ProjectPage from './pages/kid/ProjectPage'
import CommunityPage from './pages/kid/CommunityPage'
import PortfolioEditPage from './pages/kid/PortfolioEditPage'

// Parent pages
import ParentDashboard from './pages/parent/ParentDashboard'
import ProgressPage from './pages/parent/ProgressPage'
import SettingsPage from './pages/parent/SettingsPage'

// Admin pages
import MarketingPage from './pages/admin/MarketingPage'
import ModerationPage from './pages/admin/ModerationPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/assess" element={<AssessPage />} />
        <Route path="/assess/questions" element={<QuestionsPage />} />
        <Route path="/assess/email" element={<EmailGatePage />} />
        <Route path="/assess/results" element={<ResultsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/schools" element={<SchoolsPage />} />
        <Route path="/portfolio/:username" element={<PortfolioPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Kid dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/project/:projectId" element={<ProjectPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/portfolio/edit" element={<PortfolioEditPage />} />

        {/* Parent dashboard */}
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/parent/dashboard" element={<ParentDashboard />} />
        <Route path="/parent/progress" element={<ProgressPage />} />
        <Route path="/parent/settings" element={<SettingsPage />} />

        {/* Admin */}
        <Route path="/admin/marketing" element={<MarketingPage />} />
        <Route path="/admin/moderation" element={<ModerationPage />} />
      </Routes>
    </BrowserRouter>
  )
}
