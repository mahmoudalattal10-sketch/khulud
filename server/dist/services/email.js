"use strict";
/**
 * =========================================================
 * 📧 EMAIL SERVICE
 * =========================================================
 * Handles sending automated emails for the platform.
 * Uses Nodemailer and supports HTML templates.
 * Now includes PDF voucher attachments!
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const voucherService_1 = require("./voucherService");
// Configure Transporter (Mock for development, or Real if env vars set)
// In production, use environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'ethereal.user@ethereal.email', // Replace with real credentials in .env
        pass: process.env.SMTP_PASS || 'ethereal_password'
    }
});
class EmailService {
    static sendEmail(to_1, subject_1, html_1) {
        return __awaiter(this, arguments, void 0, function* (to, subject, html, attachments = []) {
            try {
                const from = process.env.SMTP_FROM || '"Diafat Platform" <noreply@diafat.com>';
                const info = yield transporter.sendMail({
                    from,
                    to,
                    subject,
                    html,
                    attachments
                });
                console.log(`📧 Email sent: ${info.messageId}`);
                if (process.env.NODE_ENV !== 'production') {
                    console.log(`🔗 Preview URL: ${nodemailer_1.default.getTestMessageUrl(info)}`);
                }
                return true;
            }
            catch (error) {
                console.error('❌ Failed to send email:', error);
                // Don't throw error to prevent blocking the main flow
                return false;
            }
        });
    }
    /**
     * Send Booking Confirmation Email
     */
    static sendBookingConfirmation(booking, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = `✅ تأكيد حجزك - ${booking.id.slice(0, 8).toUpperCase()}`;
            const html = `
            <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px 0;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <div style="background-color: #10b981; padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">تم تأكيد الحجز بنجاح!</h1>
                    </div>

                    <!-- Content -->
                    <div style="padding: 40px;">
                        <p style="color: #64748b; font-size: 16px; margin-bottom: 24px;">مرحباً <strong>${user.name}</strong>،</p>
                        <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                            نشكرك على اختيارك لمنصة ضيافة. يسرنا تأكيد حجزك، ونتطلع لاستقبالك قريباً.
                        </p>

                        <!-- Booking Details Card -->
                        <div style="background-color: #f1f5f9; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                            <h2 style="color: #0f172a; font-size: 18px; margin: 0 0 16px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">تفاصيل الحجز</h2>
                            
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b;">رقم الحجز:</td>
                                    <td style="padding: 8px 0; color: #0f172a; font-weight: bold; text-align: left;">#${booking.id.slice(0, 8).toUpperCase()}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b;">تاريخ الوصول:</td>
                                    <td style="padding: 8px 0; color: #0f172a; font-weight: bold; text-align: left;">${new Date(booking.checkIn).toLocaleDateString('ar-SA')}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b;">تاريخ المغادرة:</td>
                                    <td style="padding: 8px 0; color: #0f172a; font-weight: bold; text-align: left;">${new Date(booking.checkOut).toLocaleDateString('ar-SA')}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #64748b;">المبلغ الإجمالي:</td>
                                    <td style="padding: 8px 0; color: #10b981; font-weight: bold; text-align: left;">${booking.totalPrice.toLocaleString()} ريال سعودي</td>
                                </tr>
                            </table>
                        </div>

                        <div style="text-align: center;">
                            <a href="${process.env.FRONTEND_URL}/profile" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: bold; font-size: 14px;">إدارة حجزي</a>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="color: #94a3b8; font-size: 12px; margin: 0;">© 2026 Diafat Platform. جميع الحقوق محفوظة.</p>
                    </div>
                </div>
            </div>
        `;
            return this.sendEmail(user.email, subject, html);
        });
    }
    /**
     * Send Cancellation Email
     */
    static sendCancellation(booking, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = `❌ تم إلغاء الحجز - ${booking.id.slice(0, 8).toUpperCase()}`;
            const html = `
            <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px 0;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <div style="background-color: #ef4444; padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">تم إلغاء الحجز</h1>
                    </div>
                    <div style="padding: 40px;">
                        <p style="color: #334155; font-size: 16px;">مرحباً <strong>${user.name}</strong>،</p>
                        <p style="color: #334155; font-size: 16px;">تم إلغاء حجزك رقم #${booking.id.slice(0, 8).toUpperCase()} بنجاح بناءً على طلبك.</p>
                        ${booking.paymentStatus === 'PAID' ? '<p style="color: #10b981; font-weight: bold;">سيتم استرداد المبلغ المدفوع خلال 5-7 أيام عمل.</p>' : ''}
                    </div>
                </div>
            </div>
        `;
            return this.sendEmail(user.email, subject, html);
        });
    }
    /**
     * Send Payment Receipt with PDF
     */
    static sendPaymentReceipt(booking, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = `🧾 إيصال الدفع - ${booking.id.slice(0, 8).toUpperCase()}`;
            const html = `
            <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px 0;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <div style="background-color: #3b82f6; padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">إيصال الدفع</h1>
                    </div>
                    <div style="padding: 40px;">
                        <p style="color: #334155; font-size: 16px;">مرحباً <strong>${user.name}</strong>،</p>
                        <p style="color: #334155; font-size: 16px;">تم استلام دفعتك بنجاح. شكراً لثقتك بنا.</p>
                    </div>
                </div>
            </div>
        `;
            return this.sendEmail(user.email, subject, html);
        });
    }
    /**
     * 🎫 Send Booking Confirmation WITH Voucher PDF
     * This is called when booking is confirmed and paid
     */
    static sendBookingConfirmationWithVoucher(booking, user) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const subject = `🎫 فاوتشر حجزك - ${booking.id.slice(0, 8).toUpperCase()} | ضيافات خلود`;
            // Get hotel name from booking relations
            const hotelName = ((_b = (_a = booking.room) === null || _a === void 0 ? void 0 : _a.hotel) === null || _b === void 0 ? void 0 : _b.name) || 'الفندق';
            const roomName = ((_c = booking.room) === null || _c === void 0 ? void 0 : _c.name) || 'الغرفة';
            // Calculate VAT (15% is the profit margin from total price)
            const totalPrice = booking.totalPrice;
            const vatAmount = totalPrice * 0.15 / 1.15; // VAT is 15% of base
            const baseAmount = totalPrice - vatAmount;
            const html = `
            <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px 0;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <div style="background-color: #1a3d2a; padding: 40px; text-align: center;">
                        <h1 style="color: #c5a059; margin: 0; font-size: 28px; font-weight: 800;">ضيافات خلود</h1>
                        <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Luxury Travel & Tourism</p>
                    </div>

                    <!-- Success Banner -->
                    <div style="background-color: #c5a059; padding: 20px; text-align: center;">
                        <h2 style="color: #1a3d2a; margin: 0; font-size: 20px; font-weight: 800;">✅ تم تأكيد حجزك بنجاح!</h2>
                    </div>

                    <!-- Content -->
                    <div style="padding: 40px;">
                        <p style="color: #64748b; font-size: 16px; margin-bottom: 24px;">مرحباً <strong style="color: #1a3d2a;">${booking.guestName || user.name}</strong>،</p>
                        <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                            يسعدنا تأكيد حجزك في <strong style="color: #1a3d2a;">${hotelName}</strong>. 
                            تجد في المرفقات فاوتشر الحجز الرسمي الخاص بك.
                        </p>

                        <!-- Booking Details Card -->
                        <div style="background-color: #f1f5f9; border-radius: 12px; padding: 24px; margin-bottom: 32px; border-right: 4px solid #c5a059;">
                            <h3 style="color: #0f172a; font-size: 16px; margin: 0 0 16px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">📋 تفاصيل الحجز</h3>
                            
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 10px 0; color: #64748b; font-size: 14px;">رقم الحجز:</td>
                                    <td style="padding: 10px 0; color: #0f172a; font-weight: bold; text-align: left; font-size: 14px;">#${booking.id.slice(0, 8).toUpperCase()}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #64748b; font-size: 14px;">الفندق:</td>
                                    <td style="padding: 10px 0; color: #1a3d2a; font-weight: bold; text-align: left; font-size: 14px;">${hotelName}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #64748b; font-size: 14px;">الغرفة:</td>
                                    <td style="padding: 10px 0; color: #0f172a; font-weight: bold; text-align: left; font-size: 14px;">${booking.roomCount || 1}x ${roomName}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #64748b; font-size: 14px;">تاريخ الوصول:</td>
                                    <td style="padding: 10px 0; color: #0f172a; font-weight: bold; text-align: left; font-size: 14px;">${new Date(booking.checkIn).toLocaleDateString('ar-SA')}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #64748b; font-size: 14px;">تاريخ المغادرة:</td>
                                    <td style="padding: 10px 0; color: #0f172a; font-weight: bold; text-align: left; font-size: 14px;">${new Date(booking.checkOut).toLocaleDateString('ar-SA')}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #64748b; font-size: 14px;">عدد الضيوف:</td>
                                    <td style="padding: 10px 0; color: #0f172a; font-weight: bold; text-align: left; font-size: 14px;">${booking.guestsCount} ضيوف</td>
                                </tr>
                            </table>
                        </div>

                        <!-- Price Summary -->
                        <div style="background-color: #1a3d2a; border-radius: 12px; padding: 20px; margin-bottom: 32px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="color: rgba(255,255,255,0.7); font-size: 14px;">المبلغ الأساسي:</span>
                                <span style="color: #ffffff; font-weight: bold; font-size: 14px;">${baseAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ريال</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.2);">
                                <span style="color: rgba(255,255,255,0.7); font-size: 14px;">ضريبة القيمة المضافة (15%):</span>
                                <span style="color: #ffffff; font-weight: bold; font-size: 14px;">${vatAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ريال</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: #c5a059; font-size: 16px; font-weight: bold;">الإجمالي:</span>
                                <span style="color: #c5a059; font-weight: bold; font-size: 20px;">${totalPrice.toLocaleString()} ريال سعودي</span>
                            </div>
                        </div>

                        <!-- CTA Button -->
                        <div style="text-align: center;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile" style="display: inline-block; background-color: #1a3d2a; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: bold; font-size: 14px;">📂 إدارة حجوزاتي</a>
                        </div>

                        <!-- Voucher Notice -->
                        <div style="margin-top: 24px; padding: 16px; background-color: #fef3c7; border-radius: 8px; text-align: center;">
                            <p style="color: #92400e; margin: 0; font-size: 14px;">📎 <strong>الفاوتشر الرسمي مرفق مع هذا البريد</strong></p>
                            <p style="color: #92400e; margin: 8px 0 0 0; font-size: 12px;">يرجى طباعته وتقديمه عند الوصول للفندق</p>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0;">للاستفسارات: <strong>+966 2445 388 055</strong></p>
                        <p style="color: #94a3b8; font-size: 11px; margin: 0;">© 2026 ضيافات خلود. جميع الحقوق محفوظة.</p>
                    </div>
                </div>
            </div>
        `;
            try {
                // Generate the voucher PDF
                const pdfBuffer = yield (0, voucherService_1.generateVoucherPDF)(booking.id);
                // Send email with PDF attachment
                return this.sendEmail(user.email, subject, html, [
                    {
                        filename: `Diafat-Voucher-${booking.id.slice(0, 8).toUpperCase()}.pdf`,
                        content: pdfBuffer,
                        contentType: 'application/pdf'
                    }
                ]);
            }
            catch (error) {
                console.error('❌ Failed to generate voucher PDF:', error);
                // Fallback: send email without attachment
                return this.sendEmail(user.email, subject, html);
            }
        });
    }
}
exports.EmailService = EmailService;
