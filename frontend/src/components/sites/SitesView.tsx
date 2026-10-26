import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Edit2, MapPin, Eye } from 'lucide-react';
import { ConstructionSite, SiteStatus } from '../../types';
import { SiteModal } from './SiteModal';
import { Modal } from '../common/Modal';
import { siteImagesMap } from '../../data/mockData';

export const SitesView: React.FC = () => {
  const { sites, projects, currentUser, addSite, updateSite, setActiveSection } = useApp();
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<ConstructionSite | null>(null);
  const [viewingSite, setViewingSite] = useState<ConstructionSite | null>(null);

  const filteredSites = sites.filter((s) => {
    // If site engineer, optionally show their assigned sites or all
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase()) ||
      s.engineerName.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());
    const matchesProject = projectFilter === 'All' || s.projectId === projectFilter;
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesProject && matchesStatus;
  });

  const getStatusBadge = (status: SiteStatus) => {
    switch (status) {
      case 'Active':
        return <span className="badge badge-success">Active</span>;
      case 'Completed':
        return <span className="badge badge-info">Completed</span>;
      case 'On Hold':
        return <span className="badge badge-warning">On Hold</span>;
      case 'Planned':
      default:
        return <span className="badge badge-neutral">Planned</span>;
    }
  };

  const handleSave = (siteData: Omit<ConstructionSite, 'id'>) => {
    if (editingSite) {
      updateSite({ ...siteData, id: editingSite.id });
      setEditingSite(null);
    } else {
      addSite(siteData);
    }
  };

  return (
    <div className="page-content sites-view">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {currentUser.role === 'site_engineer' ? 'My Construction Sites' : 'Construction Sites'}
          </h1>
          <p className="page-subtitle">Manage all construction sites & work zones</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingSite(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} />
          <span>Add Site</span>
        </button>
      </div>

      {/* Filter Bar (Screenshot 4) */}
      <div className="filter-bar">
        <div className="filter-group">
          <div className="search-input-wrapper">
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search sites, engineers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="All">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Planned">Planned</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          Showing <strong>{filteredSites.length}</strong> sites
        </div>
      </div>

      {/* Table (Screenshot 4) */}
      <div className="mobile-scroll-hint">Swipe horizontally to see all columns</div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Site Name</th>
              <th>Project</th>
              <th>Engineer</th>
              <th>Location</th>
              <th>Phase</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSites.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No sites found.
                </td>
              </tr>
            ) : (
              filteredSites.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 700, color: '#f97316' }}>{s.id}</td>
                  <td style={{ fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img
                        src={siteImagesMap[s.id] || siteImagesMap.default}
                        alt={s.name}
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
                      <span>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#475569' }}>{s.projectName}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: '#fff7ed',
                          color: '#f97316',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                        }}
                      >
                        {s.engineerName.charAt(0)}
                      </div>
                      <span>{s.engineerName}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748b' }}>
                      <MapPin size={13} color="#f97316" />
                      <span>{s.location}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#334155' }}>{s.currentPhase}</td>
                  <td>{getStatusBadge(s.status)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                      <button
                        className="btn-icon-only btn-outline"
                        title="View Site Details"
                        onClick={() => setViewingSite(s)}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="btn-icon-only btn-outline"
                        title="Edit Site"
                        onClick={() => {
                          setEditingSite(s);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Create/Edit */}
      {isModalOpen && (
        <SiteModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSite(null);
          }}
          onSave={handleSave}
          initialData={editingSite}
        />
      )}

      {/* Modal View Details */}
      {viewingSite && (
        <Modal
          isOpen={!!viewingSite}
          onClose={() => setViewingSite(null)}
          title={`Site Details: ${viewingSite.name}`}
          maxWidth="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative', height: '140px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#0f172a' }}>
              <img
                src={siteImagesMap[viewingSite.id] || siteImagesMap.default}
                alt={viewingSite.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.currentTarget.src = siteImagesMap.default; }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 65%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '0.85rem 1rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#fed7aa', textTransform: 'uppercase', fontWeight: 700 }}>
                    {viewingSite.id} • {viewingSite.currentPhase}
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                    {viewingSite.name}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Parent Project:</span>
                <span style={{ fontWeight: 700, color: '#334155', marginLeft: '6px' }}>{viewingSite.projectName}</span>
              </div>
              <div>{getStatusBadge(viewingSite.status)}</div>
            </div>

            <div className="form-grid" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Parent Project</div>
                <div style={{ fontWeight: 700 }}>{viewingSite.projectName}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Assigned Engineer</div>
                <div style={{ fontWeight: 700 }}>{viewingSite.engineerName}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>GPS Coordinates</div>
                <div style={{ fontWeight: 600, color: '#2563eb' }}>{viewingSite.gpsCoordinates}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Construction Phase</div>
                <div style={{ fontWeight: 700 }}>{viewingSite.currentPhase}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Target Completion</div>
                <div style={{ fontWeight: 600 }}>{viewingSite.expectedCompletionDate}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Location</div>
                <div style={{ fontWeight: 600 }}>{viewingSite.location}</div>
              </div>
            </div>

            {viewingSite.notes && (
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                  Site Notes
                </div>
                <p style={{ fontSize: '0.85rem', color: '#334155', background: '#fff7ed', padding: '0.75rem', borderRadius: '6px' }}>
                  {viewingSite.notes}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setViewingSite(null);
                  setActiveSection('daily-reports-create');
                }}
              >
                + Create Daily Report for this Site
              </button>
              <button className="btn btn-secondary" onClick={() => setViewingSite(null)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
