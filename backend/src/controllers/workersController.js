import { db } from '../data/database.js';

export const getWorkers = (req, res) => {
  const workers = db.get('workers');
  res.json(workers);
};

export const createWorker = (req, res) => {
  const { name, trade, contractor, skill, contact, siteId, todayAttendance } = req.body;
  if (!name) return res.status(400).json({ error: 'Worker name is required' });

  const id = `WKR-${String(db.get('workers').length + 1).padStart(3, '0')}`;
  const newWorker = {
    id,
    name,
    trade: trade || 'Mason',
    contractor: contractor || 'Direct Hire',
    skill: skill || 'Skilled',
    contact: contact || '+91 90000 00000',
    siteId: siteId || 'SIT-001',
    status: 'Active',
    todayAttendance: todayAttendance || 'Present',
    createdAt: new Date().toISOString(),
  };

  db.insert('workers', newWorker);
  res.status(201).json(newWorker);
};

export const updateAttendance = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ error: 'Attendance status is required' });

  const updated = db.update('workers', id, { todayAttendance: status });
  if (!updated) return res.status(404).json({ error: 'Worker not found' });

  res.json(updated);
};

export const updateWorker = (req, res) => {
  const updated = db.update('workers', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Worker not found' });
  res.json(updated);
};

export const deleteWorker = (req, res) => {
  const success = db.delete('workers', req.params.id);
  if (!success) return res.status(404).json({ error: 'Worker not found' });
  res.json({ message: 'Worker deleted successfully' });
};
