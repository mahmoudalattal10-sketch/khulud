
import { Router } from 'express';
import { HotelController } from '../controllers/hotelController';
import { RoomController } from '../controllers/roomController';
import { authMiddleware, adminMiddleware } from './auth';

const router = Router();

router.get('/', HotelController.getHotels);
router.get('/:slug', HotelController.getHotelBySlug);
router.get('/id/:id', HotelController.getHotelById);

// Admin Routes
router.post('/', authMiddleware, adminMiddleware, HotelController.createHotel);
router.put('/:id', authMiddleware, adminMiddleware, HotelController.updateHotel);
router.delete('/:id', authMiddleware, adminMiddleware, HotelController.deleteHotel);
router.patch('/:id/visibility', authMiddleware, adminMiddleware, HotelController.toggleVisibility);
router.patch('/:id/featured', authMiddleware, adminMiddleware, HotelController.toggleFeatured);

// Room Routes (Nested)
router.post('/:hotelId/rooms', authMiddleware, adminMiddleware, RoomController.createRoom);

export default router;
