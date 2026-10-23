import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Worker, WorkerTrade } from '../../types';
import { useApp } from '../../context/AppContext';

interface WorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (worker: Omit<Worker, 'id'>) => void;
}

export const WorkerModal: React.FC<WorkerModalProps> = ({ isOpen, onClose, onSave }) => {
  const { sites } = useApp();
  const [name, setName] = useState('');
  const [trade, setTrade] = useState<WorkerTrade>('Mason');
  const [contractor, setContractor] = useState('Apex Build Infra');
  const [skill, setSkill] = useState<'Unskilled' | 'Semi-Skilled' | 'Skilled' | 'Master Craftsman'>('Skilled');
  const [contact, setContact] = useState('+91 98765 00000');
  const [siteId, setSiteId] = useState(sites[0]?.id || 'SIT-001');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      trade,
      contractor,
      skill,
      contact,
      siteId,
      status: 'Active',
      todayAttendance: 'Present',
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Construction Worker" maxWidth="md">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Worker Full Name <span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Trade / Craft</label>
            <select
              className="form-input"
              value={trade}
              onChange={(e) => setTrade(e.target.value as WorkerTrade)}
            >
              <option value="Mason">Mason</option>
              <option value="Electrician">Electrician</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Helper">Helper</option>
              <option value="Welder">Welder</option>
              <option value="Bar Bender">Bar Bender</option>
              <option value="Plumber">Plumber</option>
              <option value="Surveyor">Surveyor</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Contractor Agency</label>
            <input
              type="text"
              className="form-input"
              value={contractor}
              onChange={(e) => setContractor(e.target.value)}
              placeholder="e.g. Apex Build Infra"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Skill Level</label>
            <select
              className="form-input"
              value={skill}
              onChange={(e) => setSkill(e.target.value as any)}
            >
              <option value="Unskilled">Unskilled</option>
              <option value="Semi-Skilled">Semi-Skilled</option>
              <option value="Skilled">Skilled</option>
              <option value="Master Craftsman">Master Craftsman</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Contact Number</label>
            <input
              type="text"
              className="form-input"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Assigned Site</label>
            <select
              className="form-input"
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
            >
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-footer" style={{ margin: '0 -1.5rem -1.5rem -1.5rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Register Worker
          </button>
        </div>
      </form>
    </Modal>
  );
};
