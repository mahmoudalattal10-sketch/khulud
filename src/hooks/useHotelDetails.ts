/**
 * =========================================================
 * 🏨 useHotelDetails Hook - Single Hotel Details Integration
 * =========================================================
 * Fetches a single hotel with its rooms from the API
 * =========================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { HotelsAPI, Hotel, Room } from '../services/api';

interface UseHotelDetailsReturn {
    hotel: Hotel | null;
    rooms: Room[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useHotelDetails = (idOrSlug: string | undefined, queryParams?: { checkIn?: Date | null; checkOut?: Date | null; guests?: number }): UseHotelDetailsReturn => {
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Helpers
    const tryParse = (str: unknown): any[] => {
        if (!str) return [];
        if (Array.isArray(str)) return str;
        if (typeof str === 'string') {
            try { return JSON.parse(str); } catch (e) { return []; }
        }
        return [];
    };

    const fetchHotel = useCallback(async () => {
        if (!idOrSlug) {
            setError('معرف الفندق غير صالح');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        // Prepare API params
        const apiParams: Parameters<typeof HotelsAPI.getBySlug>[1] = {};
        if (queryParams?.checkIn) apiParams.checkIn = queryParams.checkIn.toISOString();
        if (queryParams?.checkOut) apiParams.checkOut = queryParams.checkOut.toISOString();
        if (queryParams?.guests) apiParams.guests = queryParams.guests;

        try {
            // Priority 1: Try fetching by Slug
            let response = await HotelsAPI.getBySlug(idOrSlug, apiParams);

            // Priority 2: Try ID fallbacks...
            if (!response.success || !response.data) {
                const idResponse = await HotelsAPI.getById(idOrSlug, apiParams);
                if (idResponse.success && idResponse.data) {
                    response = idResponse;
                }
            }

            if (response.success && response.data) {
                // ... (Parsing logic remains the same, assuming safeHotel structure matches)
                const rawHotel = response.data;
                const safeHotel: Hotel = {
                    ...rawHotel,
                    amenities: Array.isArray(rawHotel.amenities) ? rawHotel.amenities : typeof rawHotel.amenities === 'string' ? (tryParse(rawHotel.amenities) || []) : [],
                    images: Array.isArray(rawHotel.images) ? rawHotel.images : typeof rawHotel.images === 'string' ? (tryParse(rawHotel.images) || []) : [],
                    coords: (Array.isArray(rawHotel.coords) && rawHotel.coords.length === 2) ? rawHotel.coords : [21.4225, 39.8262],
                    basePrice: Number(rawHotel.basePrice) || 0,
                    rating: Number(rawHotel.rating) || 5,
                    id: String(rawHotel.id),
                    rooms: Array.isArray(rawHotel.rooms) ? rawHotel.rooms.map(room => ({
                        ...room,
                        pricingPeriods: Array.isArray(room.pricingPeriods) ? room.pricingPeriods : (tryParse(room.pricingPeriods as unknown) || []),
                        features: Array.isArray(room.features) ? room.features : (tryParse(room.features as unknown) || []),
                        images: Array.isArray(room.images) ? room.images : (tryParse(room.images as unknown) || []),
                        // @ts-ignore - amenities might be missing in APIRoom but added here
                        amenities: Array.isArray((room as any).amenities) ? (room as any).amenities : (tryParse((room as any).amenities) || [])
                    })) : []
                };

                setHotel(safeHotel);
                setRooms(safeHotel.rooms);
            } else {
                setError(response.error || 'فشل في تحميل بيانات الفندق');
            }
        } catch (err) {
            setError('حدث خطأ في الاتصال بالخادم');
        } finally {
            setLoading(false);
        }
    }, [idOrSlug, queryParams?.checkIn, queryParams?.checkOut, queryParams?.guests]);

    useEffect(() => {
        fetchHotel();
    }, [fetchHotel]);

    return {
        hotel,
        rooms,
        loading,
        error,
        refetch: fetchHotel,
    };
};

export default useHotelDetails;
