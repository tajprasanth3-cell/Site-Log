import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { RiskLevel } from '../../types';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose }) => {
  const { sites, currentUser, addSafetyObservation } = useApp();
  const [observation, setObservation] = useState('');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('High');
  const [location, setLocation] = useState('14th floor perimeter');
  const [siteId, setSiteId] = useState(sites[0]?.id || 'SIT-001');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [remarks, setRemarks] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selSite = sites.find((s) => s.id === siteId);
    addSafetyObservation({
      observation,
      riskLevel,
      location,
      siteId,
      siteName: selSite?.name || 'Site A',
      correctiveAction,
      status: 'Open',
      remarks,
      reportedBy: currentUser.name,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Safety Observation (Site Inspection)" maxWidth="md">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="form-group">
          <label className="form-label">Safety Observation Description <span className="required">*</span></label>
          <textarea
            className="form-textarea"
            rows={2}
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="e.g. Scaffolding edge barrier on 14th floor missing mid-rail..."
            required
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Risk Level <span className="required">*</span></label>
            <select
              className="form-input"
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Site</label>
            <select className="form-input" value={siteId} onChange={(e) => setSiteId(e.target.value)}>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group col-span-2">
            <label className="form-label">Precise Location on Site</label>
            <input
              type="text"
              className="form-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Tower 1, 14th Floor South Face / Basement Entry Ramp"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Required Corrective Action <span className="required">*</span></label>
          <textarea
            className="form-textarea"
            rows={2}
            value={correctiveAction}
            onChange={(e) => setCorrectiveAction(e.target.value)}
            placeholder="e.g. Dispatched carpentry team to fix double handrails and warning tape."
            required
          />
        </div>

        <div className="modal-footer" style={{ margin: '0 -1.5rem -1.5rem -1.5rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Safety Observation
          </button>
        </div>
      </form>
    </Modal>
  );
};
