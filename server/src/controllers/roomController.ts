import { Request, Response } from 'express';
import { RoomService } from '../services/roomService';

const roomService = new RoomService();

export class RoomController {
    // POST /api/hotels/:hotelId/rooms
    static async createRoom(req: Request, res: Response) {
        try {
            const { hotelId } = req.params;
            const room = await roomService.createRoom(hotelId, req.body);
            res.status(201).json(room);
        } catch (error: any) {
            console.error('[RoomController] Error creating room:', error);
            res.status(500).json({ error: 'Failed to create room', details: error.message });
        }
    }

    // PUT /api/rooms/:id
    static async updateRoom(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const room = await roomService.updateRoom(id, req.body);
            res.json(room);
        } catch (error: any) {
            console.error('[RoomController] Error updating room:', error);
            res.status(500).json({ error: 'Failed to update room', details: error.message });
        }
    }

    // DELETE /api/rooms/:id
    static async deleteRoom(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await roomService.deleteRoom(id);
            res.json({ message: 'Room deleted successfully' });
        } catch (error: any) {
            console.error('[RoomController] Error deleting room:', error);
            res.status(500).json({ error: 'Failed to delete room', details: error.message });
        }
    }
}
