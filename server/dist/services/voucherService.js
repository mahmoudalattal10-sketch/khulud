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
exports.generateVoucherPDF = void 0;
const react_1 = __importDefault(require("react"));
const renderer_1 = require("@react-pdf/renderer");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// 1. Register Fonts (Temporarily disabled for debugging or if not needed locally)
// Font.register({
//     family: 'Tajawal',
//     src: 'https://fonts.gstatic.com/s/tajawal/v9/I2DvyPlS8w7M8k8wTio.ttf'
// });
// Font.register({
//     family: 'Tajawal-Bold',
//     src: 'https://fonts.gstatic.com/s/tajawal/v9/I2D0yPlS8w7M8k8wTio52zk.ttf'
// });
// 2. Define Colors
const COLORS = {
    primary: '#1a3d2a', // The Dark Emerald Green
    secondary: '#c5a059', // The Gold
    text: '#1e293b', // Slate 800
    textLight: '#64748b', // Slate 500
    border: '#e2e8f0', // Slate 200
    bgLight: '#f8fafc', // Slate 50
    badgeBg: '#dcfce7', // Light Green for Badge
    badgeText: '#15803d', // Green Text for Badge
    white: '#FFFFFF',
};
// 3. Define Styles
const styles = renderer_1.StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        // fontFamily: 'Tajawal', // Disabled for debug
        padding: 40, // Generous padding as per design
    },
    // Header
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    logo: {
        width: 120,
        height: 60,
        objectFit: 'contain'
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.badgeBg,
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#bbf7d0',
        marginBottom: 8,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.badgeText,
        marginRight: 6,
    },
    statusText: {
        color: COLORS.badgeText,
        fontSize: 10,
        // fontFamily: 'Tajawal-Bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    refRow: {
        flexDirection: 'row',
        marginTop: 4,
    },
    refLabel: {
        color: COLORS.textLight,
        fontSize: 10,
        marginRight: 4,
        textTransform: 'uppercase',
    },
    refValue: {
        color: COLORS.text,
        fontSize: 10,
        // fontFamily: 'Tajawal-Bold',
    },
    // Verified Partner Badge (Centered)
    verifiedPartner: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 20,
        paddingVertical: 4,
        paddingHorizontal: 12,
        marginBottom: 20,
    },
    verifiedIcon: {
        color: COLORS.secondary,
        fontSize: 8,
        marginRight: 4,
    },
    verifiedText: {
        color: COLORS.textLight,
        fontSize: 7,
        // fontFamily: 'Tajawal-Bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    // Welcome Text
    welcomeText: {
        fontSize: 9,
        color: COLORS.text,
        lineHeight: 1.6,
        marginBottom: 30,
        borderLeftWidth: 3,
        borderLeftColor: '#cbd5e1', // Light gray quote bar
        paddingLeft: 10,
        fontStyle: 'italic',
    },
    highlight: {
        // fontFamily: 'Tajawal-Bold',
        color: COLORS.primary,
    },
    // Two Column Layout (Guest vs Dates)
    splitSection: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 25,
    },
    guestCard: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
        borderRadius: 12,
        padding: 20,
    },
    datesCard: {
        flex: 2,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 0, // Padding handled inside
    },
    // Labels & Values
    labelSmall: {
        fontSize: 7,
        color: COLORS.textLight,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    valueMedium: {
        fontSize: 14,
        // fontFamily: 'Tajawal-Bold',
        color: COLORS.text,
        marginBottom: 12,
    },
    valueSmall: {
        fontSize: 10,
        // fontFamily: 'Tajawal-Bold',
        color: COLORS.text,
    },
    // Dates Styling
    datesTop: {
        flexDirection: 'row',
        padding: 24,
    },
    dateBox: {
        flex: 1,
        alignItems: 'center',
    },
    dateValue: {
        fontSize: 24,
        // fontFamily: 'Tajawal-Bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    timeValue: {
        fontSize: 10,
        color: COLORS.textLight,
        letterSpacing: 1,
    },
    nightsBar: {
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: '#fcfcfc',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    nightsText: {
        fontSize: 10,
        // fontFamily: 'Tajawal-Bold',
        color: COLORS.secondary,
        textTransform: 'uppercase',
        letterSpacing: 3,
    },
    // Property Asset
    propertyCard: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 20,
        marginBottom: 25,
        position: 'relative',
    },
    propertyTitle: {
        fontSize: 20,
        // fontFamily: 'Tajawal-Bold',
        color: COLORS.primary,
        marginVertical: 4,
    },
    assetBadge: {
        position: 'absolute',
        top: 20,
        right: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    // Room & Finance Section
    detailsSplit: {
        flexDirection: 'row',
        gap: 30,
        marginTop: 10,
    },
    roomDetails: {
        flex: 1,
    },
    roomTitle: {
        fontSize: 18,
        // fontFamily: 'Tajawal-Bold',
        color: COLORS.text,
        marginBottom: 20,
    },
    specsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
    },
    specItem: {
        width: '45%',
        flexDirection: 'row',
        marginBottom: 15,
    },
    specIconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: COLORS.bgLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    specIconText: {
        fontSize: 10,
        color: COLORS.secondary,
    },
    // Financial Ledger (The Dark Block)
    financialCard: {
        flex: 1,
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        padding: 24,
        color: COLORS.white,
    },
    finLabel: {
        fontSize: 8,
        color: 'rgba(255,255,255,0.6)',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 20,
    },
    finRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    finRowText: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.7)',
        textTransform: 'uppercase',
    },
    finRowValue: {
        fontSize: 12,
        color: COLORS.white,
        // fontFamily: 'Tajawal-Bold',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 16,
    },
    totalLabel: {
        fontSize: 8,
        color: COLORS.secondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
        textAlign: 'right',
    },
    totalValue: {
        fontSize: 28,
        // fontFamily: 'Tajawal-Bold',
        color: COLORS.white,
        textAlign: 'right',
    },
    currency: {
        fontSize: 12,
        color: COLORS.secondary,
        marginLeft: 4,
    },
    // Footer
    policySection: {
        marginTop: 30,
        flexDirection: 'row',
        gap: 30,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 20,
    },
    policyCol: {
        flex: 1,
    },
    policyTitle: {
        fontSize: 10,
        // fontFamily: 'Tajawal-Bold',
        color: COLORS.text,
        textTransform: 'uppercase',
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.secondary,
        marginRight: 6,
    },
    policyText: {
        fontSize: 8,
        color: COLORS.textLight,
        lineHeight: 1.5,
        marginBottom: 6,
    }
});
// 4. Helper Components
const SpecItem = ({ icon, label, value }) => (react_1.default.createElement(renderer_1.View, { style: styles.specItem },
    react_1.default.createElement(renderer_1.View, { style: styles.specIconBox },
        react_1.default.createElement(renderer_1.Text, { style: styles.specIconText }, icon)),
    react_1.default.createElement(renderer_1.View, null,
        react_1.default.createElement(renderer_1.Text, { style: styles.labelSmall }, label),
        react_1.default.createElement(renderer_1.Text, { style: styles.valueSmall }, value))));
