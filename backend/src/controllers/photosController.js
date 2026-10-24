import { db } from '../data/database.js';

export const getPhotos = (req, res) => {
  const photos = db.get('photos');
  res.json(photos);
};

export const createPhoto = (req, res) => {
  const { title, url, projectId, projectName, siteId, siteName, category, description, uploadedBy, takenAt } = req.body;
  if (!url) return res.status(400).json({ error: 'Photo URL is required' });

  const id = `PHT-${String(db.get('photos').length + 1).padStart(3, '0')}`;
  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

  const newPhoto = {
    id,
    url,
    title: title || 'Site Progress Record',
    projectId: projectId || 'PRJ-001',
    projectName: projectName || 'Apartment Building',
    siteId: siteId || 'SIT-001',
    siteName: siteName || 'Site A - Tower Block 1',
    category: category || 'Work Progress',
    dateTime: now,
    takenAt: takenAt || now,
    uploadedAt: now,
    description: description || '',
    uploadedBy: uploadedBy || 'Ashok',
    createdAt: new Date().toISOString(),
  };

  db.insert('photos', newPhoto);
  res.status(201).json(newPhoto);
};

export const deletePhoto = (req, res) => {
  const success = db.delete('photos', req.params.id);
  if (!success) return res.status(404).json({ error: 'Photo not found' });
  res.json({ message: 'Photo deleted successfully' });
};
