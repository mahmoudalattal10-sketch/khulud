/**
 * =========================================================
 * 📊 ADMIN ROUTES - Analytics & Statistics
 * =========================================================
 * Aggregated data for the Admin Dashboard.
 * Includes profit calculation logic (50 SAR per night).
 * =========================================================
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, adminMiddleware } from './auth';

const router = Router();
const prisma = new PrismaClient();

// Types for auth middleware
interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: string;
    };
}

// ============================================
// 📈 GET DASHBOARD STATS
// ============================================

router.get('/stats', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        // Fetch all bookings to calculate aggregates
        // In a large scale app, this should be an aggregate query or cached job
        const bookings = await prisma.booking.findMany({
            where: {
                status: { in: ['CONFIRMED', 'COMPLETED', 'PENDING'] }
            },
            select: {
                id: true,
                subtotal: true,
                totalPrice: true,
                discountAmount: true,
                checkIn: true,
                checkOut: true,
                status: true,
                paymentStatus: true,
                createdAt: true,
                guestsCount: true
            }
        });

        // 1. Confirmed Bookings Only (Paid)
        const confirmedBookings = bookings.filter(b => b.paymentStatus === 'PAID');

        // 2. Total Sales (From Confirmed/Paid Bookings Only)
        const totalSales = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

        // 3. Active Bookings
        const activeBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length;

        // 4. Total Bookings
        const totalBookingsCount = bookings.length;

        // 5. Calculate Net Profit (15% Margin on Subtotal MINUS Discounts)
        // This ensures the hotel gets their full share (85% of subtotal)
        // and the platform bears the cost of the coupon discount.
        const PROFIT_MARGIN = 0.15; // 15% commission
        const totalSubtotal = confirmedBookings.reduce((sum, b) => sum + (b.subtotal || b.totalPrice), 0);
        const totalDiscounts = confirmedBookings.reduce((sum, b) => sum + (b.discountAmount || 0), 0);

        const totalProfit = Math.round((totalSubtotal * PROFIT_MARGIN) - totalDiscounts);

        // 6. Average Booking Value
        const avgBookingValue = confirmedBookings.length > 0
            ? Math.round(totalSales / confirmedBookings.length)
            : 0;

        // 5. New Visitors (Unique Users) - Optional, simplified for now
        // For real count: await prisma.user.count({ where: { role: 'USER' } });
        const usersCount = await prisma.user.count({
            where: { role: 'USER' }
        });

        // 6. Completion Rate (Completed / Total)
        const completedCount = bookings.filter(b => b.status === 'COMPLETED').length;
        const completionRate = totalBookingsCount > 0
            ? Math.round((completedCount / totalBookingsCount) * 100)
            : 0;

        // 7. Monthly Stats (For AreaChart)
        const currentYear = new Date().getFullYear();
        const startOfYear = new Date(currentYear, 0, 1);
        const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

        const yearBookings = await prisma.booking.findMany({
            where: {
                createdAt: {
                    gte: startOfYear,
                    lte: endOfYear
                },
                status: { not: 'CANCELLED' }
            },
            select: { createdAt: true, totalPrice: true }
        });

        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        const monthlyStats = months.map((name, index) => {
            const monthBookings = yearBookings.filter(b => new Date(b.createdAt).getMonth() === index);
            return {
                name,
                value: monthBookings.reduce((sum, b) => sum + b.totalPrice, 0),
                users: monthBookings.length
            };
        });

        // 8. Destinations Breakdown
        // We need to join relations to get the city from the hotel
        const bookingsWithCity = await prisma.booking.findMany({
            where: { status: { not: 'CANCELLED' } },
            select: {
                room: {
                    select: {
                        hotel: { select: { city: true } }
                    }
                }
            }
        });

        const makkahCount = bookingsWithCity.filter(b => b.room?.hotel?.city === 'makkah').length;
        const madinahCount = bookingsWithCity.filter(b => b.room?.hotel?.city === 'madinah').length;
        const totalCityBookings = (makkahCount + madinahCount) || 1;

        const destinations = [
            {
                name: 'مكة المكرمة',
                percentage: Math.round((makkahCount / totalCityBookings) * 100),
                color: 'bg-emerald-600',
                icon: '🕋'
            },
            {
                name: 'المدينة المنورة',
                percentage: Math.round((madinahCount / totalCityBookings) * 100),
                color: 'bg-emerald-400',
                icon: '🕌'
            }
        ];

        res.json({
            sales: totalSales,
            activeBookings: activeBookings,
            profit: totalProfit,
            visitors: usersCount,
            completionRate: completionRate,
            totalBookings: totalBookingsCount,
            confirmedCount: confirmedBookings.length,
            avgBookingValue: avgBookingValue,
            monthlyStats: monthlyStats || [],
            destinations: destinations || []
        });

    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
});
// ============================================
// 📊 GET ANALYTICS CHARTS DATA
// ============================================

router.get('/analytics', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        // 1. Weekly Growth (Last 7 Days)
        const weeklyData = [];
        const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dayName = days[date.getDay()];

            // Start of day
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            // End of day
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const dayBookings = await prisma.booking.findMany({
                where: {
                    createdAt: {
                        gte: startOfDay,
                        lte: endOfDay
                    },
                    status: { not: 'CANCELLED' }
                }
            });

            weeklyData.push({
                name: dayName,
                visitors: dayBookings.length, // Using bookings count as visitors proxy
                revenue: dayBookings.reduce((sum, b) => sum + b.totalPrice, 0)
            });
        }

        // 2. Hotel Performance (Occupancy)
        const hotels = await prisma.hotel.findMany({
            include: { rooms: true }
        });

        const activeBookingsAll = await prisma.booking.findMany({
            where: { status: { in: ['CONFIRMED', 'PENDING'] } },
            select: { roomId: true }
        });

        const hotelPerformance = hotels.map(hotel => {
            // Simplistic Occupancy: (Active Bookings for this hotel / Total Hotel Rooms Stock) * 100
            // Note: In real world, this is date-specific.

            const totalStock = hotel.rooms.reduce((sum, r) => sum + r.availableStock, 0);
            const hotelRoomIds = hotel.rooms.map(r => r.id);
            const activeCount = activeBookingsAll.filter(b => hotelRoomIds.includes(b.roomId)).length;

            const occupancy = totalStock > 0 ? Math.round((activeCount / totalStock) * 100) : 0;

            // Assign color based on occupancy
            let color = 'bg-emerald-500';
            if (occupancy < 30) color = 'bg-slate-400';
            else if (occupancy < 60) color = 'bg-blue-500';
            else if (occupancy < 80) color = 'bg-amber-500';
            else color = 'bg-emerald-500'; // High occupancy

            return {
                name: hotel.name,
                val: `${occupancy}%`,
                rawVal: occupancy,
                color
            };
        }).sort((a, b) => b.rawVal - a.rawVal).slice(0, 5); // Top 5

        // 3. Visitor Sources (By Phone Number)
        const users = await prisma.user.findMany({
            where: { role: 'USER' },
            select: { phone: true }
        });

        let ksaCount = 0;
        let gulfCount = 0;
        let intlCount = 0;

        users.forEach(u => {
            const p = u.phone?.replace(/\D/g, '') || ''; // Remove non-digits
            if (p.startsWith('966') || p.startsWith('05')) {
                ksaCount++;
            } else if (
                p.startsWith('971') || // UAE
                p.startsWith('973') || // Bahrain
                p.startsWith('968') || // Oman
                p.startsWith('965') || // Kuwait
                p.startsWith('974')    // Qatar
            ) {
                gulfCount++;
            } else {
                intlCount++; // Includes unknown/null
            }
        });

        const totalUsers = users.length || 1; // Avoid div by zero
        const ksaPct = Math.round((ksaCount / totalUsers) * 100);
        const gulfPct = Math.round((gulfCount / totalUsers) * 100);
        const intlPct = Math.round((intlCount / totalUsers) * 100);

        // Determine top source for summarized display
        let topSource = { name: 'الإحصائيات غير كافية', pct: 0 };
        if (ksaPct >= gulfPct && ksaPct >= intlPct) topSource = { name: 'المملكة العربية السعودية', pct: ksaPct };
        else if (gulfPct >= ksaPct && gulfPct >= intlPct) topSource = { name: 'دول الخليج', pct: gulfPct };
        else topSource = { name: 'الزوار الدوليين', pct: intlPct };

        res.json({
            weekly: weeklyData,
            hotels: hotelPerformance,
            visitorSources: {
                ksa: ksaPct,
                gulf: gulfPct,
                intl: intlPct,
                top: topSource
            }
        });

    } catch (error) {
        console.error('Analytics stats error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics stats' });
    }
});

// ============================================
// 🔔 NOTIFICATIONS ROUTES
// ============================================

router.get('/notifications', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const notifications = await prisma.notification.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50
        });
        res.json({ notifications });
    } catch (error) {
        console.error('Fetch notifications error:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

router.put('/notifications/:id/read', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Mark notification read error:', error);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
});

// ============================================
// 🔐 UPDATE ADMIN CREDENTIALS
// ============================================

router.post('/update-credentials', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { currentPassword, newEmail, newPassword } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'غير مصرح' });
        }

        if (!currentPassword) {
            return res.status(400).json({ success: false, error: 'كلمة المرور الحالية مطلوبة' });
        }

        // Get current user
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ success: false, error: 'المستخدم غير موجود' });
        }

        // Verify current password
        const bcrypt = require('bcryptjs');
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, error: 'كلمة المرور الحالية غير صحيحة' });
        }

        // Prepare update data
        const updateData: any = {};

        if (newEmail && newEmail !== user.email) {
            // Check if email already exists
            const existingUser = await prisma.user.findUnique({ where: { email: newEmail } });
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({ success: false, error: 'البريد الإلكتروني مستخدم بالفعل' });
            }
            updateData.email = newEmail;
        }

        if (newPassword) {
            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, error: 'لم يتم تقديم أي تغييرات' });
        }

        // Update user
        await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        res.json({ success: true, message: 'تم تحديث البيانات بنجاح' });

    } catch (error) {
        console.error('Update credentials error:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء تحديث البيانات' });
    }
});

export default router;
