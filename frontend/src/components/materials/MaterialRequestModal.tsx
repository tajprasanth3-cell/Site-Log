import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

interface MaterialRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MaterialRequestModal: React.FC<MaterialRequestModalProps> = ({ isOpen, onClose }) => {
  const { sites, currentUser, addMaterialRequest } = useApp();
  const [materialName, setMaterialName] = useState('TMT Reinforcement Steel 20mm');
  const [quantity, setQuantity] = useState<number>(20);
  const [unit, setUnit] = useState('MT');
  const [requiredDate, setRequiredDate] = useState(
    new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]
  );
  const [siteId, setSiteId] = useState(sites[0]?.id || 'SIT-001');
  const [reason, setReason] = useState('Level 15 columns casting rebar fabrication.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selSite = sites.find((s) => s.id === siteId);
    addMaterialRequest({
      materialName,
      quantity: Number(quantity),
      unit,
      requiredDate,
      reason,
      siteId,
      siteName: selSite?.name || 'Site A',
      requestingEngineerId: currentUser.id,
      requestingEngineerName: currentUser.name,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Material Requisition" maxWidth="md">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="form-grid">
          <div className="form-group col-span-2">
            <label className="form-label">Material Description <span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
              placeholder="e.g. TMT Steel 16mm Fe500D"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Quantity Required <span className="required">*</span></label>
            <input
              type="number"
              className="form-input"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Unit of Measure</label>
            <select className="form-input" value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="bags">bags</option>
              <option value="MT">MT (Metric Ton)</option>
              <option value="m³">m³ (Cubic Meter)</option>
              <option value="pcs">pcs (Pieces)</option>
              <option value="meters">meters</option>
              <option value="liters">liters</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Destination Site <span className="required">*</span></label>
            <select className="form-input" value={siteId} onChange={(e) => setSiteId(e.target.value)}>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Required Delivery Date <span className="required">*</span></label>
            <input
              type="date"
              className="form-input"
              value={requiredDate}
              onChange={(e) => setRequiredDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Reason / Work Activity Justification <span className="required">*</span></label>
          <textarea
            className="form-textarea"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Specify why materials are needed and corresponding milestone..."
            required
          />
        </div>

        <div className="modal-footer" style={{ margin: '0 -1.5rem -1.5rem -1.5rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit Requisition to Manager
          </button>
        </div>
      </form>
    </Modal>
  );
};
