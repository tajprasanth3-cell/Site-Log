import { db } from '../data/database.js';

export const getUsers = (req, res) => {
  const users = db.get('users');
  res.json(users);
};

export const createUser = (req, res) => {
  const { name, email, role, phone, assignedSiteIds, avatar } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

  const id = `USR-${String(db.get('users').length + 1).padStart(3, '0')}`;
  const newUser = {
    id,
    name,
    email: email.toLowerCase(),
    role: role || 'site_engineer',
    phone: phone || '+91 98765 00000',
    avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    assignedSiteIds: assignedSiteIds || ['SIT-001'],
    createdAt: new Date().toISOString(),
  };

  db.insert('users', newUser);
  res.status(201).json(newUser);
};

export const updateUser = (req, res) => {
  const updated = db.update('users', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.json(updated);
};

export const deleteUser = (req, res) => {
  const success = db.delete('users', req.params.id);
  if (!success) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User deleted successfully' });
};
