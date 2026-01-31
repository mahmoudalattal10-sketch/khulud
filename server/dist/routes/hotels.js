"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hotelController_1 = require("../controllers/hotelController");
const roomController_1 = require("../controllers/roomController");
const auth_1 = require("./auth");
const router = (0, express_1.Router)();
router.get('/', hotelController_1.HotelController.getHotels);
router.get('/:slug', hotelController_1.HotelController.getHotelBySlug);
router.get('/id/:id', hotelController_1.HotelController.getHotelById);
// Admin Routes
router.post('/', auth_1.authMiddleware, auth_1.adminMiddleware, hotelController_1.HotelController.createHotel);
router.put('/:id', auth_1.authMiddleware, auth_1.adminMiddleware, hotelController_1.HotelController.updateHotel);
router.delete('/:id', auth_1.authMiddleware, auth_1.adminMiddleware, hotelController_1.HotelController.deleteHotel);
router.patch('/:id/visibility', auth_1.authMiddleware, auth_1.adminMiddleware, hotelController_1.HotelController.toggleVisibility);
router.patch('/:id/featured', auth_1.authMiddleware, auth_1.adminMiddleware, hotelController_1.HotelController.toggleFeatured);
// Room Routes (Nested)
router.post('/:hotelId/rooms', auth_1.authMiddleware, auth_1.adminMiddleware, roomController_1.RoomController.createRoom);
exports.default = router;
