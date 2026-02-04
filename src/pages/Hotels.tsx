
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HotelCard from '../features/hotels/components/HotelCard';
import PremiumSearch from '../features/search/components/PremiumSearch';
import MobileSearchOverlay from '../features/search/components/MobileSearchOverlay';
import { useFrontendHotels } from '../hooks/useFrontendHotels';
import { useSearch } from '../contexts/SearchContext';
import { Filter, MapPin, SlidersHorizontal, Star, ArrowUpDown, Loader2, RefreshCw, AlertCircle, Wifi, Utensils, Car, Search, ChevronLeft, Eye, Sparkles, X } from 'lucide-react';
import HotelCardSkeleton from '../features/hotels/components/HotelCardSkeleton';

const Hotels = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const cityFilter = searchParams.get('city') as 'makkah' | 'madinah' | null;
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests') ? Number(searchParams.get('guests')) : undefined;

    // [ENFORCEMENT] Relaxed: Allow if City is present (for Top Destinations) OR if all params are present
    const hasRequiredParams = Boolean(cityFilter);

    // [PERSISTENCE] Check if we can restore from context
    const { searchData } = useSearch();
    const canRestore = !hasRequiredParams && !cityFilter && searchData.hasSearched && !!searchData.destination;

    // [STATE] Restoring state to prevent flash of "Search Required"
    const [isRestoring, setIsRestoring] = useState(canRestore);

    const [showMobileFilters, setShowMobileFilters] = useState(false);
    // Don't auto-open search if we are busy restoring
    const [showMobileSearch, setShowMobileSearch] = useState(!hasRequiredParams && !canRestore);
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Auto-open search on mobile if missing params (only if NOT restoring)
    useEffect(() => {
        if (!hasRequiredParams && !isRestoring && window.innerWidth < 1024) {
            setShowMobileSearch(true);
        }
    }, [hasRequiredParams, isRestoring]);

    // 🚀 Use the new API-connected hook
    const {
        filteredHotels,
        loading,
        error,
        refetch,
        filters,
        applyFilter,
        resetFilters,
        sortBy,
        setSortBy,
        searchQuery,
        setSearchQuery,
        filteredCount,
    } = useFrontendHotels(cityFilter, { checkIn, checkOut, guests });

    // [PERSISTENCE EFFECT] Restore search from Context if URL params are missing
    useEffect(() => {
        // If URL params are missing (and we're not just viewing "Top Destinations" via city),
        // try to restore from Context
        if (canRestore) {
            const params = new URLSearchParams();

            // Map context data back to URL params with normalization (Same as handleSearch)
            let cityValue = searchData.destination;
            const cityLower = cityValue?.toLowerCase() || '';

            if (['مكة المكرمة', 'مكه المكرمه', 'مكة', 'مكه', 'makkah'].includes(cityLower) || cityLower.includes('مكة') || cityLower.includes('makkah')) {
                cityValue = 'makkah';
            } else if (['المدينة المنورة', 'المدينه المنوره', 'المدينة', 'المدينه', 'madinah'].includes(cityLower) || cityLower.includes('مدينة') || cityLower.includes('madinah')) {
                cityValue = 'madinah';
            } else if (['جدة', 'جده', 'jeddah'].includes(cityLower)) {
                cityValue = 'jeddah';
            } else if (['الرياض', 'riyadh'].includes(cityLower)) {
                cityValue = 'riyadh';
            }

            params.set('city', cityValue);

            if (searchData.checkIn) {
                const formatDate = (date: Date) => {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                };
                params.set('checkIn', formatDate(new Date(searchData.checkIn)));
            }

            if (searchData.checkOut) {
                const formatDate = (date: Date) => {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                };
                params.set('checkOut', formatDate(new Date(searchData.checkOut)));
            }

            if (searchData.adults) {
                // [MODIFIED] Only count adults for filtering per user request
                const totalGuests = (searchData.adults || 0);
                if (totalGuests > 0) params.set('guests', totalGuests.toString());
            }

            // Redirect to restore session
            console.log("Restoring session from context...", params.toString());
            navigate(`/hotels?${params.toString()}`, { replace: true });
        } else {
            // If we can't restore or don't need to, stop restoring state
            setIsRestoring(false);
        }
    }, [canRestore, searchData, navigate]);

    // Local state for UI (synced with hook)
    const [priceRange, setPriceRange] = useState(filters.maxPrice || 3000);
    const [selectedStars, setSelectedStars] = useState<number[]>(filters.starRatings || []);
    const [selectedDistances, setSelectedDistances] = useState<number[]>(filters.maxDistance || []);
    const [activeSort, setActiveSort] = useState('recommended');

    // [OPTIMIZATION] Local search state for debouncing
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

    // [OPTIMIZATION] Debounce search query update
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(localSearchQuery);
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [localSearchQuery, setSearchQuery]);

    // Sync local query if searchQuery changes externally (e.g. reset)
    useEffect(() => {
        if (searchQuery !== localSearchQuery) {
            setLocalSearchQuery(searchQuery);
        }
    }, [searchQuery]);

    // Sync local state with filter hook
    useEffect(() => {
        applyFilter('maxPrice', priceRange);
    }, [priceRange, applyFilter]);

    useEffect(() => {
        applyFilter('starRatings', selectedStars);
    }, [selectedStars, applyFilter]);

    useEffect(() => {
        applyFilter('maxDistance', selectedDistances);
    }, [selectedDistances, applyFilter]);

    // Handle sort changes
    useEffect(() => {
        switch (activeSort) {
            case 'price_asc':
                setSortBy({ field: 'price', direction: 'asc' });
                break;
            case 'price_desc':
                setSortBy({ field: 'price', direction: 'desc' });
                break;
            case 'rating':
                setSortBy({ field: 'rating', direction: 'desc' });
                break;
            case 'smart':
                setSortBy({ field: 'smart', direction: 'desc' });
                break;
            default:
                setSortBy({ field: 'rating', direction: 'desc' });
        }
    }, [activeSort, setSortBy]);

    const handleStarToggle = (star: number) => {
        setSelectedStars(prev =>
            prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
        );
    };

    const handleDistanceToggle = (dist: number) => {
        setSelectedDistances(prev =>
            prev.includes(dist) ? prev.filter(d => d !== dist) : [...prev, dist]
        );
    };

    const handleResetFilters = () => {
        setPriceRange(3000);
        setSelectedStars([]);
        setSelectedDistances([]);
        setActiveSort('recommended');
        resetFilters();
    };

    // Sorting Dropdown Options
    const sortOptions = [
        { id: 'smart', label: 'الخيار الأفضل (قيمة مقابل سعر)' },
        { id: 'recommended', label: 'الموصى به' },
        { id: 'price_asc', label: 'الأقل سعراً' },
        { id: 'price_desc', label: 'الأعلى سعراً' },
        { id: 'rating', label: 'الأعلى تقييماً' },
    ];

    // Reveal on scroll refs
    const revealRefs = useRef<HTMLDivElement[]>([]);
    const addToRevealRefs = (el: HTMLDivElement) => {
        if (el && !revealRefs.current.includes(el)) {
            revealRefs.current.push(el);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            },
            { threshold: 0.1 }
        );

        revealRefs.current.forEach((el) => observer.observe(el));

        return () => {
            revealRefs.current.forEach((el) => observer.unobserve(el));
        };
    }, [filteredHotels]);

    useEffect(() => {
        if (showMobileFilters) {
            document.body.classList.add('filters-open');
        } else {
            document.body.classList.remove('filters-open');
        }
    }, [showMobileFilters]);

    const handleSearch = (data: any) => {
        const params = new URLSearchParams();

        // Map Arabic display names to API values
        let cityValue = data.city;
        const MAKKAH_VARIANTS = ['مكة المكرمة', 'مكه المكرمه', 'مكة', 'مكه', 'makkah'];
        const MADINAH_VARIANTS = ['المدينة المنورة', 'المدينه المنوره', 'المدينة', 'المدينه', 'madinah'];
        const JEDDAH_VARIANTS = ['جدة', 'جده', 'jeddah'];
        const RIYADH_VARIANTS = ['الرياض', 'riyadh'];

        if (MAKKAH_VARIANTS.includes(data.city)) cityValue = 'makkah';
        else if (MADINAH_VARIANTS.includes(data.city)) cityValue = 'madinah';
        else if (JEDDAH_VARIANTS.includes(data.city)) cityValue = 'jeddah';
        else if (RIYADH_VARIANTS.includes(data.city)) cityValue = 'riyadh';
        else if (data.city === 'دبي' || data.city?.toLowerCase() === 'dubai') cityValue = 'dubai';
        else if (data.city === 'القاهرة' || data.city?.toLowerCase() === 'cairo') cityValue = 'cairo';
        else if (data.city === 'الدوحة' || data.city?.toLowerCase() === 'doha') cityValue = 'doha';
        else if (data.city === 'جميع الفنادق' || data.city === 'الكل' || !data.city) cityValue = 'all';

        const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        if (cityValue) params.set('city', cityValue);
        if (data.checkIn) params.set('checkIn', formatDate(data.checkIn));
        if (data.checkOut) params.set('checkOut', formatDate(data.checkOut));

        // [MODIFIED] Only count adults for filtering per user request
        const totalGuests = (data.guests?.adults || 0);
        if (totalGuests > 0) params.set('guests', totalGuests.toString());

        // Use navigate to update URL which triggers the hook
        navigate(`/hotels?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-cairo">
            <div className="h-24 md:h-28" />

            {/* Premium Search Section */}
            <div className="relative z-30 bg-slate-50/95 backdrop-blur-md py-4 border-b border-slate-200 transition-all duration-300 shadow-sm">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                    <div className="hidden md:block">
                        <PremiumSearch onSearch={handleSearch} hideAiToggle={true} disableScroll={true} />
                    </div>

                    {/* Mobile Research Trigger */}
                    <button
                        onClick={() => setShowMobileSearch(true)}
                        className="md:hidden w-full bg-white border border-slate-200 p-4 rounded-[2rem] flex items-center justify-between shadow-sm active:scale-95 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                                <Search size={20} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cityFilter === 'makkah' ? 'مكة المكرمة' : cityFilter === 'madinah' ? 'المدينة المنورة' : 'جميع المدن'}</p>
                                <p className="text-xs font-black text-text">انقر لتعديل البحث والتواريخ</p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                            <ChevronLeft size={16} />
                        </div>
                    </button>

                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters (Desktop) */}
                    <aside className="hidden lg:block w-80 shrink-0 space-y-8 sticky top-48 h-[calc(100vh-12rem)] overflow-y-auto no-scrollbar pl-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-text">تصفية النتائج</h2>
                            <button onClick={handleResetFilters} className="text-xs text-slate-500 font-bold hover:text-gold transition-colors">إعادة تعيين</button>
                        </div>

                        {/* Search by Name */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 group focus-within:ring-2 focus-within:ring-gold/20 transition-all">
                            <h3 className="font-bold text-text mb-4">البحث عن فندق محدد</h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="ادخل اسم الفندق..."
                                    value={localSearchQuery}
                                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-gold transition-all"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                                    <Search size={18} />
                                </div>
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-text">نطاق السعر</h3>
                                <span className="text-xs font-bold text-gold bg-gold/10 px-4 py-1.5 rounded-full">أقل من {priceRange} ريال</span>
                            </div>
                            <input
                                type="range"
                                min="100"
                                max="10000"
                                step="100"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full accent-gold h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Distance Filter */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h3 className="font-bold text-text mb-4">
                                {cityFilter === 'madinah' ? 'المسافة عن المسجد النبوي' : 'المسافة عن الحرم'}
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { value: 0, label: 'إطلالة مباشرة / صف أول' },
                                    { value: 200, label: 'أقل من 200 متر' },
                                    { value: 500, label: 'أقل من 500 متر' },
                                    { value: 1000, label: 'أقل من 1 كم' }
                                ].map((opt) => (
                                    <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedDistances.includes(opt.value)}
                                                onChange={() => handleDistanceToggle(opt.value)}
                                                className="peer w-5 h-5 border-2 border-slate-200 rounded-lg checked:bg-gold checked:border-gold transition-colors appearance-none"
                                            />
                                            <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className={`text-slate-600 font-bold transition-colors ${selectedDistances.includes(opt.value) ? 'text-text' : 'group-hover:text-gold'}`}>
                                            {opt.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Star Rating */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h3 className="font-bold text-text mb-4">تصنيف الفندق</h3>
                            <div className="space-y-3">
                                {[5, 4, 3].map((star) => (
                                    <label key={star} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedStars.includes(star)}
                                                onChange={() => handleStarToggle(star)}
                                                className="peer w-5 h-5 border-2 border-slate-200 rounded-lg checked:bg-gold checked:border-gold transition-colors appearance-none"
                                            />
                                            <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className={`text-slate-600 font-bold transition-colors flex items-center gap-1 ${selectedStars.includes(star) ? 'text-text' : 'group-hover:text-gold'}`}>
                                            {star} نجوم
                                            <div className="flex text-gold">
                                                {[...Array(star)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                            </div>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Header & Sort */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-text mb-2">
                                    {cityFilter === 'makkah' ? 'فنادق مكة المكرمة' : cityFilter === 'madinah' ? 'فنادق المدينة المنورة' : 'جميع الفنادق'}
                                    <span className="text-gold text-4xl mr-2">.</span>
                                </h1>
                                <p className="text-slate-500 font-bold">وجدنا {filteredHotels.length} مكان إقامة متاح</p>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto relative z-20">
                                <button
                                    onClick={() => setShowMobileFilters(true)}
                                    className="lg:hidden flex-1 bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <Filter size={18} />
                                    تصفية
                                </button>

                                {/* Sort Dropdown */}
                                <div className="relative group md:w-56 w-1/2">
                                    <button
                                        onClick={() => setIsSortOpen(!isSortOpen)}
                                        onBlur={() => setTimeout(() => setIsSortOpen(false), 200)}
                                        className="w-full bg-white border border-slate-200 px-4 py-3 rounded-2xl font-bold text-slate-600 flex items-center justify-between hover:border-gold transition-colors"
                                    >
                                        <span className="flex items-center gap-2 truncate text-sm">
                                            <ArrowUpDown size={16} />
                                            {sortOptions.find(o => o.id === activeSort)?.label}
                                        </span>
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-200 origin-top ${isSortOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                        {sortOptions.map(option => (
                                            <button
                                                key={option.id}
                                                onClick={() => { setActiveSort(option.id); setIsSortOpen(false); }}
                                                className={`w-full text-right px-4 py-3 text-sm font-bold hover:bg-slate-50 transition-colors ${activeSort === option.id ? 'text-gold bg-slate-50' : 'text-slate-600'}`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hotels List */}
                        <div className="space-y-6">
                            {isRestoring ? (
                                <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-300">
                                    <h3 className="text-xl font-bold text-slate-400 mb-2">جاري استرجاع بحثك السابق...</h3>
                                    <Loader2 className="w-8 h-8 text-gold animate-spin" />
                                </div>
                            ) : !hasRequiredParams ? (
                                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                                    <div className="w-24 h-24 bg-gold/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gold animate-pulse">
                                        <Search size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black text-text mb-3">ابدأ رحلتك معنا</h3>
                                    <p className="text-slate-500 font-bold mb-8 max-w-md mx-auto leading-relaxed">
                                        يرجى تحديد وجهتك وتواريخ السفر وعدد الضيوف لعرض أفضل الفنادق المتاحة لك.
                                    </p>
                                    <button
                                        onClick={() => setShowMobileSearch(true)}
                                        className="lg:hidden bg-primary text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                                    >
                                        تحديد خيارات البحث
                                    </button>
                                    <div className="hidden lg:block text-slate-400 font-medium text-sm">
                                        استخدم شريط البحث في الأعلى للبدء 👆
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-red-100 shadow-sm">
                                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400">
                                        <AlertCircle size={32} />
                                    </div>
                                    <h3 className="text-xl font-black text-text mb-2">حدث خطأ أثناء تحميل الفنادق</h3>
                                    <p className="text-slate-500 font-medium mb-6">{error}</p>
                                    <button
                                        onClick={() => refetch()}
                                        className="bg-primary text-gold px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto"
                                    >
                                        <RefreshCw size={18} />
                                        إعادة المحاولة
                                    </button>
                                </div>
                            ) : loading ? (
                                <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-500">
                                    <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mb-6">
                                        <Loader2 className="w-10 h-10 text-gold animate-spin" />
                                    </div>
                                    <h3 className="text-2xl font-black text-[#0f172a] mb-2">جاري البحث عن أفضل الخيارات...</h3>
                                    <p className="text-slate-400 font-bold">يرجى الانتظار لحظات، نقوم بمطابقة بحثك مع فنادقنا المميزة</p>
                                </div>
                            ) : filteredHotels.length > 0 ? (
                                filteredHotels.map((hotel, index) => (
                                    <div
                                        key={hotel.id}
                                        ref={addToRevealRefs}
                                        className="reveal-on-scroll transform will-change-[transform,opacity] transition-[opacity,transform] duration-500 translate-y-4 opacity-0"
                                    >
                                        <HotelCard hotel={hotel} index={index} />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                        <Filter size={32} />
                                    </div>
                                    <h3 className="text-xl font-black text-text mb-2">لا توجد فنادق متاحة لهذا البحث</h3>
                                    <p className="text-slate-500 font-medium mb-6">جرب تغيير التواريخ أو المرشحات للحصول على نتائج</p>
                                    <button
                                        onClick={handleResetFilters}
                                        className="bg-gold text-white px-8 py-3 rounded-xl font-bold hover:bg-gold-dark transition-colors"
                                    >
                                        إعادة تعيين الفلاتر
                                    </button>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {/* Mobile Search Overlay (iOS Style) */}
            <MobileSearchOverlay
                isOpen={showMobileSearch}
                onClose={() => setShowMobileSearch(false)}
                onSearch={handleSearch}
            />

            {/* Mobile Filters Drawer - Functional */}
            <div className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-[400ms] ${showMobileFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowMobileFilters(false)} />
                <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[3rem] p-6 h-[85vh] overflow-y-auto transition-transform duration-[500ms] ease-ios transform flex flex-col ${showMobileFilters ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8 shrink-0" />

                    <div className="flex justify-between items-center mb-8 shrink-0 px-2">
                        <button onClick={() => setShowMobileFilters(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 active:scale-90 transition-all">
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-black text-secondary">تصفية النتائج</h2>
                        <button onClick={handleResetFilters} className="text-gold font-bold text-xs">إعادة تعيين</button>
                    </div>

                    <div className="mb-6 space-y-4">
                        <h3 className="font-bold text-lg text-text">بحث بالاسم</h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="ادخل اسم الفندق..."
                                value={localSearchQuery}
                                onChange={(e) => setLocalSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-gold transition-all"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                                <Search size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pb-8">

                        {/* 1. PRICE RANGE */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-xl text-text">نطاق السعر</h3>
                                <span className="text-xs font-bold text-gold bg-gold/10 px-4 py-1.5 rounded-full">أقل من {priceRange} ريال</span>
                            </div>
                            <input
                                type="range"
                                min="100"
                                max="10000"
                                step="100"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full accent-gold h-2 bg-slate-100 rounded-lg"
                            />
                        </div>


                        {/* Mobile Distance Filter */}
                        <div className="border-t border-slate-100 pt-8">
                            <h3 className="font-bold text-xl text-text mb-4">
                                {cityFilter === 'madinah' ? 'المسافة عن المسجد النبوي' : 'المسافة عن الحرم'}
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { value: 0, label: 'إطلالة مباشرة / صف أول' },
                                    { value: 200, label: 'أقل من 200 متر' },
                                    { value: 500, label: 'أقل من 500 متر' },
                                    { value: 1000, label: 'أقل من 1 كم' }
                                ].map((opt) => (
                                    <label key={opt.value} className="flex items-center gap-4 cursor-pointer">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedDistances.includes(opt.value)}
                                                onChange={() => handleDistanceToggle(opt.value)}
                                                className="peer w-6 h-6 border-2 border-slate-200 rounded-lg checked:bg-gold checked:border-gold transition-colors appearance-none"
                                            />
                                            <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className={`text-slate-600 font-bold text-lg ${selectedDistances.includes(opt.value) ? 'text-text' : ''}`}>
                                            {opt.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Stars */}
                        <div>
                            <h3 className="font-bold text-xl text-text mb-4">تصنيف الفندق</h3>
                            <div className="space-y-4">
                                {[5, 4, 3].map((star) => (
                                    <label key={star} className="flex items-center gap-4 cursor-pointer">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedStars.includes(star)}
                                                onChange={() => handleStarToggle(star)}
                                                className="peer w-6 h-6 border-2 border-slate-200 rounded-lg checked:bg-gold checked:border-gold transition-colors appearance-none"
                                            />
                                            <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className={`text-slate-600 font-bold text-lg flex items-center gap-2 ${selectedStars.includes(star) ? 'text-text' : ''}`}>
                                            {star} نجوم
                                            <div className="flex text-gold">
                                                {[...Array(star)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                            </div>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 shrink-0 border-t border-slate-100">
                        <div className="flex gap-4">
                            <button
                                onClick={handleResetFilters}
                                className="flex-1 py-4 rounded-2xl font-bold text-slate-500 bg-slate-100 active:scale-95 transition-all"
                            >
                                مسح الكل
                            </button>
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="flex-[2] bg-secondary text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-secondary/20 active:scale-95 transition-transform"
                            >
                                تطبيق الفلاتر
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .reveal-on-scroll.active {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
};

export default Hotels;
