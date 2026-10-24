import { db } from '../data/database.js';

export const getReports = (req, res) => {
  const reports = db.get('dailyReports');
  res.json(reports);
};

export const getReportById = (req, res) => {
  const report = db.getById('dailyReports', req.params.id);
  if (!report) return res.status(404).json({ error: 'Daily report not found' });
  res.json(report);
};

export const createReport = (req, res) => {
  const payload = req.body;
  const count = db.get('dailyReports').length + 1;
  const id = `DSR-${new Date().getFullYear()}-${String(count).padStart(3, '0')}`;
  
  const newReport = {
    ...payload,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviewHistory: payload.reviewHistory || [],
    photographs: payload.photographs || [],
    workProgress: payload.workProgress || [],
    materialsUsed: payload.materialsUsed || [],
    equipmentUsed: payload.equipmentUsed || [],
    workersSummary: payload.workersSummary || { total: 0, present: 0, absent: 0, halfDay: 0, leave: 0 },
  };

  db.insert('dailyReports', newReport);

  // Add in-app notification
  db.insert('notifications', {
    id: `NOT-${Date.now().toString().slice(-4)}`,
    title: 'New Daily Report',
    message: `Report ${id} created by ${newReport.engineerName || 'Site Engineer'}`,
    time: 'Just now',
    read: false,
    type: 'report',
  });

  res.status(201).json(newReport);
};

export const updateReport = (req, res) => {
  const updated = db.update('dailyReports', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Daily report not found' });
  res.json(updated);
};

export const approveReport = (req, res) => {
  const { id } = req.params;
  const { comment, reviewerName, reviewerId } = req.body;

  const report = db.getById('dailyReports', id);
  if (!report) return res.status(404).json({ error: 'Daily report not found' });

  const history = report.reviewHistory || [];
  history.push({
    id: `REV-${Date.now().toString().slice(-4)}`,
    reviewerId: reviewerId || 'USR-002',
    reviewerName: reviewerName || 'Priya (Manager)',
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    action: 'Approved',
    comment: comment || 'Report reviewed and approved.',
  });

  const updated = db.update('dailyReports', id, {
    status: 'Approved',
    reviewHistory: history,
  });

  db.insert('notifications', {
    id: `NOT-${Date.now().toString().slice(-4)}`,
    title: 'Report Approved',
    message: `Daily report ${id} approved by ${reviewerName || 'Project Manager'}`,
    time: 'Just now',
    read: false,
    type: 'approval',
  });

  res.json(updated);
};

export const requestRevision = (req, res) => {
  const { id } = req.params;
  const { comment, reviewerName, reviewerId } = req.body;

  const report = db.getById('dailyReports', id);
  if (!report) return res.status(404).json({ error: 'Daily report not found' });

  const history = report.reviewHistory || [];
  history.push({
    id: `REV-${Date.now().toString().slice(-4)}`,
    reviewerId: reviewerId || 'USR-002',
    reviewerName: reviewerName || 'Priya (Manager)',
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    action: 'Revision Required',
    comment: comment || 'Revision requested. Please update required fields.',
  });

  const updated = db.update('dailyReports', id, {
    status: 'Revision Required',
    reviewHistory: history,
  });

  db.insert('notifications', {
    id: `NOT-${Date.now().toString().slice(-4)}`,
    title: 'Revision Requested',
    message: `Report ${id} flagged for revisions: "${comment || 'Details requested'}"`,
    time: 'Just now',
    read: false,
    type: 'revision',
  });

  res.json(updated);
};

export const deleteReport = (req, res) => {
  const success = db.delete('dailyReports', req.params.id);
  if (!success) return res.status(404).json({ error: 'Daily report not found' });
  res.json({ message: 'Daily report deleted successfully' });
};
