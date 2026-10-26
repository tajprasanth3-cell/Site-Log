import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Eye, Edit3, CheckCircle2, Clock, Camera } from 'lucide-react';
import { DailyReport, ReportStatus } from '../../types';
import { ReportReviewModal } from './ReportReviewModal';
import { siteImagesMap } from '../../data/mockData';

export const DailyReportsView: React.FC = () => {
  const {
    dailyReports,
    sites,
    currentUser,
    setActiveSection,
    setSelectedReportForEdit,
    selectedReportForReview,
    setSelectedReportForReview,
  } = useApp();

  const [search, setSearch] = useState('');
  const [siteFilter, setSiteFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'All' | 'Submitted' | 'Approved' | 'Revision Required' | 'Draft'>('All');

  const filteredReports = dailyReports.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.siteName.toLowerCase().includes(search.toLowerCase()) ||
      r.engineerName.toLowerCase().includes(search.toLowerCase());
    const matchesSite = siteFilter === 'All' || r.siteId === siteFilter;
    const matchesTab = activeTab === 'All' || r.status === activeTab;
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesSite && matchesTab && matchesStatus;
  });

  const getStatusBadge = (status: ReportStatus) => {
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

  const handleEdit = (report: DailyReport) => {
    setSelectedReportForEdit(report);
    setActiveSection('daily-reports-create');
  };

  return (
    <div className="page-content daily-reports-view">
      <div className="page-header">
        <div>
          <h1 className="page-title">Daily Site Reports</h1>
          <p className="page-subtitle">Centralized daily operational logs from all project sites</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedReportForEdit(null);
            setActiveSection('daily-reports-create');
          }}
        >
          <Plus size={16} />
          <span>New Daily Report</span>
        </button>
      </div>

      {/* Tabs for quick filtering */}
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === 'All' ? 'active' : ''}`}
          onClick={() => setActiveTab('All')}
        >
          All Reports ({dailyReports.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'Submitted' ? 'active' : ''}`}
          onClick={() => setActiveTab('Submitted')}
        >
          Pending Review ({dailyReports.filter((r) => r.status === 'Submitted').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'Approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('Approved')}
        >
          Approved ({dailyReports.filter((r) => r.status === 'Approved').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'Revision Required' ? 'active' : ''}`}
          onClick={() => setActiveTab('Revision Required')}
        >
          Revision Required ({dailyReports.filter((r) => r.status === 'Revision Required').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'Draft' ? 'active' : ''}`}
          onClick={() => setActiveTab('Draft')}
        >
          Drafts ({dailyReports.filter((r) => r.status === 'Draft').length})
        </button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <div className="search-input-wrapper">
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search reports by ID, site, engineer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
          >
            <option value="All">All Sites</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          Showing <strong>{filteredReports.length}</strong> reports
        </div>
      </div>

      {/* Reports Table */}
      <div className="mobile-scroll-hint">Swipe horizontally to see all columns</div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Site & Work Area</th>
              <th>Report Date</th>
              <th>Engineer</th>
              <th>Weather</th>
              <th>Workers</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No reports found matching this criteria.
                </td>
              </tr>
            ) : (
              filteredReports.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700, color: '#f97316' }}>
                    <div>{r.id}</div>
                    {r.photographs && r.photographs.length > 0 && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                        <Camera size={11} color="#f97316" />
                        <span>{r.photographs.length} photos</span>
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img
                        src={siteImagesMap[r.siteId] || siteImagesMap[r.projectId] || siteImagesMap.default}
                        alt={r.siteName}
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '6px',
                          objectFit: 'cover',
                          border: '1px solid var(--border)',
                          flexShrink: 0,
                          backgroundColor: '#0f172a',
                        }}
                        onError={(e) => { e.currentTarget.src = siteImagesMap.default; }}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{r.siteName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{r.projectName}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: '#334155' }}>{r.date}</td>
                  <td>{r.engineerName}</td>
                  <td>
                    <span className="badge badge-neutral">{r.weatherCondition}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem' }}>
                      <span style={{ color: '#059669', fontWeight: 700 }}>
                        {r.workersSummary?.present || 0}
                      </span>
                      <span style={{ color: '#94a3b8' }}> / {r.workersSummary?.total || 0} present</span>
                    </div>
                  </td>
                  <td>{getStatusBadge(r.status)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setSelectedReportForReview(r)}
                        title="Review Report Details"
                      >
                        <Eye size={13} />
                        <span>Review</span>
                      </button>

                      {(r.status === 'Draft' ||
                        r.status === 'Revision Required' ||
                        currentUser.role === 'admin') && (
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleEdit(r)}
                          title="Edit Report"
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {selectedReportForReview && (
        <ReportReviewModal
          isOpen={!!selectedReportForReview}
          onClose={() => setSelectedReportForReview(null)}
          report={selectedReportForReview}
        />
      )}
    </div>
  );
};
