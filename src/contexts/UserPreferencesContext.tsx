import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define context shape
interface UserPreferencesContextType {
    favorites: string[];
    compareList: string[];
    toggleFavorite: (hotelId: string) => void;
    toggleCompare: (hotelId: string) => void;
    clearCompare: () => void;
    isFavorite: (hotelId: string) => boolean;
    isInCompare: (hotelId: string) => boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

// Storage keys
const FAVORITES_KEY = 'diafat_favorites';
const COMPARE_KEY = 'diafat_compare';

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [compareList, setCompareList] = useState<string[]>([]);

    // Initialize from localStorage
    useEffect(() => {
        const storedFavs = localStorage.getItem(FAVORITES_KEY);
        const storedCompare = localStorage.getItem(COMPARE_KEY);

        if (storedFavs) {
            try { setFavorites(JSON.parse(storedFavs)); } catch (e) { }
        }
        if (storedCompare) {
            try { setCompareList(JSON.parse(storedCompare)); } catch (e) { }
        }
    }, []);

    // Toggle Favorite
    const toggleFavorite = (hotelId: string) => {
        setFavorites(prev => {
            const next = prev.includes(hotelId)
                ? prev.filter(id => id !== hotelId)
                : [...prev, hotelId];

            localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
            return next;
        });
    };

    // Toggle Compare
    const toggleCompare = (hotelId: string) => {
        setCompareList(prev => {
            // Limit to 3 items for compare? Optional. Let's keep it simple.
            const next = prev.includes(hotelId)
                ? prev.filter(id => id !== hotelId)
                : [...prev, hotelId].slice(0, 4); // Max 4 for example

            localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
            return next;
        });
    };

    const clearCompare = () => {
        setCompareList([]);
        localStorage.removeItem(COMPARE_KEY);
    };

    const isFavorite = (hotelId: string) => favorites.includes(hotelId);
    const isInCompare = (hotelId: string) => compareList.includes(hotelId);

    return (
        <UserPreferencesContext.Provider value={{
            favorites,
            compareList,
            toggleFavorite,
            toggleCompare,
            clearCompare,
            isFavorite,
            isInCompare
        }}>
            {children}
        </UserPreferencesContext.Provider>
    );
};

export const useUserPreferences = () => {
    const context = useContext(UserPreferencesContext);
    if (context === undefined) {
        throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
    }
    return context;
};
