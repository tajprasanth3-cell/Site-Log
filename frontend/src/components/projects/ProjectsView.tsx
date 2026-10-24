import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import { Project, ProjectStatus, ProjectType } from '../../types';
import { ProjectModal } from './ProjectModal';
import { Modal } from '../common/Modal';
import { siteImagesMap } from '../../data/mockData';

export const ProjectsView: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesType = typeFilter === 'All' || p.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'Active':
        return <span className="badge badge-success">Active</span>;
      case 'Completed':
        return <span className="badge badge-info">Completed</span>;
      case 'On Hold':
        return <span className="badge badge-warning">On Hold</span>;
      case 'Planned':
        return <span className="badge badge-neutral">Planned</span>;
      case 'Cancelled':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  const handleSave = (projData: Omit<Project, 'id'>) => {
    if (editingProject) {
      updateProject({ ...projData, id: editingProject.id });
      setEditingProject(null);
    } else {
      addProject(projData);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove project "${name}"?`)) {
      deleteProject(id);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Manage all construction projects</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingProject(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter Bar (Exact Match to Screenshot 3) */}
      <div className="filter-bar">
        <div className="filter-group">
          <div className="search-input-wrapper">
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

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
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Institutional">Institutional</option>
          </select>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          Showing <strong>{filteredProjects.length}</strong> projects
        </div>
      </div>

      {/* Projects Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Project Name</th>
              <th>Client</th>
              <th>Type</th>
              <th>Location</th>
              <th style={{ minWidth: '150px' }}>Progress</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No matching projects found.
                </td>
              </tr>
            ) : (
              filteredProjects.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 700, color: '#f97316' }}>{p.id}</td>
                  <td style={{ fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img
                        src={siteImagesMap[p.id] || siteImagesMap.default}
                        alt={p.name}
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
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#475569' }}>{p.client}</td>
                  <td>
                    <span className="badge badge-neutral">{p.type}</span>
                  </td>
                  <td>{p.location}</td>
                  <td>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#f97316' }}>{p.progress}%</span>
                  </td>
                  <td>{getStatusBadge(p.status)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                      <button
                        className="btn-icon-only btn-outline"
                        title="View Details"
                        onClick={() => setViewingProject(p)}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="btn-icon-only btn-outline"
                        title="Edit Project"
                        onClick={() => {
                          setEditingProject(p);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="btn-icon-only btn-outline"
                        style={{ color: '#ef4444' }}
                        title="Delete Project"
                        onClick={() => handleDelete(p.id, p.name)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Project Create/Edit Modal */}
      {isModalOpen && (
        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProject(null);
          }}
          onSave={handleSave}
          initialData={editingProject}
        />
      )}

      {/* Project Details Modal */}
      {viewingProject && (
        <Modal
          isOpen={!!viewingProject}
          onClose={() => setViewingProject(null)}
          title={`Project Details: ${viewingProject.name}`}
          maxWidth="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative', height: '140px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#0f172a' }}>
              <img
                src={siteImagesMap[viewingProject.id] || siteImagesMap.default}
                alt={viewingProject.name}
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
                    {viewingProject.id} • {viewingProject.type}
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                    {viewingProject.name}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Client:</span>
                <span style={{ fontWeight: 700, color: '#334155', marginLeft: '6px' }}>{viewingProject.client}</span>
              </div>
              <div>{getStatusBadge(viewingProject.status)}</div>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#334155' }}>{viewingProject.description}</p>

            <div className="form-grid" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Client</div>
                <div style={{ fontWeight: 700 }}>{viewingProject.client}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Type</div>
                <div style={{ fontWeight: 700 }}>{viewingProject.type}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Location</div>
                <div style={{ fontWeight: 700 }}>{viewingProject.location}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Project Manager</div>
                <div style={{ fontWeight: 700 }}>{viewingProject.projectManager}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Timeline</div>
                <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>
                  {viewingProject.startDate} &rarr; {viewingProject.expectedCompletionDate}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Completion Progress</div>
                <div style={{ fontWeight: 800, color: '#f97316' }}>{viewingProject.progress}%</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setViewingProject(null)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
