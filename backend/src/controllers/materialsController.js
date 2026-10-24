import { db } from '../data/database.js';

export const getMaterials = (req, res) => {
  const materials = db.get('materials');
  res.json(materials);
};

export const createMaterial = (req, res) => {
  const { name, category, unit, openingQty, receivedQty, usedQty, remainingQty, supplier, deliveryDate, siteId, remarks } = req.body;
  if (!name) return res.status(400).json({ error: 'Material name is required' });

  const id = `MAT-${String(db.get('materials').length + 1).padStart(3, '0')}`;
  const newMaterial = {
    id,
    name,
    category: category || 'General Construction',
    unit: unit || 'bags',
    openingQty: Number(openingQty) || 0,
    receivedQty: Number(receivedQty) || 0,
    usedQty: Number(usedQty) || 0,
    remainingQty: Number(remainingQty) || 0,
    supplier: supplier || 'Local Vendor',
    deliveryDate: deliveryDate || new Date().toISOString().split('T')[0],
    siteId: siteId || 'SIT-001',
    remarks: remarks || '',
    createdAt: new Date().toISOString(),
  };

  db.insert('materials', newMaterial);
  res.status(201).json(newMaterial);
};

export const updateMaterial = (req, res) => {
  const updated = db.update('materials', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Material not found' });
  res.json(updated);
};

export const getMaterialRequests = (req, res) => {
  const requests = db.get('materialRequests');
  res.json(requests);
};

export const createMaterialRequest = (req, res) => {
  const { materialName, quantity, unit, requiredDate, reason, siteId, siteName, requestingEngineerId, requestingEngineerName } = req.body;
  if (!materialName) return res.status(400).json({ error: 'Material name is required' });

  const id = `MR-${String(db.get('materialRequests').length + 1).padStart(3, '0')}`;
  const newRequest = {
    id,
    materialName,
    quantity: Number(quantity) || 1,
    unit: unit || 'units',
    requiredDate: requiredDate || new Date().toISOString().split('T')[0],
    reason: reason || 'Standard stock replenishment',
    siteId: siteId || 'SIT-001',
    siteName: siteName || 'Site A - Tower Block 1',
    requestingEngineerId: requestingEngineerId || 'USR-001',
    requestingEngineerName: requestingEngineerName || 'Ashok',
    status: 'Pending Review',
    createdAt: new Date().toISOString().split('T')[0],
  };

  db.insert('materialRequests', newRequest);

  db.insert('notifications', {
    id: `NOT-${Date.now().toString().slice(-4)}`,
    title: 'New Material Requisition',
    message: `${newRequest.materialName} (${newRequest.quantity} ${newRequest.unit}) requested for ${newRequest.siteName}`,
    time: 'Just now',
    read: false,
    type: 'material',
  });

  res.status(201).json(newRequest);
};

export const updateMaterialRequestStatus = (req, res) => {
  const { id } = req.params;
  const { status, remarks } = req.body;

  const updated = db.update('materialRequests', id, {
    status,
    managerRemarks: remarks,
  });

  if (!updated) return res.status(404).json({ error: 'Requisition not found' });
  res.json(updated);
};
