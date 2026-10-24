import { db } from '../data/database.js';

export const getInitialData = (req, res) => {
  const allData = db.getAllData();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    data: allData,
  });
};

export const getHealth = (req, res) => {
  res.json({
    status: 'online',
    service: 'Site Log API Server',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};
