import { Router } from 'express';
import {
  getReports,
  getReportById,
  createReport,
  updateReport,
  approveReport,
  requestRevision,
  deleteReport,
} from '../controllers/reportsController.js';

const router = Router();
router.get('/', getReports);
router.get('/:id', getReportById);
router.post('/', createReport);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);
router.post('/:id/approve', approveReport);
router.post('/:id/revision', requestRevision);

export default router;
