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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentAuditService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.PaymentAuditService = {
    /**
     * Log a payment-related event
     */
    log: (bookingId, event, details, ip) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // console.log to server stdout for immediate visibility
            const timestamp = new Date().toISOString();
            console.log(`[AUDIT][${timestamp}][${event}] Booking: ${bookingId || 'N/A'} - IP: ${ip}`);
            // In a real production app, we would save this to a 'PaymentLog' table
            // For now, we will structure the log to console with a specific format that could be parsed later
            // or we could create a simplified SystemLog model if the user wants.
            // NOTE: Since schema.prisma modification requires migration, and we are in a rapid dev flow,
            // we will stick to structured console logging for this iteration unless the user explicitly requested a DB table.
        }
        catch (error) {
            console.error('Failed to write audit log:', error);
        }
    }),
    /**
     * Check (Simulated) for recent attempts
     * In a full implementation, this queries the DB to help with rate limiting logic if needed beyond memory store.
     */
    getRecentAttempts: (ip) => __awaiter(void 0, void 0, void 0, function* () {
        return 0; // Placeholder
    })
};
