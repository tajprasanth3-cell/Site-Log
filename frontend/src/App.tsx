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
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { scrollToTop } from './utils/scroll';

const MainAppLayout: React.FC = () => {
  const { isAuthenticated, activeSection, toasts, removeToast } = useApp();
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
        <main className="main-content-area">{renderActiveView()}</main>
      </div>

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            title="Click to dismiss"
            className={`toast ${
              toast.type === 'error'
                ? 'toast-error'
                : toast.type === 'info'
                ? 'toast-info'
                : ''
            }`}
            style={{ cursor: 'pointer' }}
          >
            {toast.type === 'error' ? (
              <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
            ) : toast.type === 'info' ? (
              <Info size={16} color="#3b82f6" style={{ flexShrink: 0 }} />
            ) : (
              <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0 }} />
            )}
            <span style={{ flex: '1 1 auto', minWidth: 0, wordBreak: 'break-word' }}>{toast.message}</span>
            <button
              type="button"
              className="toast-close-btn"
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
              title="Close notification"
              aria-label="Close notification"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'currentColor',
                opacity: 0.75,
                padding: '2px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '6px',
                flexShrink: 0,
              }}
            >
              <X size={14} />
            </button>
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
