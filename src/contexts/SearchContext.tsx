
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Search data interface - dates can be null initially
export interface SearchData {
    checkIn: Date | null;
    checkOut: Date | null;
    nights: number;
    rooms: number;
    adults: number;
    children: number;
    destination: string;
    promoCode: string;
    couponDiscount?: number; // <--- Added: Validated discount percentage
    hasSearched: boolean; // Track if user has initiated a search
}

// Context interface
interface SearchContextType {
    searchData: SearchData;
    updateSearch: (updates: Partial<SearchData>) => void;
    setSearchData: (data: SearchData) => void;
    resetSearch: () => void;
    initializeForBooking: () => void; // Set default dates when needed
}

// Default values - start empty for home page
const emptySearchData: SearchData = {
    checkIn: null,
    checkOut: null,
    nights: 0,
    rooms: 1, // Default to 1 room
    adults: 1, // Default to 1 adult
    children: 0,
    destination: '',
    promoCode: '',
    couponDiscount: 0,
    hasSearched: false
};

// Create context
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Helper to get default dates
const getDefaultDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    return { checkIn: tomorrow, checkOut: dayAfterTomorrow };
};

// Provider component
export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [searchData, setSearchDataState] = useState<SearchData>(emptySearchData);

    // Calculate nights whenever dates change
    useEffect(() => {
        if (searchData.checkIn && searchData.checkOut) {
            const nights = Math.ceil(
                (searchData.checkOut.getTime() - searchData.checkIn.getTime()) / (1000 * 60 * 60 * 24)
            );
            if (nights !== searchData.nights && nights > 0) {
                setSearchDataState(prev => ({ ...prev, nights }));
            }
        }
    }, [searchData.checkIn, searchData.checkOut]);

    // Update partial search data
    const updateSearch = (updates: Partial<SearchData>) => {
        setSearchDataState(prev => {
            const newData = { ...prev, ...updates, hasSearched: true };

            // Recalculate nights if dates changed
            const checkIn = updates.checkIn !== undefined ? updates.checkIn : prev.checkIn;
            const checkOut = updates.checkOut !== undefined ? updates.checkOut : prev.checkOut;
            if (checkIn && checkOut) {
                newData.nights = Math.ceil(
                    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
                );
            }

            return newData;
        });
    };

    // Set full search data
    const setSearchData = (data: SearchData) => {
        setSearchDataState(data);
    };

    // Reset to empty
    const resetSearch = () => {
        setSearchDataState(emptySearchData);
    };

    // Initialize with default dates (for booking pages)
    const initializeForBooking = () => {
        setSearchDataState(prev => {
            if (prev.checkIn && prev.checkOut) return prev; // Already has dates
            const { checkIn, checkOut } = getDefaultDates();
            return {
                ...prev,
                checkIn,
                checkOut,
                nights: 1,
                rooms: prev.rooms || 1,
                adults: prev.adults || 2,
                hasSearched: prev.hasSearched
            };
        });
    };

    return (
        <SearchContext.Provider value={{ searchData, updateSearch, setSearchData, resetSearch, initializeForBooking }}>
            {children}
        </SearchContext.Provider>
    );
};

// Hook to use search context
export const useSearch = (): SearchContextType => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};

// Helper to format date in Arabic (handles null, strings, and invalid dates)
export const formatDateArabic = (dateInput: Date | string | null | undefined): string => {
    if (!dateInput) return '--';

    let date: Date;
    if (typeof dateInput === 'string') {
        date = new Date(dateInput);
    } else {
        date = dateInput;
    }

    if (!(date instanceof Date) || isNaN(date.getTime())) return '--';

    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
};

export default SearchContext;
