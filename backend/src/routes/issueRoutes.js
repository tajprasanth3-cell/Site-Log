import { Router } from 'express';
import {
  getIssues,
  createIssue,
  updateIssueStatus,
  getSafetyObservations,
  createSafetyObservation,
  updateSafetyStatus,
} from '../controllers/issuesController.js';

const router = Router();
router.get('/', getIssues);
router.post('/', createIssue);
router.patch('/:id/status', updateIssueStatus);

router.get('/safety/all', getSafetyObservations);
router.post('/safety/new', createSafetyObservation);
router.patch('/safety/:id/status', updateSafetyStatus);

export default router;
