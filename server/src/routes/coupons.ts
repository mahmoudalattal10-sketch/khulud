
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, adminMiddleware } from './auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/coupons - List all coupons (Admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                bookings: {
                    select: {
                        id: true,
                        createdAt: true,
                        room: {
                            select: {
                                name: true,
                                hotel: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        res.json({ success: true, coupons });
    } catch (error) {
        console.error('Fetch coupons error:', error);
        res.status(500).json({ error: 'Failed to fetch coupons' });
    }
});

// POST /api/coupons - Create a new coupon (Admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { code, discount, limit } = req.body;

        if (!code || !discount || !limit) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newCoupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                discount: Number(discount),
                limit: Number(limit)
            }
        });

        res.status(201).json({ success: true, coupon: newCoupon });
    } catch (error) {
        console.error('Create coupon error:', error);
        res.status(500).json({ error: 'Failed to create coupon' });
    }
});

// PUT /api/coupons/:id - Update an existing coupon (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { code, discount, limit, isActive } = req.body;

        const updateData: any = {};
        if (code) updateData.code = code.toUpperCase();
        if (discount !== undefined) updateData.discount = Number(discount);
        if (limit !== undefined) updateData.limit = Number(limit);
        if (isActive !== undefined) updateData.isActive = Boolean(isActive);

        const updatedCoupon = await prisma.coupon.update({
            where: { id },
            data: updateData
        });

        res.json({ success: true, coupon: updatedCoupon });
    } catch (error) {
        console.error('Update coupon error:', error);
        res.status(500).json({ error: 'Failed to update coupon' });
    }
});

// DELETE /api/coupons/:id - Delete (or deactivate) a coupon (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.coupon.delete({ where: { id } });
        res.json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error) {
        console.error('Delete coupon error:', error);
        res.status(500).json({ error: 'Failed to delete coupon' });
    }
});

// POST /api/coupons/verify - Verify a coupon code (Public/User)
router.post('/verify', async (req, res) => {
    try {

        console.log('Verifying coupon raw:', req.body.code); // DEBUG
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ error: 'Coupon code is required' });
        }

        const cleanCode = code.trim().toUpperCase();
        console.log('Verifying coupon clean:', cleanCode); // DEBUG

        const coupon = await prisma.coupon.findUnique({
            where: { code: cleanCode }
        });

        if (!coupon) {
            return res.status(404).json({ valid: false, error: 'كود الخصم غير صحيح' });
        }

        if (!coupon.isActive) {
            return res.status(400).json({ valid: false, error: 'هذا الكوبون غير فعال حالياً' });
        }

        if (coupon.usedCount >= coupon.limit) {
            return res.status(400).json({ valid: false, error: 'تم تجاوز الحد الأقصى لاستخدام هذا الكوبون' });
        }

        res.json({
            valid: true,
            discount: coupon.discount,
            code: coupon.code,
            message: `تم تطبيق خصم ${coupon.discount}% بنجاح`
        });

    } catch (error) {
        console.error('Verify coupon error:', error);
        res.status(500).json({ error: 'Failed to verify coupon' });
    }
});

export default router;
