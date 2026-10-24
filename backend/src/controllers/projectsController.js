import { db } from '../data/database.js';

export const getProjects = (req, res) => {
  const projects = db.get('projects');
  res.json(projects);
};

export const getProjectById = (req, res) => {
  const project = db.getById('projects', req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
};

export const createProject = (req, res) => {
  const { name, client, type, startDate, expectedCompletionDate, location, projectManager, status, description, progress } = req.body;
  
  if (!name) return res.status(400).json({ error: 'Project name is required' });

  const id = `PRJ-${String(db.get('projects').length + 1).padStart(3, '0')}`;
  const newProject = {
    id,
    name,
    client: client || 'General Client',
    type: type || 'Commercial',
    startDate: startDate || new Date().toISOString().split('T')[0],
    expectedCompletionDate: expectedCompletionDate || '2027-12-31',
    location: location || 'Location TBA',
    projectManager: projectManager || 'Priya',
    status: status || 'Active',
    description: description || '',
    progress: Number(progress) || 0,
    createdAt: new Date().toISOString(),
  };

  db.insert('projects', newProject);
  res.status(201).json(newProject);
};

export const updateProject = (req, res) => {
  const updated = db.update('projects', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Project not found' });
  res.json(updated);
};

export const deleteProject = (req, res) => {
  const success = db.delete('projects', req.params.id);
  if (!success) return res.status(404).json({ error: 'Project not found' });
  res.json({ message: 'Project deleted successfully' });
};
