
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, MapPin, Users, Search, ChevronRight, ChevronLeft, Globe, Compass, ChevronDown, ChevronUp, Building, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearch, formatDateArabic } from '../contexts/SearchContext';
import { DESTINATIONS, TOP_DESTINATIONS } from '../constants/destinations';
import { useFrontendHotels } from '../hooks/useFrontendHotels';

interface MobileSearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onSearch: (data: any) => void;
    initialStep?: 'destination' | 'dates' | 'guests';
    hideDestination?: boolean;
}

const MobileSearchOverlay: React.FC<MobileSearchOverlayProps> = ({
    isOpen,
    onClose,
    onSearch,
    initialStep = 'destination',
    hideDestination = false
}) => {
    const { searchData, updateSearch } = useSearch();
    const [step, setStep] = useState(hideDestination && initialStep === 'destination' ? 'dates' : initialStep);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // Fetch all hotels for smart search
    const { hotels } = useFrontendHotels();

    const filteredTop = TOP_DESTINATIONS.filter(city => city.includes(searchQuery));

    const filteredHotels = searchQuery.trim().length >= 2
        ? hotels.filter(hotel =>
            hotel.name.includes(searchQuery) ||
            (hotel.nameEn && hotel.nameEn.toLowerCase().includes(searchQuery.toLowerCase()))
        ).slice(0, 5)
        : [];

    const filteredDestinations = DESTINATIONS.map(country => ({
        ...country,
        cities: country.cities.filter(city =>
            city.includes(searchQuery) || country.name.includes(searchQuery)
        )
    })).filter(country => country.cities.length > 0);

    const hasResults = filteredTop.length > 0 || filteredDestinations.length > 0 || filteredHotels.length > 0;

    useEffect(() => {
        if (searchQuery.trim() !== '') {
            setExpandedCountry(null);
        }
    }, [searchQuery]);

    // Sync with global search context
    const setAdults = (v: number) => updateSearch({ adults: v });
    const setChildren = (v: number) => updateSearch({ children: v });
    const setRooms = (v: number) => updateSearch({ rooms: v });
    const setDestination = (v: string) => updateSearch({ destination: v });

    // Lock scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSearch = () => {
        if (!searchData.destination) {
            setStep('destination');
            alert("يرجى اختيار الوجهة أولاً للبدء بالبحث");
            return;
        }

        onSearch({
            city: searchData.destination,
            checkIn: searchData.checkIn,
            checkOut: searchData.checkOut,
            guests: {
                adults: searchData.adults,
                children: searchData.children,
                rooms: searchData.rooms
            }
        });
        onClose();
    };

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

    const generateDays = (date: Date) => {
        const days = [];
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(date.getFullYear(), date.getMonth(), i));
        return days;
    };

    return createPortal(
        <div className="fixed inset-0 z-[10000] lg:hidden flex flex-col pt-12">
            {/* Backdrop with iOS smooth fade */}
            <div className={`absolute inset-0 bg-primary/20 backdrop-blur-sm transition-opacity duration-[400ms] ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />

            {/* Sheet with iOS smooth slide/scale */}
            <div className={`relative mt-auto bg-white rounded-t-[3.5rem] shadow-[0_-20px_80px_rgba(0,0,0,0.2)] h-[92vh] flex flex-col overflow-hidden transition-all duration-[500ms] ease-ios transform ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-full scale-[0.98]'}`}>
                {/* iOS Handle */}
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-4 shrink-0 opacity-50" />

                {/* Header */}
                <div className="px-6 flex items-center justify-between mb-2">
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 active:scale-90 transition-all">
                        <X size={20} />
                    </button>
                    <h2 className="text-xl font-black text-secondary">تعديل البحث</h2>
                    <button onClick={handleSearch} className="text-gold font-bold text-sm active:scale-90 transition-all">تطبيق</button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
                    {/* Summary Tabs */}
                    <div className={`grid ${hideDestination ? 'grid-cols-2' : 'grid-cols-3'} gap-2 bg-slate-50/50 p-1.5 rounded-[2rem] border border-slate-100/50 mb-8`}>
                        {!hideDestination && (
                            <button
                                onClick={() => setStep('destination')}
                                className={`py-3 rounded-full text-[10px] font-black transition-all duration-300 ${step === 'destination' ? 'bg-white shadow-sm text-gold' : 'text-slate-400'}`}
                            >
                                الوجهة
                            </button>
                        )}
                        <button
                            onClick={() => setStep('dates')}
                            className={`py-3 rounded-full text-[10px] font-black transition-all duration-300 ${step === 'dates' ? 'bg-white shadow-sm text-gold' : 'text-slate-400'}`}
                        >
                            التاريخ
                        </button>
                        <button
                            onClick={() => setStep('guests')}
                            className={`py-3 rounded-full text-[10px] font-black transition-all duration-300 ${step === 'guests' ? 'bg-white shadow-sm text-gold' : 'text-slate-400'}`}
                        >
                            الضيوف
                        </button>
                    </div>

                    <div className={`${isOpen ? 'stagger-entry active' : 'stagger-entry'}`}>

                        {/* Step Content */}
                        <div className="space-y-6">
                            {step === 'destination' && (
                                <div className="space-y-6">
                                    {/* Search Bar */}
                                    <div className="relative sticky top-0 bg-white z-10 pb-2">
                                        <input
                                            type="text"
                                            placeholder="ابحث عن مدينة أو دولة..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-6 py-5 text-sm font-black placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-gold transition-all"
                                        />
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
                                            <Search size={22} />
                                        </div>
                                    </div>

                                    <div id="destination-list" className="space-y-6 pb-10">
                                        {hasResults ? (
                                            <>
                                                {/* Matching Hotels (Smart Results) */}
                                                {filteredHotels.length > 0 && (
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-2 px-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                                            <Building size={14} className="text-gold" />
                                                            الفنادق المقترحة
                                                        </div>
                                                        <div className="grid grid-cols-1 gap-3">
                                                            {filteredHotels.map(hotel => (
                                                                <button
                                                                    key={hotel.id}
                                                                    onClick={() => {
                                                                        onClose();
                                                                        navigate(`/hotel/${hotel.slug}`);
                                                                    }}
                                                                    className="w-full flex items-center justify-between p-4 rounded-[2.2rem] border transition-all active:scale-[0.97] bg-white border-slate-100 text-text shadow-sm"
                                                                >
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 overflow-hidden border border-slate-50 shrink-0">
                                                                            {hotel.image ? (
                                                                                <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                                                                            ) : (
                                                                                <div className="w-full h-full flex items-center justify-center text-gold">
                                                                                    <Building size={22} />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <span className="block font-black text-sm mb-0.5">{hotel.name}</span>
                                                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                                                <MapPin size={10} className="text-gold" />
                                                                                <span className="text-[10px] font-bold">{hotel.city}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <ChevronLeft size={18} className="text-slate-300" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Top Destinations */}
                                                {filteredTop.length > 0 && (
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-2 px-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                                            <Compass size={14} className="text-gold" />
                                                            أغلب المدن حجزاً
                                                        </div>
                                                        <div className="grid grid-cols-1 gap-3">
                                                            {filteredTop.map(city => (
                                                                <button
                                                                    key={city}
                                                                    onClick={() => { setDestination(city); setStep('dates'); }}
                                                                    className={`w-full flex items-center justify-between p-5 rounded-[2.2rem] border transition-all active:scale-[0.97] ${searchData.destination === city ? 'bg-secondary border-secondary text-white shadow-lg' : 'bg-white border-slate-100 text-text'}`}
                                                                >
                                                                    <div className="flex items-center gap-4">
                                                                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${searchData.destination === city ? 'bg-white/20' : 'bg-slate-50 text-gold'}`}>
                                                                            <MapPin size={22} />
                                                                        </div>
                                                                        <span className="font-black text-sm">{city}</span>
                                                                    </div>
                                                                    {searchData.destination === city && <div className="w-2.5 h-2.5 rounded-full bg-white shadow-glow" />}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Countries List */}
                                                <div className="space-y-3">
                                                    {filteredDestinations.map(country => {
                                                        const isExpanded = expandedCountry === country.code || (searchQuery.trim() !== '' && !filteredHotels.length);
                                                        return (
                                                            <div key={country.code} className="space-y-3">
                                                                <button
                                                                    onClick={() => setExpandedCountry(expandedCountry === country.code ? null : country.code)}
                                                                    className={`w-full flex items-center justify-between p-5 rounded-3xl border transition-all active:scale-[0.98] ${expandedCountry === country.code ? 'bg-slate-50 border-gold/20' : 'bg-white border-slate-100'}`}
                                                                >
                                                                    <div className="text-slate-300">
                                                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                                    </div>
                                                                    <div className="flex items-center gap-4">
                                                                        <span className="font-black text-sm text-secondary">{country.name}</span>
                                                                        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                                                                            <Globe size={18} className="text-gold" />
                                                                        </div>
                                                                    </div>
                                                                </button>

                                                                {isExpanded && (
                                                                    <div className="grid grid-cols-1 gap-2 pr-4 mr-5 border-r border-slate-100 animate-premium-popup">
                                                                        {country.cities.map(city => (
                                                                            <button
                                                                                key={city}
                                                                                onClick={() => { setDestination(city); setStep('dates'); }}
                                                                                className={`w-full flex items-center justify-between p-4 rounded-[1.8rem] border transition-all active:scale-[0.97] ${searchData.destination === city ? 'bg-secondary border-secondary text-white shadow-lg' : 'bg-white border-slate-50 text-text'}`}
                                                                            >
                                                                                <div className="flex items-center gap-4">
                                                                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${searchData.destination === city ? 'bg-white/20' : 'bg-slate-50 text-gold'}`}>
                                                                                        <MapPin size={18} />
                                                                                    </div>
                                                                                    <span className="font-black text-sm">{city}</span>
                                                                                </div>
                                                                                {searchData.destination === city && <div className="w-2 h-2 rounded-full bg-white shadow-glow" />}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center py-20">
                                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                                    <Search size={32} />
                                                </div>
                                                <p className="text-sm font-black text-slate-400">عذراً، لم نجد ما تبحث عنه</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {step === 'dates' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between px-2">
                                        <button onClick={prevMonth} className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 active:scale-90 transition-all"><ChevronRight size={20} /></button>
                                        <h3 className="font-black text-lg text-secondary">{currentMonth.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })}</h3>
                                        <button onClick={nextMonth} className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 active:scale-90 transition-all"><ChevronLeft size={20} /></button>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1">
                                        {['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'].map(d => <div key={d} className="text-center text-[10px] font-black text-slate-300 py-2">{d}</div>)}
                                        {generateDays(currentMonth).map((day, i) => {
                                            if (!day) return <div key={i} />;
                                            const isStart = searchData.checkIn && day.toDateString() === searchData.checkIn.toDateString();
                                            const isEnd = searchData.checkOut && day.toDateString() === searchData.checkOut.toDateString();
                                            const inRange = searchData.checkIn && searchData.checkOut && day > searchData.checkIn && day < searchData.checkOut;
                                            const past = day < new Date(new Date().setHours(0, 0, 0, 0));

                                            return (
                                                <div key={i} className={`relative py-1 flex justify-center ${inRange ? 'bg-gold/10' : ''}`}>
                                                    <button
                                                        onClick={() => {
                                                            if (past) return;
                                                            if (!searchData.checkIn || (searchData.checkIn && searchData.checkOut)) {
                                                                updateSearch({ checkIn: day, checkOut: null });
                                                            } else if (day > searchData.checkIn) {
                                                                updateSearch({ checkOut: day });
                                                                setTimeout(() => setStep('guests'), 300);
                                                            } else {
                                                                updateSearch({ checkIn: day, checkOut: null });
                                                            }
                                                        }}
                                                        className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all relative z-10 active:scale-90 ${isStart || isEnd ? 'bg-gold text-white shadow-lg shadow-gold/30' : inRange ? 'text-secondary font-black' : past ? 'text-slate-100' : 'text-slate-700 hover:bg-slate-50'}`}
                                                    >
                                                        {day.getDate()}
                                                    </button>
                                                    {isStart && searchData.checkOut && <div className="absolute right-0 inset-y-1 left-1/2 bg-gold/10 z-0" />}
                                                    {isEnd && searchData.checkIn && <div className="absolute left-0 inset-y-1 right-1/2 bg-gold/10 z-0" />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {step === 'guests' && (
                                <div className="space-y-4">
                                    {[
                                        { label: 'البالغين', subLabel: 'أكبر من 11 سنة', val: searchData.adults, set: setAdults, min: 1 },
                                        { label: 'الأطفال', subLabel: 'تحت سن 11 سنة', val: searchData.children, set: setChildren, min: 0 },
                                        { label: 'الغرف', subLabel: 'حدد عدد الغرف المطلوبة', val: searchData.rooms, set: setRooms, min: 1 },
                                    ].map(item => (
                                        <div key={item.label} className="p-6 bg-slate-50/50 rounded-[2.5rem] flex items-center justify-between border border-slate-100/50">
                                            <div className="flex items-center gap-4">
                                                <button onClick={() => item.set(item.val + 1)} className="w-10 h-10 rounded-full bg-gold shadow-md text-white flex items-center justify-center active:scale-90 transition-all"><Plus size={18} /></button>
                                                <span className="font-black text-xl text-secondary w-8 text-center">{item.val}</span>
                                                <button onClick={() => item.set(Math.max(item.min, item.val - 1))} className="w-10 h-10 rounded-full bg-white shadow-sm text-slate-400 flex items-center justify-center active:scale-90 transition-all border border-slate-100"><Minus size={18} /></button>
                                            </div>
                                            <div className="text-right">
                                                <span className="block font-black text-secondary text-sm">{item.label}</span>
                                                <span className="block text-[9px] font-bold text-slate-400 mt-0.5">{item.subLabel}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Action */}
                    <div className="p-6 border-t border-slate-100 shrink-0">
                        <button
                            onClick={handleSearch}
                            className="w-full bg-secondary text-white py-5 rounded-[2.5rem] font-black text-lg shadow-xl shadow-secondary/10 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            <Search size={22} />
                            تحديث النتائج
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default MobileSearchOverlay;
