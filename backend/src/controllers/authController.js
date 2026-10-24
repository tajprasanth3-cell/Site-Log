import { db } from '../data/database.js';

export const login = (req, res) => {
  const { email, role } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const users = db.get('users');
  let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    // If not found, authenticate with requested role or default
    user = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      email: email.toLowerCase(),
      role: role || 'site_engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      phone: '+91 99999 00000',
      assignedSiteIds: ['SIT-001'],
    };
    db.insert('users', user);
  } else if (role && user.role !== role) {
    user = db.update('users', user.id, { role });
  }

  res.json({
    message: 'Login successful',
    token: `fake-jwt-token-for-${user.id}`,
    user,
  });
};

export const getCurrentUser = (req, res) => {
  const users = db.get('users');
  const user = users[0]; // Default active user (Ashok)
  res.json(user);
};
