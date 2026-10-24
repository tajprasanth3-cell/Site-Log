import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Check, X, Clock, Calendar } from 'lucide-react';
import { Worker, AttendanceStatus } from '../../types';
import { WorkerModal } from './WorkerModal';

export const WorkersView: React.FC = () => {
  const { workers, sites, addWorker, updateWorkerAttendance } = useApp();
  const [search, setSearch] = useState('');
  const [tradeFilter, setTradeFilter] = useState('All');
  const [siteFilter, setSiteFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.trade.toLowerCase().includes(search.toLowerCase()) ||
      w.contractor.toLowerCase().includes(search.toLowerCase()) ||
      w.id.toLowerCase().includes(search.toLowerCase());
    const matchesTrade = tradeFilter === 'All' || w.trade === tradeFilter;
    const matchesSite = siteFilter === 'All' || w.siteId === siteFilter;
    return matchesSearch && matchesTrade && matchesSite;
  });

  const presentCount = workers.filter((w) => w.todayAttendance === 'Present').length;
  const absentCount = workers.filter((w) => w.todayAttendance === 'Absent').length;
  const halfDayCount = workers.filter((w) => w.todayAttendance === 'Half Day').length;

  const getAttendanceBadge = (w: Worker) => {
    switch (w.todayAttendance) {
      case 'Present':
        return <span className="badge badge-success">Present</span>;
      case 'Absent':
        return <span className="badge badge-danger">Absent</span>;
      case 'Half Day':
        return <span className="badge badge-warning">Half Day</span>;
      case 'Leave':
      default:
        return <span className="badge badge-info">Leave</span>;
    }
  };

  const cycleAttendance = (worker: Worker) => {
    const sequence: AttendanceStatus[] = ['Present', 'Absent', 'Half Day', 'Leave'];
    const currentIndex = sequence.indexOf(worker.todayAttendance);
    const nextStatus = sequence[(currentIndex + 1) % sequence.length];
    updateWorkerAttendance(worker.id, nextStatus);
  };

  return (
    <div className="page-content workers-view">
      <div className="page-header">
        <div>
          <h1 className="page-title">Workers & Attendance</h1>
          <p className="page-subtitle">Manage site workforce muster roll and daily attendance records</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Add Worker</span>
        </button>
      </div>

      {/* Attendance Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: '1.25rem' }}>
        <div className="stat-card" style={{ padding: '1rem' }}>
          <div className="stat-meta">
            <div className="stat-label">Total Registered Workers</div>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{workers.length}</div>
          </div>
        </div>
        <div className="stat-card" style={{ padding: '1rem', borderLeft: '4px solid #10b981' }}>
          <div className="stat-meta">
            <div className="stat-label" style={{ color: '#059669' }}>Today's Present</div>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: '#059669' }}>{presentCount}</div>
          </div>
        </div>
        <div className="stat-card" style={{ padding: '1rem', borderLeft: '4px solid #ef4444' }}>
          <div className="stat-meta">
            <div className="stat-label" style={{ color: '#dc2626' }}>Absent</div>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: '#dc2626' }}>{absentCount}</div>
          </div>
        </div>
        <div className="stat-card" style={{ padding: '1rem', borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-meta">
            <div className="stat-label" style={{ color: '#d97706' }}>Half Day / Leave</div>
            <div className="stat-value" style={{ fontSize: '1.5rem', color: '#d97706' }}>{halfDayCount}</div>
          </div>
        </div>
      </div>

      {/* Filter Bar (Screenshot 6) */}
      <div className="filter-bar">
        <div className="filter-group">
          <div className="search-input-wrapper">
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search workers by name, trade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={tradeFilter}
            onChange={(e) => setTradeFilter(e.target.value)}
          >
            <option value="All">All Trades</option>
            <option value="Mason">Mason</option>
            <option value="Electrician">Electrician</option>
            <option value="Carpenter">Carpenter</option>
            <option value="Helper">Helper</option>
            <option value="Welder">Welder</option>
            <option value="Bar Bender">Bar Bender</option>
            <option value="Plumber">Plumber</option>
            <option value="Surveyor">Surveyor</option>
          </select>

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
          Click attendance tag to toggle status (Present / Absent / Half Day / Leave)
        </div>
      </div>

      {/* Table (Screenshot 6) */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Trade</th>
              <th>Contractor</th>
              <th>Skill</th>
              <th>Assigned Site</th>
              <th>Attendance</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Mark Quick</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkers.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No workers found.
                </td>
              </tr>
            ) : (
              filteredWorkers.map((w) => {
                const workerSite = sites.find((s) => s.id === w.siteId);
                return (
                  <tr key={w.id}>
                    <td style={{ fontWeight: 700, color: '#f97316' }}>{w.id}</td>
                    <td style={{ fontWeight: 600 }}>{w.name}</td>
                    <td>
                      <span className="badge badge-neutral">{w.trade}</span>
                    </td>
                    <td style={{ color: '#475569', fontSize: '0.8rem' }}>{w.contractor}</td>
                    <td>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{w.skill}</span>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{workerSite?.name || 'Assigned Site'}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => cycleAttendance(w)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        title="Click to cycle attendance status"
                      >
                        {getAttendanceBadge(w)}
                      </button>
                    </td>
                    <td>
                      <span className="badge badge-success">Active</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                        <button
                          className="btn-icon-only btn-outline"
                          style={{
                            color: w.todayAttendance === 'Present' ? '#059669' : '#94a3b8',
                            borderColor: w.todayAttendance === 'Present' ? '#10b981' : '#e2e8f0',
                            backgroundColor: w.todayAttendance === 'Present' ? '#ecfdf5' : 'transparent',
                          }}
                          title="Mark Present"
                          onClick={() => updateWorkerAttendance(w.id, 'Present')}
                        >
                          <Check size={13} />
                        </button>
                        <button
                          className="btn-icon-only btn-outline"
                          style={{
                            color: w.todayAttendance === 'Absent' ? '#dc2626' : '#94a3b8',
                            borderColor: w.todayAttendance === 'Absent' ? '#ef4444' : '#e2e8f0',
                            backgroundColor: w.todayAttendance === 'Absent' ? '#fef2f2' : 'transparent',
                          }}
                          title="Mark Absent"
                          onClick={() => updateWorkerAttendance(w.id, 'Absent')}
                        >
                          <X size={13} />
                        </button>
                        <button
                          className="btn-icon-only btn-outline"
                          style={{
                            color: w.todayAttendance === 'Half Day' ? '#d97706' : '#94a3b8',
                            borderColor: w.todayAttendance === 'Half Day' ? '#f59e0b' : '#e2e8f0',
                            backgroundColor: w.todayAttendance === 'Half Day' ? '#fffbeb' : 'transparent',
                          }}
                          title="Mark Half Day"
                          onClick={() => updateWorkerAttendance(w.id, 'Half Day')}
                        >
                          <Clock size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <WorkerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={addWorker}
        />
      )}
    </div>
  );
};
