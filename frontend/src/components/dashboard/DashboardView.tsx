import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  MapPin,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle,
  TrendingUp,
  Users,
} from 'lucide-react';
import siteAImg from '../../assets/site-a.jpg';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    projects,
    sites,
    dailyReports,
    issues,
    setActiveSection,
    setSelectedReportForReview,
  } = useApp();

  const totalProjects = projects.length;
  const activeSites = sites.filter((s) => s.status === 'Active').length;
  const pendingReports = dailyReports.filter((r) => r.status === 'Submitted').length;
  const openIssues = issues.filter((i) => i.status === 'Open' || i.status === 'In Progress').length;

  // Recent reports
  const recentReports = dailyReports.slice(0, 4);
  // Recent issues
  const recentIssues = issues.slice(0, 4);

  // Status badge styling helper
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <span className="badge badge-success">Approved</span>;
      case 'Submitted':
        return <span className="badge badge-warning">Pending Review</span>;
      case 'Revision Required':
        return <span className="badge badge-danger">Revision Required</span>;
      case 'Draft':
      default:
        return <span className="badge badge-neutral">Draft</span>;
    }
  };

  const renderSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return <span className="badge badge-danger">Critical</span>;
      case 'High':
        return <span className="badge badge-warning">High</span>;
      case 'Medium':
        return <span className="badge badge-info">Medium</span>;
      case 'Low':
      default:
        return <span className="badge badge-neutral">Low</span>;
    }
  };

  return (
    <div className="page-content">
      {/* Top Welcome Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, <strong>{currentUser.name}</strong> ({currentUser.role.replace('_', ' ').toUpperCase()}). Here's the live status of your work sites today.
          </p>
        </div>

        <div className="page-actions">
          {currentUser.role === 'site_engineer' && (
            <button
              className="btn btn-primary"
              onClick={() => setActiveSection('daily-reports-create')}
            >
              <Plus size={16} />
              <span>Create Daily Report</span>
            </button>
          )}

          {currentUser.role === 'project_manager' && (
            <button
              className="btn btn-primary"
              onClick={() => setActiveSection('reports-export')}
            >
              <FileText size={16} />
              <span>Generate Reports</span>
            </button>
          )}

          {currentUser.role === 'admin' && (
            <button
              className="btn btn-primary"
              onClick={() => setActiveSection('users')}
            >
              <Users size={16} />
              <span>Manage Users & Roles</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Top Metric Cards with Rich Box Shade */}
      <div className="stats-grid">
        <div className="stat-card stat-card-blue" onClick={() => setActiveSection('projects')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-wrapper stat-icon-blue">
            <Building2 size={24} />
          </div>
          <div className="stat-meta">
            <div className="stat-label">Total Projects</div>
            <div className="stat-value">{totalProjects}</div>
            <div className="stat-trend up">
              <TrendingUp size={12} />
              <span>+2 this month</span>
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-green" onClick={() => setActiveSection('sites')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-wrapper stat-icon-green">
            <MapPin size={24} />
          </div>
          <div className="stat-meta">
            <div className="stat-label">Active Sites</div>
            <div className="stat-value">{activeSites}</div>
            <div className="stat-trend up">
              <TrendingUp size={12} />
              <span>+3 this month</span>
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-orange" onClick={() => setActiveSection('daily-reports')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-wrapper stat-icon-orange">
            <FileText size={24} />
          </div>
          <div className="stat-meta">
            <div className="stat-label">Pending Reports</div>
            <div className="stat-value">{pendingReports}</div>
            <div className="stat-trend warning">
              <Clock size={12} />
              <span>Needs review</span>
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-red" onClick={() => setActiveSection('issues')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-wrapper stat-icon-red">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-meta">
            <div className="stat-label">Open Issues</div>
            <div className="stat-value">{openIssues}</div>
            <div className="stat-trend warning">
              <span>{issues.filter((i) => i.severity === 'Critical').length} Critical</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Charts & Reports, Right Issues & Featured Site */}
      {/* Main Grid: Left Charts & Reports, Right Issues & Featured Site */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="dashboard-col dashboard-col-main">
          {/* Project Progress Donut Widget */}
          <div className="card dashboard-card progress-donut-card">
            <div className="card-header dashboard-card-header" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap', width: '100%', gap: '0.5rem' }}>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0, flex: '1 1 auto', overflow: 'hidden' }}>
                <TrendingUp size={18} color="#f97316" style={{ flexShrink: 0 }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Overall Project Progress</span>
              </div>
              <span className="badge badge-success" style={{ flexShrink: 0, whiteSpace: 'nowrap', marginLeft: 'auto' }}>On Schedule</span>
            </div>
            <div className="card-body">
              <div className="progress-donut-container">
                {/* SVG Progress Circle Graphic */}
                <div className="donut-graphic">
                  <svg width="176" height="176" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="transparent"
                      stroke="#f1f5f9"
                      strokeWidth="8"
                    />
                    {/* 68% progress stroke */}
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="transparent"
                      stroke="#f97316"
                      strokeWidth="8"
                      strokeDasharray="301.6"
                      strokeDashoffset="96.5"
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                  <div className="donut-center-text">
                    <span className="donut-percentage">68%</span>
                    <span className="donut-label">Avg. Progress</span>
                  </div>
                </div>

                {/* Progress Breakdown Legend */}
                <div className="donut-legend">
                  <div className="legend-item">
                    <span className="legend-dot" style={{ backgroundColor: '#10b981' }} />
                    <span className="legend-text">Completed Sites</span>
                    <span className="legend-val">44%</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot" style={{ backgroundColor: '#f97316' }} />
                    <span className="legend-text">In Progress Sites</span>
                    <span className="legend-val">37%</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot" style={{ backgroundColor: '#94a3b8' }} />
                    <span className="legend-text">Not Started / Planned</span>
                    <span className="legend-val">19%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Site Reports */}
          <div className="card dashboard-card recent-reports-card">
            <div className="card-header dashboard-card-header" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap', width: '100%', gap: '0.5rem' }}>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0, flex: '1 1 auto', overflow: 'hidden' }}>
                <FileText size={18} color="#2563eb" style={{ flexShrink: 0 }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Recent Daily Site Reports</span>
              </div>
              <button
                className="btn btn-sm btn-outline"
                style={{ flexShrink: 0, whiteSpace: 'nowrap', marginLeft: 'auto' }}
                onClick={() => setActiveSection('daily-reports')}
              >
                View all &rarr;
              </button>
            </div>

            {/* Desktop / Tablet Table View */}
            <div className="dashboard-reports-desktop table-container" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Report ID</th>
                    <th>Site</th>
                    <th>Date</th>
                    <th>Engineer</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map((report) => (
                    <tr key={report.id}>
                      <td style={{ fontWeight: 700, color: '#f97316' }}>{report.id}</td>
                      <td style={{ fontWeight: 600 }}>{report.siteName}</td>
                      <td style={{ color: '#64748b' }}>{report.date}</td>
                      <td>{report.engineerName}</td>
                      <td>{renderStatusBadge(report.status)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => {
                            setSelectedReportForReview(report);
                            setActiveSection('daily-reports');
                          }}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Touch-Friendly Card View (Zero Horizontal Overflow) */}
            <div className="dashboard-reports-mobile">
              {recentReports.map((report) => (
                <div key={report.id} className="dashboard-mobile-report-card">
                  <div className="mobile-report-header">
                    <span className="mobile-report-id">{report.id}</span>
                    {renderStatusBadge(report.status)}
                  </div>
                  <div className="mobile-report-sitename">{report.siteName}</div>
                  <div className="mobile-report-details">
                    <span>📅 {report.date}</span>
                    <span>👷 {report.engineerName}</span>
                  </div>
                  <button
                    className="btn btn-sm btn-secondary mobile-report-review-btn"
                    onClick={() => {
                      setSelectedReportForReview(report);
                      setActiveSection('daily-reports');
                    }}
                  >
                    Review Report
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Featured Site & Recent Issues */}
        <div className="dashboard-col dashboard-col-side">
          {/* Featured Active Site Card */}
          <div className="card dashboard-card featured-site-card" style={{ overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '140px', backgroundColor: '#0f172a' }}>
              <img
                src={siteAImg}
                alt="Site A - Apartment Building"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, transparent 80%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '1rem',
                  color: '#ffffff',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#fed7aa', fontWeight: 700 }}>
                    Active Priority Site
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Site A - Apartment Building</div>
                </div>
              </div>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>Overall Completion</span>
                <span style={{ fontWeight: 800, color: '#f97316' }}>65%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                <span>Phase: Level 14 Column Pour</span>
                <span>Engineer: Ashok</span>
              </div>
              <button
                className="btn btn-sm btn-outline"
                style={{ width: '100%', marginTop: '0.5rem' }}
                onClick={() => setActiveSection('sites')}
              >
                <span>View Site Operational Details</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          {/* Recent Issues Card (Mockup 2) */}
          <div className="card dashboard-card recent-issues-card">
            <div className="card-header dashboard-card-header" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap', width: '100%', gap: '0.5rem' }}>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0, flex: '1 1 auto', overflow: 'hidden' }}>
                <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Recent Issues</span>
              </div>
              <button
                className="btn btn-sm btn-outline"
                style={{ flexShrink: 0, whiteSpace: 'nowrap', marginLeft: 'auto' }}
                onClick={() => setActiveSection('issues')}
              >
                View all &rarr;
              </button>
            </div>
            <div className="card-body dashboard-issues-body">
              {recentIssues.map((issue) => (
                <div key={issue.id} className="dashboard-issue-item">
                  <div className="dashboard-issue-info">
                    <div className="dashboard-issue-title">
                      {issue.title}
                    </div>
                    <div className="dashboard-issue-meta">
                      {issue.siteName} • {issue.date}
                    </div>
                  </div>
                  <div className="dashboard-issue-badge">
                    {renderSeverityBadge(issue.severity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
