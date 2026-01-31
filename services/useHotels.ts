import { useState, useMemo } from 'react';
import { HOTELS } from '../constants';
import { Hotel } from '../types';

export const useHotels = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    const filteredHotels = useMemo(() => {
        return HOTELS.filter(hotel => {
            const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCity = !selectedCity || hotel.location.toLowerCase().includes(selectedCity.toLowerCase());
            return matchesSearch && matchesCity;
        });
    }, [searchQuery, selectedCity]);

    const featuredHotels = useMemo(() => {
        return HOTELS.filter(h => h.isFeatured).slice(0, 8);
    }, []);

    const hotelsByCity = (city: string) => {
        return HOTELS.filter(h => h.location.toLowerCase().includes(city.toLowerCase()));
    };

    return {
        hotels: filteredHotels,
        featuredHotels,
        searchQuery,
        setSearchQuery,
        selectedCity,
        setSelectedCity,
        getHotelsByCity: hotelsByCity
    };
};
