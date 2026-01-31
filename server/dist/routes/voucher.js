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
const voucherService_1 = require("../services/voucherService");
const router = express_1.default.Router();
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`[VOUCHER] Request received for ID: ${req.params.id}`); // [DEBUG]
    try {
        const pdfBuffer = yield (0, voucherService_1.generateVoucherPDF)(req.params.id);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="Voucher-${req.params.id}.pdf"`,
            'Content-Length': pdfBuffer.length
        });
        res.end(pdfBuffer);
    }
    catch (error) {
        console.error('PDF Generation Error:', error);
        res.status(500).json({ error: 'Failed to generate voucher' });
    }
}));
exports.default = router;
