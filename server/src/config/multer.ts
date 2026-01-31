
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Helper to sanitize folder names
const sanitizeFolderName = (name: string) => name
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 100);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let hotelId = req.query.hotelId as string;
        let hotelName = req.query.hotelName as string;
        let roomId = req.query.roomId as string;
        let roomName = req.query.roomName as string;
        let uploadType = req.query.type as string || 'hotel';

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

        let uploadPath: string;

        // Determine path based on type
        // Note: Using relative path from project root is tricky in dist vs src.
        // We assume 'public/uploads' is in the project root logic.
        // Adjust relative path as needed: ../../../public/uploads if deep in src/config

        const baseUploads = path.join(process.cwd(), 'public', 'uploads');

        if (uploadType === 'room') {
            uploadPath = path.join(baseUploads, 'hotels', folderHotel, 'rooms', folderRoom);
        } else if (uploadType === 'hotel' && folderHotel !== 'misc') {
            uploadPath = path.join(baseUploads, 'hotels', folderHotel, 'hotel');
        } else {
            uploadPath = baseUploads;
        }

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

export const uploadConfig = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only images (jpg, png, webp) are allowed'));
    }
});
