"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelController = void 0;
const hotelService_1 = require("../services/hotelService");
const hotelService = new hotelService_1.HotelService();
class HotelController {
    // GET /api/hotels
    static getHotels(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = {
                    city: req.query.city,
                    checkIn: req.query.checkIn,
                    checkOut: req.query.checkOut,
                    guests: Number(req.query.guests) || 1,
                    adminView: req.query.adminView === 'true'
                };
                const hotels = yield hotelService.searchHotels(filters);
                res.json(hotels);
            }
            catch (error) {
                console.error('[HotelController] Error fetching hotels:', error);
                res.status(500).json({ error: 'Failed to fetch hotels', details: error.message });
            }
        });
    }
    // GET /api/hotels/:slug
    static getHotelBySlug(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { slug } = req.params;
                const options = {
                    checkIn: req.query.checkIn,
                    checkOut: req.query.checkOut,
                    guests: Number(req.query.guests) || 1
                };
                const hotel = yield hotelService.getHotelBySlug(slug, options);
                if (!hotel) {
                    return res.status(404).json({ error: 'Hotel not found' });
                }
                res.json(hotel);
            }
            catch (error) {
                console.error('[HotelController] Error fetching hotel details:', error);
                res.status(500).json({ error: 'Failed to fetch hotel details' });
            }
        });
    }
    // GET /api/hotels/id/:id
    static getHotelById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const options = {
                    checkIn: req.query.checkIn,
                    checkOut: req.query.checkOut,
                    guests: Number(req.query.guests) || 1
                };
                const hotel = yield hotelService.getHotelById(id, options);
                if (!hotel) {
                    return res.status(404).json({ error: 'Hotel not found' });
                }
                res.json(hotel);
            }
            catch (error) {
                console.error('[HotelController] Error fetching hotel by ID:', error);
                res.status(500).json({ error: 'Failed to fetch hotel details' });
            }
        });
    }
    // POST /api/hotels
    static createHotel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hotel = yield hotelService.createHotel(req.body);
                res.status(201).json(hotel);
            }
            catch (error) {
                console.error('[HotelController] Error creating hotel:', error);
                res.status(500).json({ error: 'Failed to create hotel', details: error.message });
            }
        });
    }
    // PUT /api/hotels/:id
    static updateHotel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const hotel = yield hotelService.updateHotel(id, req.body);
                res.json(hotel);
            }
            catch (error) {
                console.error('[HotelController] Error updating hotel:', error);
                res.status(500).json({ error: 'Failed to update hotel', details: error.message });
            }
        });
    }
    // DELETE /api/hotels/:id
    static deleteHotel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield hotelService.deleteHotel(id);
                res.json({ message: 'Hotel deleted successfully' });
            }
            catch (error) {
                console.error('[HotelController] Error deleting hotel:', error);
                res.status(500).json({ error: 'Failed to delete hotel', details: error.message });
            }
        });
    }
    // PATCH /api/hotels/:id/visibility
    static toggleVisibility(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield hotelService.toggleVisibility(id);
                res.json(result);
            }
            catch (error) {
                console.error('[HotelController] Error toggling visibility:', error);
                res.status(500).json({ error: 'Failed to toggle visibility', details: error.message });
            }
        });
    }
    // PATCH /api/hotels/:id/featured
    static toggleFeatured(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield hotelService.toggleFeatured(id);
                res.json(result);
            }
            catch (error) {
                console.error('[HotelController] Error toggling featured:', error);
                res.status(500).json({ error: 'Failed to toggle featured', details: error.message });
            }
        });
    }
}
exports.HotelController = HotelController;
