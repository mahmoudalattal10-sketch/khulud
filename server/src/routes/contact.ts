
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// POST: Submit a new contact message
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        const newMessage = await prisma.contactMessage.create({
            data: {
                name,
                email,
                phone,
                message,
                isRead: false
            }
        });

        // Optional: Create a notification for Admins
        await prisma.notification.create({
            data: {
                type: 'NEW_MESSAGE',
                title: 'رسالة جديدة',
                message: `رسالة جديدة من ${name}`,
                data: JSON.stringify({ messageId: newMessage.id }),
                isRead: false
            }
        });

        res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        console.error('Error submitting message:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// GET: Fetch all messages (Admin only)
router.get('/', async (req, res) => {
    try {
        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// PATCH: Mark as read
router.patch('/:id/read', async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await prisma.contactMessage.update({
            where: { id },
            data: { isRead: true }
        });
        res.json({ success: true, data: updated });
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

export default router;
