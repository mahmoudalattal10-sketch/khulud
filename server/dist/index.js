"use strict";
/**
 * =========================================================
 * 🚀 DIAFAT KHULUD - PROFESSIONAL BACKEND SERVER
 * =========================================================
 * Clean Architecture Refactor
 * =========================================================
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
// Config
const multer_1 = require("./config/multer");
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const payment_1 = __importDefault(require("./routes/payment"));
const ai_1 = __importDefault(require("./routes/ai"));
const admin_1 = __importDefault(require("./routes/admin"));
const contact_1 = __importDefault(require("./routes/contact"));
const coupons_1 = __importDefault(require("./routes/coupons"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const hotels_1 = __importDefault(require("./routes/hotels"));
const rooms_1 = __importDefault(require("./routes/rooms"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Load env
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// 🔧 MIDDLEWARE
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// CORS Configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'https://diaftkhulud.com',
    'https://www.diaftkhulud.com'
];
// Allow adding origins via env var (comma separated)
if (process.env.ALLOWED_ORIGINS) {
    allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(','));
}
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true
}));
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false,
}));
app.use((0, morgan_1.default)('dev'));
// 🔍 DEBUG LOGGING
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});
// ✅ HEALTH CHECK (No DB dependency)
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
        db: process.env.DATABASE_URL ? 'configured' : 'missing'
    });
});
// 🛣️ API ROUTES (Must be BEFORE static files)
app.use('/api/auth', auth_1.default);
app.use('/api/bookings', bookings_1.default);
app.use('/api/payment', payment_1.default);
app.use('/api/ai', ai_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/contact', contact_1.default);
app.use('/api/coupons', coupons_1.default);
app.use('/api/notifications', notifications_1.default);
app.use('/api/hotels', hotels_1.default);
app.use('/api/rooms', rooms_1.default);
// 📂 STATIC FILES
// Serve Frontend Static Files
app.use(express_1.default.static(path_1.default.join(__dirname, '../../dist')));
// Serve Public Uploads (Robust Path)
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../../public/uploads')));
// Fallback for other public files
app.use(express_1.default.static(path_1.default.join(__dirname, '../../public')));
// 📤 UPLOAD ROUTE (Kept simple here or can be moved to dedicated route)
app.post('/api/upload', multer_1.uploadConfig.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return relative URL
    // We need to reconstruct the relative path logic similar to before or simplify it.
    // The previous logic generated the URL based on where it saved customly.
    // Since we used logic in multer config, we can just grab the relative path from the saved file.
    // Simplest way: /uploads/...
    // But we need to know the subfolders.
    // The file.path is absolute. 
    // We can slice from 'public/uploads'.
    const absolutePath = req.file.path;
    const relativePath = absolutePath.split('uploads')[1].replace(/\\/g, '/');
    const fullUrl = `/uploads${relativePath}`;
    res.json({ url: fullUrl, success: true });
});
// 🌐 Client-Side Routing (Catch-All)
// Must be after all API routes
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../dist/index.html'));
});
// START SERVER
app.listen(PORT, () => {
    console.log(`
    🚀 Server running on http://localhost:${PORT}
    🗄️  Database: MySQL (Configured via Prisma)
    ✅ Mode: Professional Refactored
    `);
});
