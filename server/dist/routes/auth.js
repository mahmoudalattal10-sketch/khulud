"use strict";
/**
 * =========================================================
 * 🔐 AUTH ROUTES - JWT Authentication System
 * =========================================================
 * Handles user registration, login, and profile management.
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = void 0;
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const google_auth_library_1 = require("google-auth-library");
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// ============================================
// ⚙️ CONFIGURATION
// ============================================
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
if (!JWT_SECRET) {
    console.error('❌ CRITICAL ERROR: JWT_SECRET is not defined in environment variables');
}
const JWT_EXPIRES_IN = '7d';
// ============================================
// 🛡️ SECURITY MIDDLEWARES
// ============================================
// 🛑 Rate Limiting for Auth
const loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Max 10 attempts
    message: { error: 'Too many login attempts, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});
const registerLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Max 5 accounts per hour
    message: { error: 'Too many accounts created, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});
// ============================================
// 📜 VALIDATION SCHEMAS
// ============================================
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
    name: zod_1.z.string().min(2, 'Name is too short'),
    phone: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
});
// ============================================
// 🛡️ AUTH MIDDLEWARE
// ============================================
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authHeader = req.headers.authorization;
        const cookieToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        const token = cookieToken || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});
exports.authMiddleware = authMiddleware;
const adminMiddleware = (req, res, next) => {
    if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN')) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
// ============================================
// 📝 REGISTER
// ============================================
router.post('/register', registerLimiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        // Create user
        const user = yield prisma.user.create({
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
            yield prisma.notification.create({
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
        }
        catch (e) {
            console.error('Failed to create notification', e);
        }
        // 5. Generate Token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
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
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
}));
// 🔑 LOGIN
// ============================================
router.post('/login', loginLimiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Zod Validation
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.issues[0].message });
        }
        const { email, password } = req.body;
        // 2. Find User
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        // 3. Compare Passwords
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        // 4. Generate Token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
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
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
}));
// ============================================
// 🌐 SOCIAL AUTH HELPER & ROUTES
// ============================================
// Helper to handle user find/create for social login
const handleSocialLogin = (res, email, name, provider) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Random password for social users
            const randomPassword = yield bcryptjs_1.default.hash(Math.random().toString(36), 10);
            user = yield prisma.user.create({
                data: {
                    email,
                    name,
                    password: randomPassword,
                    role: 'USER'
                }
            });
        }
        // Generate Token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
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
    }
    catch (error) {
        console.error(`Social login error (${provider}):`, error);
        return res.status(500).json({ error: 'Social authentication failed' });
    }
});
// --- GOOGLE AUTH ---
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
router.post('/google', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        if (!token)
            return res.status(400).json({ error: 'Token required' });
        const ticket = yield googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(400).json({ error: 'Invalid Google credential' });
        }
        yield handleSocialLogin(res, payload.email, payload.name || payload.email.split('@')[0], 'GOOGLE');
    }
    catch (error) {
        console.error('Google auth error:', error);
        res.status(401).json({ error: 'Invalid Google Token' });
    }
}));
// --- FACEBOOK AUTH ---
router.post('/facebook', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accessToken } = req.body;
        if (!accessToken)
            return res.status(400).json({ error: 'AccessToken required' });
        // Verify Facebook Token via Graph API
        const { data } = yield axios_1.default.get(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`);
        if (!data.email) {
            return res.status(400).json({ error: 'Facebook account must have an email' });
        }
        yield handleSocialLogin(res, data.email, data.name, 'FACEBOOK');
    }
    catch (error) {
        console.error('Facebook auth error:', error);
        res.status(401).json({ error: 'Invalid Facebook Token' });
    }
}));
// ============================================
// 👤 GET PROFILE (Protected)
// ============================================
router.get('/profile', exports.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({
            where: { id: req.user.userId },
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
    }
    catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
}));
// ============================================
// ✏️ UPDATE PROFILE (Protected)
// ============================================
router.put('/profile', exports.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, phone, currentPassword, newPassword } = req.body;
        const updateData = {};
        if (name)
            updateData.name = name;
        if (phone !== undefined)
            updateData.phone = phone;
        if (currentPassword && newPassword) {
            const user = yield prisma.user.findUnique({ where: { id: req.user.userId } });
            if (!user)
                return res.status(404).json({ error: 'User not found' });
            const isMatch = yield bcryptjs_1.default.compare(currentPassword, user.password);
            if (!isMatch)
                return res.status(400).json({ error: 'Incorrect password' });
            updateData.password = yield bcryptjs_1.default.hash(newPassword, 12);
        }
        const updatedUser = yield prisma.user.update({
            where: { id: req.user.userId },
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
    }
    catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
}));
// ============================================
// 🔍 VERIFY TOKEN
// ============================================
router.get('/verify', exports.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        valid: true,
        user: req.user
    });
}));
// ============================================
// 🚪 LOGOUT
// ============================================
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});
// ============================================
// 👑 ADMIN: GET ALL USERS (Admin Only)
// ============================================
router.get('/users', exports.authMiddleware, exports.adminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
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
    }
    catch (error) {
        console.error('Users list error:', error);
        res.status(500).json({ error: 'Failed to get users' });
    }
}));
exports.default = router;
