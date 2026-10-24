import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Project, ProjectStatus, ProjectType } from '../../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id'>) => void;
  initialData?: Project | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [client, setClient] = useState(initialData?.client || '');
  const [type, setType] = useState<ProjectType>(initialData?.type || 'Residential');
  const [startDate, setStartDate] = useState(initialData?.startDate || new Date().toISOString().split('T')[0]);
  const [expectedCompletionDate, setExpectedCompletionDate] = useState(
    initialData?.expectedCompletionDate || '2027-12-31'
  );
  const [location, setLocation] = useState(initialData?.location || '');
  const [projectManager, setProjectManager] = useState(initialData?.projectManager || 'Priya');
  const [status, setStatus] = useState<ProjectStatus>(initialData?.status || 'Active');
  const [description, setDescription] = useState(initialData?.description || '');
  const [progress, setProgress] = useState<number>(initialData?.progress || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      client,
      type,
      startDate,
      expectedCompletionDate,
      location,
      projectManager,
      status,
      description,
      progress: Number(progress),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Project' : 'Create New Project'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Project Name <span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Skyline Residency Tower A"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Client Name <span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="e.g. ABC Developers Ltd."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Project Type</label>
            <select
              className="form-input"
              value={type}
              onChange={(e) => setType(e.target.value as ProjectType)}
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Institutional">Institutional</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Location (City/Region) <span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bengaluru, Karnataka"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Expected Completion Date</label>
            <input
              type="date"
              className="form-input"
              value={expectedCompletionDate}
              onChange={(e) => setExpectedCompletionDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Project Manager</label>
            <input
              type="text"
              className="form-input"
              value={projectManager}
              onChange={(e) => setProjectManager(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Initial Status</label>
            <select
              className="form-input"
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            >
              <option value="Planned">Planned</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Progress Percentage ({progress}%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#f97316' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Project Scope & Description</label>
          <textarea
            className="form-textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key project deliverables, site constraints, milestones..."
          />
        </div>

        <div className="modal-footer" style={{ margin: '0 -1.5rem -1.5rem -1.5rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {initialData ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
