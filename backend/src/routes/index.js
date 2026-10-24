import { Router } from 'express';
import authRoutes from './authRoutes.js';
import projectRoutes from './projectRoutes.js';
import siteRoutes from './siteRoutes.js';
import reportRoutes from './reportRoutes.js';
import workerRoutes from './workerRoutes.js';
import materialRoutes from './materialRoutes.js';
import equipmentRoutes from './equipmentRoutes.js';
import issueRoutes from './issueRoutes.js';
import photoRoutes from './photoRoutes.js';
import userRoutes from './userRoutes.js';
import { getInitialData, getHealth } from '../controllers/syncController.js';

const router = Router();

// Health check
router.get('/health', getHealth);

// Full initial sync payload for fast frontend bootstrapping
router.get('/initial-data', getInitialData);

// Sub-resource routes
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/sites', siteRoutes);
router.use('/reports', reportRoutes);
router.use('/workers', workerRoutes);
router.use('/materials', materialRoutes);
router.use('/equipment', equipmentRoutes);
router.use('/issues', issueRoutes);
router.use('/photos', photoRoutes);
router.use('/users', userRoutes);

export default router;
