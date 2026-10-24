import { Router } from 'express';
import {
  getWorkers,
  createWorker,
  updateWorker,
  updateAttendance,
  deleteWorker,
} from '../controllers/workersController.js';

const router = Router();
router.get('/', getWorkers);
router.post('/', createWorker);
router.put('/:id', updateWorker);
router.patch('/:id/attendance', updateAttendance);
router.delete('/:id', deleteWorker);

export default router;