// 5. Main Component
const VoucherDocument = ({ data }) => {
    var _a;
    const { guest, booking, status } = data;
    // Formatting Dates
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);
    const formatDate = (date) => {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };
    return (react_1.default.createElement(renderer_1.Document, { title: `Voucher ${booking.reference}` },
        react_1.default.createElement(renderer_1.Page, { size: "A4", style: styles.page },
            react_1.default.createElement(renderer_1.View, { style: styles.headerRow },
                react_1.default.createElement(renderer_1.Text, null, "LOGO"),
                react_1.default.createElement(renderer_1.View, { style: styles.headerRight },
                    react_1.default.createElement(renderer_1.View, { style: styles.statusBadge },
                        react_1.default.createElement(renderer_1.View, { style: styles.statusDot }),
                        react_1.default.createElement(renderer_1.Text, { style: styles.statusText }, status || 'CONFIRMED')),
                    react_1.default.createElement(renderer_1.View, { style: styles.refRow },
                        react_1.default.createElement(renderer_1.Text, { style: styles.refLabel }, "REFERENCE:"),
                        react_1.default.createElement(renderer_1.Text, { style: styles.refValue }, booking.reference || 'RES-2026-UNKNOWN')))),
            react_1.default.createElement(renderer_1.View, { style: styles.verifiedPartner },
                react_1.default.createElement(renderer_1.Text, { style: styles.verifiedIcon }, "\uD83D\uDEE1"),
                react_1.default.createElement(renderer_1.Text, { style: styles.verifiedText }, "VERIFIED TOURISM PARTNER")),
            react_1.default.createElement(renderer_1.Text, { style: styles.welcomeText },
                "\"Dear Mr/Mrs. ",
                react_1.default.createElement(renderer_1.Text, { style: styles.highlight }, guest.lastName),
                ", it is our pleasure to formally confirm your reservation at ",
                react_1.default.createElement(renderer_1.Text, { style: styles.highlight }, booking.hotelName),
                ". Your stay in a ",
                react_1.default.createElement(renderer_1.Text, { style: styles.highlight }, booking.roomType),
                " for ",
                react_1.default.createElement(renderer_1.Text, { style: styles.highlight },
                    booking.nights,
                    " nights"),
                " (from ",
                formatDate(checkInDate),
                " to ",
                formatDate(checkOutDate),
                ") is officially ",
                react_1.default.createElement(renderer_1.Text, { style: Object.assign(Object.assign({}, styles.highlight), { color: COLORS.secondary }) }, status),
                ". We look forward to welcoming you soon.\""),
            react_1.default.createElement(renderer_1.View, { style: styles.splitSection },
                react_1.default.createElement(renderer_1.View, { style: styles.guestCard },
                    react_1.default.createElement(renderer_1.Text, { style: styles.labelSmall }, "LEAD PASSENGER"),
                    react_1.default.createElement(renderer_1.Text, { style: styles.valueMedium },
                        guest.firstName,
                        " ",
                        guest.lastName),
                    react_1.default.createElement(renderer_1.View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 } },
                        react_1.default.createElement(renderer_1.Text, { style: { fontSize: 10, marginRight: 6 } }, "\uD83C\uDF0D"),
                        react_1.default.createElement(renderer_1.Text, { style: styles.valueSmall }, guest.nationality || 'Saudi Arabia')),
                    react_1.default.createElement(renderer_1.Text, { style: styles.labelSmall }, "CONTACT PROXY"),
                    react_1.default.createElement(renderer_1.Text, { style: [styles.valueSmall, { marginBottom: 12 }] }, guest.email),
                    react_1.default.createElement(renderer_1.Text, { style: styles.labelSmall }, "PHONE RECORD"),
                    react_1.default.createElement(renderer_1.Text, { style: styles.valueSmall }, guest.phone || '+966 --- --- ---')),
                react_1.default.createElement(renderer_1.View, { style: styles.datesCard },
                    react_1.default.createElement(renderer_1.View, { style: styles.datesTop },
                        react_1.default.createElement(renderer_1.View, { style: styles.dateBox },
                            react_1.default.createElement(renderer_1.Text, { style: styles.labelSmall }, "ARRIVAL CHECK-IN"),
                            react_1.default.createElement(renderer_1.Text, { style: styles.dateValue }, formatDate(checkInDate)),
                            react_1.default.createElement(renderer_1.Text, { style: styles.timeValue }, "16:00:00")),
                        react_1.default.createElement(renderer_1.View, { style: [styles.dateBox, { borderLeftWidth: 1, borderLeftColor: COLORS.border }] },
                            react_1.default.createElement(renderer_1.Text, { style: styles.labelSmall }, "DEPARTURE CHECK-OUT"),
                            react_1.default.createElement(renderer_1.Text, { style: styles.dateValue }, formatDate(checkOutDate)),
                            react_1.default.createElement(renderer_1.Text, { style: styles.timeValue }, "12:00:00"))),
                    react_1.default.createElement(renderer_1.View, { style: styles.nightsBar },
                        react_1.default.createElement(renderer_1.Text, { style: styles.nightsText },
                            booking.nights,
                            " NIGHTS REGISTERED STAY")))),
            react_1.default.createElement(renderer_1.View, { style: styles.propertyCard },
                react_1.default.createElement(renderer_1.Text, { style: [styles.labelSmall, { color: COLORS.secondary }] }, "PROPERTY ASSET #"),
                react_1.default.createElement(renderer_1.Text, { style: styles.propertyTitle }, booking.hotelName),
                react_1.default.createElement(renderer_1.View, { style: { flexDirection: 'row', alignItems: 'center', marginTop: 4 } },
                    react_1.default.createElement(renderer_1.Text, { style: { fontSize: 8, color: COLORS.textLight, marginRight: 4 } }, "\uD83D\uDCCD"),
                    react_1.default.createElement(renderer_1.Text, { style: { fontSize: 9, color: COLORS.textLight, textTransform: 'uppercase' } }, booking.hotelAddress || 'MAKKAH, SAUDI ARABIA')),
                react_1.default.createElement(renderer_1.View, { style: styles.assetBadge },
                    react_1.default.createElement(renderer_1.Text, { style: styles.labelSmall }, "ASSET ID"),
                    react_1.default.createElement(renderer_1.Text, { style: [styles.valueSmall, { color: COLORS.secondary }] },
                        "# ",
                        ((_a = booking.reference) === null || _a === void 0 ? void 0 : _a.split('-').pop()) || '8892'))),
            react_1.default.createElement(renderer_1.View, { style: [styles.labelSmall, { color: COLORS.secondary, marginBottom: 8 }] }, "ACCOMMODATION TIER"),
            react_1.default.createElement(renderer_1.View, { style: styles.detailsSplit },
                react_1.default.createElement(renderer_1.View, { style: styles.roomDetails },
                    react_1.default.createElement(renderer_1.Text, { style: styles.roomTitle }, booking.roomType),
                    react_1.default.createElement(renderer_1.View, { style: { borderBottomWidth: 1, borderBottomColor: COLORS.border, marginBottom: 20 } }),
                    react_1.default.createElement(renderer_1.View, { style: styles.specsGrid },
                        react_1.default.createElement(SpecItem, { icon: "\uD83D\uDC65", label: "CAPACITY", value: `${booking.roomCapacity || booking.occupancy || 2} MAX GUESTS` }),
                        react_1.default.createElement(SpecItem, { icon: "\uD83D\uDECF", label: "BEDDING", value: booking.roomBeds || 'Standard Bedding' }),
                        react_1.default.createElement(SpecItem, { icon: "\uD83D\uDCD0", label: "AREA", value: booking.roomArea ? `${booking.roomArea} m²` : '---' }),
                        react_1.default.createElement(SpecItem, { icon: "\uD83D\uDC41", label: "VIEW", value: booking.roomView || 'City View' }))),
                react_1.default.createElement(renderer_1.View, { style: styles.financialCard },
                    react_1.default.createElement(renderer_1.Text, { style: styles.finLabel }, "FINANCIAL LEDGER"),
                    react_1.default.createElement(renderer_1.View, { style: styles.finRow },
                        react_1.default.createElement(renderer_1.Text, { style: styles.finRowText }, "BASE VALUE"),
                        react_1.default.createElement(renderer_1.Text, { style: styles.finRowValue },
                            (booking.totalPrice / 1.15).toLocaleString(undefined, { maximumFractionDigits: 2 }),
                            react_1.default.createElement(renderer_1.Text, { style: { fontSize: 8 } }, " SAR"))),
                    react_1.default.createElement(renderer_1.View, { style: styles.finRow },
                        react_1.default.createElement(renderer_1.Text, { style: styles.finRowText }, "VAT (15%)"),
                        react_1.default.createElement(renderer_1.Text, { style: styles.finRowValue },
                            (booking.totalPrice - (booking.totalPrice / 1.15)).toLocaleString(undefined, { maximumFractionDigits: 2 }),
                            react_1.default.createElement(renderer_1.Text, { style: { fontSize: 8 } }, " SAR"))),
                    react_1.default.createElement(renderer_1.View, { style: styles.divider }),
                    react_1.default.createElement(renderer_1.Text, { style: styles.totalLabel }, "FINAL SETTLEMENT"),
                    react_1.default.createElement(renderer_1.Text, { style: styles.totalValue },
                        booking.totalPrice.toLocaleString(),
                        react_1.default.createElement(renderer_1.Text, { style: styles.currency }, " SAR")))),
            react_1.default.createElement(renderer_1.View, { style: styles.policySection },
                react_1.default.createElement(renderer_1.View, { style: styles.policyCol },
                    react_1.default.createElement(renderer_1.View, { style: styles.policyTitle },
                        react_1.default.createElement(renderer_1.View, { style: styles.bullet }),
                        react_1.default.createElement(renderer_1.Text, null, "ACCOMMODATION POLICIES")),
                    react_1.default.createElement(renderer_1.View, { style: { marginBottom: 10 } },
                        react_1.default.createElement(renderer_1.Text, { style: [styles.policyText, {
                                    // fontFamily: 'Tajawal-Bold', 
                                    color: COLORS.text
                                }] }, "SYSTEM RELEASE:"),
                        react_1.default.createElement(renderer_1.Text, { style: styles.policyText }, "Prior 48h notice required for any booking modifications.")),
                    react_1.default.createElement(renderer_1.View, null,
                        react_1.default.createElement(renderer_1.Text, { style: [styles.policyText, {
                                    // fontFamily: 'Tajawal-Bold', 
                                    color: COLORS.text
                                }] }, "FAMILY POLICY:"),
                        react_1.default.createElement(renderer_1.Text, { style: styles.policyText }, "Children under 6 years stay complimentary with parents."))),
                react_1.default.createElement(renderer_1.View, { style: styles.policyCol },
                    react_1.default.createElement(renderer_1.View, { style: styles.policyTitle },
                        react_1.default.createElement(renderer_1.View, { style: [styles.bullet, { backgroundColor: COLORS.secondary }] }),
                        react_1.default.createElement(renderer_1.Text, null, "OPERATION STANDARDS")),
                    react_1.default.createElement(renderer_1.View, { style: { marginBottom: 10 } },
                        react_1.default.createElement(renderer_1.Text, { style: [styles.policyText, {
                                    // fontFamily: 'Tajawal-Bold', 
                                    color: COLORS.text
                                }] }, "REGISTRATION:"),
                        react_1.default.createElement(renderer_1.Text, { style: styles.policyText }, "Formal check-in begins at 16:00 Local Time.")),
                    react_1.default.createElement(renderer_1.View, null,
                        react_1.default.createElement(renderer_1.Text, { style: [styles.policyText, {
                                    // fontFamily: 'Tajawal-Bold', 
                                    color: COLORS.text
                                }] }, "DEPARTURE:"),
                        react_1.default.createElement(renderer_1.Text, { style: styles.policyText }, "Check-out must be finalized by 12:00 PM.")))))));
};
// 6. Export Function
const generateVoucherPDF = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Fetch Data
    const booking = yield prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            user: true,
            room: {
                include: {
                    hotel: true
                }
            }
        }
    });
    if (!booking)
        throw new Error('Booking not found');
    // 2. Prepare Data Object
    const data = {
        booking: {
            reference: booking.id.toUpperCase(), // Using ID as reference if no explicit ref field
            checkIn: booking.checkIn.toISOString(),
            checkOut: booking.checkOut.toISOString(),
            nights: Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)),
            hotelName: booking.room.hotel.nameEn || booking.room.hotel.name, // Prefer English for this design
            hotelAddress: booking.room.hotel.locationEn || booking.room.hotel.location,
            roomType: booking.room.type || booking.room.name,
            occupancy: booking.guestsCount,
            boardBasis: booking.room.mealPlan || 'Room Only',
            totalPrice: booking.totalPrice,
            currency: 'SAR',
            roomView: booking.room.view,
            roomArea: booking.room.area,
            roomBeds: booking.room.beds,
            roomCapacity: booking.room.capacity
        },
        guest: {
            firstName: booking.guestName ? booking.guestName.split(' ')[0] : booking.user.name.split(' ')[0],
            lastName: booking.guestName ? booking.guestName.split(' ').slice(1).join(' ') : booking.user.name.split(' ').slice(1).join(' '),
            email: booking.user.email,
            phone: booking.user.phone,
            nationality: 'Saudi Arabia' // Placeholder as we don't capture this yet
        },
        status: booking.status
    };
    // 3. Render
    return yield (0, renderer_1.renderToBuffer)(react_1.default.createElement(VoucherDocument, { data: data }));
});
exports.generateVoucherPDF = generateVoucherPDF;
