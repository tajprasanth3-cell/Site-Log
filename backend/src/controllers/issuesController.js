import { db } from '../data/database.js';

export const getIssues = (req, res) => {
  const issues = db.get('issues');
  res.json(issues);
};

export const createIssue = (req, res) => {
  const { title, description, category, severity, siteId, siteName, reportedBy, photographs, assignedPerson, status } = req.body;
  if (!title) return res.status(400).json({ error: 'Issue title is required' });

  const id = `ISS-${String(db.get('issues').length + 1).padStart(3, '0')}`;
  const newIssue = {
    id,
    title,
    description: description || '',
    category: category || 'Safety',
    severity: severity || 'Medium',
    siteId: siteId || 'SIT-001',
    siteName: siteName || 'Site A - Tower Block 1',
    reportedBy: reportedBy || 'Ashok',
    date: new Date().toISOString().split('T')[0],
    photographs: photographs || [],
    assignedPerson: assignedPerson || 'Safety Supervisor',
    status: status || 'Open',
    createdAt: new Date().toISOString(),
  };

  db.insert('issues', newIssue);

  db.insert('notifications', {
    id: `NOT-${Date.now().toString().slice(-4)}`,
    title: `New Issue: ${newIssue.severity} Severity`,
    message: `${newIssue.title} reported on ${newIssue.siteName}`,
    time: 'Just now',
    read: false,
    type: 'issue',
  });

  res.status(201).json(newIssue);
};

export const updateIssueStatus = (req, res) => {
  const { id } = req.params;
  const { status, resolution } = req.body;

  const updates = { status };
  if (resolution) updates.resolution = resolution;
  if (status === 'Resolved' || status === 'Closed') {
    updates.resolvedDate = new Date().toISOString().split('T')[0];
  }

  const updated = db.update('issues', id, updates);
  if (!updated) return res.status(404).json({ error: 'Issue not found' });
  res.json(updated);
};

export const getSafetyObservations = (req, res) => {
  const safety = db.get('safetyObservations');
  res.json(safety);
};

export const createSafetyObservation = (req, res) => {
  const { observation, riskLevel, location, siteId, siteName, photograph, correctiveAction, remarks, reportedBy } = req.body;
  if (!observation) return res.status(400).json({ error: 'Observation description is required' });

  const id = `SFT-${String(db.get('safetyObservations').length + 1).padStart(3, '0')}`;
  const newObs = {
    id,
    observation,
    riskLevel: riskLevel || 'Medium',
    location: location || 'Site Perimeter',
    siteId: siteId || 'SIT-001',
    siteName: siteName || 'Site A - Tower Block 1',
    date: new Date().toISOString().split('T')[0],
    photograph: photograph || '',
    correctiveAction: correctiveAction || 'Site team notified',
    status: 'Action Taken',
    remarks: remarks || '',
    reportedBy: reportedBy || 'Ashok',
    createdAt: new Date().toISOString(),
  };

  db.insert('safetyObservations', newObs);
  res.status(201).json(newObs);
};

export const updateSafetyStatus = (req, res) => {
  const { id } = req.params;
  const { status, remarks } = req.body;

  const updates = { status };
  if (remarks) updates.remarks = remarks;

  const updated = db.update('safetyObservations', id, updates);
  if (!updated) return res.status(404).json({ error: 'Safety observation not found' });
  res.json(updated);
};
