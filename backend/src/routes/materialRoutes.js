import { Router } from 'express';
import {
  getMaterials,
  createMaterial,
  updateMaterial,
  getMaterialRequests,
  createMaterialRequest,
  updateMaterialRequestStatus,
} from '../controllers/materialsController.js';

const router = Router();
router.get('/', getMaterials);
router.post('/', createMaterial);
router.put('/:id', updateMaterial);

router.get('/requests/all', getMaterialRequests);
router.post('/requests/new', createMaterialRequest);
router.patch('/requests/:id/status', updateMaterialRequestStatus);

export default router;
