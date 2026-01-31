import { Router } from 'express';
import { RoomController } from '../controllers/roomController';
import { authMiddleware, adminMiddleware } from './auth';

const router = Router();

// Standard routes
router.put('/:id', authMiddleware, adminMiddleware, RoomController.updateRoom);
router.delete('/:id', authMiddleware, adminMiddleware, RoomController.deleteRoom);

export default router;
