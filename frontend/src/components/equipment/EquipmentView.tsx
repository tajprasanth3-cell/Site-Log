import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Wrench, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Equipment, EquipmentCondition, MaintenanceStatus } from '../../types';
import { EquipmentModal } from './EquipmentModal';
import { Modal } from '../common/Modal';

export const EquipmentView: React.FC = () => {
  const { equipment, sites, logEquipmentUsage, equipmentUsageLogs } = useApp();
  const [search, setSearch] = useState('');
  const [siteFilter, setSiteFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Logging usage modal
  const [loggingEquipment, setLoggingEquipment] = useState<Equipment | null>(null);
  const [startTime, setStartTime] = useState('08:30');
  const [endTime, setEndTime] = useState('16:30');
  const [duration, setDuration] = useState(8);
  const [purpose, setPurpose] = useState('');
  const [usageRemarks, setUsageRemarks] = useState('');

  const filteredEquipment = equipment.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.operator.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase());
    const matchesSite = siteFilter === 'All' || e.assignedSiteId === siteFilter;
    const matchesStatus = statusFilter === 'All' || e.maintenanceStatus === statusFilter;
    return matchesSearch && matchesSite && matchesStatus;
  });

  const getConditionBadge = (c: EquipmentCondition) => {
    switch (c) {
      case 'Excellent':
      case 'Good':
        return <span className="badge badge-success">{c}</span>;
      case 'Fair':
        return <span className="badge badge-warning">{c}</span>;
      case 'Needs Repair':
      default:
        return <span className="badge badge-danger">{c}</span>;
    }
  };

  const getMaintenanceBadge = (m: MaintenanceStatus) => {
    switch (m) {
      case 'OK':
        return <span className="badge badge-success">OK</span>;
      case 'Due':
        return <span className="badge badge-warning">Due</span>;
      case 'In Repair':
      default:
        return <span className="badge badge-danger">In Repair</span>;
    }
  };

  const handleSaveUsage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggingEquipment) return;
    logEquipmentUsage({
      equipmentId: loggingEquipment.id,
      equipmentName: loggingEquipment.name,
      siteId: loggingEquipment.assignedSiteId,
      date: new Date().toISOString().split('T')[0],
      startTime,
      endTime,
      durationHours: Number(duration),
      purpose: purpose || 'General excavation and material handling',
      remarks: usageRemarks,
    });
    setLoggingEquipment(null);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Equipment Management</h1>
          <p className="page-subtitle">Manage construction equipment, heavy machinery, and log daily operational hours</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Add Equipment</span>
        </button>
      </div>

      {/* Filter Bar (Screenshot 8) */}
      <div className="filter-bar">
        <div className="filter-group">
          <div className="search-input-wrapper">
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search machinery, operator..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="OK">Status: OK</option>
            <option value="Due">Status: Due</option>
            <option value="In Repair">Status: In Repair</option>
          </select>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          Showing <strong>{filteredEquipment.length}</strong> equipment units
        </div>
      </div>

      {/* Table (Screenshot 8) */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Equipment Name</th>
              <th>Type</th>
              <th>Assigned Site</th>
              <th>Operator</th>
              <th>Condition</th>
              <th>Maintenance</th>
              <th style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEquipment.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No equipment found.
                </td>
              </tr>
            ) : (
              filteredEquipment.map((eq) => (
                <tr key={eq.id}>
                  <td style={{ fontWeight: 700, color: '#f97316' }}>{eq.id}</td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{eq.name}</td>
                  <td style={{ fontSize: '0.8rem', color: '#475569' }}>{eq.type}</td>
                  <td>{eq.assignedSiteName}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: '#f1f5f9',
                          color: '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                        }}
                      >
                        {eq.operator.charAt(0)}
                      </div>
                      <span>{eq.operator}</span>
                    </div>
                  </td>
                  <td>{getConditionBadge(eq.condition)}</td>
                  <td>{getMaintenanceBadge(eq.maintenanceStatus)}</td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => setLoggingEquipment(eq)}
                      >
                        <Clock size={13} />
                        <span>Log Usage</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Register Equipment Modal */}
      {isModalOpen && (
        <EquipmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}

      {/* Log Daily Usage Modal (PDF Section 11) */}
      {loggingEquipment && (
        <Modal
          isOpen={!!loggingEquipment}
          onClose={() => setLoggingEquipment(null)}
          title={`Log Daily Usage: ${loggingEquipment.name}`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveUsage} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  className="form-input"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Time</label>
                <input
                  type="time"
                  className="form-input"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Duration (Hours)</label>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Site</label>
                <input
                  type="text"
                  className="form-input"
                  value={loggingEquipment.assignedSiteName}
                  disabled
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Operational Purpose <span className="required">*</span></label>
              <textarea
                className="form-textarea"
                rows={2}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Lifted 4 bundles of 16mm rebar to level 14 floor slab"
                required
              />
            </div>

            <div className="modal-footer" style={{ margin: '0 -1.5rem -1.5rem -1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setLoggingEquipment(null)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Record Usage Log
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
