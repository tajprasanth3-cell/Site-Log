import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, CheckCircle, Truck, Clock, PackageCheck, AlertCircle } from 'lucide-react';
import { Material, MaterialRequest } from '../../types';
import { MaterialRequestModal } from './MaterialRequestModal';
import { Modal } from '../common/Modal';

export const MaterialsView: React.FC = () => {
  const {
    materials,
    materialRequests,
    currentUser,
    updateMaterialRequestStatus,
    addMaterial,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'inventory' | 'requests'>('inventory');
  const [search, setSearch] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('All');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isNewMaterialModalOpen, setIsNewMaterialModalOpen] = useState(false);

  // New stock item form state
  const [matName, setMatName] = useState('');
  const [matUnit, setMatUnit] = useState('bags');
  const [matOpening, setMatOpening] = useState(100);
  const [matReceived, setMatReceived] = useState(0);
  const [matUsed, setMatUsed] = useState(0);
  const [matSupplier, setMatSupplier] = useState('');

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.supplier.toLowerCase().includes(search.toLowerCase());
    const matchesSupplier = supplierFilter === 'All' || m.supplier === supplierFilter;
    return matchesSearch && matchesSupplier;
  });

  const isManagerOrAdmin = currentUser.role === 'project_manager' || currentUser.role === 'admin';

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    const remaining = Number(matOpening) + Number(matReceived) - Number(matUsed);
    addMaterial({
      name: matName,
      category: 'General Supplies',
      unit: matUnit,
      openingQty: Number(matOpening),
      receivedQty: Number(matReceived),
      usedQty: Number(matUsed),
      remainingQty: remaining,
      supplier: matSupplier || 'Local Supplier',
      deliveryDate: new Date().toISOString().split('T')[0],
      siteId: 'SIT-001',
      remarks: 'Added via SiteLog Material Manager',
    });
    setIsNewMaterialModalOpen(false);
  };

  return (
    <div className="page-content materials-view">
      <div className="page-header">
        <div>
          <h1 className="page-title">Material Management</h1>
          <p className="page-subtitle">Track material usage, current stock balances, and requisition workflows</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-outline" onClick={() => setIsNewMaterialModalOpen(true)}>
            <Plus size={16} />
            <span>+ Add Stock Item</span>
          </button>
          <button className="btn btn-primary" onClick={() => setIsRequestModalOpen(true)}>
            <Plus size={16} />
            <span>Request Material</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          Site Inventory Stock ({materials.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Requisition Requests & Workflow ({materialRequests.length})
        </button>
      </div>

      {activeTab === 'inventory' ? (
        <>
          {/* Filter Bar (Screenshot 7) */}
          <div className="filter-bar">
            <div className="filter-group">
              <div className="search-input-wrapper">
                <Search size={16} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search materials, suppliers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="filter-select"
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
              >
                <option value="All">All Suppliers</option>
                {Array.from(new Set(materials.map((m) => m.supplier))).map((sup) => (
                  <option key={sup} value={sup}>
                    {sup}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Showing <strong>{filteredMaterials.length}</strong> material categories
            </div>
          </div>

          {/* Table (Screenshot 7) */}
          <div className="mobile-scroll-hint">Swipe horizontally to see all columns</div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Opening Qty</th>
                  <th>Received</th>
                  <th>Used</th>
                  <th>Remaining Balance</th>
                  <th>Supplier</th>
                  <th>Delivery Date</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                      No materials found.
                    </td>
                  </tr>
                ) : (
                  filteredMaterials.map((m) => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>{m.name}</td>
                      <td>
                        {m.openingQty} {m.unit}
                      </td>
                      <td style={{ color: '#059669', fontWeight: 600 }}>
                        +{m.receivedQty} {m.unit}
                      </td>
                      <td style={{ color: '#dc2626', fontWeight: 600 }}>
                        -{m.usedQty} {m.unit}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            m.remainingQty > 20
                              ? 'badge-success'
                              : m.remainingQty > 0
                              ? 'badge-warning'
                              : 'badge-danger'
                          }`}
                        >
                          {m.remainingQty} {m.unit}
                        </span>
                      </td>
                      <td style={{ color: '#475569' }}>{m.supplier}</td>
                      <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{m.deliveryDate}</td>
                      <td style={{ color: '#64748b', fontSize: '0.8rem', maxWidth: '200px' }}>
                        {m.remarks}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Requisition Requests Workflow View (Section 10) */
        <>
        <div className="mobile-scroll-hint">Swipe horizontally to see all columns</div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Req ID</th>
                <th>Material</th>
                <th>Quantity</th>
                <th>Target Site</th>
                <th>Req Date</th>
                <th>Engineer</th>
                <th>Reason</th>
                <th>Status</th>
                {isManagerOrAdmin && <th style={{ textAlign: 'center' }}>Approval Actions</th>}
              </tr>
            </thead>
            <tbody>
              {materialRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No material requests logged yet.
                  </td>
                </tr>
              ) : (
                materialRequests.map((mr) => (
                  <tr key={mr.id}>
                    <td style={{ fontWeight: 700, color: '#f97316' }}>{mr.id}</td>
                    <td style={{ fontWeight: 600 }}>{mr.materialName}</td>
                    <td style={{ fontWeight: 700 }}>
                      {mr.quantity} {mr.unit}
                    </td>
                    <td>{mr.siteName}</td>
                    <td>{mr.requiredDate}</td>
                    <td>{mr.requestingEngineerName}</td>
                    <td style={{ fontSize: '0.8rem', color: '#475569', maxWidth: '220px' }}>
                      {mr.reason}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          mr.status === 'Approved'
                            ? 'badge-info'
                            : mr.status === 'Received'
                            ? 'badge-success'
                            : mr.status === 'In Delivery'
                            ? 'badge-warning'
                            : mr.status === 'Rejected'
                            ? 'badge-danger'
                            : 'badge-neutral'
                        }`}
                      >
                        {mr.status}
                      </span>
                    </td>
                    {isManagerOrAdmin && (
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                          {mr.status === 'Pending Review' && (
                            <>
                              <button
                                className="btn btn-sm btn-success"
                                title="Approve Request"
                                onClick={() =>
                                  updateMaterialRequestStatus(mr.id, 'Approved', 'Approved for supply')
                                }
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                title="Reject Request"
                                onClick={() =>
                                  updateMaterialRequestStatus(mr.id, 'Rejected', 'Exceeds budget limit')
                                }
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {mr.status === 'Approved' && (
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => updateMaterialRequestStatus(mr.id, 'In Delivery')}
                            >
                              Dispatch (In Delivery)
                            </button>
                          )}
                          {mr.status === 'In Delivery' && (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => updateMaterialRequestStatus(mr.id, 'Received')}
                            >
                              Mark Received
                            </button>
                          )}
                          {mr.status === 'Received' && (
                            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                              Closed
                            </span>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </>
      )}

      {isRequestModalOpen && (
        <MaterialRequestModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
        />
      )}

      {isNewMaterialModalOpen && (
        <Modal
          isOpen={isNewMaterialModalOpen}
          onClose={() => setIsNewMaterialModalOpen(false)}
          title="Add New Stock Material to Inventory"
          maxWidth="md"
        >
          <form onSubmit={handleAddStock} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-grid">
              <div className="form-group col-span-2">
                <label className="form-label">Material Name <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={matName}
                  onChange={(e) => setMatName(e.target.value)}
                  placeholder="e.g. Clay Red Bricks (Class 1)"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Unit of Measure</label>
                <input
                  type="text"
                  className="form-input"
                  value={matUnit}
                  onChange={(e) => setMatUnit(e.target.value)}
                  placeholder="e.g. bags / MT / pcs"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Opening Quantity</label>
                <input
                  type="number"
                  className="form-input"
                  value={matOpening}
                  onChange={(e) => setMatOpening(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group col-span-2">
                <label className="form-label">Supplier Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={matSupplier}
                  onChange={(e) => setMatSupplier(e.target.value)}
                  placeholder="e.g. Standard Brick Kilns"
                />
              </div>
            </div>

            <div className="modal-footer" style={{ margin: '0 -1.5rem -1.5rem -1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsNewMaterialModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Material
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
