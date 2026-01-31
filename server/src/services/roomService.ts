import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RoomService {
    /**
     * Create a room for a specific hotel
     */
    async createRoom(hotelId: string, data: any) {
        const { images, features, pricingPeriods, ...roomData } = data;

        return await prisma.room.create({
            data: {
                ...roomData,
                hotelId,
                price: Number(roomData.price) || 0,
                capacity: Number(roomData.capacity) || 2,
                availableStock: Number(roomData.availableStock) || 10,
                extraBedPrice: Number(roomData.extraBedPrice) || 0,
                maxExtraBeds: Number(roomData.maxExtraBeds) || 1,
                area: roomData.area ? Number(roomData.area) : null,
                images: images ? {
                    create: images.map((url: string) => ({ url }))
                } : undefined,
                features: features ? {
                    create: features.map((name: string) => ({ name }))
                } : undefined,
                pricingPeriods: pricingPeriods ? {
                    create: pricingPeriods.map((p: any) => ({
                        startDate: new Date(p.startDate),
                        endDate: new Date(p.endDate),
                        price: Number(p.price)
                    }))
                } : undefined
            },
            include: {
                images: true,
                features: true,
                pricingPeriods: true
            }
        });
    }

    /**
     * Update an existing room
     */
    async updateRoom(roomId: string, data: any) {
        const { images, features, pricingPeriods, id, hotelId, ...roomData } = data;

        // Perform updates in a transaction for atomicity
        return await prisma.$transaction(async (tx) => {
            // 1. Update basic fields
            const updatedRoom = await tx.room.update({
                where: { id: roomId },
                data: {
                    ...roomData,
                    price: roomData.price !== undefined ? Number(roomData.price) : undefined,
                    capacity: roomData.capacity !== undefined ? Number(roomData.capacity) : undefined,
                    availableStock: roomData.availableStock !== undefined ? Number(roomData.availableStock) : undefined,
                    extraBedPrice: roomData.extraBedPrice !== undefined ? Number(roomData.extraBedPrice) : undefined,
                    maxExtraBeds: roomData.maxExtraBeds !== undefined ? Number(roomData.maxExtraBeds) : undefined,
                    area: roomData.area !== undefined ? (roomData.area ? Number(roomData.area) : null) : undefined,
                }
            });

            // 2. Sync Images if provided
            if (images) {
                await tx.roomImage.deleteMany({ where: { roomId } });
                if (images.length > 0) {
                    await tx.roomImage.createMany({
                        data: images.map((url: string) => ({ url, roomId }))
                    });
                }
            }

            // 3. Sync Features if provided
            if (features) {
                await tx.roomFeature.deleteMany({ where: { roomId } });
                if (features.length > 0) {
                    await tx.roomFeature.createMany({
                        data: features.map((name: string) => ({ name, roomId }))
                    });
                }
            }

            // 4. Sync Pricing Periods if provided
            if (pricingPeriods) {
                await tx.pricingPeriod.deleteMany({ where: { roomId } });
                if (pricingPeriods.length > 0) {
                    await tx.pricingPeriod.createMany({
                        data: pricingPeriods.map((p: any) => ({
                            roomId,
                            startDate: new Date(p.startDate),
                            endDate: new Date(p.endDate),
                            price: Number(p.price)
                        }))
                    });
                }
            }

            return await tx.room.findUnique({
                where: { id: roomId },
                include: {
                    images: true,
                    features: true,
                    pricingPeriods: true
                }
            });
        });
    }

    /**
     * Delete a room
     */
    async deleteRoom(id: string) {
        return await prisma.room.delete({
            where: { id }
        });
    }
}
