import { db } from '../data/database.js';

export const getEquipment = (req, res) => {
  const equipment = db.get('equipment');
  res.json(equipment);
};

export const createEquipment = (req, res) => {
  const { name, type, assignedSiteId, assignedSiteName, operator, condition, maintenanceStatus } = req.body;
  if (!name) return res.status(400).json({ error: 'Equipment name is required' });

  const id = `EQP-${String(db.get('equipment').length + 1).padStart(3, '0')}`;
  const newEquipment = {
    id,
    name,
    type: type || 'Machinery',
    assignedSiteId: assignedSiteId || 'SIT-001',
    assignedSiteName: assignedSiteName || 'Site A - Tower Block 1',
    operator: operator || 'Assigned Operator',
    condition: condition || 'Good',
    maintenanceStatus: maintenanceStatus || 'OK',
    lastServiceDate: new Date().toISOString().split('T')[0],
    nextServiceDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  };

  db.insert('equipment', newEquipment);
  res.status(201).json(newEquipment);
};

export const updateEquipment = (req, res) => {
  const updated = db.update('equipment', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Equipment not found' });
  res.json(updated);
};

export const getUsageLogs = (req, res) => {
  const logs = db.get('equipmentUsageLogs');
  res.json(logs);
};

export const logUsage = (req, res) => {
  const { equipmentId, equipmentName, siteId, date, startTime, endTime, durationHours, purpose, remarks } = req.body;

  const id = `EUL-${String(db.get('equipmentUsageLogs').length + 1).padStart(3, '0')}`;
  const newLog = {
    id,
    equipmentId,
    equipmentName: equipmentName || 'Equipment',
    siteId: siteId || 'SIT-001',
    date: date || new Date().toISOString().split('T')[0],
    startTime: startTime || '08:00',
    endTime: endTime || '17:00',
    durationHours: Number(durationHours) || 0,
    purpose: purpose || 'Operations',
    remarks: remarks || '',
    createdAt: new Date().toISOString(),
  };

  db.insert('equipmentUsageLogs', newLog);
  res.status(201).json(newLog);
};
