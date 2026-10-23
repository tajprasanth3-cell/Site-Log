import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ConstructionSite, SiteStatus } from '../../types';
import { useApp } from '../../context/AppContext';

interface SiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (site: Omit<ConstructionSite, 'id'>) => void;
  initialData?: ConstructionSite | null;
}

export const SiteModal: React.FC<SiteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const { projects } = useApp();

  const [name, setName] = useState(initialData?.name || '');
  const [projectId, setProjectId] = useState(initialData?.projectId || (projects[0]?.id || ''));
  const [location, setLocation] = useState(initialData?.location || '');
  const [gpsCoordinates, setGpsCoordinates] = useState(
    initialData?.gpsCoordinates || '13.0827° N, 80.2707° E'
  );
  const [engineerName, setEngineerName] = useState(initialData?.engineerName || 'Ashok');
  const [currentPhase, setCurrentPhase] = useState(initialData?.currentPhase || 'Superstructure Work');
  const [status, setStatus] = useState<SiteStatus>(initialData?.status || 'Active');
  const [startDate, setStartDate] = useState(initialData?.startDate || new Date().toISOString().split('T')[0]);
  const [expectedCompletionDate, setExpectedCompletionDate] = useState(
    initialData?.expectedCompletionDate || '2027-06-30'
  );
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selProject = projects.find((p) => p.id === projectId);
    onSave({
      name,
      projectId,
      projectName: selProject?.name || 'Assigned Project',
      location,
      gpsCoordinates,
      engineerId: 'USR-001',
      engineerName,
      currentPhase,
      status,
      startDate,
      expectedCompletionDate,
      notes,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Construction Site' : 'Add Construction Site'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Site Name / Work Area <span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Site A - Tower Block 1"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Parent Project <span className="required">*</span></label>
            <select
              className="form-input"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Site Location (Address) <span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Plot 42, OMR Road, Chennai"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">GPS Coordinates</label>
            <input
              type="text"
              className="form-input"
              value={gpsCoordinates}
              onChange={(e) => setGpsCoordinates(e.target.value)}
              placeholder="e.g. 12.9716° N, 80.2435° E"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Assigned Site Engineer <span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              value={engineerName}
              onChange={(e) => setEngineerName(e.target.value)}
              placeholder="e.g. Ashok"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Current Construction Phase</label>
            <input
              type="text"
              className="form-input"
              value={currentPhase}
              onChange={(e) => setCurrentPhase(e.target.value)}
              placeholder="e.g. Basement 2 Excavation / Slab Pour"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-input"
              value={status}
              onChange={(e) => setStatus(e.target.value as SiteStatus)}
            >
              <option value="Active">Active</option>
              <option value="Planned">Planned</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Target Completion</label>
            <input
              type="date"
              className="form-input"
              value={expectedCompletionDate}
              onChange={(e) => setExpectedCompletionDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Site Specific Notes & Directives</label>
          <textarea
            className="form-textarea"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Logistics restrictions, soil conditions, crane setup notes..."
          />
        </div>

        <div className="modal-footer" style={{ margin: '0 -1.5rem -1.5rem -1.5rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {initialData ? 'Update Site' : 'Add Site'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
