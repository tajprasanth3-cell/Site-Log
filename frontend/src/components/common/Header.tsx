import React, { useState, useRef, useEffect } from 'react';
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
  X,
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
    isBackendConnected,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationContainerRef.current &&
        !notificationContainerRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleOpenMobileSearch = () => {
    setIsMobileSearchOpen(true);
    setShowSearchDropdown(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleCloseMobileSearch = () => {
    setIsMobileSearchOpen(false);
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleLabel =
    currentUser.role === 'project_manager'
      ? 'Manager'
      : currentUser.role === 'admin'
      ? 'Admin'
      : 'Engineer';

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
    setIsMobileSearchOpen(false);
    scrollToTop();
  };

  return (
    <header className={`top-header${isMobileSearchOpen ? ' search-open' : ''}`}>
      <div className="header-left">
        <button
          className="mobile-menu-btn"
          onClick={onToggleMobileSidebar}
          title="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        {/* SiteLog Brand Logo in Header - on mobile, closed (hidden) when search is open */}
        <div
          className={`header-brand-logo ${isMobileSearchOpen ? 'mobile-hidden' : ''}`}
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

        {/* On mobile: search icon button (only visible on mobile when search is NOT open) */}
        {!isMobileSearchOpen && (
          <button
            type="button"
            className="mobile-search-trigger-btn"
            onClick={handleOpenMobileSearch}
            title="Search"
            aria-label="Open search"
          >
            <Search size={18} />
          </button>
        )}

        {/* Search Bar Container:
            - Desktop: always visible in normal size
            - Mobile: only opens when search icon is clicked, in a small compact size (not full)! */}
        <div className={`global-search-container ${isMobileSearchOpen ? 'mobile-search-open' : ''}`}>
          <div className="global-search-bar">
            <Search size={15} color="#94a3b8" />
            <input
              ref={searchInputRef}
              type="text"
              className="global-search-input"
              placeholder="Search..."
              value={searchQuery}
              onFocus={() => setShowSearchDropdown(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchDropdown(false);
                  searchInputRef.current?.focus();
                }}
                className="search-clear-btn"
                title="Clear query"
              >
                <X size={14} />
              </button>
            ) : isMobileSearchOpen ? (
              <button
                type="button"
                onClick={handleCloseMobileSearch}
                className="search-clear-btn"
                title="Close search"
              >
                <X size={14} />
              </button>
            ) : null}
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
        {/* API Backend Connection Status Indicator */}
        <div
          className={`api-status-badge ${isBackendConnected ? 'connected' : 'offline'}`}
          title={isBackendConnected ? 'Backend API connected (http://localhost:5000)' : 'Running on local cache (Backend offline)'}
        >
          <span className="api-status-dot" />
          <span className="api-status-text">
            {isBackendConnected ? (
              <>
                <span className="api-status-prefix">API </span>Live
              </>
            ) : (
              'Local'
            )}
          </span>
        </div>

        {/* Role Switcher */}
        <div
          className="role-switcher"
          title={`Switch role (current: ${currentUser.role.replace('_', ' ')})`}
        >
          <UserCheck size={14} className="role-icon" />
          <span className="role-prefix">Role:</span>
          <div className="role-select-wrapper">
            <select
              className="role-select"
              value={currentUser.role}
              onChange={handleRoleChange}
              aria-label="Active user role"
            >
              <option value="site_engineer">Engineer</option>
              <option value="project_manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            <ChevronDown size={11} className="role-chevron" />
          </div>
        </div>

        {/* Notifications */}
        <div className="notification-container" ref={notificationContainerRef}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  {notifications.length > 0 && (
                    <button
                      className="btn btn-sm btn-outline"
                      style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}
                      onClick={clearAllNotifications}
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    type="button"
                    className="flyout-close-btn"
                    onClick={() => setShowNotifications(false)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'var(--radius-sm)',
                    }}
                    title="Close notifications"
                    aria-label="Close notifications"
                  >
                    <X size={16} />
                  </button>
                </div>
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
