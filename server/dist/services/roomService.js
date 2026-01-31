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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class RoomService {
    /**
     * Create a room for a specific hotel
     */
    createRoom(hotelId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { images, features, pricingPeriods } = data, roomData = __rest(data, ["images", "features", "pricingPeriods"]);
            return yield prisma.room.create({
                data: Object.assign(Object.assign({}, roomData), { hotelId, price: Number(roomData.price) || 0, capacity: Number(roomData.capacity) || 2, availableStock: Number(roomData.availableStock) || 10, extraBedPrice: Number(roomData.extraBedPrice) || 0, maxExtraBeds: Number(roomData.maxExtraBeds) || 1, area: roomData.area ? Number(roomData.area) : null, images: images ? {
                        create: images.map((url) => ({ url }))
                    } : undefined, features: features ? {
                        create: features.map((name) => ({ name }))
                    } : undefined, pricingPeriods: pricingPeriods ? {
                        create: pricingPeriods.map((p) => ({
                            startDate: new Date(p.startDate),
                            endDate: new Date(p.endDate),
                            price: Number(p.price)
                        }))
                    } : undefined }),
                include: {
                    images: true,
                    features: true,
                    pricingPeriods: true
                }
            });
        });
    }
    /**
     * Update an existing room
     */
    updateRoom(roomId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { images, features, pricingPeriods, id, hotelId } = data, roomData = __rest(data, ["images", "features", "pricingPeriods", "id", "hotelId"]);
            // Perform updates in a transaction for atomicity
            return yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // 1. Update basic fields
                const updatedRoom = yield tx.room.update({
                    where: { id: roomId },
                    data: Object.assign(Object.assign({}, roomData), { price: roomData.price !== undefined ? Number(roomData.price) : undefined, capacity: roomData.capacity !== undefined ? Number(roomData.capacity) : undefined, availableStock: roomData.availableStock !== undefined ? Number(roomData.availableStock) : undefined, extraBedPrice: roomData.extraBedPrice !== undefined ? Number(roomData.extraBedPrice) : undefined, maxExtraBeds: roomData.maxExtraBeds !== undefined ? Number(roomData.maxExtraBeds) : undefined, area: roomData.area !== undefined ? (roomData.area ? Number(roomData.area) : null) : undefined })
                });
                // 2. Sync Images if provided
                if (images) {
                    yield tx.roomImage.deleteMany({ where: { roomId } });
                    if (images.length > 0) {
                        yield tx.roomImage.createMany({
                            data: images.map((url) => ({ url, roomId }))
                        });
                    }
                }
                // 3. Sync Features if provided
                if (features) {
                    yield tx.roomFeature.deleteMany({ where: { roomId } });
                    if (features.length > 0) {
                        yield tx.roomFeature.createMany({
                            data: features.map((name) => ({ name, roomId }))
                        });
                    }
                }
                // 4. Sync Pricing Periods if provided
                if (pricingPeriods) {
                    yield tx.pricingPeriod.deleteMany({ where: { roomId } });
                    if (pricingPeriods.length > 0) {
                        yield tx.pricingPeriod.createMany({
                            data: pricingPeriods.map((p) => ({
                                roomId,
                                startDate: new Date(p.startDate),
                                endDate: new Date(p.endDate),
                                price: Number(p.price)
                            }))
                        });
                    }
                }
                return yield tx.room.findUnique({
                    where: { id: roomId },
                    include: {
                        images: true,
                        features: true,
                        pricingPeriods: true
                    }
                });
            }));
        });
    }
    /**
     * Delete a room
     */
    deleteRoom(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.room.delete({
                where: { id }
            });
        });
    }
}
exports.RoomService = RoomService;
