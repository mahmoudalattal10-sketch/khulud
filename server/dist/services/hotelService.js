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
exports.HotelService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class HotelService {
    /**
     * Search for hotels with robust filtering and availability checking
     */
    searchHotels(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { city, checkIn, checkOut, guests, adminView } = filters;
            // 1. Build optimized Where clause
            const where = {};
            // Visibility Check
            if (!adminView) {
                where.isVisible = true;
            }
            // City / Search Term Logic
            if (city && city !== 'all') {
                const term = city.toLowerCase().trim();
                // Using a broad OR search for better UX
                where.OR = [
                    { city: { contains: term } },
                    { location: { contains: term } },
                    { name: { contains: term } },
                    { nameEn: { contains: term } } // Added English name search
                ];
            }
            // 2. Fetch Initial Candidates
            const hotels = yield prisma.hotel.findMany({
                where,
                include: {
                    images: adminView ? true : { where: { isMain: true }, take: 1 }, // Admin needs all images, public only needs main
                    amenities: {
                        include: { amenity: true }
                    },
                    rooms: {
                        include: {
                            images: true, // [FIX] Fetch room images for Admin Dashboard
                            features: true, // [FIX] Fetch room features/amenities
                            pricingPeriods: true,
                            bookings: (checkIn && checkOut) ? {
                                where: {
                                    status: { in: ['CONFIRMED', 'PENDING'] }, // Ignore cancelled
                                    checkIn: { lt: new Date(checkOut) },
                                    checkOut: { gt: new Date(checkIn) }
                                }
                            } : undefined
                        }
                    },
                    nearbyPlaces: true,
                    guestReviews: adminView ? {
                        orderBy: { date: 'desc' },
                        take: 50
                    } : { select: { rating: true } }
                },
                orderBy: { isFeatured: 'desc' }
            });
            if (!checkIn || !checkOut) {
                // For public view, filter out hotels with no bookable rooms
                if (!adminView) {
                    const bookableHotels = hotels.filter(hotel => this.hasBookableRooms(hotel));
                    return this.transformHotels(bookableHotels);
                }
                return this.transformHotels(hotels);
            }
            // 3. Process Availability (In-Memory for strict logic, but much lighter now)
            return this.filterAvailableHotels(hotels, checkIn, checkOut, guests || 1);
        });
    }
    /**
     * Get single hotel details by slug with optional availability check
     */
    getHotelBySlug(slug, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const hotel = yield prisma.hotel.findUnique({
                where: { slug },
                include: {
                    images: true,
                    amenities: {
                        include: { amenity: true }
                    },
                    rooms: {
                        include: {
                            images: true,
                            features: true,
                            pricingPeriods: true,
                            bookings: ((options === null || options === void 0 ? void 0 : options.checkIn) && (options === null || options === void 0 ? void 0 : options.checkOut)) ? {
                                where: {
                                    status: { in: ['CONFIRMED', 'PENDING'] },
                                    checkIn: { lt: new Date(options.checkOut) },
                                    checkOut: { gt: new Date(options.checkIn) }
                                }
                            } : undefined
                        }
                    },
                    guestReviews: {
                        orderBy: { date: 'desc' },
                        take: 10
                    },
                    nearbyPlaces: {
                        orderBy: { sortOrder: 'asc' }
                    }
                }
            });
            if (!hotel)
                return null;
            if ((options === null || options === void 0 ? void 0 : options.checkIn) && (options === null || options === void 0 ? void 0 : options.checkOut)) {
                hotel.rooms = this.enrichRoomsWithAvailability(hotel.rooms, options.checkIn, options.checkOut, options.guests || 1);
            }
            return this.transformSingleHotel(hotel);
        });
    }
    /**
     * Get single hotel details by ID with optional availability check
     */
    getHotelById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const hotel = yield prisma.hotel.findUnique({
                where: { id },
                include: {
                    images: true,
                    amenities: {
                        include: { amenity: true }
                    },
                    rooms: {
                        include: {
                            images: true,
                            features: true,
                            pricingPeriods: true,
                            bookings: ((options === null || options === void 0 ? void 0 : options.checkIn) && (options === null || options === void 0 ? void 0 : options.checkOut)) ? {
                                where: {
                                    status: { in: ['CONFIRMED', 'PENDING'] },
                                    checkIn: { lt: new Date(options.checkOut) },
                                    checkOut: { gt: new Date(options.checkIn) }
                                }
                            } : undefined
                        }
                    },
                    guestReviews: {
                        orderBy: { date: 'desc' },
                        take: 10
                    },
                    nearbyPlaces: {
                        orderBy: { sortOrder: 'asc' }
                    }
                }
            });
            if (!hotel)
                return null;
            if ((options === null || options === void 0 ? void 0 : options.checkIn) && (options === null || options === void 0 ? void 0 : options.checkOut)) {
                hotel.rooms = this.enrichRoomsWithAvailability(hotel.rooms, options.checkIn, options.checkOut, options.guests || 1);
            }
            return this.transformSingleHotel(hotel);
        });
    }
    /**
     * Helper to process rooms and add partial metadata
     */
    /**
     * Helper to process rooms and add partial metadata
     */
    enrichRoomsWithAvailability(rooms, checkIn, checkOut, guests) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        return rooms.map((room) => {
            // 1. Check Pricing Coverage
            const isPricingCovered = this.checkPricingCoverage(room.pricingPeriods, start, end);
            // 2. Check Physical Stock Availability
            const maxBooked = this.calculateMaxOccupancy(room.bookings || [], start, end);
            const isStockAvailable = (room.availableStock - maxBooked) > 0;
            // 3. Full Availability = Stock OK AND Pricing Fully Covered
            const isFullyAvailable = isStockAvailable && isPricingCovered.isFullyCovered;
            let partialMetadata = undefined;
            if (!isFullyAvailable) {
                // Calculate partial if not fully available (either due to stock OR pricing)
                partialMetadata = this.calculatePartialAvailability(room, start, end, isPricingCovered.dailyCoverage);
            }
            return Object.assign(Object.assign({}, room), { 
                // Keep the physical available count for display, even if partial
                availableStock: (room.availableStock - maxBooked) > 0 ? (room.availableStock - maxBooked) : 0, partialMetadata: partialMetadata });
        });
    }
    /**
     * Filter hotels by availability with Partial Match Logic 🧠
     */
    filterAvailableHotels(hotels, checkIn, checkOut, guests) {
        return hotels.map(hotel => {
            const start = new Date(checkIn);
            const end = new Date(checkOut);
            const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            if (nights <= 0)
                return null;
            // Process all rooms to find availability (Full or Partial)
            const availableRooms = hotel.rooms.map((room) => {
                if (room.capacity < guests)
                    return null;
                const maxBookedOnAnyDay = this.calculateMaxOccupancy(room.bookings, start, end);
                // [NEW] Check Pricing Coverage
                const isPricingCovered = this.checkPricingCoverage(room.pricingPeriods, start, end);
                // Fully available if stock > 0 AND pricing covers all days
                const isFullyAvailable = (room.availableStock - maxBookedOnAnyDay) > 0 && isPricingCovered.isFullyCovered;
                if (isFullyAvailable) {
                    return Object.assign(Object.assign({}, room), { isPartial: false // Full match
                     });
                }
                // If not fully available, check partial
                const partialData = this.calculatePartialAvailability(room, start, end, isPricingCovered.dailyCoverage);
                if (partialData) {
                    return Object.assign(Object.assign({}, room), { partialMetadata: partialData // Attach metadata
                     });
                }
                return null;
            }).filter(Boolean);
            if (availableRooms.length > 0) {
                // Determine if we should show the "Partial Availability" badge
                const hasPartialOptions = availableRooms.some((r) => r.partialMetadata);
                const lowestPrice = Math.min(...availableRooms.map((r) => r.price));
                return Object.assign(Object.assign({}, hotel), { rooms: availableRooms, availableRooms: availableRooms.length, displayPrice: lowestPrice, isPartial: hasPartialOptions, partialMatch: hasPartialOptions });
            }
            return null;
        }).filter(Boolean).map(this.transformSingleHotel); // Transform passes partialMetadata through
    }
    /**
     * Check if the date range is covered by pricing periods
     */
    checkPricingCoverage(periods, start, end) {
        if (!periods || periods.length === 0) {
            // No periods = use base price = fully covered
            return { isFullyCovered: true, dailyCoverage: new Map() };
        }
        const coverage = new Map();
        let curr = new Date(start);
        let allCovered = true;
        while (curr < end) {
            const dateStr = curr.toISOString().split('T')[0];
            const isCovered = periods.some(p => {
                const pStart = new Date(p.startDate);
                const pEnd = new Date(p.endDate);
                return curr >= pStart && curr <= pEnd;
            });
            if (!isCovered)
                allCovered = false;
            coverage.set(dateStr, isCovered);
            curr.setDate(curr.getDate() + 1);
        }
        return { isFullyCovered: allCovered, dailyCoverage: coverage };
    }
    /**
     * Calculate if a room is available for valid subset of dates
     */
    calculatePartialAvailability(room, start, end, pricingCoverage) {
        // 1. Map daily availability
        const dailyAvailability = new Map();
        let curr = new Date(start);
        // Init map with 0 booked
        while (curr < end) {
            dailyAvailability.set(curr.toISOString().split('T')[0], 0);
            curr.setDate(curr.getDate() + 1);
        }
        // Fill occupancy
        room.bookings.forEach((booking) => {
            let bStart = new Date(booking.checkIn);
            let bEnd = new Date(booking.checkOut);
            if (bStart < start)
                bStart = new Date(start);
            if (bEnd > end)
                bEnd = new Date(end);
            let d = new Date(bStart);
            while (d < bEnd) {
                const k = d.toISOString().split('T')[0];
                if (dailyAvailability.has(k)) {
                    dailyAvailability.set(k, (dailyAvailability.get(k) || 0) + (booking.roomCount || 1));
                }
                d.setDate(d.getDate() + 1);
            }
        });
        // 2. Find longest contiguous available streak
        let maxStreak = 0;
        let currentStreak = 0;
        let streakStart = null;
        let bestStart = null;
        const sortedDates = Array.from(dailyAvailability.keys()).sort();
        for (const date of sortedDates) {
            const booked = dailyAvailability.get(date) || 0;
            const isStockAvailable = (room.availableStock - booked) > 0;
            // Check Pricing Coverage if provided
            const isPricingOk = pricingCoverage && pricingCoverage.size > 0 ? pricingCoverage.get(date) : true;
            const isAvailable = isStockAvailable && isPricingOk;
            if (isAvailable) {
                if (currentStreak === 0)
                    streakStart = new Date(date);
                currentStreak++;
            }
            else {
                if (currentStreak > maxStreak) {
                    maxStreak = currentStreak;
                    bestStart = streakStart;
                }
                currentStreak = 0;
                streakStart = null;
            }
        }
        // Final check for streak at the end
        if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
            bestStart = streakStart;
        }
        const totalNights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        if (maxStreak > 0 && maxStreak < totalNights) {
            const availableFrom = bestStart ? bestStart.toISOString().split('T')[0] : '';
            // availableTo is start + maxStreak
            const availableToDate = bestStart ? new Date(bestStart.getTime()) : new Date();
            if (bestStart)
                availableToDate.setDate(availableToDate.getDate() + maxStreak); // Add days
            const availableTo = availableToDate.toISOString().split('T')[0];
            return {
                isPartial: true,
                availableFrom,
                availableTo,
                availableNightsCount: maxStreak,
                totalPrice: room.price * maxStreak, // Approximate
                avgPrice: room.price
            };
        }
        return null;
    }
    calculateMaxOccupancy(bookings, start, end) {
        // Create a day-by-day map
        const occupancy = new Map();
        let max = 0;
        bookings.forEach((booking) => {
            let curr = new Date(booking.checkIn < start ? start : booking.checkIn);
            const bEnd = new Date(booking.checkOut > end ? end : booking.checkOut);
            while (curr < bEnd) {
                const key = curr.toISOString().split('T')[0];
                const count = (occupancy.get(key) || 0) + (booking.roomCount || 1);
                occupancy.set(key, count);
                if (count > max)
                    max = count;
                curr.setDate(curr.getDate() + 1);
            }
        });
        return max;
    }
    /**
     * Check if a hotel has any bookable rooms
     * A room is bookable if:
     * 1. It exists
     * 2. It has availableStock > 0
     * 3. It has at least one valid (non-expired) pricing period, or no pricing periods (uses base price)
     */
    hasBookableRooms(hotel) {
        // No rooms at all
        if (!hotel.rooms || hotel.rooms.length === 0) {
            return false;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Check if at least one room is bookable
        return hotel.rooms.some((room) => {
            // Room must have stock
            if (room.availableStock <= 0) {
                return false;
            }
            // If room has pricing periods, at least one must be valid (not expired)
            if (room.pricingPeriods && room.pricingPeriods.length > 0) {
                const hasValidPricing = room.pricingPeriods.some((period) => {
                    const endDate = new Date(period.endDate);
                    return endDate >= today;
                });
                return hasValidPricing;
            }
            // No pricing periods = uses base price, room is bookable
            return true;
        });
    }
    /**
     * Transform Prisma result to API response format
     */
    transformHotels(hotels) {
        return hotels.map(hotel => this.transformSingleHotel(hotel)); // Fix context binding
    }
    transformSingleHotel(hotel) {
        // Flatten structure for frontend compatibility
        // The frontend expects amenities as string[] and images as specific array
        var _a, _b, _c, _d, _e;
        // Calculate minimum room price for display
        let displayPrice = hotel.displayPrice || hotel.basePrice;
        if (hotel.rooms && hotel.rooms.length > 0) {
            const roomPrices = hotel.rooms
                .filter((r) => r.price > 0)
                .map((r) => r.price);
            if (roomPrices.length > 0) {
                displayPrice = Math.min(...roomPrices);
            }
        }
        return {
            id: hotel.id,
            slug: hotel.slug,
            name: hotel.name,
            nameEn: hotel.nameEn,
            location: hotel.location,
            city: hotel.city,
            country: hotel.country,
            rating: hotel.rating,
            reviews: hotel.reviews,
            basePrice: displayPrice, // Use minimum room price
            image: hotel.image || ((_b = (_a = hotel.images) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.url), // [FIX] Prefer explicit cover image, fallback to gallery
            // Map relations to flat arrays if needed by frontend
            images: hotel.images ? hotel.images.map((img) => img.url) : [],
            amenities: ((_c = hotel.amenities) === null || _c === void 0 ? void 0 : _c.map((a) => { var _a; return ((_a = a.amenity) === null || _a === void 0 ? void 0 : _a.name) || a.amenityId; })) || [],
            description: hotel.description,
            isFeatured: hotel.isFeatured,
            isOffer: hotel.isOffer,
            discount: hotel.discount,
            isPartial: hotel.isPartial, // [FIX] Pass partial status
            partialMatch: hotel.partialMatch, // [FIX] Pass partial status
            rooms: hotel.rooms ? hotel.rooms.map((room) => {
                var _a, _b;
                return (Object.assign(Object.assign({}, room), { features: ((_a = room.features) === null || _a === void 0 ? void 0 : _a.map((f) => f.name)) || [], images: ((_b = room.images) === null || _b === void 0 ? void 0 : _b.map((i) => i.url)) || [] }));
            }) : [],
            guestReviews: hotel.guestReviews ? hotel.guestReviews.map((r) => ({
                id: r.id,
                userName: r.userName,
                rating: r.rating,
                text: r.text,
                date: r.date, // Date is already a string in Schema
            })) : [],
            nearbyLandmarks: hotel.nearbyPlaces ? hotel.nearbyPlaces.map((p) => ({
                name: p.name,
                distance: p.distance,
                icon: p.icon,
                type: p.type
            })) : [],
            distanceFromHaram: hotel.distanceFromHaram,
            distance: hotel.distanceFromHaram, // Alias for frontend
            view: hotel.view,
            hasFreeTransport: hotel.hasFreeTransport,
            hasFreeBreakfast: hotel.hasFreeBreakfast,
            isVisible: hotel.isVisible,
            extraBedStock: hotel.extraBedStock,
            coords: hotel.coords ? [
                parseFloat(hotel.coords.split(',')[0]) || 21.4225,
                parseFloat(hotel.coords.split(',')[1]) || 39.8262
            ] : [21.4225, 39.8262],
            lat: ((_d = hotel.coords) === null || _d === void 0 ? void 0 : _d.split(',')[0]) || '21.4225',
            lng: ((_e = hotel.coords) === null || _e === void 0 ? void 0 : _e.split(',')[1]) || '39.8262'
        };
    }
    /**
     * Delete a hotel and all its relations
     */
    deleteHotel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Use transaction to ensure clean delete if needed, though cascade might handle it.
            // Prisma relies on foreign keys for cascade usually, but explicit is safer.
            return yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Delete relations first (optional if cascade is set in schema, but good practice)
                yield tx.room.deleteMany({ where: { hotelId: id } });
                yield tx.review.deleteMany({ where: { hotelId: id } });
                // Delete hotel
                return yield tx.hotel.delete({ where: { id } });
            }));
        });
    }
    /**
     * Create a new hotel
     */
    createHotel(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // [FIX] Convert coords array [lat, lng] to string "lat,lng" for DB
            let coordsString = "21.4225,39.8262";
            if (Array.isArray(data.coords) && data.coords.length === 2) {
                coordsString = `${data.coords[0]},${data.coords[1]}`;
            }
            // Generate slug if not provided
            const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();
            return yield prisma.hotel.create({
                data: {
                    name: data.name,
                    nameEn: data.nameEn || data.name,
                    slug: slug,
                    location: data.location,
                    locationEn: data.locationEn || data.location,
                    city: data.city,
                    country: data.country || 'SA',
                    rating: Number(data.rating) || 0,
                    reviews: Number(data.reviews) || 0,
                    basePrice: Number(data.basePrice) || 0,
                    image: data.image || '',
                    coords: coordsString,
                    description: data.description || '',
                    isOffer: data.isOffer || false,
                    isFeatured: data.isFeatured || false,
                    discount: data.discount || null,
                    distanceFromHaram: data.distanceFromHaram || null,
                    view: data.view || null,
                    hasFreeBreakfast: data.hasFreeBreakfast || false,
                    hasFreeTransport: data.hasFreeTransport || false,
                    extraBedStock: Number(data.extraBedStock) || 0,
                    isVisible: data.isVisible !== undefined ? data.isVisible : true
                }
            });
        });
    }
    /**
     * Update an existing hotel
     */
    updateHotel(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // [FIX] Convert coords array [lat, lng] to string "lat,lng" for DB
            let updateData = Object.assign({}, data);
            if (Array.isArray(data.coords) && data.coords.length === 2) {
                updateData.coords = `${data.coords[0]},${data.coords[1]}`;
            }
            // Convert types for safety
            if (data.rating !== undefined)
                updateData.rating = Number(data.rating);
            if (data.reviews !== undefined)
                updateData.reviews = Number(data.reviews);
            if (data.basePrice !== undefined)
                updateData.basePrice = Number(data.basePrice);
            if (data.extraBedStock !== undefined)
                updateData.extraBedStock = Number(data.extraBedStock);
            // Extract gallery and amenities for relation update
            const gallery = updateData.gallery;
            const amenities = updateData.amenities;
            // Sanitize relations that shouldn't be updated directly via this method
            delete updateData.id;
            delete updateData.rooms;
            delete updateData.amenities;
            delete updateData.images;
            delete updateData.guestReviews;
            delete updateData.nearbyPlaces;
            delete updateData.gallery; // Remove gallery to avoid Prisma unknown field error
            return yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // 1. Update Hotel Basic Info (including cover image 'image')
                const updatedHotel = yield tx.hotel.update({
                    where: { id },
                    data: updateData
                });
                // 2. Update Gallery Images if provided
                if (gallery && Array.isArray(gallery)) {
                    // Delete old images
                    yield tx.hotelImage.deleteMany({ where: { hotelId: id } });
                    // Insert new images
                    if (gallery.length > 0) {
                        yield tx.hotelImage.createMany({
                            data: gallery.map((url) => ({
                                hotelId: id,
                                url: url,
                                isMain: false // Main is stored in Hotel.image
                            }))
                        });
                    }
                }
                // 3. Update Amenities if provided
                if (amenities && Array.isArray(amenities)) {
                    // Delete old hotel amenities
                    yield tx.hotelAmenity.deleteMany({ where: { hotelId: id } });
                    // Insert new amenities
                    for (const amenityName of amenities) {
                        // Ensure amenity exists to get its ID (robust against missing seeds)
                        const amenityObj = yield tx.amenity.upsert({
                            where: { name: amenityName },
                            create: {
                                name: amenityName,
                                nameEn: amenityName.charAt(0).toUpperCase() + amenityName.slice(1)
                            },
                            update: {}
                        });
                        // Create the relation
                        yield tx.hotelAmenity.create({
                            data: {
                                hotelId: id,
                                amenityId: amenityObj.id
                            }
                        });
                    }
                }
                return updatedHotel;
            }));
        });
    }
    /**
     * Toggle Hotel Visibility
     */
    toggleVisibility(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const hotel = yield prisma.hotel.findUnique({ where: { id }, select: { isVisible: true } });
            if (!hotel)
                throw new Error('Hotel not found');
            return yield prisma.hotel.update({
                where: { id },
                data: { isVisible: !hotel.isVisible },
                select: { id: true, isVisible: true } // minimal select
            });
        });
    }
    /**
     * Toggle Featured Status
     */
    toggleFeatured(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const hotel = yield prisma.hotel.findUnique({ where: { id }, select: { isFeatured: true } });
            if (!hotel)
                throw new Error('Hotel not found');
            return yield prisma.hotel.update({
                where: { id },
                data: { isFeatured: !hotel.isFeatured },
                select: { id: true, isFeatured: true }
            });
        });
    }
}
exports.HotelService = HotelService;
