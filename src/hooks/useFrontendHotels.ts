/**
 * =========================================================
 * 🏨 useFrontendHotels Hook - Public Hotels Integration
 * =========================================================
 * A specialized hook for the public-facing hotels pages.
 * Fetches hotels from API with smart filtering and sorting.
 * =========================================================
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { HotelsAPI, Hotel } from '../services/api';

export interface HotelFilters {
    city?: string | null;
    maxPrice?: number;
    minRating?: number;
    starRatings?: number[];
    maxDistance?: number[];
    hasOffer?: boolean;
    hasFreeBreakfast?: boolean;
    hasFreeTransport?: boolean;
    amenities?: string[];
}

export interface SortOption {
    field: 'price' | 'rating' | 'distance' | 'reviews' | 'smart';
    direction: 'asc' | 'desc';
}
interface UseFrontendHotelsReturn {
    hotels: Hotel[];
    filteredHotels: Hotel[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;

    // Filtering
    filters: HotelFilters;
    setFilters: React.Dispatch<React.SetStateAction<HotelFilters>>;
    applyFilter: (key: keyof HotelFilters, value: HotelFilters[keyof HotelFilters]) => void;
    resetFilters: () => void;

    // Sorting
    sortBy: SortOption;
    setSortBy: React.Dispatch<React.SetStateAction<SortOption>>;

    // Search
    searchQuery: string;
    setSearchQuery: (query: string) => void;

    // Stats
    totalCount: number;
    filteredCount: number;
}

const DEFAULT_FILTERS: HotelFilters = {
    city: null,
    maxPrice: 10000,
    minRating: 0,
    starRatings: [],
    maxDistance: [],
    hasOffer: false,
    hasFreeBreakfast: false,
    hasFreeTransport: false,
    amenities: [],
};

const DEFAULT_SORT: SortOption = {
    field: 'rating',
    direction: 'desc',
};

// Helper to parse distance string "150 متر" -> 150
const parseDistance = (distStr?: string | null): number => {
    if (!distStr) return 9999;
    if (distStr.includes('صف أول') || distStr.includes('مباشر')) return 0;
    const match = distStr.match(/(\d+)/);
    return match ? parseInt(match[0]) : 9999;
};

export const useFrontendHotels = (
    initialCity?: string | null,
    searchParams?: { checkIn?: string | null; checkOut?: string | null; guests?: number }
): UseFrontendHotelsReturn => {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [filters, setFilters] = useState<HotelFilters>({
        ...DEFAULT_FILTERS,
        city: initialCity as 'makkah' | 'madinah' | null,
    });
    const [sortBy, setSortBy] = useState<SortOption>(DEFAULT_SORT);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch hotels from API with availability params
    const fetchHotels = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Prepare API params
            const apiParams: Parameters<typeof HotelsAPI.getAll>[0] = {};
            if (initialCity && initialCity !== 'all') apiParams.city = initialCity;
            if (searchParams?.checkIn) apiParams.checkIn = searchParams.checkIn;
            if (searchParams?.checkOut) apiParams.checkOut = searchParams.checkOut;
            if (searchParams?.guests) apiParams.guests = searchParams.guests;

            const response = await HotelsAPI.getAll(apiParams);

            if (response.success && response.data) {
                setHotels(response.data);
            } else {
                setError(response.error || 'فشل في تحميل الفنادق');
            }
        } catch (err) {
            setError('حدث خطأ في الاتصال بالخادم');
        } finally {
            setLoading(false);
        }
    }, [initialCity, searchParams?.checkIn, searchParams?.checkOut, searchParams?.guests]);

    // Initial fetch
    useEffect(() => {
        fetchHotels();
    }, [fetchHotels]);

    // Update city filter when initialCity changes
    useEffect(() => {
        if (initialCity !== undefined) {
            setFilters(prev => ({
                ...prev,
                city: initialCity as 'makkah' | 'madinah' | null,
            }));
        }
    }, [initialCity]);

    // Apply single filter
    const applyFilter = useCallback((key: keyof HotelFilters, value: HotelFilters[keyof HotelFilters]) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    // Reset all filters
    const resetFilters = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
        setSortBy(DEFAULT_SORT);
        setSearchQuery('');
    }, []);

    // Filter and sort hotels
    const filteredHotels = useMemo(() => {
        // 🛡️ Safety: Filter out invalid entries first (Allow strict numbers or convertibles)
        let result = [...hotels].filter(h => h && h.basePrice != null && !isNaN(Number(h.basePrice)));

        // 1. Search filter
        if (searchQuery.trim()) {
            const normalize = (text: string) =>
                text.toLowerCase()
                    .replace(/ة/g, 'ه')
                    .replace(/أ|إ|آ/g, 'ا')
                    .trim();

            const query = normalize(searchQuery);
            result = result.filter(hotel =>
                normalize(hotel.name).includes(query) ||
                normalize(hotel.nameEn || '').includes(query) ||
                normalize(hotel.location).includes(query) ||
                normalize(hotel.description || '').includes(query)
            );
        }

        // 2. City filter
        if (filters.city && filters.city !== 'all') {
            const filterCity = String(filters.city).toLowerCase().trim();

            // Map variations for frontend filtering
            const MAKKAH_TERMS = ['مكة', 'makkah', 'مكه', 'makka'];
            const MADINAH_TERMS = ['المدينة', 'madinah', 'المدينه', 'مدينة', 'madina'];
            const JEDDAH_TERMS = ['جدة', 'jeddah', 'جده'];
            const RIYADH_TERMS = ['الرياض', 'riyadh', 'riyad'];

            result = result.filter(hotel => {
                const hotelCity = (hotel.city || '').toLowerCase();
                const hotelLoc = (hotel.location || '').toLowerCase();

                if (MAKKAH_TERMS.includes(filterCity) || filterCity === 'makkah') {
                    return MAKKAH_TERMS.some(t => hotelCity.includes(t) || hotelLoc.includes(t));
                } else if (MADINAH_TERMS.includes(filterCity) || filterCity === 'madinah') {
                    return MADINAH_TERMS.some(t => hotelCity.includes(t) || hotelLoc.includes(t));
                } else if (JEDDAH_TERMS.includes(filterCity)) {
                    return JEDDAH_TERMS.some(t => hotelCity.includes(t) || hotelLoc.includes(t));
                } else if (RIYADH_TERMS.includes(filterCity)) {
                    return RIYADH_TERMS.some(t => hotelCity.includes(t) || hotelLoc.includes(t));
                }

                // Exact or partial match for other cities
                return hotelCity.includes(filterCity) || hotelLoc.includes(filterCity);
            });
        }

        // 3. Price filter
        if (filters.maxPrice) {
            result = result.filter(hotel => hotel.basePrice <= filters.maxPrice!);
        }

        // 4. Rating filter
        if (filters.minRating && filters.minRating > 0) {
            result = result.filter(hotel => hotel.rating >= filters.minRating!);
        }

        // 5. Star rating filter (converted from rating)
        if (filters.starRatings && filters.starRatings.length > 0) {
            result = result.filter(hotel => {
                return filters.starRatings!.some(star => {
                    if (star === 5) return hotel.rating >= 4.5;
                    if (star === 4) return hotel.rating >= 4.0 && hotel.rating < 4.5;
                    if (star === 3) return hotel.rating < 4.0;
                    return false;
                });
            });
        }

        // 6. Distance filter
        if (filters.maxDistance && filters.maxDistance.length > 0) {
            result = result.filter(hotel => {
                const dist = parseDistance(hotel.distanceFromHaram);
                return filters.maxDistance!.some(maxDist => {
                    if (maxDist === 0) {
                        // Check if hotel has any view defined
                        const hasView = hotel.view &&
                            hotel.view.trim() !== '' &&
                            hotel.view !== 'بدون إطلالة' &&
                            hotel.view !== 'No View';

                        return dist === 0 || hasView;
                    }
                    return dist > 0 && dist <= maxDist;
                });
            });
        }

        // 7. Offer filter
        if (filters.hasOffer) {
            result = result.filter(hotel => hotel.isOffer);
        }

        // 8. Free breakfast filter
        if (filters.hasFreeBreakfast) {
            result = result.filter(hotel => hotel.hasFreeBreakfast);
        }

        // 9. Free transport filter
        if (filters.hasFreeTransport) {
            result = result.filter(hotel => hotel.hasFreeTransport);
        }

        // 10. Amenities filter
        if (filters.amenities && filters.amenities.length > 0) {
            result = result.filter(hotel => {
                return filters.amenities!.every(amenity =>
                    hotel.amenities?.includes(amenity)
                );
            });
        }



        // Apply sorting
        result.sort((a, b) => {
            let comparison = 0;

            switch (sortBy.field) {
                case 'price':
                    comparison = a.basePrice - b.basePrice;
                    break;
                case 'rating':
                    comparison = a.rating - b.rating;
                    break;
                case 'distance':
                    comparison = parseDistance(a.distanceFromHaram) - parseDistance(b.distanceFromHaram);
                    break;
                case 'reviews':
                    comparison = a.reviews - b.reviews;
                    break;
                case 'smart':
                    // Smart Sort: Higher rating and lower price = better score
                    // Simple formula: Rating / Price (normalized)
                    const scoreA = (a.rating * 1000) / a.basePrice;
                    const scoreB = (b.rating * 1000) / b.basePrice;
                    comparison = scoreA - scoreB;
                    break;
            }

            return sortBy.direction === 'desc' ? -comparison : comparison;
        });

        return result;
    }, [hotels, filters, sortBy, searchQuery]);

    return {
        hotels,
        filteredHotels,
        loading,
        error,
        refetch: fetchHotels,

        filters,
        setFilters,
        applyFilter,
        resetFilters,

        sortBy,
        setSortBy,

        searchQuery,
        setSearchQuery,

        totalCount: hotels.length,
        filteredCount: filteredHotels.length,
    };
};

export default useFrontendHotels;
