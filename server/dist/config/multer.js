"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadConfig = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Helper to sanitize folder names
const sanitizeFolderName = (name) => name
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 100);
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        let hotelId = req.query.hotelId;
        let hotelName = req.query.hotelName;
        let roomId = req.query.roomId;
        let roomName = req.query.roomName;
        let uploadType = req.query.type || 'hotel';
        // Robust query extraction
        if (!hotelId && req.url && req.url.includes('?')) {
            const urlParts = req.url.split('?')[1];
            const params = new URLSearchParams(urlParts);
            hotelId = params.get('hotelId') || '';
            hotelName = params.get('hotelName') || '';
            roomId = params.get('roomId') || '';
            roomName = params.get('roomName') || '';
            uploadType = params.get('type') || 'hotel';
        }
        const folderHotel = hotelName ? sanitizeFolderName(hotelName) : (hotelId || 'misc');
        const folderRoom = roomName ? sanitizeFolderName(roomName) : (roomId || 'general');
        let uploadPath;
        // Determine path based on type
        // Note: Using relative path from project root is tricky in dist vs src.
        // We assume 'public/uploads' is in the project root logic.
        // Adjust relative path as needed: ../../../public/uploads if deep in src/config
        const baseUploads = path_1.default.join(process.cwd(), 'public', 'uploads');
        if (uploadType === 'room') {
            uploadPath = path_1.default.join(baseUploads, 'hotels', folderHotel, 'rooms', folderRoom);
        }
        else if (uploadType === 'hotel' && folderHotel !== 'misc') {
            uploadPath = path_1.default.join(baseUploads, 'hotels', folderHotel, 'hotel');
        }
        else {
            uploadPath = baseUploads;
        }
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
exports.uploadConfig = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only images (jpg, png, webp) are allowed'));
    }
});
