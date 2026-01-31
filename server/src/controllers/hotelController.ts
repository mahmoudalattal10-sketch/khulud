
import { Request, Response } from 'express';
import { HotelService } from '../services/hotelService';
import { HotelFilterOptions } from '../types';

const hotelService = new HotelService();

export class HotelController {

    // GET /api/hotels
    static async getHotels(req: Request, res: Response) {
        try {
            const filters: HotelFilterOptions = {
                city: req.query.city as string,
                checkIn: req.query.checkIn as string,
                checkOut: req.query.checkOut as string,
                guests: Number(req.query.guests) || 1,
                adminView: req.query.adminView === 'true'
            };

            const hotels = await hotelService.searchHotels(filters);
            res.json(hotels);
        } catch (error: any) {
            console.error('[HotelController] Error fetching hotels:', error);
            res.status(500).json({ error: 'Failed to fetch hotels', details: error.message });
        }
    }

    // GET /api/hotels/:slug
    static async getHotelBySlug(req: Request, res: Response) {
        try {
            const { slug } = req.params;
            const options = {
                checkIn: req.query.checkIn as string,
                checkOut: req.query.checkOut as string,
                guests: Number(req.query.guests) || 1
            };
            const hotel = await hotelService.getHotelBySlug(slug, options);

            if (!hotel) {
                return res.status(404).json({ error: 'Hotel not found' });
            }

            res.json(hotel);
        } catch (error) {
            console.error('[HotelController] Error fetching hotel details:', error);
            res.status(500).json({ error: 'Failed to fetch hotel details' });
        }
    }

    // GET /api/hotels/id/:id
    static async getHotelById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const options = {
                checkIn: req.query.checkIn as string,
                checkOut: req.query.checkOut as string,
                guests: Number(req.query.guests) || 1
            };
            const hotel = await hotelService.getHotelById(id, options);

            if (!hotel) {
                return res.status(404).json({ error: 'Hotel not found' });
            }

            res.json(hotel);
        } catch (error) {
            console.error('[HotelController] Error fetching hotel by ID:', error);
            res.status(500).json({ error: 'Failed to fetch hotel details' });
        }
    }
    // POST /api/hotels
    static async createHotel(req: Request, res: Response) {
        try {
            const hotel = await hotelService.createHotel(req.body);
            res.status(201).json(hotel);
        } catch (error: any) {
            console.error('[HotelController] Error creating hotel:', error);
            res.status(500).json({ error: 'Failed to create hotel', details: error.message });
        }
    }

    // PUT /api/hotels/:id
    static async updateHotel(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const hotel = await hotelService.updateHotel(id, req.body);
            res.json(hotel);
        } catch (error: any) {
            console.error('[HotelController] Error updating hotel:', error);
            res.status(500).json({ error: 'Failed to update hotel', details: error.message });
        }
    }

    // DELETE /api/hotels/:id
    static async deleteHotel(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await hotelService.deleteHotel(id);
            res.json({ message: 'Hotel deleted successfully' });
        } catch (error: any) {
            console.error('[HotelController] Error deleting hotel:', error);
            res.status(500).json({ error: 'Failed to delete hotel', details: error.message });
        }
    }

    // PATCH /api/hotels/:id/visibility
    static async toggleVisibility(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await hotelService.toggleVisibility(id);
            res.json(result);
        } catch (error: any) {
            console.error('[HotelController] Error toggling visibility:', error);
            res.status(500).json({ error: 'Failed to toggle visibility', details: error.message });
        }
    }

    // PATCH /api/hotels/:id/featured
    static async toggleFeatured(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await hotelService.toggleFeatured(id);
            res.json(result);
        } catch (error: any) {
            console.error('[HotelController] Error toggling featured:', error);
            res.status(500).json({ error: 'Failed to toggle featured', details: error.message });
        }
    }
}
