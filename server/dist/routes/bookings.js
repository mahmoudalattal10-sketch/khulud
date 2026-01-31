"use strict";
/**
 * =========================================================
 * 📅 BOOKINGS ROUTES - Core Business Logic
 * =========================================================
 * Handles booking creation, availability checks, and management.
 * Integrated with Auth system and Prisma ORM.
 * =========================================================
 */
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
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("./auth");
const email_1 = require("../services/email");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// ============================================
// 📝 CREATE BOOKING (User)
// ============================================
router.post('/', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId, checkIn, checkOut, guestsCount, specialRequests, extraBedCount } = req.body;
        const userId = req.user.userId;
        // 1. Validate Input
        if (!roomId || !checkIn || !checkOut || !guestsCount) {
            const missing = [];
            if (!roomId)
                missing.push('roomId');
            if (!checkIn)
                missing.push('checkIn');
            if (!checkOut)
                missing.push('checkOut');
            if (!guestsCount)
                missing.push('guestsCount');
            return res.status(400).json({ error: `Missing required booking details: ${missing.join(', ')}` });
        }
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (checkInDate < today) {
            return res.status(400).json({ error: 'Check-in date cannot be in the past' });
        }
        if (checkOutDate <= checkInDate) {
            return res.status(400).json({ error: 'Check-out date must be after check-in' });
        }
        // 2. Fetch Room & Check Availability
        const room = yield prisma.room.findUnique({
            where: { id: roomId },
            include: { hotel: true }
        });
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        // Check capacity
        if (guestsCount > room.capacity) {
            return res.status(400).json({ error: `Room capacity exceeded. Max: ${room.capacity}` });
        }
        // Sum up the roomCount of conflicting bookings
        const conflictingBookings = yield prisma.booking.findMany({
            where: {
                roomId: roomId,
                status: { in: ['CONFIRMED', 'PENDING'] },
                AND: [
                    { checkIn: { lt: checkOutDate } },
                    { checkOut: { gt: checkInDate } }
                ]
            }
        });
        // Smart stock calculation: 
        // 1. Ignore PENDING bookings older than 15 minutes (stale)
        // 2. Ignore PENDING bookings from the SAME user (likely a retry)
        const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
        const bookedRooms = conflictingBookings.reduce((sum, b) => {
            if (b.status === 'PENDING') {
                const isStale = new Date(b.createdAt) < fifteenMinsAgo;
                const isSameUser = b.userId === userId;
                if (isStale || isSameUser)
                    return sum;
            }
            return sum + (b.roomCount || 1);
        }, 0);
        const requestedRooms = Number(req.body.roomCount) || 1;
        if (bookedRooms + requestedRooms > room.availableStock) {
            return res.status(400).json({ error: 'No rooms available for these dates' });
        }
        // 3. Calculate Price
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
        let roomBasePrice = room.price;
        // In a real app, we'd check pricing periods here too
        const subtotal = (roomBasePrice * requestedRooms + ((room.extraBedPrice || 0) * Number(extraBedCount || 0))) * nights;
        let totalPrice = subtotal;
        let discountAmount = 0;
        // 🎫 Coupon Logic
        let couponId;
        const promoCode = req.body.promoCode;
        if (promoCode) {
            const coupon = yield prisma.coupon.findUnique({
                where: { code: promoCode.toUpperCase() }
            });
            if (coupon && coupon.isActive && coupon.usedCount < coupon.limit) {
                discountAmount = (totalPrice * coupon.discount) / 100;
                totalPrice -= discountAmount;
                couponId = coupon.id;
                // Note: usedCount will be incremented upon successful PAYMENT for maximum integrity
            }
        }
        // 4. Create Booking
        const bookingData = {
            userId,
            roomId,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            subtotal,
            totalPrice,
            discountAmount,
            guestsCount,
            roomCount: requestedRooms,
            extraBedCount: Number(extraBedCount) || 0,
            guestName: req.body.guestName,
            guestEmail: req.body.guestEmail,
            guestPhone: req.body.guestPhone,
            specialRequests,
            status: 'PENDING',
            paymentStatus: 'UNPAID',
            couponId: couponId // Link coupon
        };
        const booking = yield prisma.booking.create({
            data: bookingData,
            include: {
                room: {
                    include: { hotel: true }
                },
                user: true,
                coupon: true // Include coupon details in response
            }
        });
        // 🔔 Create Admin Notification
        const bookingAny = booking;
        yield prisma.notification.create({
            data: {
                type: 'NEW_BOOKING',
                title: 'حجز قيد الانتظار (Waitlist)',
                message: `محاولة حجز جديدة من ${req.body.guestName || bookingAny.user.name} في ${bookingAny.room.hotel.name}. (رقم الهاتف: ${bookingAny.user.phone || 'غير مسجل'})`,
                data: JSON.stringify({ bookingId: booking.id, hotelId: bookingAny.room.hotelId }),
                isRead: false
            }
        });
        // 📧 Send Confirmation Email
        email_1.EmailService.sendBookingConfirmation(booking, bookingAny.user).catch(console.error);
        res.status(201).json({
            message: 'Booking created successfully',
            booking
        });
    }
    catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
}));
// ============================================
// 👤 GET MY BOOKINGS (User)
// ============================================
router.get('/me', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookings = yield prisma.booking.findMany({
            where: { userId: req.user.userId },
            include: {
                room: {
                    include: {
                        hotel: {
                            select: {
                                id: true,
                                slug: true,
                                name: true,
                                image: true,
                                city: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(bookings);
    }
    catch (error) {
        console.error('Fetch my bookings error:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
}));
// ============================================
// 👑 GET ALL BOOKINGS (Admin)
// ============================================
router.get('/', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookings = yield prisma.booking.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                },
                room: {
                    include: {
                        hotel: {
                            select: { name: true }
                        }
                    }
                },
                coupon: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(bookings);
    }
    catch (error) {
        console.error('Admin bookings fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
}));
// ============================================
// 🔄 UPDATE STATUS (Admin)
// ============================================
router.patch('/:id/status', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const { id } = req.params;
        if (!['CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const booking = yield prisma.booking.update({
            where: { id },
            data: { status }
        });
        res.json(booking);
    }
    catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ error: 'Failed to update booking status' });
    }
}));
// ============================================
// ❌ CANCEL BOOKING (User/Admin)
// ============================================
router.post('/:id/cancel', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const isAdmin = req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN';
        // Find booking
        const booking = yield prisma.booking.findUnique({
            where: { id }
        });
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        // Check ownership
        if (booking.userId !== userId && !isAdmin) {
            return res.status(403).json({ error: 'Not authorized to cancel this booking' });
        }
        // Check if already cancelled or completed
        if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
            return res.status(400).json({ error: 'Cannot cancel a completed or already cancelled booking' });
        }
        const updatedBooking = yield prisma.booking.update({
            where: { id },
            data: { status: 'CANCELLED' },
            include: { user: true }
        });
        // 📧 Send Cancellation Email
        if (updatedBooking.user) {
            email_1.EmailService.sendCancellation(updatedBooking, updatedBooking.user).catch(console.error);
        }
        res.json({ message: 'Booking cancelled successfully', booking: updatedBooking });
    }
    catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
}));
exports.default = router;
