import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Package,
  Shield,
  Menu,
  LogOut,
  UserCheck,
  HardHat,
  ChevronDown,
} from 'lucide-react';
import { UserRole } from '../../types';
import { scrollToTop } from '../../utils/scroll';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const {
    currentUser,
    switchRole,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setActiveSection,
    logout,
    projects,
    sites,
    dailyReports,
    materials,
    equipment,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const trimmedQuery = searchQuery.trim().toLowerCase();
  const searchResults = trimmedQuery.length > 1 ? [
    ...projects
      .filter((p) => p.name.toLowerCase().includes(trimmedQuery) || p.id.toLowerCase().includes(trimmedQuery) || p.client.toLowerCase().includes(trimmedQuery))
      .slice(0, 3)
      .map((p) => ({ id: p.id, title: p.name, subtitle: `${p.id} • ${p.client} • Project`, section: 'projects' })),
    ...sites
      .filter((s) => s.name.toLowerCase().includes(trimmedQuery) || s.id.toLowerCase().includes(trimmedQuery) || s.location.toLowerCase().includes(trimmedQuery))
      .slice(0, 3)
      .map((s) => ({ id: s.id, title: s.name, subtitle: `${s.id} • ${s.location} • Site`, section: 'sites' })),
    ...dailyReports
      .filter((r) => r.id.toLowerCase().includes(trimmedQuery) || r.siteName.toLowerCase().includes(trimmedQuery))
      .slice(0, 3)
      .map((r) => ({ id: r.id, title: r.id, subtitle: `${r.siteName} • ${r.date} • Report`, section: 'daily-reports' })),
    ...equipment
      .filter((e) => e.name.toLowerCase().includes(trimmedQuery) || e.id.toLowerCase().includes(trimmedQuery) || e.type.toLowerCase().includes(trimmedQuery))
      .slice(0, 2)
      .map((e) => ({ id: e.id, title: e.name, subtitle: `${e.id} • ${e.type} • Equipment`, section: 'equipment' })),
    ...materials
      .filter((m) => m.name.toLowerCase().includes(trimmedQuery) || m.id.toLowerCase().includes(trimmedQuery) || m.category.toLowerCase().includes(trimmedQuery))
      .slice(0, 2)
      .map((m) => ({ id: m.id, title: m.name, subtitle: `${m.id} • ${m.category} • Material`, section: 'materials' })),
  ] : [];

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switchRole(e.target.value as UserRole);
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'report':
        return <FileText size={16} color="#2563eb" />;
      case 'safety':
        return <Shield size={16} color="#dc2626" />;
      case 'material':
        return <Package size={16} color="#ea580c" />;
      case 'issue':
        return <AlertTriangle size={16} color="#d97706" />;
      default:
        return <CheckCircle2 size={16} color="#10b981" />;
    }
  };

  const handleNotificationClick = (n: typeof notifications[0]) => {
    markNotificationRead(n.id);
    if (n.targetSection) {
      setActiveSection(n.targetSection);
      scrollToTop();
    }
    setShowNotifications(false);
  };

  const handleSelectSearchResult = (section: string) => {
    setActiveSection(section);
    setSearchQuery('');
    setShowSearchDropdown(false);
    scrollToTop();
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          className="mobile-menu-btn"
          onClick={onToggleMobileSidebar}
          title="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        {/* SiteLog Brand Logo in Header - Click to go to Dashboard */}
        <div
          className="header-brand-logo"
          onClick={() => {
            setActiveSection('dashboard');
            scrollToTop();
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setActiveSection('dashboard');
              scrollToTop();
            }
          }}
          title="Site Log - Go to Dashboard"
          aria-label="Site Log Dashboard"
        >
          <div className="header-brand-icon">
            <HardHat size={16} />
          </div>
          <span className="header-brand-text">
            Site <span className="text-orange">Log</span>
          </span>
        </div>

        <div className="global-search-container">
          <div className="global-search-bar">
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              className="global-search-input"
              placeholder="Search projects, sites, reports..."
              value={searchQuery}
              onFocus={() => setShowSearchDropdown(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchDropdown(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                ✕
              </button>
            )}
          </div>

          {showSearchDropdown && trimmedQuery.length > 1 && (
            <div className="search-dropdown-menu">
              {searchResults.length === 0 ? (
                <div style={{ padding: '0.75rem', fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
                  No matches found for "{searchQuery}"
                </div>
              ) : (
                searchResults.map((res) => (
                  <div
                    key={`${res.section}-${res.id}`}
                    className="search-result-item"
                    onClick={() => handleSelectSearchResult(res.section)}
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {res.title}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {res.subtitle}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="header-right">
        {/* Role Switcher */}
        <div className="role-switcher" title="Switch active perspective">
          <UserCheck size={14} />
          <span className="role-prefix">Role:</span>
          <div className="role-select-wrapper">
            <select
              className="role-select"
              value={currentUser.role}
              onChange={handleRoleChange}
              aria-label="Active user role"
            >
              <option value="site_engineer">Site Engineer</option>
              <option value="project_manager">Project Manager</option>
              <option value="admin">Admin</option>
            </select>
            <ChevronDown size={11} className="role-chevron" />
          </div>
        </div>

        {/* Notifications */}
        <div className="notification-container">
          <button
            className="icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="notification-flyout">
              <div className="flyout-header">
                <span>Notifications ({notifications.length})</span>
                {notifications.length > 0 && (
                  <button
                    className="btn btn-sm btn-outline"
                    style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}
                    onClick={clearAllNotifications}
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="flyout-body">
                {notifications.length === 0 ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notif-item ${!n.read ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(n)}
                    >
                      <div style={{ paddingTop: '2px' }}>{getNotifIcon(n.type)}</div>
                      <div className="notif-content">
                        <div className="notif-title">{n.title}</div>
                        <div className="notif-desc">{n.message}</div>
                        <div className="notif-time">{n.timestamp}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div
          className="user-profile-chip"
          onClick={() => {
            setActiveSection('profile');
            scrollToTop();
          }}
          title="View Profile"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="user-avatar"
          />
          <div className="user-meta">
            <span className="user-name">{currentUser.name}</span>
            <span className="user-role-label">
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          className="icon-btn"
          onClick={logout}
          title="Sign out"
          style={{ color: '#ef4444' }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};
