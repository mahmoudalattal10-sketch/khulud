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
const auth_1 = require("./auth");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// GET /api/coupons - List all coupons (Admin only)
router.get('/', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coupons = yield prisma.coupon.findMany({
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
    }
    catch (error) {
        console.error('Fetch coupons error:', error);
        res.status(500).json({ error: 'Failed to fetch coupons' });
    }
}));
// POST /api/coupons - Create a new coupon (Admin only)
router.post('/', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, discount, limit } = req.body;
        if (!code || !discount || !limit) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const newCoupon = yield prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                discount: Number(discount),
                limit: Number(limit)
            }
        });
        res.status(201).json({ success: true, coupon: newCoupon });
    }
    catch (error) {
        console.error('Create coupon error:', error);
        res.status(500).json({ error: 'Failed to create coupon' });
    }
}));
// PUT /api/coupons/:id - Update an existing coupon (Admin only)
router.put('/:id', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { code, discount, limit, isActive } = req.body;
        const updateData = {};
        if (code)
            updateData.code = code.toUpperCase();
        if (discount !== undefined)
            updateData.discount = Number(discount);
        if (limit !== undefined)
            updateData.limit = Number(limit);
        if (isActive !== undefined)
            updateData.isActive = Boolean(isActive);
        const updatedCoupon = yield prisma.coupon.update({
            where: { id },
            data: updateData
        });
        res.json({ success: true, coupon: updatedCoupon });
    }
    catch (error) {
        console.error('Update coupon error:', error);
        res.status(500).json({ error: 'Failed to update coupon' });
    }
}));
// DELETE /api/coupons/:id - Delete (or deactivate) a coupon (Admin only)
router.delete('/:id', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.coupon.delete({ where: { id } });
        res.json({ success: true, message: 'Coupon deleted successfully' });
    }
    catch (error) {
        console.error('Delete coupon error:', error);
        res.status(500).json({ error: 'Failed to delete coupon' });
    }
}));
// POST /api/coupons/verify - Verify a coupon code (Public/User)
router.post('/verify', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Verifying coupon raw:', req.body.code); // DEBUG
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ error: 'Coupon code is required' });
        }
        const cleanCode = code.trim().toUpperCase();
        console.log('Verifying coupon clean:', cleanCode); // DEBUG
        const coupon = yield prisma.coupon.findUnique({
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
    }
    catch (error) {
        console.error('Verify coupon error:', error);
        res.status(500).json({ error: 'Failed to verify coupon' });
    }
}));
exports.default = router;
