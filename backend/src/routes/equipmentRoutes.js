import { Router } from 'express';
import {
  getEquipment,
  createEquipment,
  updateEquipment,
  getUsageLogs,
  logUsage,
} from '../controllers/equipmentController.js';

const router = Router();
router.get('/', getEquipment);
router.post('/', createEquipment);
router.put('/:id', updateEquipment);

router.get('/usage/logs', getUsageLogs);
router.post('/usage/log', logUsage);

export default router;
