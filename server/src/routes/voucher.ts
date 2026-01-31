import express, { Request, Response } from 'express';
import { generateVoucherPDF } from '../services/voucherService';

const router = express.Router();

router.get('/:id', async (req: Request, res: Response) => {
    console.log(`[VOUCHER] Request received for ID: ${req.params.id}`); // [DEBUG]
    try {
        const pdfBuffer = await generateVoucherPDF(req.params.id);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="Voucher-${req.params.id}.pdf"`,
            'Content-Length': pdfBuffer.length
        });

        res.end(pdfBuffer);
    } catch (error) {
        console.error('PDF Generation Error:', error);
        res.status(500).json({ error: 'Failed to generate voucher' });
    }
});

export default router;
