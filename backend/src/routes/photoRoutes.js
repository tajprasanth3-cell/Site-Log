import { Router } from 'express';
import { getPhotos, createPhoto, deletePhoto } from '../controllers/photosController.js';

const router = Router();
router.get('/', getPhotos);
router.post('/', createPhoto);
router.delete('/:id', deletePhoto);

export default router;
