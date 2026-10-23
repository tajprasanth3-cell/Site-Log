import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, AlertTriangle, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { SiteIssue, SafetyObservation, IssueStatus, SafetyStatus } from '../../types';
import { IssueModal } from './IssueModal';
import { SafetyModal } from './SafetyModal';
import { Modal } from '../common/Modal';
import { scrollToTop } from '../../utils/scroll';

export const IssuesSafetyView: React.FC = () => {
  const {
    issues,
    safetyObservations,
    sites,
    updateIssueStatus,
    updateSafetyStatus,
    activeSection,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'issues' | 'safety'>(() =>
    activeSection === 'safety' ? 'safety' : 'issues'
  );

  React.useEffect(() => {
    if (activeSection === 'safety') {
      setActiveTab('safety');
    } else if (activeSection === 'issues') {
      setActiveTab('issues');
    }
    scrollToTop();
  }, [activeSection]);
  const [search, setSearch] = useState('');
  const [siteFilter, setSiteFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);

  // Resolution modal state
  const [resolvingIssue, setResolvingIssue] = useState<SiteIssue | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  const filteredIssues = issues.filter((i) => {
    const matchesSearch =
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase()) ||
      i.id.toLowerCase().includes(search.toLowerCase());
    const matchesSite = siteFilter === 'All' || i.siteId === siteFilter;
    const matchesSeverity = severityFilter === 'All' || i.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
    return matchesSearch && matchesSite && matchesSeverity && matchesStatus;
  });

  const filteredSafety = safetyObservations.filter((s) => {
    const matchesSearch =
      s.observation.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());
    const matchesSite = siteFilter === 'All' || s.siteId === siteFilter;
    const matchesRisk = severityFilter === 'All' || s.riskLevel === severityFilter;
    return matchesSearch && matchesSite && matchesRisk;
  });

  const getSeverityBadge = (sev: string) => {
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

  const getStatusBadge = (status: IssueStatus) => {
    switch (status) {
      case 'Resolved':
      case 'Closed':
        return <span className="badge badge-success">{status}</span>;
      case 'In Progress':
        return <span className="badge badge-info">In Progress</span>;
      case 'Assigned':
        return <span className="badge badge-warning">Assigned</span>;
      case 'Open':
      default:
        return <span className="badge badge-danger">Open</span>;
    }
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingIssue) return;
    updateIssueStatus(resolvingIssue.id, 'Resolved', resolutionText);
    setResolvingIssue(null);
    setResolutionText('');
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Issues & Safety Observations</h1>
          <p className="page-subtitle">Track operational delays, site hazards, and corrective actions</p>
        </div>
        <div className="page-actions">
          {activeTab === 'issues' ? (
            <button className="btn btn-primary" onClick={() => setIsIssueModalOpen(true)}>
              <Plus size={16} />
              <span>Report Issue</span>
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => setIsSafetyModalOpen(true)}>
              <Plus size={16} />
              <span>Record Safety Observation</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === 'issues' ? 'active' : ''}`}
          onClick={() => setActiveTab('issues')}
        >
          Site Issues ({issues.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'safety' ? 'active' : ''}`}
          onClick={() => setActiveTab('safety')}
        >
          Safety Observations ({safetyObservations.length})
        </button>
      </div>

      {/* Filter Bar (Screenshot 9) */}
      <div className="filter-bar">
        <div className="filter-group">
          <div className="search-input-wrapper">
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search problems, hazards, locations..."
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

          <select
            className="filter-select"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="All">All Severity / Risk</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {activeTab === 'issues' && (
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          )}
        </div>

        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          Showing <strong>{activeTab === 'issues' ? filteredIssues.length : filteredSafety.length}</strong> items
        </div>
      </div>

      {activeTab === 'issues' ? (
        /* Issues Table (Screenshot 9) */
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Issue Title</th>
                <th>Category</th>
                <th>Severity</th>
                <th>Site</th>
                <th>Reported Date</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No issues found.
                  </td>
                </tr>
              ) : (
                filteredIssues.map((i) => (
                  <tr key={i.id}>
                    <td style={{ fontWeight: 700, color: '#f97316' }}>{i.id}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{i.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: '300px' }}>
                        {i.description}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{i.category}</span>
                    </td>
                    <td>{getSeverityBadge(i.severity)}</td>
                    <td style={{ fontSize: '0.8rem' }}>{i.siteName}</td>
                    <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{i.date}</td>
                    <td style={{ fontSize: '0.8rem' }}>{i.assignedPerson}</td>
                    <td>{getStatusBadge(i.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                        {i.status !== 'Resolved' && i.status !== 'Closed' ? (
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => {
                              setResolvingIssue(i);
                              setResolutionText('');
                            }}
                          >
                            Resolve
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
                            ✓ Resolved
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Safety Observations Table (Section 13) */
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Hazard Observation</th>
                <th>Risk Level</th>
                <th>Location</th>
                <th>Site</th>
                <th>Date</th>
                <th>Corrective Action</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Quick Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSafety.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No safety observations found.
                  </td>
                </tr>
              ) : (
                filteredSafety.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 700, color: '#f97316' }}>{s.id}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{s.observation}</div>
                    </td>
                    <td>{getSeverityBadge(s.riskLevel)}</td>
                    <td style={{ fontSize: '0.8rem' }}>{s.location}</td>
                    <td style={{ fontSize: '0.8rem' }}>{s.siteName}</td>
                    <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{s.date}</td>
                    <td style={{ fontSize: '0.8rem', color: '#059669', maxWidth: '240px' }}>
                      {s.correctiveAction}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          s.status === 'Resolved'
                            ? 'badge-success'
                            : s.status === 'Action Taken'
                            ? 'badge-info'
                            : 'badge-danger'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                        {s.status !== 'Resolved' && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => updateSafetyStatus(s.id, 'Resolved')}
                          >
                            Mark Resolved
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
      )}

      {isIssueModalOpen && (
        <IssueModal isOpen={isIssueModalOpen} onClose={() => setIsIssueModalOpen(false)} />
      )}

      {isSafetyModalOpen && (
        <SafetyModal isOpen={isSafetyModalOpen} onClose={() => setIsSafetyModalOpen(false)} />
      )}

      {/* Resolve Issue Modal */}
      {resolvingIssue && (
        <Modal
          isOpen={!!resolvingIssue}
          onClose={() => setResolvingIssue(null)}
          title={`Resolve Issue: ${resolvingIssue.id}`}
          maxWidth="md"
        >
          <form onSubmit={handleResolveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{resolvingIssue.title}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                Site: {resolvingIssue.siteName} | Reported by: {resolvingIssue.reportedBy}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Corrective Resolution Notes <span className="required">*</span></label>
              <textarea
                className="form-textarea"
                rows={3}
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                placeholder="Explain what actions, repairs, or replacements resolved this issue..."
                required
              />
            </div>

            <div className="modal-footer" style={{ margin: '0 -1.5rem -1.5rem -1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setResolvingIssue(null)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                Mark as Resolved
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
