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
exports.RoomController = void 0;
const roomService_1 = require("../services/roomService");
const roomService = new roomService_1.RoomService();
class RoomController {
    // POST /api/hotels/:hotelId/rooms
    static createRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { hotelId } = req.params;
                const room = yield roomService.createRoom(hotelId, req.body);
                res.status(201).json(room);
            }
            catch (error) {
                console.error('[RoomController] Error creating room:', error);
                res.status(500).json({ error: 'Failed to create room', details: error.message });
            }
        });
    }
    // PUT /api/rooms/:id
    static updateRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const room = yield roomService.updateRoom(id, req.body);
                res.json(room);
            }
            catch (error) {
                console.error('[RoomController] Error updating room:', error);
                res.status(500).json({ error: 'Failed to update room', details: error.message });
            }
        });
    }
    // DELETE /api/rooms/:id
    static deleteRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield roomService.deleteRoom(id);
                res.json({ message: 'Room deleted successfully' });
            }
            catch (error) {
                console.error('[RoomController] Error deleting room:', error);
                res.status(500).json({ error: 'Failed to delete room', details: error.message });
            }
        });
    }
}
exports.RoomController = RoomController;
