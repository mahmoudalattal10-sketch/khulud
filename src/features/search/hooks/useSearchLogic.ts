import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../../contexts/SearchContext';

export type SheetType = 'none' | 'destination' | 'dates' | 'guests' | 'rooms';

export const useSearchLogic = () => {
    const navigate = useNavigate();
    const { searchData, updateSearch } = useSearch();

    const [activeSheet, setActiveSheet] = useState<SheetType>('none');
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const isSelected = (date: Date) => {
        if (searchData.checkIn && date.toDateString() === searchData.checkIn.toDateString()) return true;
        if (searchData.checkOut && date.toDateString() === searchData.checkOut.toDateString()) return true;
        return false;
    };

    const isInRange = (date: Date) => {
        if (!searchData.checkIn || !searchData.checkOut) return false;
        const d = new Date(date).setHours(0, 0, 0, 0);
        const start = new Date(searchData.checkIn).setHours(0, 0, 0, 0);
        const end = new Date(searchData.checkOut).setHours(0, 0, 0, 0);
        return d > start && d < end;
    };

    const handleDaySelect = (date: Date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        if (!searchData.checkIn || (searchData.checkIn && searchData.checkOut)) {
            updateSearch({ checkIn: d, checkOut: null });
        } else if (d > searchData.checkIn) {
            updateSearch({ checkIn: searchData.checkIn, checkOut: d });
        } else {
            updateSearch({ checkIn: d, checkOut: null });
        }
    };

    const handleFieldClick = (type: SheetType) => {
        setActiveSheet(type === activeSheet ? 'none' : type);
    };

    const closeSheet = () => setActiveSheet('none');

    const handleSearch = (destination: string) => {
        if (!destination) {
            setActiveSheet('destination');
            alert("يرجى اختيار الوجهة أولاً للبدء بالبحث");
            return;
        }

        const params = new URLSearchParams();

        // City mapping logic
        let cityValue = destination;
        const MAKKAH_VARIANTS = ['مكة المكرمة', 'مكه المكرمه', 'مكة', 'مكه', 'makkah'];
        const MADINAH_VARIANTS = ['المدينة المنورة', 'المدينه المنوره', 'المدينة', 'المدينه', 'madinah'];
        const JEDDAH_VARIANTS = ['جدة', 'جده', 'jeddah'];
        const RIYADH_VARIANTS = ['الرياض', 'riyadh'];

        if (MAKKAH_VARIANTS.includes(destination)) cityValue = 'makkah';
        else if (MADINAH_VARIANTS.includes(destination)) cityValue = 'madinah';
        else if (JEDDAH_VARIANTS.includes(destination)) cityValue = 'jeddah';
        else if (RIYADH_VARIANTS.includes(destination)) cityValue = 'riyadh';
        else if (destination === 'دبي' || destination.toLowerCase() === 'dubai') cityValue = 'dubai';
        else if (destination === 'القاهرة' || destination.toLowerCase() === 'cairo') cityValue = 'cairo';
        else if (destination === 'الدوحة' || destination.toLowerCase() === 'doha') cityValue = 'doha';
        else if (destination === 'جميع الفنادق' || destination === 'الكل') cityValue = 'all';

        const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        if (cityValue) params.append('city', cityValue);
        if (searchData.checkIn) params.append('checkIn', formatDate(searchData.checkIn));
        if (searchData.checkOut) params.append('checkOut', formatDate(searchData.checkOut));
        // [MODIFIED] Only count adults for filtering per user request
        const totalGuests = (searchData.adults || 0);
        if (totalGuests > 0) params.append('guests', totalGuests.toString());

        navigate(`/hotels?${params.toString()}`);
    };

    return {
        searchData,
        updateSearch,
        activeSheet,
        setActiveSheet,
        currentMonth,
        handleNextMonth,
        handlePrevMonth,
        isSelected,
        isInRange,
        handleDaySelect,
        handleFieldClick,
        closeSheet,
        handleSearch
    };
};
