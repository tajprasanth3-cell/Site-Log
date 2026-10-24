import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { IssueCategory, IssueSeverity } from '../../types';

interface IssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IssueModal: React.FC<IssueModalProps> = ({ isOpen, onClose }) => {
  const { sites, currentUser, addIssue } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('Equipment failure');
  const [severity, setSeverity] = useState<IssueSeverity>('High');
  const [siteId, setSiteId] = useState(sites[0]?.id || 'SIT-001');
  const [assignedPerson, setAssignedPerson] = useState('Safety Supervisor');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selSite = sites.find((s) => s.id === siteId);
    addIssue({
      title,
      description,
      category,
      severity,
      siteId,
      siteName: selSite?.name || 'Site A',
      reportedBy: currentUser.name,
      photographs: [],
      assignedPerson: assignedPerson || 'Site Supervisor',
      status: 'Open',
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Construction Site Problem / Issue" maxWidth="md">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="form-group">
          <label className="form-label">Issue Title <span className="required">*</span></label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Scaffolding clamp slippage on 14th floor"
            required
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value as IssueCategory)}
            >
              <option value="Material shortage">Material shortage</option>
              <option value="Equipment failure">Equipment failure</option>
              <option value="Labour shortage">Labour shortage</option>
              <option value="Weather">Weather</option>
              <option value="Safety">Safety</option>
              <option value="Quality">Quality</option>
              <option value="Design/change">Design/change</option>
              <option value="Delivery delay">Delivery delay</option>
              <option value="Access problem">Access problem</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Severity Level <span className="required">*</span></label>
            <select
              className="form-input"
              value={severity}
              onChange={(e) => setSeverity(e.target.value as IssueSeverity)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Site / Location <span className="required">*</span></label>
            <select className="form-input" value={siteId} onChange={(e) => setSiteId(e.target.value)}>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Assigned Person</label>
            <input
              type="text"
              className="form-input"
              value={assignedPerson}
              onChange={(e) => setAssignedPerson(e.target.value)}
              placeholder="e.g. Mechanical Engineer / Safety Lead"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Detailed Description & Immediate Impact <span className="required">*</span></label>
          <textarea
            className="form-textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain what happened, what work is stopped or impacted, and immediate measures taken..."
            required
          />
        </div>

        <div className="modal-footer" style={{ margin: '0 -1.5rem -1.5rem -1.5rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit Issue Report
          </button>
        </div>
      </form>
    </Modal>
  );
};
