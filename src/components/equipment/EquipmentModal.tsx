import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Equipment, EquipmentCondition, MaintenanceStatus } from '../../types';

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EquipmentModal: React.FC<EquipmentModalProps> = ({ isOpen, onClose }) => {
  const { sites, addEquipment } = useApp();
  const [name, setName] = useState('');
  const [type, setType] = useState('Heavy Machinery');
  const [siteId, setSiteId] = useState(sites[0]?.id || 'SIT-001');
  const [operator, setOperator] = useState('');
  const [condition, setCondition] = useState<EquipmentCondition>('Good');
  const [maintenanceStatus, setMaintenanceStatus] = useState<MaintenanceStatus>('OK');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selSite = sites.find((s) => s.id === siteId);
    addEquipment({
      name,
      type,
      assignedSiteId: siteId,
      assignedSiteName: selSite?.name || 'Site A',
      operator: operator || 'Assigned Operator',
      condition,
      maintenanceStatus,
      lastServiceDate: new Date().toISOString().split('T')[0],
      nextServiceDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register Construction Equipment" maxWidth="md">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="form-grid">
          <div className="form-group col-span-2">
            <label className="form-label">Equipment Name & Model <span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tower Crane 50m Boom / CAT 320D"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Machinery Type</label>
            <input
              type="text"
              className="form-input"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="e.g. Earthmoving / Lifting / Mixing"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Assigned Site</label>
            <select className="form-input" value={siteId} onChange={(e) => setSiteId(e.target.value)}>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Operator Name</label>
            <input
              type="text"
              className="form-input"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              placeholder="e.g. Ramesh Chandra"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Working Condition</label>
            <select
              className="form-input"
              value={condition}
              onChange={(e) => setCondition(e.target.value as EquipmentCondition)}
            >
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Needs Repair">Needs Repair</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Maintenance Status</label>
            <select
              className="form-input"
              value={maintenanceStatus}
              onChange={(e) => setMaintenanceStatus(e.target.value as MaintenanceStatus)}
            >
              <option value="OK">OK (Certified)</option>
              <option value="Due">Due (Inspection required)</option>
              <option value="In Repair">In Repair (Standstill)</option>
            </select>
          </div>
        </div>

        <div className="modal-footer" style={{ margin: '0 -1.5rem -1.5rem -1.5rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Register Equipment
          </button>
        </div>
      </form>
    </Modal>
  );
};
