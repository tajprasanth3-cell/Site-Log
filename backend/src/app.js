import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';

const app = express();

// CORS configuration (allows frontend on Vite dev port, preview, or Vercel production)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(logger);

// Welcome Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Site Log API Server',
    description: 'Centralized digital construction site operations & daily reporting platform API',
    endpoints: {
      health: '/api/health',
      initialData: '/api/initial-data',
      projects: '/api/projects',
      sites: '/api/sites',
      reports: '/api/reports',
      workers: '/api/workers',
      materials: '/api/materials',
      equipment: '/api/equipment',
      issues: '/api/issues',
      photos: '/api/photos',
      users: '/api/users',
      auth: '/api/auth',
    },
  });
});

// Mount /api routes
app.use('/api', apiRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global Error Handler
app.use(errorHandler);

export default app;
