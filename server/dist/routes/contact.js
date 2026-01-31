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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// POST: Submit a new contact message
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        const newMessage = yield prisma.contactMessage.create({
            data: {
                name,
                email,
                phone,
                message,
                isRead: false
            }
        });
        // Optional: Create a notification for Admins
        yield prisma.notification.create({
            data: {
                type: 'NEW_MESSAGE',
                title: 'رسالة جديدة',
                message: `رسالة جديدة من ${name}`,
                data: JSON.stringify({ messageId: newMessage.id }),
                isRead: false
            }
        });
        res.status(201).json({ success: true, data: newMessage });
    }
    catch (error) {
        console.error('Error submitting message:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}));
// GET: Fetch all messages (Admin only)
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: messages });
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}));
// PATCH: Mark as read
router.patch('/:id/read', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updated = yield prisma.contactMessage.update({
            where: { id },
            data: { isRead: true }
        });
        res.json({ success: true, data: updated });
    }
    catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}));
exports.default = router;
