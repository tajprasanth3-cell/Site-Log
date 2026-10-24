import { db } from '../data/database.js';
import { isMongoConnected } from '../config/db.js';

export const getInitialData = (req, res) => {
  const allData = db.getAllData();
  res.json({
    status: 'ok',
    database: isMongoConnected() ? 'mongodb_atlas' : 'local_json_db',
    timestamp: new Date().toISOString(),
    data: allData,
  });
};

export const getHealth = (req, res) => {
  res.json({
    status: 'online',
    service: 'Site Log API Server',
    database: isMongoConnected() ? 'MongoDB Atlas (Cluster0)' : 'Local JSON Store (db.json)',
    isMongoConnected: isMongoConnected(),
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};
