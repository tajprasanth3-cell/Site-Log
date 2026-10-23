import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Database, Building2, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { showToast } = useApp();
  const [companyName, setCompanyName] = useState('ABC Construction Group Ltd.');
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST +5:30)');
  const [currency, setCurrency] = useState('INR (₹)');
  const [dailyReportCutoff, setDailyReportCutoff] = useState('19:00');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Platform configuration and master settings updated successfully!');
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings & Master Data</h1>
          <p className="page-subtitle">Configure enterprise organization settings, operational defaults, and master categories</p>
        </div>
      </div>

      <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <form onSubmit={handleSaveSettings} className="card">
          <div className="card-header">
            <div className="card-title">
              <Building2 size={18} color="#f97316" />
              <span>Organization Profile & Operations</span>
            </div>
          </div>
          <div className="card-body">
            <div className="form-grid">
              <div className="form-group col-span-2">
                <label className="form-label">Enterprise Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Default Reporting Timezone</label>
                <input
                  type="text"
                  className="form-input"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Currency Symbol</label>
                <input
                  type="text"
                  className="form-input"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                />
              </div>

              <div className="form-group col-span-2">
                <label className="form-label">Daily Shift Report Submission Deadline</label>
                <input
                  type="time"
                  className="form-input"
                  value={dailyReportCutoff}
                  onChange={(e) => setDailyReportCutoff(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="card-footer">
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Changes take effect immediately across all active site accounts.
            </span>
            <button type="submit" className="btn btn-primary">
              Save Configuration
            </button>
          </div>
        </form>

        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Database size={18} color="#2563eb" />
              <span>Master Categories & Taxonomies</span>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
                Work Categories (Daily Progress)
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Concrete Work', 'Masonry Work', 'Steel Fixing', 'Formwork & Shuttering', 'Excavation', 'Electrical Work', 'Plumbing Work', 'Plastering & Painting'].map((c) => (
                  <span key={c} className="badge badge-neutral">{c}</span>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
                Issue Categories
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Material shortage', 'Equipment failure', 'Labour shortage', 'Weather', 'Safety', 'Quality', 'Design/change', 'Delivery delay', 'Access problem'].map((c) => (
                  <span key={c} className="badge badge-warning">{c}</span>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
                Trades & Worker Crafts
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Mason', 'Electrician', 'Carpenter', 'Helper', 'Welder', 'Plumber', 'Painter', 'Surveyor', 'Bar Bender'].map((c) => (
                  <span key={c} className="badge badge-info">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
