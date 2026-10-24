import { db } from '../data/database.js';

export const getSites = (req, res) => {
  const sites = db.get('sites');
  res.json(sites);
};

export const getSiteById = (req, res) => {
  const site = db.getById('sites', req.params.id);
  if (!site) return res.status(404).json({ error: 'Site not found' });
  res.json(site);
};

export const createSite = (req, res) => {
  const { name, projectId, location, gpsCoordinates, engineerId, engineerName, currentPhase, status, startDate, expectedCompletionDate, notes } = req.body;
  
  if (!name) return res.status(400).json({ error: 'Site name is required' });

  const projects = db.get('projects');
  const project = projects.find((p) => p.id === projectId) || projects[0];

  const id = `SIT-${String(db.get('sites').length + 1).padStart(3, '0')}`;
  const newSite = {
    id,
    name,
    projectId: project ? project.id : 'PRJ-001',
    projectName: project ? project.name : 'Apartment Building',
    location: location || 'Project Site Area',
    gpsCoordinates: gpsCoordinates || '12.9716° N, 80.2435° E',
    engineerId: engineerId || 'USR-001',
    engineerName: engineerName || 'Ashok',
    currentPhase: currentPhase || 'Foundation & Excavation',
    status: status || 'Active',
    startDate: startDate || new Date().toISOString().split('T')[0],
    expectedCompletionDate: expectedCompletionDate || '2027-06-30',
    notes: notes || '',
    createdAt: new Date().toISOString(),
  };

  db.insert('sites', newSite);
  res.status(201).json(newSite);
};

export const updateSite = (req, res) => {
  const updated = db.update('sites', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Site not found' });
  res.json(updated);
};

export const deleteSite = (req, res) => {
  const success = db.delete('sites', req.params.id);
  if (!success) return res.status(404).json({ error: 'Site not found' });
  res.json({ message: 'Site deleted successfully' });
};
