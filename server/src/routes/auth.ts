/**
 * =========================================================
 * 🔐 AUTH ROUTES - JWT Authentication System
 * =========================================================
 * Handles user registration, login, and profile management.
 */

import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { EmailService } from '../services/email';

const router = express.Router();
const prisma = new PrismaClient();

// ============================================
// ⚙️ CONFIGURATION
// ============================================

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
if (!JWT_SECRET) {
    console.error('❌ CRITICAL ERROR: JWT_SECRET is not defined in environment variables');
}
const JWT_EXPIRES_IN = '7d';

// ============================================
// 🔧 TYPES
// ============================================

interface JWTPayload {
    userId: string;
    email: string;
    role: string;
}

interface AuthRequest extends Request {
    user?: JWTPayload;
}

// ============================================
// 🛡️ SECURITY MIDDLEWARES
// ============================================

// 🛑 Rate Limiting for Auth
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Max 10 attempts
    message: { error: 'Too many login attempts, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Max 5 accounts per hour
    message: { error: 'Too many accounts created, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

// ============================================
// 📜 VALIDATION SCHEMAS
// ============================================

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
    name: z.string().min(2, 'Name is too short'),
    phone: z.string().optional(),
    country: z.string().optional(),
});

// ============================================
// 🛡️ AUTH MIDDLEWARE
// ============================================

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const cookieToken = req.cookies?.token;
        const token = cookieToken || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN')) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// ============================================
// 📝 REGISTER
// ============================================

router.post('/register', registerLimiter, async (req: Request, res: Response) => {
    try {
        // 1. Zod Validation
        const validation = registerSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                error: validation.error.issues[0].message,
            });
        }

        const { email, password, name, phone, country } = req.body;
        
        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone: phone || null,
                country: country || null,
                role: 'USER'
            }
        });

        // 🔔 Create Admin Notification
        try {
            await prisma.notification.create({
                data: {
                    type: 'NEW_USER',
                    title: 'تسجيل مستخدم جديد',
                    message: `تم تسجيل مستخدم جديد باسم ${user.name} وبريد إلكتروني ${user.email}`,
                    data: JSON.stringify({
                        userId: user.id,
                        name: user.name,
                        email: user.email
                    })
                }
            });
        } catch (e) {
            console.error('Failed to create notification', e);
        }

        // 5. Generate Token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // 6. Set Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            message: 'Registration successful',
            token, // Keep sending for compatibility for now
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// 🔑 LOGIN
// ============================================

router.post('/login', loginLimiter, async (req: Request, res: Response) => {
    try {
        // 1. Zod Validation
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.issues[0].message });
        }

        const { email, password } = req.body;

        // 2. Find User
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // 3. Compare Passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // 4. Generate Token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // 5. Set Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            message: 'Login successful',
            token, // Keep sending for compatibility
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// ============================================
// 🌐 SOCIAL AUTH HELPER & ROUTES
// ============================================

// Helper to handle user find/create for social login
const handleSocialLogin = async (
    res: Response,
    email: string,
    name: string,
    provider: 'GOOGLE' | 'FACEBOOK'
) => {
    try {
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Random password for social users
            const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    password: randomPassword,
                    role: 'USER'
                }
            });
        }

        // Generate Token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            message: `Login via ${provider} successful`,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error(`Social login error (${provider}):`, error);
        return res.status(500).json({ error: 'Social authentication failed' });
    }
};

// --- GOOGLE AUTH ---
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ error: 'Token required' });

        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(400).json({ error: 'Invalid Google credential' });
        }

        await handleSocialLogin(
            res,
            payload.email,
            payload.name || payload.email.split('@')[0],
            'GOOGLE'
        );

    } catch (error) {
        console.error('Google auth error:', error);
        res.status(401).json({ error: 'Invalid Google Token' });
    }
});

// --- FACEBOOK AUTH ---
router.post('/facebook', async (req: Request, res: Response) => {
    try {
        const { accessToken } = req.body;
        if (!accessToken) return res.status(400).json({ error: 'AccessToken required' });

        // Verify Facebook Token via Graph API
        const { data } = await axios.get(
            `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
        );

        if (!data.email) {
            return res.status(400).json({ error: 'Facebook account must have an email' });
        }

        await handleSocialLogin(res, data.email, data.name, 'FACEBOOK');

    } catch (error) {
        console.error('Facebook auth error:', error);
        res.status(401).json({ error: 'Invalid Facebook Token' });
    }
});

// ============================================
// 👤 GET PROFILE (Protected)
// ============================================

router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.userId },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                country: true,
                role: true,
                createdAt: true,
                bookings: {
                    include: {
                        room: {
                            include: {
                                hotel: {
                                    select: {
                                        id: true,
                                        name: true,
                                        image: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
});

// ============================================
// ✏️ UPDATE PROFILE (Protected)
// ============================================

router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { name, phone, currentPassword, newPassword } = req.body;

        const updateData: any = {};
        if (name) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;

        if (currentPassword && newPassword) {
            const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
            if (!user) return res.status(404).json({ error: 'User not found' });

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ error: 'Incorrect password' });

            updateData.password = await bcrypt.hash(newPassword, 12);
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.user!.userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                country: true,
                role: true
            }
        });

        res.json({ message: 'Profile updated', user: updatedUser });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// ============================================
// 🔍 VERIFY TOKEN
// ============================================

router.get('/verify', authMiddleware, async (req: AuthRequest, res: Response) => {
    res.json({
        valid: true,
        user: req.user
    });
});

// ============================================
// 🚪 LOGOUT
// ============================================

router.post('/logout', (req: Request, res: Response) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

// ============================================
// 👑 ADMIN: GET ALL USERS (Admin Only)
// ============================================

router.get('/users', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                country: true,
                role: true,
                createdAt: true,
                bookings: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                    select: { checkIn: true }
                },
                _count: {
                    select: { bookings: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ users });
    } catch (error) {
        console.error('Users list error:', error);
        res.status(500).json({ error: 'Failed to get users' });
    }
});

export default router;
