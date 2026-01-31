/**
 * =========================================================
 * 🎣 useHotels Hook - Professional Data Fetching
 * =========================================================
 * A React hook for fetching and managing hotel data.
 * Includes loading states, error handling, and auto-refresh.
 * =========================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { HotelsAPI, Hotel } from '../services/api';

interface UseHotelsOptions {
    /** Auto-fetch on mount (default: true) */
    autoFetch?: boolean;
    /** Filter by city */
    city?: 'makkah' | 'madinah';
    /** Only fetch offers */
    offersOnly?: boolean;
}

interface UseHotelsReturn {
    hotels: Hotel[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    // Derived data
    makkahHotels: Hotel[];
    madinahHotels: Hotel[];
    featuredHotels: Hotel[];
}

export function useHotels(options: UseHotelsOptions = {}): UseHotelsReturn {
    const { autoFetch = true, city, offersOnly } = options;

    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(autoFetch);
    const [error, setError] = useState<string | null>(null);

    const fetchHotels = useCallback(async () => {
        setLoading(true);
        setError(null);

        const response = await HotelsAPI.getAll();

        if (response.success && response.data) {
            let filteredHotels = response.data;

            // Apply city filter
            if (city) {
                filteredHotels = filteredHotels.filter(h => h.city === city);
            }

            // Apply offers filter
            if (offersOnly) {
                filteredHotels = filteredHotels.filter(h => h.isOffer);
            }

            setHotels(filteredHotels);
        } else {
            setError(response.error || 'Failed to fetch hotels');
        }

        setLoading(false);
    }, [city, offersOnly]);

    useEffect(() => {
        if (autoFetch) {
            fetchHotels();
        }
    }, [autoFetch, fetchHotels]);

    // Derived data for convenience
    const makkahHotels = hotels.filter(h => h.city === 'makkah');
    const madinahHotels = hotels.filter(h => h.city === 'madinah');
    const featuredHotels = hotels.filter(h => h.isOffer);

    return {
        hotels,
        loading,
        error,
        refetch: fetchHotels,
        makkahHotels,
        madinahHotels,
        featuredHotels,
    };
}

/**
 * =========================================================
 * 🎣 useHotel Hook - Single Hotel Data
 * =========================================================
 */

interface UseHotelReturn {
    hotel: Hotel | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useHotel(slugOrId: string, bySlug = true): UseHotelReturn {
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHotel = useCallback(async () => {
        if (!slugOrId) return;

        setLoading(true);
        setError(null);

        const response = bySlug
            ? await HotelsAPI.getBySlug(slugOrId)
            : await HotelsAPI.getById(slugOrId);

        if (response.success && response.data) {
            setHotel(response.data);
        } else {
            setError(response.error || 'Hotel not found');
        }

        setLoading(false);
    }, [slugOrId, bySlug]);

    useEffect(() => {
        fetchHotel();
    }, [fetchHotel]);

    return { hotel, loading, error, refetch: fetchHotel };
}

export default useHotels;
