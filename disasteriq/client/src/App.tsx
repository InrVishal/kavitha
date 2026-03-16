import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';
import api from './services/api';
import AppLayout from './components/layout/AppLayout';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import EmergencyPage from './pages/EmergencyPage';
import VolunteersPage from './pages/VolunteersPage';
import SheltersPage from './pages/SheltersPage';
import FamilyPage from './pages/FamilyPage';
import ResourcesPage from './pages/ResourcesPage';
import DamagePage from './pages/DamagePage';
import AIRiskPage from './pages/AIRiskPage';
import AdminPage from './pages/AdminPage';
import EvacuationPage from './pages/EvacuationPage';
import ScenarioPage from './pages/ScenarioPage';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function AuthCheck({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, setAuth, logout } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/auth/me')
        .then(r => {
          const token = localStorage.getItem('disasteriq_token') || '';
          setAuth(r.data.user, token);
        })
        .catch(() => logout())
        .finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []); // eslint-disable-line

  if (checking) {
    return (
      <div className="h-screen bg-bg-primary flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-2 border-interactive/10"></div>
            <div className="absolute inset-0 rounded-full border-t-2 border-interactive animate-spin"></div>
          </div>
            <div className="absolute inset-x-0 bottom-0 mb-8 text-center px-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading DisasterIQ...</p>
            </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthCheck>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="emergency" element={<EmergencyPage />} />
            <Route path="volunteers" element={<VolunteersPage />} />
            <Route path="shelters" element={<SheltersPage />} />
            <Route path="family" element={<FamilyPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="damage" element={<DamagePage />} />
            <Route path="ai-risk" element={<AIRiskPage />} />
            <Route path="evacuation" element={<EvacuationPage />} />
            <Route path="scenarios" element={<ScenarioPage />} />
            <Route path="admin" element={<AdminPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthCheck>
    </BrowserRouter>
  );
}
