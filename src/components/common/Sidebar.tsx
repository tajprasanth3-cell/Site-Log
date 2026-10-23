import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Building2,
  MapPin,
  FileText,
  Users,
  Package,
  Wrench,
  AlertTriangle,
  ShieldCheck,
  Camera,
  BarChart3,
  Settings,
  User,
  HardHat,
  TrendingUp,
  X,
} from 'lucide-react';
import { scrollToTop } from '../../utils/scroll';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { currentUser, activeSection, setActiveSection, dailyReports, issues, materialRequests } = useApp();

  const pendingReportsCount = dailyReports.filter((r) => r.status === 'Submitted').length;
  const openIssuesCount = issues.filter((i) => i.status === 'Open' || i.status === 'In Progress').length;
  const pendingMatCount = materialRequests.filter((m) => m.status === 'Pending Review').length;

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    onCloseMobile();
    scrollToTop();
  };

  // Dynamic category title based on active role
  const getCategoryTitle = () => {
    switch (currentUser.role) {
      case 'site_engineer':
        return 'Field Operations';
      case 'project_manager':
        return 'Project Oversight';
      case 'admin':
        return 'System Administration';
      default:
        return 'Operations Menu';
    }
  };

  // Strictly role-specific navigation matrix
  const getNavItems = () => {
    switch (currentUser.role) {
      case 'site_engineer':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'sites', label: 'My Sites', icon: MapPin },
          { id: 'daily-reports', label: 'Daily Reports', icon: FileText, badge: pendingReportsCount },
          { id: 'workers', label: 'Workers & Attendance', icon: Users },
          { id: 'materials', label: 'Materials Usage', icon: Package, badge: pendingMatCount },
          { id: 'equipment', label: 'Equipment Log', icon: Wrench },
          { id: 'issues', label: 'Issues & Safety', icon: AlertTriangle, badge: openIssuesCount },
          { id: 'photos', label: 'Site Photos', icon: Camera },
          { id: 'profile', label: 'My Profile', icon: User },
        ];
      case 'project_manager':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'projects', label: 'Projects Portfolio', icon: Building2 },
          { id: 'sites', label: 'Sites Overview', icon: MapPin },
          { id: 'daily-reports', label: 'Daily Reports Review', icon: FileText, badge: pendingReportsCount },
          { id: 'progress', label: 'Progress Tracking', icon: TrendingUp },
          { id: 'materials', label: 'Materials Requisitions', icon: Package, badge: pendingMatCount },
          { id: 'issues', label: 'Issues & Risks', icon: AlertTriangle, badge: openIssuesCount },
          { id: 'photos', label: 'Site Photos', icon: Camera },
          { id: 'reports-export', label: 'Reports & Export', icon: BarChart3 },
          { id: 'profile', label: 'My Profile', icon: User },
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'projects', label: 'Projects Master', icon: Building2 },
          { id: 'sites', label: 'Construction Sites', icon: MapPin },
          { id: 'photos', label: 'Site Photos', icon: Camera },
          { id: 'users', label: 'Users & Roles', icon: Users },
          { id: 'reports-export', label: 'Reports & Audit Export', icon: BarChart3 },
          { id: 'settings', label: 'Settings & Master Data', icon: Settings },
          { id: 'profile', label: 'My Profile', icon: User },
        ];
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'sites', label: 'Sites', icon: MapPin },
          { id: 'daily-reports', label: 'Daily Reports', icon: FileText },
          { id: 'profile', label: 'Profile', icon: User },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div
            className="brand-logo"
            onClick={() => handleNavClick('dashboard')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNavClick('dashboard');
              }
            }}
            style={{ cursor: 'pointer' }}
            title="Site Log - Go to Dashboard"
            aria-label="Site Log Dashboard"
          >
            <div className="brand-icon">
              <HardHat size={20} />
            </div>
            <div className="brand-title">
              <span className="brand-name">Site Log</span>
              <span className="brand-sub">Ops & Daily Reports</span>
            </div>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={onCloseMobile}
            title="Close navigation menu"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-nav">
          <div className="sidebar-category">{getCategoryTitle()}</div>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive =
              activeSection === item.id ||
              (item.id === 'daily-reports' && activeSection === 'daily-reports-create');
            return (
              <div
                key={item.id}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <IconComponent className="nav-icon" />
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="nav-badge">{item.badge}</span>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="sidebar-footer">
          <div className="role-indicator">
            <div className="role-dot" />
            <span>
              Role: <strong>{currentUser.role.replace('_', ' ').toUpperCase()}</strong>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
