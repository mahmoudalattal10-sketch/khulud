/**
 * =========================================================
 * 🎛️ useAdminHotels Hook - Admin Dashboard Integration
 * =========================================================
 * A specialized hook for the Admin Dashboard with CRUD operations.
 * Connects to the live backend API for real-time data management.
 * =========================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { HotelsAPI, RoomsAPI, ReviewsAPI, Hotel, Room as APIRoom } from '../services/api';
import { AdminHotel, Room, Review } from '../adminTypes';

// Meal plan type for safe transformation
type MealPlanType = 'none' | 'breakfast' | 'half_board' | 'full_board' | 'all_inclusive';
const VALID_MEAL_PLANS: MealPlanType[] = ['none', 'breakfast', 'half_board', 'full_board', 'all_inclusive'];

const toMealPlan = (value: string): MealPlanType => {
    return VALID_MEAL_PLANS.includes(value as MealPlanType) ? (value as MealPlanType) : 'breakfast';
};

// Helper for safe JSON parsing
const tryParse = (str: unknown): any[] => {
    if (!str) return [];
    if (Array.isArray(str)) return str;
    if (typeof str === 'string') {
        try { return JSON.parse(str); } catch (e) { return []; }
    }
    return [];
};

// Transform API Hotel to Admin Hotel format
const transformToAdminHotel = (hotel: Hotel): AdminHotel => ({
    id: hotel.id,
    name: hotel.name,
    city: hotel.city || 'makkah',
    country: hotel.country || 'SA',
    location: hotel.location,
    description: hotel.description,
    rating: hotel.rating,
    rooms: (hotel.rooms || []).map(r => ({
        id: r.id,
        name: r.name,
        type: r.type,
        capacity: r.capacity,
        available: r.availableStock,
        price: r.price,
        mealPlan: toMealPlan(r.mealPlan),
        area: r.area || 0,
        beds: r.beds || '',
        view: r.view || '',
        images: Array.isArray(r.images)
            ? r.images.map((img: any) => typeof img === 'object' && img.url ? img.url : img)
            : (tryParse(r.images) || []),
        pricingPeriods: (Array.isArray(r.pricingPeriods) ? r.pricingPeriods : (tryParse(r.pricingPeriods) || [])).map((p: any) => ({
            ...p,
            startDate: typeof p.startDate === 'string' ? p.startDate.split('T')[0] : p.startDate,
            endDate: typeof p.endDate === 'string' ? p.endDate.split('T')[0] : p.endDate
        })),
        amenities: Array.isArray(r.features)
            ? r.features.map((f: any) => typeof f === 'object' && f.name ? f.name : f)
            : (tryParse(r.features) || []),
        sofa: r.sofa || false,
        allowExtraBed: r.allowExtraBed || false,
        extraBedPrice: r.extraBedPrice || 0,
        maxExtraBeds: r.maxExtraBeds || 1
    })),
    reviews: (hotel.guestReviews || []).map(r => ({
        id: r.id,
        user: r.userName,
        comment: r.text,
        rating: r.rating,
        date: r.date
    })),
    amenities: hotel.amenities,
    gallery: hotel.images || [],
    price: hotel.basePrice || 0,
    image: hotel.image || '',
    isVisible: hotel.isVisible !== undefined ? hotel.isVisible : true,
    // [Improved Parsing] Handle both array and string (comma-separated) from API
    lat: (() => {
        const h = hotel as any;
        if (h.lat) return String(h.lat);
        const coords = hotel.coords as unknown;
        if (Array.isArray(coords) && coords.length >= 2) return String(coords[0]);
        if (typeof coords === 'string' && coords.includes(',')) return coords.split(',')[0].trim();
        return '21.4225';
    })(),
    lng: (() => {
        const h = hotel as any;
        if (h.lng) return String(h.lng);
        const coords = hotel.coords as unknown;
        if (Array.isArray(coords) && coords.length >= 2) return String(coords[1]);
        if (typeof coords === 'string' && coords.includes(',')) return coords.split(',')[1].trim();
        return '39.8262';
    })(),
    mapQuery: hotel.nameEn,
    summary: undefined,
    view: hotel.view || undefined,
    distanceFromHaram: hotel.distanceFromHaram || '',
    distance: hotel.distanceFromHaram || '',
    hasFreeTransport: hotel.hasFreeTransport || false,
    hasFreeBreakfast: hotel.hasFreeBreakfast || false,
    isFeatured: hotel.isFeatured || false,
    extraBedStock: hotel.extraBedStock || 0,
    isOffer: hotel.isOffer || false,
    discount: hotel.discount || null,
    reviewsCount: hotel.reviews || 0,
    _rawCoords: (hotel as any).coords
});

// Transform Admin Hotel back to API format
const transformToAPIHotel = (hotel: AdminHotel): any => ({
    id: String(hotel.id), // Convert to string for API
    name: hotel.name,
    nameEn: hotel.mapQuery || hotel.name,
    location: hotel.location,
    locationEn: hotel.location,
    city: hotel.city,
    country: hotel.country,
    description: hotel.description,
    rating: hotel.rating,
    basePrice: hotel.price,
    image: hotel.image,
    gallery: hotel.gallery, // [FIX] Send as 'gallery' to match backend service expectation
    coords: [parseFloat(String(hotel.lat)) || 0, parseFloat(String(hotel.lng)) || 0] as [number, number],
    amenities: hotel.amenities,
    view: hotel.view,
    distanceFromHaram: (hotel.distance || hotel.distanceFromHaram || '').trim(),
    hasFreeTransport: hotel.hasFreeTransport,
    hasFreeBreakfast: hotel.hasFreeBreakfast,
    extraBedStock: hotel.extraBedStock,
    isFeatured: hotel.isFeatured ?? false,
    isVisible: hotel.isVisible ?? true,
    isOffer: hotel.isOffer ?? false,
    discount: hotel.discount,
    reviews: hotel.reviewsCount || 0
});

interface UseAdminHotelsReturn {
    hotels: AdminHotel[];
    loading: boolean;
    error: string | null;
    saving: boolean;
    refetch: () => Promise<void>;
    saveHotel: (hotel: AdminHotel) => Promise<{ success: boolean; error?: string }>;
    deleteHotel: (id: string) => Promise<boolean>;
    createHotel: (hotel: Partial<AdminHotel>) => Promise<AdminHotel | null>;
    updateRoom: (hotelId: string, roomId: string, roomData: Partial<Room>) => Promise<{ success: boolean; error?: string }>;
    deleteRoom: (roomId: string) => Promise<boolean>;
    createRoom: (hotelId: string, roomData: Partial<Room>) => Promise<boolean>;
    createReview: (review: Partial<Review> & { hotelId: string }) => Promise<boolean>;
    deleteReview: (reviewId: string) => Promise<boolean>;
    toggleVisibility: (id: string) => Promise<boolean>;
    toggleFeatured: (id: string) => Promise<boolean>;
}

export function useAdminHotels(): UseAdminHotelsReturn {
    const [hotels, setHotels] = useState<AdminHotel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchHotels = useCallback(async () => {
        setLoading(true);
        setError(null);

        const response = await HotelsAPI.getAll({ adminView: true });

        if (response.success && response.data) {
            setHotels(response.data.map(transformToAdminHotel));
        } else {
            setError(response.error || 'Failed to fetch hotels');
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        fetchHotels();
    }, [fetchHotels]);

    const saveHotel = useCallback(async (hotel: AdminHotel): Promise<{ success: boolean; error?: string }> => {
        setSaving(true);
        const apiData = transformToAPIHotel(hotel);

        // 1. Update Hotel main record
        const hotelResponse = await HotelsAPI.update(String(hotel.id), apiData);

        if (!hotelResponse.success) {
            setSaving(false);
            return { success: false, error: hotelResponse.error };
        }

        // 1.5. Synchronize Room Deletions
        const currentHotel = hotels.find(h => h.id === hotel.id);
        if (currentHotel) {
            const currentRoomIds = (currentHotel.rooms || []).map(r => r.id).filter(Boolean);
            const updatedRoomIds = (hotel.rooms || []).map(r => r.id).filter(Boolean);
            const roomsToDelete = currentRoomIds.filter(id => !updatedRoomIds.includes(id));

            for (const roomId of roomsToDelete) {
                await RoomsAPI.delete(roomId as string);
            }
        }

        // 2. Synchronize Rooms (Update or Create)
        for (const room of hotel.rooms) {
            const apiRoomData = {
                name: room.name,
                type: room.type,
                capacity: room.capacity,
                price: room.price,
                availableStock: room.available,
                mealPlan: room.mealPlan,
                view: room.view,
                area: room.area,
                features: room.amenities,
                images: room.images,
                beds: room.beds,
                sofa: room.sofa,
                pricingPeriods: room.pricingPeriods || [],
                allowExtraBed: room.allowExtraBed || false,
                extraBedPrice: room.extraBedPrice || 0,
                maxExtraBeds: room.maxExtraBeds || 1
            };

            let roomResponse;
            if (room.id) {
                // Update existing room
                roomResponse = await RoomsAPI.update(room.id, apiRoomData as any);
            } else {
                // Create new room
                roomResponse = await RoomsAPI.create(String(hotel.id), apiRoomData as any);
            }

            if (!roomResponse.success) {
                console.error(`Failed to sync room ${room.name}:`, roomResponse.error);
                setSaving(false);
                return { success: false, error: `فشل تحديث الغرفة "${room.name}": ${roomResponse.error}` };
            }
        }

        // 3. Optional: Delete rooms not in the current list?
        // (For now, we assume explicit deletion from the UI handles this)

        setSaving(false);
        await fetchHotels(); // Refresh to get final state from DB
        return { success: true };
    }, [fetchHotels, hotels]);

    const deleteHotel = useCallback(async (id: string): Promise<boolean> => {
        const response = await HotelsAPI.delete(id);

        if (response.success) {
            setHotels(prev => prev.filter(h => h.id !== id));
            return true;
        }

        return false;
    }, []);

    const createHotel = useCallback(async (hotelData: Partial<AdminHotel>): Promise<AdminHotel | null> => {
        setSaving(true);

        // Prepare minimal data for creation
        const apiData = {
            name: hotelData.name || 'فندق جديد',
            nameEn: hotelData.mapQuery || 'New Hotel',
            location: hotelData.location || 'مكة المكرمة',
            locationEn: 'Makkah',
            city: hotelData.city || 'makkah',
            country: hotelData.country || 'SA', // [FIX] Include country
            description: hotelData.description || '',
            rating: hotelData.rating || 5,
            basePrice: hotelData.price || 500,
            image: hotelData.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000',
            gallery: hotelData.gallery || [],
            coords: [parseFloat(String(hotelData.lat || '21.4189')), parseFloat(String(hotelData.lng || '39.8262'))],
            amenities: hotelData.amenities || [],
            view: hotelData.view || '', // [FIX] Include view
            reviews: 0,
            isOffer: false,
            hasFreeBreakfast: hotelData.hasFreeBreakfast || false, // [FIX] Correctly map hasFreeBreakfast
            hasFreeTransport: hotelData.hasFreeTransport || false, // [FIX] Correctly map hasFreeTransport
        };

        const response = await HotelsAPI.create(apiData as any);

        if (response.success && response.data) {
            const newHotelId = response.data.id;

            // If rooms are provided, create them
            if (hotelData.rooms && hotelData.rooms.length > 0) {
                for (const room of hotelData.rooms) {
                    const apiRoomData = {
                        name: room.name || 'غرفة جديدة',
                        type: room.type || 'double',
                        capacity: room.capacity || 2,
                        price: room.price || 500,
                        availableStock: room.available || 5,
                        mealPlan: room.mealPlan || 'breakfast',
                        view: room.view || 'City View',
                        area: room.area || 30,
                        features: room.amenities || [],
                        images: room.images || [],
                        pricingPeriods: room.pricingPeriods || [],
                        allowExtraBed: room.allowExtraBed || false,
                        extraBedPrice: room.extraBedPrice || 0,
                        maxExtraBeds: room.maxExtraBeds || 1
                    };
                    await RoomsAPI.create(newHotelId, apiRoomData as any);
                }
            }

            // Fetch the full hotel with rooms to ensure we have everything back
            const fullHotelResponse = await HotelsAPI.getById(newHotelId);
            if (fullHotelResponse.success && fullHotelResponse.data) {
                const newAdminHotel = transformToAdminHotel(fullHotelResponse.data);
                setHotels(prev => [...prev, newAdminHotel]);
                setSaving(false);
                return newAdminHotel;
            }
        }

        setSaving(false);
        return null;
    }, []);

    const updateRoom = useCallback(async (hotelId: string, roomId: string, roomData: Partial<Room>): Promise<{ success: boolean; error?: string }> => {
        const apiRoomData = {
            hotelId, // Ensure hotelId is present
            name: roomData.name,
            type: roomData.type,
            capacity: roomData.capacity,
            price: roomData.price,
            availableStock: roomData.available,
            mealPlan: roomData.mealPlan,
            view: roomData.view,
            area: roomData.area,
            features: roomData.amenities,
            images: roomData.images,
            pricingPeriods: roomData.pricingPeriods,
            allowExtraBed: roomData.allowExtraBed,
            extraBedPrice: roomData.extraBedPrice,
            maxExtraBeds: roomData.maxExtraBeds,
        };

        const response = await RoomsAPI.update(roomId, apiRoomData as any);

        if (response.success) {
            await fetchHotels(); // Refresh data
            return { success: true };
        }

        return { success: false, error: response.error };
    }, [fetchHotels]);

    const deleteRoom = useCallback(async (roomId: string): Promise<boolean> => {
        const response = await RoomsAPI.delete(roomId);

        if (response.success) {
            await fetchHotels();
            return true;
        }

        return false;
    }, [fetchHotels]);

    const createRoom = useCallback(async (hotelId: string, roomData: Partial<Room>): Promise<boolean> => {
        const apiRoomData = {
            name: roomData.name || 'غرفة جديدة',
            type: roomData.type || 'double',
            capacity: roomData.capacity || 2,
            price: roomData.price || 500,
            availableStock: roomData.available || 5,
            mealPlan: roomData.mealPlan || 'breakfast',
            view: roomData.view || 'City View',
            area: roomData.area || 30,
            features: roomData.amenities || [],
            images: roomData.images || [],
            pricingPeriods: roomData.pricingPeriods || [],
            allowExtraBed: roomData.allowExtraBed || false,
            extraBedPrice: roomData.extraBedPrice || 0,
            maxExtraBeds: roomData.maxExtraBeds || 1
        };

        const response = await RoomsAPI.create(hotelId, apiRoomData as any);

        if (response.success) {
            await fetchHotels();
            return true;
        }

        return false;
    }, [fetchHotels]);

    // NEW: Review Operations
    const createReview = useCallback(async (review: Partial<Review> & { hotelId: string }): Promise<boolean> => {
        const apiReviewData = {
            hotelId: review.hotelId,
            userName: review.user,
            rating: review.rating,
            text: review.comment,
            date: review.date,
        };

        const response = await ReviewsAPI.create(apiReviewData as any);
        if (response.success) {
            await fetchHotels(); // Refresh to see new review
            return true;
        }
        return false;
    }, [fetchHotels]);

    const deleteReview = useCallback(async (reviewId: string): Promise<boolean> => {
        const response = await ReviewsAPI.delete(reviewId);
        if (response.success) {
            await fetchHotels(); // Refresh to remove review
            return true;
        }
        return false;
    }, [fetchHotels]);

    // NEW: Toggle Visibility
    const toggleVisibility = useCallback(async (id: string): Promise<boolean> => {
        const response = await HotelsAPI.toggleVisibility(id);
        if (response.success) {
            setHotels(prev => prev.map(h =>
                String(h.id) === String(id) ? { ...h, isVisible: !h.isVisible } : h
            ));
            return true;
        }
        return false;
    }, []);

    // NEW: Toggle Featured
    const toggleFeatured = useCallback(async (id: string): Promise<boolean> => {
        const response = await HotelsAPI.toggleFeatured(id);
        if (response.success) {
            setHotels(prev => prev.map(h =>
                String(h.id) === String(id) ? { ...h, isFeatured: !h.isFeatured } : h
            ));
            return true;
        }
        return false;
    }, []);

    return {
        hotels,
        loading,
        error,
        saving,
        refetch: fetchHotels,
        saveHotel,
        deleteHotel,
        createHotel,
        updateRoom,
        deleteRoom,
        createRoom,
        createReview,
        deleteReview,
        toggleVisibility,
        toggleFeatured,
    };
}

export default useAdminHotels;
