import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, Building2, MapPin, CheckCircle, Clock } from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { projects, sites } = useApp();

  return (
    <div className="page-content progress-view">
      <div className="page-header">
        <div>
          <h1 className="page-title">Project Progress Monitoring</h1>
          <p className="page-subtitle">Track completion velocity, construction phases, and delivery milestones</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {projects.map((proj) => {
          const projectSites = sites.filter((s) => s.projectId === proj.id);
          return (
            <div key={proj.id} className="card">
              <div className="card-header progress-card-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, color: '#f97316' }}>{proj.id}</span>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>{proj.name}</span>
                    <span className="badge badge-neutral">{proj.type}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', lineHeight: 1.4 }}>
                    Client: {proj.client} | Location: {proj.location} | Timeline: {proj.startDate} &rarr; {proj.expectedCompletionDate}
                  </div>
                </div>
                <div className="progress-stat-badge">
                  <span className="progress-percentage-val">
                    {proj.progress}%
                  </span>
                  <span className="badge badge-success">
                    <CheckCircle size={13} />
                    On Schedule
                  </span>
                </div>
              </div>

              <div className="card-body">
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: '#334155' }}>
                  Associated Work Zones & Sites ({projectSites.length})
                </div>

                {projectSites.length === 0 ? (
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>No individual sites mapped yet.</div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                    {projectSites.map((s) => (
                      <div
                        key={s.id}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '0.85rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>{s.name}</span>
                          <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{s.status}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem' }}>
                          Phase: <strong>{s.currentPhase}</strong>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                          Engineer: {s.engineerName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
