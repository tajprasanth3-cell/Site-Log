import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { LoginPage } from './components/auth/LoginPage';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProjectsView } from './components/projects/ProjectsView';
import { SitesView } from './components/sites/SitesView';
import { DailyReportsView } from './components/reports/DailyReportsView';
import { DailyReportForm } from './components/reports/DailyReportForm';
import { ProgressView } from './components/progress/ProgressView';
import { WorkersView } from './components/workers/WorkersView';
import { MaterialsView } from './components/materials/MaterialsView';
import { EquipmentView } from './components/equipment/EquipmentView';
import { IssuesSafetyView } from './components/issues/IssuesSafetyView';
import { PhotosView } from './components/photos/PhotosView';
import { ReportsExportView } from './components/exports/ReportsExportView';
import { UsersAdminView } from './components/users/UsersAdminView';
import { SettingsView } from './components/settings/SettingsView';
import { ProfileView } from './components/profile/ProfileView';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { scrollToTop } from './utils/scroll';

const MainAppLayout: React.FC = () => {
  const { isAuthenticated, activeSection, toasts } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    scrollToTop();
  }, [activeSection]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActiveView = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView />;
      case 'projects':
        return <ProjectsView />;
      case 'sites':
        return <SitesView />;
      case 'daily-reports':
        return <DailyReportsView />;
      case 'daily-reports-create':
        return <DailyReportForm />;
      case 'progress':
        return <ProgressView />;
      case 'workers':
        return <WorkersView />;
      case 'materials':
        return <MaterialsView />;
      case 'equipment':
        return <EquipmentView />;
      case 'issues':
      case 'safety':
        return <IssuesSafetyView />;
      case 'photos':
        return <PhotosView />;
      case 'reports-export':
        return <ReportsExportView />;
      case 'users':
        return <UsersAdminView />;
      case 'settings':
        return <SettingsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="app-container">
      {/* Mobile backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Content wrapper */}
      <div className="main-wrapper">
        <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />
        <main>{renderActiveView()}</main>
      </div>

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast ${
              toast.type === 'error'
                ? 'toast-error'
                : toast.type === 'info'
                ? 'toast-info'
                : ''
            }`}
          >
            {toast.type === 'error' ? (
              <AlertTriangle size={16} color="#ef4444" />
            ) : toast.type === 'info' ? (
              <Info size={16} color="#3b82f6" />
            ) : (
              <CheckCircle2 size={16} color="#10b981" />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}
